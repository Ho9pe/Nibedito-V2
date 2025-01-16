const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const serverPort = process.env.SERVER_PORT;
const mongodbURL = process.env.MONGODB_LOCAL_URL;
const defaultPicture = process.env.DEFAULT_USER_PICTURE;
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;
const jwtAccessKey = process.env.JWT_ACCESS_KEY;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;
const smtpEmail = process.env.SMTP_EMAIL;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
const superAdminPhone = process.env.SUPER_ADMIN_PHONE;
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD;


// Debugging
// Print all the secrets
//console.log(serverPort, mongodbURL, defaultPicture, jwtActivationKey, jwtAccessKey, jwtRefreshKey, smtpEmail, smtpPassword, clientURL, cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret, superAdminEmail, superAdminPassword, superAdminPhone, defaultUserPassword);

module.exports = { 
    serverPort,
    mongodbURL, 
    defaultPicture, 
    jwtActivationKey, 
    jwtAccessKey,
    jwtRefreshKey,
    smtpEmail, 
    smtpPassword, 
    clientURL,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinaryApiSecret,
    superAdminEmail,
    superAdminPassword,
    superAdminPhone,
    defaultUserPassword
};