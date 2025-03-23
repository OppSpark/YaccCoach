const bcrypt = require("bcrypt");
const { pepper } = require("../config/hashConfig");

module.exports = {
    hashPassword: async (password) => {
        const peppered = password + pepper.secret;
        return bcrypt.hash(peppered, 12);
    },

    comparePassword: async (password, hash) => {
        const peppered = password + pepper.secret;
        return bcrypt.compare(peppered, hash);
    },
};
