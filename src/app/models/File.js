//é o arquivo que vai alterar, criar e deletar os usuarios

import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(sequelize){
        super.init(
        {
            name: Sequelize.STRING,
            path: Sequelize.STRING,
        },
        {
            sequelize,
        });

        return this;
    }
}

export default File;
