import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
    PORT: process.env.PORT,
    DB_USER: process.env.DBUSERNAME,
    DB_PASSWORD: process.env.DBPASSWORD,
    DB_HOST: process.env.DBHOST,
    DB_PORT: process.env.DBPORT,
    DB_NAME: process.env.DBNAME,
    ACCESSTOKEN_SECRET: process.env.ACCESSTOKEN_SECRET,
    SENDGRID_APIKEY: process.env.SENDGRID_APIKEY,
    SENDER_EMAIL: process.env.SENDER_EMAIL,

});

// module.exports={
//     config
// }