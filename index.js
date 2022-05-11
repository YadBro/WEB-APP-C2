import express from 'express';
import {
    fileURLToPath
} from 'url';
import {
    dirname,
    parse
} from 'path';
import hbs from "hbs";
import path from 'path';
import bodyParser from "body-parser";
import {
    calculateDate
} from 'calculating-date';
import {
    SetUp
} from './app/models/b34s_chapter2.js';
import bcrypt from "bcrypt";
import expressSession from "express-session";
import expressFlash from 'express-flash';
import {
    upload
} from './middlewars/fileUpload.js';
import multer from 'multer';
import {
    pool
} from './connection/db.js';
import fs from "fs";


const client = new SetUp("b34s_chapter2", 5432, "postgres", "yadiprime009", "tb_projects");
const user = new SetUp("b34s_chapter2", 5432, "postgres", "yadiprime009", "tb_users");


const __filename = fileURLToPath(
    import.meta.url);
// Result dari __filename = C:\Users\yadi\Documents\Javascript\NodeJs\index.mjs

const __dirname = dirname(__filename);
// Result dari __dirname = C:\Users\yadi\Documents\Javascript\NodeJs\

const app = express();

const monthIndexes = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agust',
    'Sept',
    'Okt',
    'Nov',
    'Des'
];

// Atur template engine
app.set('view engine', 'hbs');

//  Gunakan static folder
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressFlash());

app.use(expressSession({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * (60 * 60 * 2), // 2 jam
    },
    store: new expressSession.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'Hitam putih pelangi',
}));

// Register partials to handlebars
hbs.registerPartials(path.join(__dirname, '/views/partials'));
// Result dari path.join(__dirname, '/views/partials') = C:\Users\yadi\Documents\Javascript\NodeJs\views\partials


// Register own helper to hbs
hbs.registerHelper('isTrue', function (con, title) {
    return con === title;
});

hbs.registerHelper('isFalse', function (con, title) {
    return con !== title;
});




app.get('/', function (req, res) {
    let relationQuery = '';
    if (req.session.isLogin) {
        relationQuery = `
            SELECT tb_projects.project_id, tb_projects.project_name, start_date, end_date, description, image, technologies, user_id, tb_users.id, tb_users.name, email
            FROM tb_projects
            LEFT JOIN tb_users
            ON tb_users.id = tb_projects.user_id
            WHERE user_id = ${req.session.user.id}
            `;
    } else {
        relationQuery = `
            SELECT tb_projects.project_id, tb_projects.project_name, start_date, end_date, description, image, technologies, user_id, tb_users.id, tb_users.name, email
            FROM tb_projects
            LEFT JOIN tb_users
            ON tb_users.id = tb_projects.user_id
            `;
    }

    pool.connect((err, client, done) => {
        if (err) throw new err
        client.query(relationQuery, (err, results) => {
            done();
            if (err) throw new err
            let data = results.rows;
            data.map(m => {
                m.technologies = JSON.parse(m.technologies);
                m.yearEnd = new Date(m.end_date).getFullYear();
                const calculatingdate = calculateDate(m.start_date, m.end_date, false);
                m.distance = `${calculatingdate[0].dayDiff} Day${(calculatingdate[0].monthDiff === undefined || calculatingdate[0].monthDiff === 0 ) ? '' : `, ${calculatingdate[0].monthDiff} Month`}${(calculatingdate[0].yearDiff === undefined) ? '' : `, ${calculatingdate[0].yearDiff} Year`}`;
                m.intro = `${(String(m.description).length > 100) ? String(m.description).slice(0, 100)+`...` : m.description}`;
                m.isLogin = req.session.isLogin;
            });

            res.render('index', {
                title: "Home",
                data,
                isLogin: req.session.isLogin,
                user: req.session.user
            });
        });
    });

});


app.get('/contact', function (req, res) {
    res.render('contact', {
        title: "Contact",
        isLogin: req.session.isLogin,
        user: req.session.user
    });
});

