const express = require('express');
const app = express();

// app.use((req, res, next) => {
//     console.log("Middleware executed");
//     next();
// });

// app.use((req, res, next) => {
//     console.log("Second Middleware executed");
//     next();
// });
//logging middleware
// app.use((req, res, next)=>{
//           req.responseTime= new Date(Date.now()).toString();
//           console.log(req.method, req.path, req.responseTime,req.hostname);
//           next();
//         });
//authentication middleware

const checkToken = ("/api",(req,res,next)=>{
    let {token}= req.query;
    if (token === "giveaccess"){
        next();
    }
    res.send("Invalid Token");
    });


app.get('/api',checkToken,(req,res)=>{
    res.send("data from api");
})

app.get('/random', (req, res) => {
    res.send('Random Page');
})


app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});