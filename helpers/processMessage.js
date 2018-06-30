const API_AI_TOKEN = '6dc628ac63d74e70a32beab1a1592b4f'
const apiAiClient = require('apiai')(API_AI_TOKEN)
const FACEBOOK_ACCESS_TOKEN = 'EAAF3LkdXbvIBALxIJqipi8rEzSokjssUWccYXPX67pmpSzzmHGZAXZCM0AwuRu0RSZAUhBE8mK9fW9PAZAi8LRntWaOPpKER7UDEQLUEX1HV1BBe5hdD4yp0upUHzlbhURDYM8XsWTf2DkP9JZBHAHluJAojxAPp9czp6hLZA4CQZDZD'
const request = require('request')
const sendTextMessage = (senderId, text) => {
			console.log(text)
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

			const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'samrachgoogledialogflow'})

			apiaiSession.on('response', (response) => {

			 	const result = response.result.fulfillment.speech
				console.log(result)

				sendTextMessage(senderId, result)
			 })

			apiaiSession.on('error', error =>
				console.log(error)
			)
			 apiaiSession.end()
		}
