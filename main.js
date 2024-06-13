const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {getCookies, getLanguageId} = require("./helperFunctions");
const path = require("path");
const {PrismaClient} = require('@prisma/client');
const Header = require('./classes/headersClient');
const prisma = new PrismaClient();


dotenv.config();


const app = express();

app.use(cors());

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.use((req, res, next) => {
    const parts = req.url.split('/');
    if (['en', 'ru', 'az'].includes(parts[1])) {
        req.language = getLanguageId(parts[1]);
        next();
    } else {
        req.language = 1;
        next();
    }
});

app.use(
    express.urlencoded({
        extended: true,
    })
);


app.get('/test', async (req, res) => {

    //createdAr yazmamisham
   try{
       // const result = await prisma.product.create({
       //     data:{
       //         info: "test_Info",
       //         description: "test_Description",
       //         categoryId: 1,
       //         languageId: 1,
       //         name: "test_Product"
       //     }
       // });

       const result = await  prisma.product_image.create({
           data:{
               img_src: "about1.avif",
               isMain: true,
               productId: 1
           }
       })
       console.log(result);
   }catch (e) {
       console.error(e);
   }

    res.json({
        res: 'en'
    });
});


app.get('/:lang/headers', async (req, res)=>{
    const headers = await prisma.header.findMany({
        where:{
            languageId: req.language
        }
    });
    const clientHeaders = [];
    headers.forEach(x=>{
        const head = new Header(x).getHeadersClient(req.headers.host);
        console.log(head);
        clientHeaders.push(head);
    });

    res.json({
        result: clientHeaders,
        error: null
    });
});


app.get('/:lang/services', async (req, res)=>{
    const services = await prisma.service.findMany({
        where:{
            languageId: req.language
        }
    });
    res.json({
        result: services,
        error: null
    })
});


app.get('/:lang/contacts', async (req, res)=>{
    const contacts = await prisma.contacts.findMany({
        where:{
            languageId: req.language
        }
    });
    res.json({
        result: contacts,
        error: null
    })
});


app.get('/:lang/about', async (req, res)=>{
    const abouts = await prisma.about.findMany({
        where:{
            languageId: req.language
        }
    });
    res.json({
        result: abouts,
        error: null
    })
});

app.get('/:lang/categories', async (req, res)=>{
    const categories = await prisma.category.findMany({
        where: {
            languageId: req.language
        }
    });
    res.json({
        result: categories,
        error: null
    })
});

app.get('/:lang/products', async (req, res)=>{
    const products = await prisma.product.findMany({
        where: {
            languageId: req.language
        }
    });

    for (let product of products) {
        product.images = await prisma.product_image.findMany({
            where:{
                productId: product.id
            }
        });
    }
    res.json({
        result: products,
        error: null
    })
});



app.listen(5500, () => {

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