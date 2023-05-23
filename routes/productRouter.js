const express = require('express')
const router = express.Router();
const db = require("../db")
const Auth = require("../auth")

router.post('/create', async (req, res) => {
    const { name, quantity, price, type } = req.body
    await db.query('create table if not exists product_table(id serial primary key, name varchar(30), quantity int, price int, type varchar(20))')
    const product = await db.query(`select * from product_table where name = '${name}';`)
    if (product.rows.length) {
        return res.status(400).send('Product already exists.')
    }
    const newProduct = await db.query(`insert into product_table(name, quantity, price,type) values('${name}', '${quantity}', '${price}','${type}')`)
    res.send({success : true, msg : "Loaded into db"})
})

router.get('/get',Auth.auth,async(req,res)=>{
    const product = await db.query(`select * from product_table;`)
    res.status(200).json(product.rows)
})

module.exports = router