app.get('/project', function (req, res) {
    const isLogin = req.session.isLogin;
    if (!isLogin) {
        return res.redirect('/');
    }
    res.render('project', {
        title: "Project",
        isLogin,
        user: req.session.user
    });
});
app.post('/project', function (req, res) {
    const prosesUpload = upload.single('inputFile');
    prosesUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // CHECK ERROR DARI MULTER
            req.flash('multerError', `Error: ${err.message}`);
            return res.redirect('/project');
        } else if (err) {
            // CHECK ERROR YANG TIDAK DI KETAHUI
            req.flash('unknownError', err);
            return res.redirect('/project');
        } else {
            client.save('project_id', {
                project_name: `${req.body.inputName}`,
                start_date: `${req.body.inputStartDate}`,
                end_date: `${req.body.inputEndDate}`,
                description: `${req.body.inputDescription}`,
                image: `${req.file.filename}`,
                technologies: `{"nodeJsTechnology": "${req.body.nodeJsTechnology}", "reactJsTechnology": "${req.body.reactJsTechnology}", "nextJsTechnology": "${req.body.nextJsTechnology}", "typeScriptTechnology": "${req.body.typeScriptTechnology}"}`,
                user_id: req.session.user.id
            });
            req.flash('addProjectSuccess', "Add Project Success!");
            return res.redirect('/');
        }
    });
});


app.get('/detail-project/:id', function (req, res) {
    const updatedId = req.params.id;
    client.selectOneById('project_id', updatedId, data => {
        data.map(m => {
            const calculatingdate = calculateDate(m.start_date, m.end_date, false);
            m.distance = `${calculatingdate[0].dayDiff} Day${(calculatingdate[0].monthDiff === undefined || calculatingdate[0].monthDiff === 0 ) ? '' : `, ${calculatingdate[0].monthDiff} Month`}${(calculatingdate[0].yearDiff === undefined) ? '' : `, ${calculatingdate[0].yearDiff} Year`}`;
            const start = new Date(m.start_date);
            const end = new Date(m.end_date);
            m.start_date = `${start.getDay()} ${monthIndexes[start.getMonth()]} ${start.getFullYear()}`;
            m.end_date = `${end.getDay()} ${monthIndexes[end.getMonth()]} ${end.getFullYear()}`;
            m.technologies = JSON.parse(m.technologies);
        });
        res.render('project-detail', {
            title: "Project Detail",
            data,
            isLogin: req.session.isLogin,
            user: req.session.user
        });
    });

});

app.get('/update/:id', function (req, res) {
    if (!req.session.isLogin) {
        return res.redirect('/');
    }
    const ID = req.params.id;

    client.selectOneById('project_id', ID, data => {
        data.map(m => {
            const start = new Date(m.start_date);
            const end = new Date(m.end_date);
            const tidakBolehLebih = 10;
            m.start_date = `${start.getFullYear()}-${(start.getMonth()+1<tidakBolehLebih)? `0${start.getMonth()+1}` :`${start.getMonth()+1}`}-${(start.getDay()+1<tidakBolehLebih)? `0${start.getDay()+1}` :`${start.getDay()+1}`}`;
            m.end_date = `${end.getFullYear()}-${(end.getMonth()+1<tidakBolehLebih)? `0${end.getMonth()+1}` :`${end.getMonth()+1}`}-${(end.getDay()+1<tidakBolehLebih)? `0${end.getDay()+1}` :`${end.getDay()+1}`}`;
            m.technologies = JSON.parse(m.technologies);

            //                                                 5          < 10 jikatrue = "05", jikafalse ="11"                                            11              10          jikatrue="11"
            // m.start_date = `${start.getFullYear}-${(start.getMonth()+1 < tidakBolehLebih) ? `0${start.getMonth()+1}`: `${start.getMonth()+1}`}-${(start.getDay() < tidakBolehLebih) ? `0${start.getDay()}` : `${start.getDay()}`}`;
            // `2022-05-06`;
        });

        res.render('project-update', {
            data,
            title: 'Project Update',
            isLogin: req.session.isLogin,
            user: req.session.user
        });


    });
});



