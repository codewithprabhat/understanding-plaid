const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {Configuration, PlaidApi, PlaidEnvironments} = require('plaid')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': '643953584ea2730014077e67',
			'PLAID-SECRET': 'b9a7326556db5169f4a36cc71997e7',
		},
	},
})

const plaidClient = new PlaidApi(configuration)

app.post('/api/create_link_token', async function (request, response) {
	// Get the client_user_id by searching for the current user

	const plaidRequest = {
		user: {
			// This should correspond to a unique id for the current user.
			client_user_id: 'testuser101',
		},
		client_name: 'Plaid Test App',
		products: ['auth', 'identity'],
		language: 'en',
		redirect_uri: 'http://localhost:3000/',
		country_codes: ['US'],
		// exclude: {
		// 	// institutions: ['ins_109512', 'ins_109509', 'ins_109508', 'ins_109510']
		// },
		// exclude_banks: ['ins_109512', 'ins_109509', 'ins_109508', 'ins_109510'],
		//webhook: 'http://www.domain.com/ ',
		//allow user to select one acount at a time
	}
	try {
		const createTokenResponse = await plaidClient.linkTokenCreate(
			plaidRequest
		)
		response.json(createTokenResponse.data)
	} catch (error) {
		response.status(500).json(error)
	}
})

// Create a one-time use link_token for the Item.
// This link_token can be used to initialize Link
// in update mode for the user

  app.post('/update_link_token', async (request, response, next) => {

	//get accesstoken from request
	const accessToken = request.body.accessToken;
	console.log("accessToken", accessToken)
	const configs = {
		user: {
			client_user_id: 'testuser101',
		},
		client_name: 'Plaid Test App',
		country_codes: ['US'],
		language: 'en',
		access_token: accessToken,
	  };

	const linkTokenResponse = await client.linkTokenCreate(configs);
	// Use the link_token to initialize Link
	response.json({ link_token: linkTokenResponse.data.link_token });
  });
  

app.post(
	'/api/exchange_public_token',
	async function (request, response, next) {
		const publicToken = request.body.public_token
		try {
			const plaidResponse = await plaidClient.itemPublicTokenExchange({
				public_token: publicToken,
			})

			console.log('plaidResponse', plaidResponse)
			// These values should be saved to a persistent database and
			// associated with the currently signed-in user
			const accessToken = plaidResponse.data.access_token
			const itemID = plaidResponse.data.item_id
			response.json({
				public_token_exchange: 'complete',
				accessToken,
				itemID,
			})
		} catch (error) {
			// handle error
			console.log(error)
			response.status(500).json(error)
		}
	}
)

app.post('/api/auth', async (req, res) => {
	const accessToken = req.body.accessToken
	const plaidRequest = {
		access_token: accessToken,
	}
	try {
		const response = await plaidClient.authGet(plaidRequest)
		const accountData = response.data.accounts
		const numbers = response.data.numbers
		res.json({accountData, numbers})
	} catch (error) {
		// handle error
		res.status(500).json(error)
	}
})

app.post('/api/hello', (req, res) => {
	res.json({message: 'Hello World', name: req.body.name})
})

app.listen(8000, () => {
	console.log('Server is running on port 8000')
})
