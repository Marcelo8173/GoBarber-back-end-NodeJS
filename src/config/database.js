// credencias para acessar a base de dados
module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '123',
    database: 'goBarbe',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    }
}