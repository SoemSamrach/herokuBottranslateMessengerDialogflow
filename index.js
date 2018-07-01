
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.listen(3000, () => console.log('Webhook server is listening, port 3000'));

'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = "https://63f48324.ngrok.io"


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot, i am using messenger bot')
})

const verificationController = require('./controllers/verification');

const messageWebhookController = require('./controllers/messageWebhook');
app.get('/Webhook/', verificationController);
app.post('/', messageWebhookController);
