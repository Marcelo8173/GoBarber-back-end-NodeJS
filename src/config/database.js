// credencias para acessar a base de dados
module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'marcelo123',
    database: 'goBarber',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    }
}