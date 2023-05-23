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

app.post('/login', async(req, res) => {
    const {username, password} = req.body
    const result = await db.query(`select * from userss_table where username = '${username}';`)
    const user = result.rows 
    const usernames = user.map((user) => user.username);
    const passwords = user.map((user) => user.password )
    if(username == usernames && password == passwords){
        const token = jsonwebtoken.sign({username}, 'process.env.JWT_SECRET')
        res.cookie('authToken', token, {maxAge: 10000, signed: true})
        return res.status(200).json({success: true, token, message: 'User authenticated successfully.'})
    }
    return res.status(401).send('Invalid username or password.')
})

app.get('/getAll', async (req, res) => {
    const users = await  db.query('select * from userss_table;')
    return res.json(users.rows)
})

const registerRouter = require("./routes/register");
app.use('/register',registerRouter) 

const productRouter = require("./routes/productRouter");
app.use('/product',productRouter) 


app.listen(3000, () => {
    console.log("Server Running")
})

