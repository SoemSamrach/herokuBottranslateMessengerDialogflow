// You can find your project ID in your Dialogflow agent settings
const projectId = 'dialogflowtranslate' //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id'

const query = 'hello, i am a studnt, ប្រាកដចិត្ត, Hello'
const languageCode = 'en-US'
const target = 'en'
// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow')
const sessionClient = new dialogflow.SessionsClient()

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId)
const translate = require('google-translate-api')

translate(query, {to: target}).then(res => {

  console.log(`Here is the original text: ${query}`)
  const languageDetection = res.from.language.iso
  console.log(`Here is the detected languages: ${languageDetection}`)

  const response =res.from.text.value?res.from.text.value:res.text

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text:  response,
        languageCode: languageCode,
      },
    },
  }
  //return request
  sessionClient
    .detectIntent(request)
    .then(responses => {
      console.log('Detected intent')
      const result = responses[0].queryResult
      console.log(`The text is translated to dialogflow: ${result.queryText}`)
      console.log(`Here is the text that response from dialogflow: ${result.fulfillmentText}`)
      translate(result.fulfillmentText, {to:languageDetection}).then(results => {
        const translation = results.text;
        console.log(`Here is the text that receive from dialogflow: ${translation}`);
      })
    })

}).catch(err => {
  console.error(err);
});
