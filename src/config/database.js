module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    post:5432,
    username: 'postgres',
    password: 'postgres',
    database: 'devburger',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};