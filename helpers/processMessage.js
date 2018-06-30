const API_AI_TOKEN = '6dc628ac63d74e70a32beab1a1592b4f'
const apiAiClient = require('apiai')(API_AI_TOKEN)
const FACEBOOK_ACCESS_TOKEN = 'EAAF3LkdXbvIBAOTpLOZCuzMAPEpNZCBzO8BLk6bbPpmXhB9LHLiPvLPG6yMlkI6F43ZBb0B0ZAWokR4psgV0R3RyLhkyduojZAEHBhrBY0OH49viqDKVz1RgWjfo1IVmFoZAfBzMwrCRfhk35EYRsn3EqjebWLv0fwT3WiZA7Jj5AZDZD'
const request = require('request')
const translate = require('google-translate-api')
const sendTextMessage = (senderId, text) => {

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
