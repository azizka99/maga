const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {getCookies} = require("./helperFunctions");

dotenv.config();


const app = express();

app.use(express.json());

app.use('/assets', express.static('./assets'));

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cors());


app.use(async (req, res, next)=>{
   req.cookies = getCookies(req);
    next();
})

app.get('/',async (req, res)=>{
    const cookies = getCookies(req);
    console.log(req.headers)
    res.send(cookies);
})



app.listen(5500, ()=>{

    console.log(`
  ____    ____      _        ______       _       
|_   \\  /   _|    / \\     .' ___  |     / \\      
  |   \\/   |     / _ \\   / .'   \\_|    / _ \\     
  | |\\  /| |    / ___ \\  | |   ____   / ___ \\    
 _| |_\\/_| |_ _/ /   \\ \\_\\ \`.___]  |_/ /   \\ \\_  
|_____||_____|____| |____|\`._____.'|____| |____| 
    `);

    console.log('Server is running at port: ' + "5500")
})