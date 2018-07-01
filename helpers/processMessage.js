const API_AI_TOKEN = '6dc628ac63d74e70a32beab1a1592b4f'//this is the api from dialogflow
const apiAiClient = require('apiai')(API_AI_TOKEN)
const FACEBOOK_ACCESS_TOKEN = 'EAAF3LkdXbvIBACGT49DmZB8Ai1M1nU7uTqcoI2TjYmod0jRjTwDbER3YPz8ThAECCgYz5XtUo2lXU2Dft8x5ZC9R6Sk0yFZAXXUS8UBIcuJEaZAZCOtqS478u5QZCV82TBKrZBuISXkQmPqqXI48ov1ZCmvOn4DF41MLIuq1BsTgwgZDZD'
// this is the facebook access token which is generated from Facebook page
const request = require('request')// This is the request client library which request to Facebook

const translate = require('google-translate-api')// This is the google translate api (free version)


const sendTextMessage = (senderId, text) => { // This is send back to Facebook

		 request({
				 url: 'https://graph.facebook.com/v2.6/me/messages',
				 qs: { access_token: FACEBOOK_ACCESS_TOKEN },
				 method: 'POST',
				 json: {
					 recipient: { id: senderId },
					 message: { text },
		 		}
		 	})
	}


module.exports = (event) => {

			const senderId = event.sender.id
			const message = event.message.text
			console.log(`message here is the original messages: ${message}`)

			translate(message, {to: 'en'}).then(res => {

			    const testMessage = res.from.text.value?res.from.text.value:res.text

			    const detectedLangauge = res.from.language.iso
			    //=> I speak English
			    console.log(`Here is the translate text: ${testMessage}`)
			    console.log(`Here is the detected language: ${detectedLangauge}`);
			    //=> nl

			    const apiaiSession = apiAiClient.textRequest(testMessage, {sessionId: 'samrachgoogledialogflow'})

				apiaiSession.on('response', (response) => {

			 		const result = response.result.fulfillment.speech

 					console.log(result)

					translate(result, {to: detectedLangauge}).then(res => {

					const returnToMessenger = res.text

					console.log(`Text to facebook: ${returnToMessenger}`)

					sendTextMessage(senderId, returnToMessenger)

				}).catch(err => {
				    console.error(err);
				});

			 })

			apiaiSession.on('error', error =>console.log(error))
			 apiaiSession.end()
			}).catch(err => {
			    console.error(err);
			});
		}
