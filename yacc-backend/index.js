const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(express.json());

app.use(cors({
    origin: ['http://100.92.18.19:4000', 'http://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.get('/', (req, res) => {
    res.send('Welcome to YaccCoach API')
})

//drugInfo api
const drugInfo = require('./model/apis/openApi.js');
app.use('/', drugInfo);

//openAI api
const openAI = require('./model/apis/openAi-api.js');
app.use('/', openAI);

//login
//const login = require('./model/apis/login.js');
//app.use('/', login);

//register
//const register = require('./model/apis/register.js');
//app.use('/', register);

app.set('port', process.env.PORT || 3330);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'Listen to 3300 port')
});

