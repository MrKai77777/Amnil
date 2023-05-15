const express = require('express')
const router = express.Router();
const users = []
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    filename: (req, file, callback) => {
        callback(null,  Date.now() + file.originalname)
    }
})

const upload = multer({storage: storage}).single('myfile')

router.get('/create', (req, res) => {
    res.render('register')
})

router.get('/', (req, res) => {
    res.render('showusers', {users})
})

router.post('/create',(req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err)
            return
        }
        const {firstname,lastname,username} = req.body
        var myfile = req.file.filename
        users.push({ firstname, lastname, username,myfile })
        console.log('File uploaded successfully.')
        return res.render('showusers', { users })
    })
})

module.exports = router