require("dotenv").config();

module.exports = {
    pepper: {
        secret: process.env.PEPPER_SECRET,
        version: process.env.PEPPER_VERSION,
    },
};
