import jwd from 'jsonwebtoken';
import {promisify} from 'util'
import authConfig from '../../config/auth';

export default  async (req,res,next) =>{
    const authHeader = req.headers.authorization; 

    if(!authHeader){
        return res.status(401).json({ erro: 'Token not provided'})
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwd.verify)(token, authConfig.secret);
        //aqui estão as informações do token
        req.userId = decoded.id;
        return next(); // a partir o usuario pode usar o updade normalmente pq ele esta autenticado
    } catch (error) {
        return res.status(401).json({erro: 'Token invalid'})
    }

}

//next para continuar usando a rota