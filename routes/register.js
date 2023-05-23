const express = require('express')
const router = express.Router();
const users = []
const multer = require('multer')
const db = require('../db')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    filename: (req, file, callback) => {
        callback(null,  Date.now() + file.originalname);
    }
})

const upload = multer({storage: storage}).single('myfile')

router.get('/createuser', (req, res) => {
    res.render('register')
})

router.get('/', (req, res) => {
    res.render('showusers', {users})
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/listusers', async (req, res) => {
    const users = await db.query(`select * from users_table;`)
    console.log(users)
    res.status(200).json(users.rows)
})

router.post('/create',(req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err)
            return
        }
        const {firstname,lastname,username,password} = req.body
        var myfile = req.file.filename
        users.push({ firstname, lastname, username,password,myfile })
        console.log('File uploaded successfully.')
        return res.render('showusers', { users })
    })
})

router.post('/createuser',async(req,res)=>{
    const {firstname, lastname, username,password,role} = req.body
    await db.query('create table if not exists userss_table(id serial primary key, firstname varchar(30), lastname varchar(30), username varchar(20), password varchar(20),role varchar(20))')
    const user = await db.query(`select * from userss_table where username = '${username}';`)
    if(user.rows.length) {
        return res.status(400).send('User already exists.')
    }
    const newUser = await db.query(`insert into userss_table(firstname, lastname, username,password,role) values('${firstname}', '${lastname}', '${username}','${password}','${role}')`)
    res.send({success : true, msg : "New user created"})
})

module.exports = router