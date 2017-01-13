module.exports = {
    port: 3000,
    session: {
        secret: 'A string hard to guess',
        key: 'express',
        maxAge: 24*60*60,
    },
    mongodb: 'mongodb://localhost:27017/express',
};
