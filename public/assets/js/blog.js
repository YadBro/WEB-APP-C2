let blogs = [];
const month = [
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

function addBlog(event) {
    /** menambahkan blog post baru*/
    event.preventDefault();

    const projectNameInput = document.querySelector('#inputName').value;

    const projectDateInput = {
        startDate: document.querySelector('#inputStartDate').value,
        endDate: document.querySelector('#inputEndDate').value
    }
    const projectDescriptionInput = document.querySelector('#inputDescription').value;
    const projectTechnologiesInput = {
        nodeJs: document.querySelector('input[name="nodeJsTechnology"]').checked,
        nextJs: document.querySelector('input[name="nextJsTechnology"]').checked,
        reactJs: document.querySelector('input[name="reactJsTechnology"]').checked,
        typeScript: document.querySelector('input[name="typeScriptTechnology"]').checked
    };
    let projectImageInput = document.querySelector('#inputFile');
    projectImageInput = URL.createObjectURL(projectImageInput.files[0]);

    let blog = {
        title: projectNameInput,
        date: projectDateInput,
        description: projectDescriptionInput,
        icons: projectTechnologiesInput,
        image: projectImageInput
    }
    blogs.push(blog);


    // console.log(projectNameInput, projectDateInput, projectDescriptionInput, projectTechnologiesInput, projectImageInput);

    renderBlog();
}

function renderBlog() {
    const containerBlog = document.querySelector('.projects-list');
    containerBlog.innerHTML = firstBlogContent();

    // Convert object blog to string
    const ObjectBlogsString = JSON.stringify(blogs);

    // Save the string object to localstorage
    for (let index = 0; index < blogs.length; index++) {
        // Formatting
        const date = new Date(blogs[index].date.startDate);
        const date2 = new Date(blogs[index].date.endDate);
        const monthIndex = date2.getMonth();
        const year = date2.getFullYear();

        const hour = date2.getHours()
        let minute = date2.getMinutes()

        const calculate = getDistanceTime(date, date2);


        localStorage.setItem(`${blogs[index].title}`, ObjectBlogsString);
        containerBlog.innerHTML += `
            <div class="project-card">
                <div class="card">
                    <img src="${blogs[index].image}" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#" onclick="projectDetail(event)" id='${blogs[index].title}'>${blogs[index].title} - ${year}</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: ${calculate}</small>
                    </div>
                    <div class="card-description">
                        <p>${blogs[index].description}</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                        ${(blogs[index].icons.nodeJs === true) ? '<img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">' : ''}
                        ${(blogs[index].icons.nextJs === true) ? '<img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">' : ''}
                        ${(blogs[index].icons.reactJs === true) ? '<img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">' : ''}
                        ${(blogs[index].icons.typeScript === true) ? '<img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">' : ''}
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>
        `;

    }

}

function projectDetail(event) {
    // Item Name in Local Storage
    let keyName;
    if (event) {
        keyName = event.path[0].id;
        const contentBodyElement = document.querySelector('.content-body');
        const data = JSON.parse(localStorage.getItem(keyName));
        for (let i = 0; i < data.length; i++) {
            const endDate = new Date(blogs[i].date.endDate);
            const dateEnd = endDate.getDate();
            const monthIndexEnd = endDate.getMonth();
            const yearEnd = endDate.getFullYear();
            const hourEnd = endDate.getHours();
            let minuteEnd = endDate.getMinutes();

            const startDate = new Date(blogs[i].date.startDate);
            const dateStart = startDate.getDate();
            const monthIndexStart = startDate.getMonth();
            const yearStart = startDate.getFullYear();
            const hourStart = startDate.getHours();
            let minuteStart = startDate.getMinutes();
            contentBodyElement.textContent = '';
            const calculate = getDistanceTime(startDate, endDate);
            contentBodyElement.innerHTML += `
        <div class="content-title">
            <h1>${data[i].title}</h1>
        </div>
        <div class="container-content">
            <div class="content-card-top">
                <div class="project-image">
                    <img src="${data[i].image}" alt="Content Image">
                </div>
                <div class="project-about">
                    <div class="project-duration">
                        <h2>Duration</h2>
                        <i class="fa-solid fa-calendar-days fa-xl"></i><small>${dateStart} ${month[monthIndexStart]} ${yearStart} - ${dateEnd} ${month[monthIndexEnd]} ${yearEnd}</small><br>
                        <i class="fa-solid fa-clock fa-xl"></i><small>${calculate}</small>
                    </div>
                    <div class="project-technologies">
                        <h2>Technologies</h2>
                        <div class="technology-icons">
                            <div class="left-icons">
                                ${(data[i].icons.nodeJs === true) ? '<img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon"><br>' : ''}
                                ${(data[i].icons.reactJs === true) ? '<img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">' : ''}
                            </div>
                            <div class="left-text">
                                ${(data[i].icons.nodeJs === true) ? '<p>Node Js</p><br>' : ''}
                                ${(data[i].icons.reactJs === true) ? '<p>React Js</p>' : ''}
                            </div>
                            <div class="right-icons">
                                ${(data[i].icons.nextJs === true) ? '<img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon"><br>' : ''}
                                ${(data[i].icons.typeScript === true) ? '<img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">' : ''}
                            </div>
                            <div class="right-text">
                                ${(data[i].icons.nextJs === true) ? '<p>Next Js</p><br>' : ''}
                                ${(data[i].icons.typeScript === true) ? '<p>TypeScript</p>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-card-buttom">
                <div class="content-description">
                    <p>${data[i].description}</p>
                </div>
            </div>
        </div>
        `;
        }
    }


}

function getDistanceTime(time, time2) {
    // console.log(typeof time);
    const distance = (time2 - time)
    const miliseconds = 1000
    const secondInMinute = 60
    const minuteInHour = 60
    const secondInHour = secondInMinute * minuteInHour
    const hourInDay = 23

    let dayDistance = distance / (miliseconds * secondInHour * hourInDay)

    if (dayDistance > 60) {
        const time = (Math.floor(dayDistance) - 60)
        return `${time} day 2 month`
    } else if (dayDistance > 30) {
        const time = (Math.floor(dayDistance) - 30)
        return `${time} day 1 month`
    } else if (dayDistance >= 1) {
        const time = Math.floor(dayDistance) + ' day'
        return time
    } else {
        let hourDistance = Math.floor(distance / (miliseconds * secondInHour))
        if (hourDistance > 0) {
            return hourDistance + ' hour'
        } else {
            let minuteDistance = Math.floor(distance / (miliseconds * secondInMinute))
            return minuteDistance + ' minute'
        }
    }
}

function firstBlogContent() {
    return `<div class="project-card">
                <div class="card">
                    <img src="https://source.unsplash.com/1280x1080?webdesign" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#">Web Application - 2022</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: 2 month</small>
                    </div>
                    <div class="card-description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis molestiae ipsa itaque
                            ipsam
                            quisquam sed quas quis nisi explicabo recusandae.</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                            <img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">
                            <img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">
                            <img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">
                            <img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>
            <div class="project-card">
                <div class="card">
                    <img src="https://source.unsplash.com/1280x1080?programming" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#">Web Application - 2022</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: 3 month</small>
                    </div>
                    <div class="card-description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis molestiae ipsa itaque
                            ipsam
                            quisquam sed quas quis nisi explicabo recusandae.</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                            <img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">
                            <img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">
                            <img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">
                            <img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>
            <div class="project-card">
                <div class="card">
                    <img src="https://source.unsplash.com/1280x1080?developer" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#">Web Application - 2022</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: 1 month</small>
                    </div>
                    <div class="card-description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis molestiae ipsa itaque
                            ipsam
                            quisquam sed quas quis nisi explicabo recusandae.</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                            <img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">
                            <img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">
                            <img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">
                            <img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>
            <div class="project-card">
                <div class="card">
                    <img src="https://source.unsplash.com/1280x1080?programming" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#">Web Application - 2022</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: 1 month</small>
                    </div>
                    <div class="card-description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis molestiae ipsa itaque
                            ipsam
                            quisquam sed quas quis nisi explicabo recusandae.</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                            <img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">
                            <img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">
                            <img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">
                            <img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>
            <div class="project-card">
                <div class="card">
                    <img src="https://source.unsplash.com/1280x1080?developer" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#">Web Application - 2022</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: 3 day</small>
                    </div>
                    <div class="card-description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis molestiae ipsa itaque
                            ipsam
                            quisquam sed quas quis nisi explicabo recusandae.</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                            <img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">
                            <img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">
                            <img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">
                            <img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>
            <div class="project-card">
                <div class="card">
                    <img src="https://source.unsplash.com/1280x1080?webdesign" alt="Card Image">
                    <div class="card-title">
                        <h3><a href="#">Web Application - 2022</a></h3>
                    </div>
                    <div class="card-duration">
                        <small>duration: 2 month</small>
                    </div>
                    <div class="card-description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis molestiae ipsa itaque
                            ipsam
                            quisquam sed quas quis nisi explicabo recusandae.</p>
                    </div>
                    <div class="logos">
                        <div class="img-icon">
                            <img src="assets/img/node-js.png" id="nodeJsIcon" alt="nodeJsIcon">
                            <img src="assets/img/react-js.png" id="reactJsIcon" alt="reactJsIcon">
                            <img src="assets/img/next-js.png" id="nextJsIcon" alt="nextJsIcon">
                            <img src="assets/img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">
                        </div>
                    </div>
                    <div class="actions">
                        <button class="edit-button">edit</button>
                        <button class="delete-button">delete</button>
                    </div>
                </div>
            </div>`;
}

window.onbeforeunload = function () {
    return 'If you reload, refresh, redirect, and close. data will be removed!';
}

function removeStorageItem() {
    // Dapatkan performance entries data
    const perfEntries = performance.getEntriesByType("navigation");

    // Looping performance entries data
    for (let i = 0; i < perfEntries.length; i++) {
        // Dapatkan performance entries data
        let p = perfEntries[i];
        // Cek jika tipe data entrynya reload
        if (p.type === 'reload') {
            // Hapus data sementaranya
            for (let index = 0; index < localStorage.length; index++) {
                const keyName = localStorage.key(index);
                localStorage.removeItem(keyName);
            }
        }

    }
}

removeStorageItem();