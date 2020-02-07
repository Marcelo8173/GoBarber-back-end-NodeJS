//é o arquivo que vai alterar, criar e deletar os usuarios

import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize){
        super.init(
        {
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            provide: Sequelize.BOOLEAN,
        },
        {
            sequelize,
        });
        this.addHook('beforeSave', async (user) =>{
            if(user.password){ //verifico se ele tem um password, assim sera criado o hash apenas na create
                user.password_hash = await bcrypt.hash(user.password, 8); //força da criptografia
            }

            return this;
        })
    }
    checkPassword(password){
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
