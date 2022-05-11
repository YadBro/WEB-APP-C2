import pkg from "pg";

const IdT = "Your id request, it doesn't exist!";

export class SetUp {
    /**
     *Set Up your database postgresql
     *  
     *  @param {string} dbname
     *  @param {number} port 5432
     *  @param {string} user postgres
     *  @param {string} password *****
     *  @param {string} table_name
     */
    constructor(dbname, port, user, password, table_name) {
        const {
            Pool
        } = pkg;
        this.table_name = table_name;
        this.dbname = dbname;
        this.port = 5432 || port;
        this.user = 'postgres' || user;
        this.password = password;
        this.client = new Pool({
            database: dbname,
            port: 5432 || port,
            user: 'postgres' || user,
            password: password
        });
        this.client.connect((err, client, done) => {
            if (err) throw err;
        });
    }
    /**
     * Checking rowCount data
     * @param {string} table_name your table name database
     * @param {number} id your id database
     * @param {()} callback
     */
    checking(id, callback) {
        if (id) {
            let query = `SELECT * FROM ${this.table_name} WHERE project_id=${id}`;
            this.client.query(query, (err, result) => {
                if (result.rowCount === 0) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false)
        }
    }
    /**
     * Select all rows in your table database
     * @param {()} callback
     */
    selectAll(callback, stop = false) {
        let query = `SELECT * FROM ${this.table_name}`;
        this.client.query(query, (err, result) => {
            if (err) throw err
            if (stop === true) {
                this.client.end();
            }
            callback(result.rows);
        });

    }


    /**
     * Select single data in your table database
     * @param {string} field_id your id database
     * @param {number} id your id database
     * @param {(results: Array)} callback
     */
    selectOneById(field_id, id, callback) {
        let query = `SELECT * FROM ${this.table_name} WHERE ${field_id}=${id}`;
        this.client.query(query, (err, result) => {
            if (result.rowCount === 0) {
                if (err) throw err
                this.client.end();

                return console.log(`SELECTING ERROR: ${IdT}`);
            } else {

                callback(result.rows);
            }
        });
    }

    /**
     * Select single data in your table database
     * @param {string} field your field table
     * @param {number | string} value your value table
     * @param {(error, results: Array)} callback
     */
    selectOneBy(field, value, callback) {
        let query = `SELECT * FROM ${this.table_name} WHERE ${field}='${value}'`;
        this.client.query(query, (err, result) => {
            if (result.rowCount === 0) {
                let errorMessage = `SELECTING ERROR: your ${field} request, it doesn't exist`;
                callback(true, errorMessage);
            } else {
                callback(false, result);
            }
        });
    }

    /**
     * Create or Update your field database
     * @param {()} callback
     */
    save(field = '', data) {
        let query = ``;
        let fields = ``;
        let records = ``;
        const dataID = data.project_id;
        this.checking(dataID, checked => {
            // CHECK APAKAH ID ADA ATAU TIDAK
            if (checked === true) {
                this.client.end();
                return console.log(`SAVING ERROR: ${IdT}`);
            } else if (checked === false) {
                const keys = Object.keys(data);
                const values = Object.values(data);
                if (keys[0] === 'project_id') {
                    for (let i = 0; i < keys.length; i++) {
                        fields += `${keys[i]} = '${values[i]}', `;
                    }
                    const fr = fields.slice(0, -2); // menghapus koma di belakang
                    query += `UPDATE ${this.table_name} SET ${fr} WHERE ${field}='${values[0]}'`;
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        fields += `${keys[i]}, `
                        records += `'${values[i]}', `
                    }
                    fields = fields.slice(0, -2); // menghapus koma di belakang
                    records = records.slice(0, -2); // menghapus koma di belakang
                    query += `INSERT INTO ${this.table_name}(${fields}) VALUES(${records})`;
                }
                // return console.log(query);
                this.client.query(query, (err, result) => {
                    if (err) throw err
                });
            }
        });
    }
    /**
     * Remove your field database
     * @param {string} table_name your table name database
     * @param {number} id your id database
     */
    remove(field, id) {
        this.checking(id, checked => {
            // CHECK APAKAH ID ADA ATAU TIDAK
            if (checked === true) {
                this.client.end();
                return console.log(`DELETING ERROR: ${IdT}`);
            } else if (checked === false) {
                let query = `DELETE FROM ${this.table_name} WHERE ${field}=${id}`;
                this.client.query(query, (err, result) => {
                    if (err) throw err
                });
            }
        });
    }

    /**
     * Remove your field database
     * @param {object} setup your table relation name database
     * @param {string} method
     * @param {Array} selectedData
     * @param {string} selectedData
     * @param {callback} result
     */
    // relationTable(table2, method, selectedData, where, result) {
    //     let query = '';
    //     let fields = '';
    //     for (let i = 0; i < selectedData.length; i++) {
    //         fields += `${i}`;
    //     }
    //     query += `
    //     SELECT ${i}
    //     from ${this.table_name}
    //     ${method} ${table2}
    //     ON

    //     `;
    // }

}