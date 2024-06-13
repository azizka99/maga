const getCookies = (req)=>{
    return Object.fromEntries(req.headers.cookie.split('; ').map(cookie => cookie.split('=')));
}

const getLanguageId = (lang) =>{
    switch (lang){
        case "az":
            return 1;
        case "ru":
            return 2;
        case "en":
            return 3;
        default:
            return  1;
    }
}
module.exports = {
    getCookies,
    getLanguageId
}