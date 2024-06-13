const path = require("path");


class Header {
    _image_src;
    _title;
    _description;
    _language;

    constructor(header) {
        this._image_src = header.image_src;
        this._title = header.title;
        this._description = header.description;
        this._language = header.languageId;
    };

    getHeadersClient = (host)=>{
        const getLanguage = (id)=>{
            switch (id) {
                case 1:
                   return  'az';
                case 2:
                    return 'ru';
                case 3:
                    return 'en';
                default:
                    return 'az';
            }
        }
        return {
            image_src: path.join(host, '/assets/img/', this._image_src),
            title: this._title,
            description: this._description,
            language: getLanguage(this._language)
        }
    }
}


module.exports = Header