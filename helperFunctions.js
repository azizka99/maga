const getCookies = (req)=>{
    return Object.fromEntries(req.headers.cookie.split('; ').map(cookie => cookie.split('=')));
}

module.exports = {
    getCookies
}