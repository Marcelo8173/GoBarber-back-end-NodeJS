import multer from 'multer';
import crypto from 'crypto';
import {extname, resolve} from 'path'; //retorna a extensão do arquivo



export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp','uploads'),
        filename: (req,file,cb) =>{
            crypto.randomBytes(16, (err,res) => { //eu garanto que cada imagem tenha uma identificação unica dentro da aplicação
                if(err) return cb(err);

                return cb(null, res.toString('hex') + extname(file.originalname));
            });

        },
    })
};