app.post('/update/:id', function (req, res) {
    const prosesUpload = upload.single('inputFile');
    prosesUpload(req, res, function (err) {
        const updatedId = req.params.id;
        let IMAGE = '';

        // GET ALL DATA FILE IMAGE IN FOLDERS
        const filesOnFolders = fs.readdirSync('./uploads');
        // GAMBAR SEBELUM
        let oldImage = req.body.oldImage;
        // return console.log(!myImage);
        let myImage = req.file;
        // GAMBAR BARU
        if (!myImage) {
            IMAGE = oldImage;
        } else {

            if (err instanceof multer.MulterError) {
                // CHECK ERROR DARI MULTER
                req.flash('multerError', `Error: ${err.message}`);
                return res.redirect(`/update/${updatedId}`);
            } else if (err) {
                // CHECK ERROR YANG TIDAK DI KETAHUI
                req.flash('unknownError', err);
                return res.redirect(`/update/${updatedId}`);
            } else {
                for (let i = 0; i < filesOnFolders.length; i++) {
                    if (oldImage == filesOnFolders[i]) {
                        fs.unlinkSync(`./uploads/${oldImage}`);
                        IMAGE = req.file.filename;
                        break
                    }
                }
            }
        }
        // UPDATING DATA
        client.save('project_id', {
            project_id: updatedId,
            project_name: `${req.body.inputName}`,
            start_date: `${req.body.inputStartDate}`,
            end_date: `${req.body.inputEndDate}`,
            description: `${req.body.inputDescription}`,
            image: `${IMAGE}`,
            technologies: `{"nodeJsTechnology": "${req.body.nodeJsTechnology}", "reactJsTechnology": "${req.body.reactJsTechnology}", "nextJsTechnology": "${req.body.nextJsTechnology}", "typeScriptTechnology": "${req.body.typeScriptTechnology}"}`,
            user_id: `${req.session.user.id}`
        });
        res.redirect('/');

    });
});

app.get('/delete/:id', function (req, res) {
    const deletedId = req.params.id;
    const filesOnFolders = fs.readdirSync('./uploads');
    client.selectOneBy('project_id', deletedId, (err, data) => {
        for (let index = 0; index < filesOnFolders.length; index++) {
            const gambar = filesOnFolders[index];
            if (data.rows[0].image == gambar) {
                fs.unlinkSync(`./uploads/${data.rows[0].image}`);
                break
            }

        }
    })

    client.remove('project_id', deletedId);
    res.redirect('/#myproject');
});

app.get('/register', function (req, res) {
    // CEK KALO UDAH LOGIN ARAHIN KE HOME
    if (req.session.isLogin) {
        return res.redirect('/');
    }
    res.render('register', {
        title: 'Register'
    });
});
app.post('/register', function (req, res) {


    // ambil data password
    let {
        inputName,
        inputPassword,
        inputEmail
    } = req.body;

    user.selectOneBy('email', inputEmail, (err, result) => {
        if (err) {
            // proteksi password
            inputPassword = bcrypt.hashSync(inputPassword, 10);

            // save data user ke database
            user.save('id', {
                name: inputName,
                email: inputEmail,
                password: inputPassword
            });
            req.flash('successRegisterMessage', 'Your account succesfully registered, please login!');
            return res.redirect('/login');
        } else if (result.rows[0].email === inputEmail) {
            req.flash('errorRegisterMessage', 'The Account Have Been Registered!');
            return res.redirect('/register');
        }
    });
});

app.get('/login', function (req, res) {

    // CEK APAKAH SEORANG YANG UDAH LOGIN ITU KE HALAMAN
    if (req.session.isLogin) {
        return res.redirect('/');
    }

    res.render('login', {
        title: 'Login',
    });
});


app.post('/login', function (req, res) {
    let {
        inputEmail,
        inputPassword
    } = req.body;

    user.selectOneBy('email', inputEmail, (err, result) => {
        if (err) {
            req.flash('errorLoginMessage', 'Account Not Found!');
            res.redirect('/login');
        }
        if (result.rowCount > 0) {
            let isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password);
            if (isMatch) {
                req.session.isLogin = true;
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                };
                req.flash('successLoginMessage', 'Successfully login!');

                res.redirect('/');
            } else {
                req.flash('errorLoginMessage', 'Your password is wrong!');
                res.redirect('/login');
            };
        }

    });
});

app.get('/logout', function (req, res) {
    if (req.session.isLogin) {
        req.flash('successLogoutMessage', 'Successfully Logout!');
        req.session.isLogin = false;
        res.redirect('/');
        setTimeout(() => {
            req.session.destroy();
        }, 2000);
    } else {
        req.flash('errorLogoutMessage', 'you haven\'t logged in yet!');
        res.redirect('/');
    }
});

const port = 5000;
app.listen(port, function () {
    console.log(`Server running on port : ${port}`);
});