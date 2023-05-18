const express = require("express");
require('dotenv').config()
const app = express();
const jsonwebtoken = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const cors = require("cors");
const products = require("./product.json")
app.use(cors())
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
const db = require('./db')
app.use(cookieparser("process.env.COOKIE_SECRET"))

const auth = (req, res, next) => {
    try{
        const authToken = req.headers.authorization.split(' ')[1];
        const cookieToken = req.signedCookies['authToken'] //req.signedCookies['name']
        console.log('Cookie token', cookieToken)
        const decodeToken = jsonwebtoken.verify(authToken, "process.env.JWT_SECRET")
        console.log('Decoded token  ', decodeToken)
        next()
    }catch(err){
        console.log(err)
        return res.status(401).send('User Unauthorized')
    }
}

app.post('/login', async(req, res) => {
    const {username, password} = req.body
    const result = await db.query(`select * from users_table where username = '${username}';`)
    const user = result.rows 
    const usernames = user.map((user) => user.username);
    console.log(usernames)
    if(username == usernames && password === 'admin'){
        const token = jsonwebtoken.sign({username}, "process.env.JWT_SECRET")
        res.cookie('authToken', token, {maxAge: 10000, signed: true})
        return res.status(200).json({success: true, token, message: 'User authenticated successfully.'})
    }
    return res.status(401).send('Invalid username or password.')
})

app.get('/getAll', auth, async (req, res) => {
    const users = await  db.query('select * from users_table;')
    return res.json(users.rows)
})

const registerRouter = require("./routes/register");
app.use('/register',registerRouter) 


app.listen(3000, () => {
    console.log("Server Running")
})