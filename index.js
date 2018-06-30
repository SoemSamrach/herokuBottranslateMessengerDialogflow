

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot, i am using messenger bot')
})
app.listen(3000, () => console.log('Webhook server is listening, port 3000'))
