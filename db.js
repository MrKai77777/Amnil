const Pool = require('pg').Pool

const pool = new Pool({
    host: 'localhost',
    post: 5432,
    user: 'postgres',
    password: 'neerav123',
    database: 'postgres'
})

// exports.createUserTable = () => {
//     return pool.query('create table if not exists users_table(id serial primary key, firstname varchar(30), lastname varchar(30), username varchar(20),password varchar(20))', (err, results) => {
//         if(err){
//             console.log(err)
//         }

//         console.log(results)
//     })
// }
pool.connect()



module.exports = pool

