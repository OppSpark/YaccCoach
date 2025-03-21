const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const mysqlDB = require('./model/database/databaseInfo.js');

require("dotenv").config();

app.use(express.json());

app.use(
    cors({
    origin: ["http://100.92.18.19:4000", "http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    })
    
);

app.use(
    session({
        secret: "test123",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly : true, // https 환경에서만 session 정보를 주고받도록처리
            secure : false,
            maxAge: 1000 * 60 * 60 * 24,
        },
        name: 'session-cookie'
    })
)

app.get("/", (req, res) => {
    res.send("Welcome to YaccCoach API");
});

//drugInfo api
const drugInfo = require("./model/apis/openApi.js");
app.use("/", drugInfo);

//openAI api
const openAI = require("./model/apis/openAi-api.js");
app.use("/", openAI);

//login
const login = require('./model/auth/login.js');
app.use('/', login);

//register
const register = require('./model/auth/register.js');
app.use('/', register);




app.set("port", process.env.PORT || 3330);

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "Listen to 3300 port");
});
