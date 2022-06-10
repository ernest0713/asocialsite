const jwt = require('jsonwebtoken');
const generateToken = (user) => {
    // 產生 JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY,
    });

    return token
};

const isJson = (obj)=>{
    try {
        JSON.parse(obj)
        return true
    } catch(e){
        return false
    }
}

module.exports = {
    generateToken,
    isJson
};
