import React, {useEffect, useState} from 'react'
import {usePlaidLink} from 'react-plaid-link'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000'

const PlainAuth = ({publicToken, setAccessToken}) => {
	const [account, setAccount] = useState(null)
	useEffect(() => {
		async function fetchData() {
			const response = await axios.post('/api/exchange_public_token', {
				public_token: publicToken,
			})
			const {accessToken} = response.data
			setAccessToken(accessToken)
			const auth = await axios.post('/api/auth', {accessToken})
			console.log('auth data ', auth.data)
			setAccount(auth.data.numbers.ach[0].account)
		}
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [publicToken])

	return <span>{account}</span>
}

function App() {
	const [linkToken, setLinkToken] = useState(null)
	const [publicToken, setPublicToken] = useState(null)
	const [accessToken, setAccessToken] = useState(null)
	const [metadata, setMetadata] = useState(null)

	useEffect(() => {
		async function fetchData() {
			const response = await axios.post('/api/create_link_token')
			const data = response.data
			console.log('token', data)
			setLinkToken(data.link_token)
		}
		fetchData()
	}, [])

	useEffect(() => {
		async function fetchData() {
			const response = await axios.post('/api/create_link_token', {
				accessToken,
			})
			const data = response.data
			console.log('updateToken', data)
			setLinkToken(data.link_token)
		}

		if (accessToken) {
			fetchData()
		}
	}, [accessToken])

	const {open, ready} = usePlaidLink({
		token: linkToken,
		onSuccess: (public_token, metadata) => {
			// send public_token to server
			setPublicToken(public_token)
			console.log('public_token', public_token, metadata)
			setMetadata(metadata)
		},
		onExit: (err, metadata) => {
			//console.log('onExit', err, metadata)
		},
		onEvent: (eventName, metadata) => {
			if (eventName === 'SELECT_DOWN_INSTITUTION') {
				console.log('METADATA', eventName, metadata)
			}

			if (eventName === 'SELECT_DEGRADED_INSTITUTION') {
				console.log('METADATA', eventName, metadata)
			}
			//console.log('eventName101', eventName, metadata)
		},
	})

	return (
		<div>
			<h1>Accounts</h1>
			{metadata && (
				<div>{metadata?.accounts.map((account) => account.name)}</div>
			)}
			{publicToken && (
				<PlainAuth
					publicToken={publicToken}
					setAccessToken={setAccessToken}
				/>
			)}

			<div className='layout'>
				{/* <div className='button'> */}
				<button className='button' onClick={() => open()}>
					Update Bank Account
				</button>
				{/* </div> */}

				<button
					className='button'
					onClick={() => open()}
					// disabled={!ready}
				>
					Connect a bank account
				</button>
			</div>
		</div>
	)
}

export default App
