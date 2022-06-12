const { ImgurClient } = require('imgur');
const  sizeOf  = require('image-size');
const { hasError, hasSuccess } = require('../responseHandle');

const filesUpload = {
    images: async (req, res, next) =>{
        const { files, query : {type} } = req;
          if (!files) {
            hasError(400, '尚未選取到需上傳的照片', next);
          }
          if (type === 'avatar') {
            const dimension = sizeOf(files[0].buffer)
            if (dimension.width !== dimension.height) {
              hasError(400, '圖片寬高比必須為 1：1，請重新選擇照片' , next)
            }
          }
          const client = new ImgurClient({
            clientId: process.env.IMGUR_CILENTID,
            clientSecret: process.env.IMGUR_CILENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN,
          });

          const response = await client.upload({
            image: req.files[0].buffer.toString('base64'),
            type: 'base64',
            album: process.env.IMGUR_ALBUM_ID,
          });

          if(response.success){
            hasSuccess(res, 200, { imgurl: response.data.link });
          } else {
            return next( hasError(response.status, response.data , next) )
          }
    }
}

module.exports = filesUpload;
