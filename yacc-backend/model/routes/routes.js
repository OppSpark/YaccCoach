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

// 질병 정보 GET /disease 
const disease_get = require("../disease/disease_get.js");
router.use("/", disease_get);

// 질병 정보 POST /disease
const disease_post = require("../disease/disease_post.js");
router.use("/", disease_post);

//질병 정보 PUT /disease
const disease_put = require("../disease/disease_put.js");
router.use("/", disease_put);

//질병 정보 DELETE /disease
const disease_delete = require("../disease/disease_delete.js");
router.use("/", disease_delete);

// 선호 회사 정보 GET /preference
const preference_get = require("../preference/preference_get.js");
router.use("/", preference_get);

// 선호 회사 정보 POST /preference
const preference_post = require("../preference/preference_post.js");
router.use("/", preference_post);

// 선호 회사 정보 PUT /preference
const preference_put = require("../preference/preference_put.js");
router.use("/", preference_put);

// 선호 회사 정보 DELETE /preference
const preference_delete = require("../preference/preference_delete.js");
router.use("/", preference_delete);

module.exports = router;