const express = require("express");
const router = express.Router();

// 제약 정보 /drugInfo
const drugInfo = require("../apis/openApi.js");
router.use("/", drugInfo);

// openAI api /openAi
const openAI = require("../apis/openAi-api.js");
router.use("/", openAI);

// 로그인 /signUp
const login = require("../auth/login.js");
router.use("/", login);

// 회원가입 /signUp
const register = require("../auth/register.js");
router.use("/", register);

// 로그아웃 /logout
const logout = require("../auth/logout.js");
router.use("/", logout);

// 질병 정보 /disease
const disease_get = require("../disease/disease_get.js");
router.use("/", disease_get);


module.exports = router;