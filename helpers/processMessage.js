const API_AI_TOKEN = 'dbe138a32bc641938e62d93a21900d26'//this is the api from dialogflow
const apiAiClient = require('apiai')(API_AI_TOKEN)
const FACEBOOK_ACCESS_TOKEN = 'EAAPQXLQ7RAUBAJwf4SlKBaZBu339RkwHk654dBcTj6DpC4JYEXYCojHkHwq9NoaRkC8PzTBRqBDIEbo4nzGZChA5m6MfHv0Q1MEiOGF3FwT3oQwQDfYpfXK66V9dHlZAdPjNTqmsiBDPXClRhJRRGSjppGjajWVAw7vRnBJvwZDZD'
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
