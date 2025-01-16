const jwt = require('jsonwebtoken');

const createJSONWebToken = (payload, secretKey, expiresIn) => {
    if(typeof payload !== 'object' || !payload) {
        throw new Error('Payload must be a non empty object');
    }
    if(typeof secretKey !== 'string' || secretKey === '') {
        throw new Error('Secret key must be a non empty string');
    }
    if(typeof expiresIn !== 'string' || !expiresIn) {
        throw new Error('Expires in must be a non empty string');
    }
    try{
        const token = jwt.sign(payload, secretKey, {expiresIn});
        return token;
    }catch(error) {
        console.log('Error in creating JSON Web Token: ', error);
        throw error;
    }
};

const verifyJWTToken = (token, secretKey) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createError(401, 'Token has expired');
      }
      throw createError(401, 'Invalid token');
    }
};

module.exports = { createJSONWebToken, verifyJWTToken };

