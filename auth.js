const jsonwebtoken = require('jsonwebtoken')
const db = require("./db")

module.exports.auth = async(req, res, next) => {
    try{
        const authToken = req.headers.authorization.split(' ')[1];
        const cookieToken = req.signedCookies['authToken'] //req.signedCookies['name']
        const decodeToken = jsonwebtoken.verify(authToken, "process.env.JWT_SECRET")
        console.log('Decoded token  ', decodeToken)
        const username = decodeToken.username
        const userResult = await db.query(`SELECT * FROM userss_table WHERE username = '${username}';`);
        const user = userResult.rows[0]
        if(user.role != 'admin'){
            res.send("unauthorized")
            return;
        }
        next();
    }catch(err){
        console.log(err)
        return res.status(401).send('User Unauthorized')
    }
}

