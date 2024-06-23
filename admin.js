const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {PrismaClient} = require("@prisma/client");
const {getLanguageId} = require('./helperFunctions')


const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: './assets/img',
    filename: (req, file, cb) => {
        let arr = file.originalname.split(" ");
        cb(null, `${Date.now()}-${arr.join('')}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


router.post('/add-header', async (req, res) => {
    const {image_src,title, description, language } = req.body;
    try{
        const header = await prisma.header.create({
            data:{
                image_src,
                title,
                description,
                languageId: getLanguageId(language)
            }
        })

        res.json({
            result: header,
            error:null
        })

    }catch (e) {
        res.json({
            result:null,
            error: e
        })
    }
});

router.post('/add-about', async (req, res)=>{
   const {title, description, image_src, image_title, image_description, language} = req.body;

   try{
       const about = await prisma.about.create({
           data:{
               title,
               description,
               image_src,
               image_title,
               image_description,
               languageId: getLanguageId(language)
           }
       })

       res.json({
           result: about,
           error:null
       })
   }catch (e) {
       res.json({
           result:null,
           error: e
       })
   }
});

router.post('/add-category', async (req, res)=>{
   const {name, language} = req.body;

  try{
      const category = await prisma.category.create({
          data:{
              name,
              languageId:getLanguageId(language)
          }
      });

      res.json({
          result: category,
          error:null
      })
  }catch (e) {
      res.json({
          result:null,
          error: e
      })
  }
});

router.post('/add-contact', async (req,res)=>{
    const {address, telephone_number, email, language} = req.body;

    try{
        const contact = await prisma.contacts.create({
            data:{
                address,
                telephone_number,
                email,
                languageId:getLanguageId(language)
            }
        })

        res.json({
            result: contact,
            error:null
        })
    }catch (e) {
        res.json({
            result:null,
            error: e
        })
    }
});

router.post('/add-service', async (req, res)=>{
    const {name, image_src, description, language} = req.body;
    try{
        const service = await prisma.service.create({
            data:{
                name,
                image_src,
                description,
                languageId: getLanguageId(language)
            }
        });

        res.json({
            result: service,
            error:null
        });
    }catch (e) {
        res.json({
            result:null,
            error: e
        })
    }
});

router.post('/add-product', async (req, res)=>{
    const {info, description, category, name, language}  = req.body;
    const categoryId = await prisma.category.findFirst({where:{name: category}});
    if(!categoryId){
        res.json({
            result:null,
            error: "category didn't found"
        })
    }
    try{
        const product = await prisma.product.create({
            data:{
                info,
                description,
                categoryId: categoryId.id,
                name,
                languageId: getLanguageId(language)
            }
        });

        res.json({
            result: product,
            error:null
        })
    }catch (e) {
        res.json({
            result:null,
            error: e
        })
    }
})


router.post('/add-product-img', async (req, res)=>{
    const {img_src, isMain, productId}  = req.body;

    try{
        const productImg = await prisma.product_image.create({
            data: {
                img_src,
                isMain,
                productId
            }
        })

        res.json({
            result: productImg,
            error: null
        })
    }catch (e) {
        res.json({
            result:null,
            error: e
        })
    }
});
router.post('/add-img', async (req, res)=>{
   upload(req, res, (err)=>{
       if(err){
           res.json({
               result:null,
               error: err
           })
       }else{
           if(req.file === undefined){
               res.json({
                   result: null,
                   error: 'No file selected!'
               });
           }else{
               res.json({
                   result: req.file.path
               })
           }
       }
   });
});



module.exports = router;