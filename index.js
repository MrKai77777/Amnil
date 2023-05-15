const express = require("express");
const app = express();
const products = require("./product.json")
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
//app.use(express.static(__dirname + '/public/images'));
app.use(express.static('public'))
const registerRouter = require("./routes/register");
app.use('/register',registerRouter) 


// app.get("/", (req, res) => {
//     res.json(products)
// })

// app.get("/product/highest", (req, res) => {
//     var price = 0;
//     for (let i = 0; i < products.length; i++) 
//     { 
//         if(products[i].price > price){
//             price = products[i].price;
//         }
//     }
//     const product = products.filter((p) => p.price == price);
//     res.send(product);
// })

// app.get("/product/sum",(req,res)=>{
//     var sum = 0;
//     for (let i = 0; i < products.length; i++) 
//     { 
//             sum += products[i].price;
//     }
//     res.send("sum : "+ sum)
// })

app.listen(3000, () => {
    console.log("Server Running")
})