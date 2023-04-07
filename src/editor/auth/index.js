import './store';
/**
 * External dependencies
 */
import { Client, Account } from 'appwrite';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

export const authClient = () => {
	const client = new Client();

	client
		.setEndpoint('https://auth.maxiblocks.com/v1') // Your API Endpoint
		.setProject('maxi'); // Your project ID

	const account = new Account(client);

	// fetch('https://my.maxiblocks.com/plugin-api-fwefqw.php')
	// 	.then(response => {
	// 		if (response.status !== 200) {
	// 			console.error(
	// 				`Looks like there was a problem with an API call. Status Code: ${response.status}`
	// 			);
	// 			return;
	// 		}

	// 		// Examine the text in the response
	// 		response.text().then(data => {
	// 			console.log(data);
	// 		});
	// 	})
	// 	.catch(err => {
	// 		console.error('Fetch Error for the API call:', err);
	// 	});

	return { client, account };
};

export async function authConnect(
	withRedirect = false,
	email = 'spry.note7764@maxiblocks.com'
) {
	const url = 'https://my.maxiblocks.com/login?plugin'; // 'https://maxiblocks.com/go/user-login'

	const redirect = () => {
		withRedirect && window.open(url, '_blank')?.focus();
	};
	const emailActive = () => {
		console.log('emailActive');
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'yes',
			name: email, // TO DO: get user name
		});
	};
	const emailNotActive = () => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'no',
			name: email, // TO DO: get user name
		});
	};
	const notActive = () => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'no',
			name: '',
		});
	};

	const fetchUrl = `https://my.maxiblocks.com/plugin-api-fwefqw.php?${new URLSearchParams(
		{
			email,
		}
	)}`;

	console.log(fetchUrl);

	fetch(fetchUrl)
		.then(response => {
			if (response.status !== 200) {
				console.error(
					`There was a problem with an API call. Status Code: ${response.status}`
				);
				return;
			}

			response.text().then(date => {
				if (typeof date === 'string' && date !== '') {
					console.log(`exp date: ${date}`);
					const today = new Date().toISOString().slice(0, 10);
					console.log(`today: ${today}`);

					if (today > date) {
						emailNotActive();
						redirect();
					} else {
						console.log('not expired');
						emailActive();
					}
				}
				if (date === '') {
					// no email
					notActive();
					redirect();
				}

				redirect();
			});
		})
		.catch(err => {
			console.error('Fetch Error for the API call:', err);
			notActive();
			redirect();
		});

	// userInfo
	// 	.then(response => {
	// 		if (response.status) {
	// 			if (response?.prefs?.pro_active) {
	// 				dispatch('maxiBlocks/pro').saveMaxiProStatus({
	// 					status: 'yes',
	// 					name: response?.name,
	// 				});
	// 			} else {
	// 				dispatch('maxiBlocks/pro').saveMaxiProStatus({
	// 					status: 'no',
	// 					name: response?.name,
	// 				});
	// 			}
	// 		} else {
	// 			dispatch('maxiBlocks/pro').saveMaxiProStatus({
	// 				status: 'no',
	// 				name: '',
	// 			});
	// 			withRedirect && window.open(url, '_blank')?.focus();
	// 		}
	// 	})
	// 	.catch(error => {
	// 		console.error(error);
	// 		dispatch('maxiBlocks/pro').saveMaxiProStatus({
	// 			status: 'no',
	// 			name: '',
	// 		});
	// 		withRedirect && window.open(url, '_blank')?.focus();
	// 	});
}

// export async function authConnect(withRedirect = false) {
// 	const url = 'https://my.maxiblocks.com/login?plugin'; // 'https://maxiblocks.com/go/user-login'

// 	const userInfo = authClient().account.get();
// 	userInfo
// 		.then(response => {
// 			if (response.status) {
// 				if (response?.prefs?.pro_active) {
// 					console.log("dispatch('maxiBlocks/pro')");
// 					dispatch('maxiBlocks/pro').saveMaxiProStatus({
// 						status: 'yes',
// 						name: response?.name,
// 					});
// 				} else {
// 					dispatch('maxiBlocks/pro').saveMaxiProStatus({
// 						status: 'no',
// 						name: response?.name,
// 					});
// 				}
// 			} else {
// 				dispatch('maxiBlocks/pro').saveMaxiProStatus({
// 					status: 'no',
// 					name: '',
// 				});
// 				withRedirect && window.open(url, '_blank')?.focus();
// 			}
// 		})
// 		.catch(error => {
// 			console.error(error);
// 			dispatch('maxiBlocks/pro').saveMaxiProStatus({
// 				status: 'no',
// 				name: '',
// 			});
// 			withRedirect && window.open(url, '_blank')?.focus();
// 		});
// }

export const isProSubActive = () => {
	const { status } = select('maxiBlocks/pro').receiveMaxiProStatus();

	if (status === 'yes') return true;
	return false;
};

export const getUserName = () => {
	const { name } = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (name !== '') return name;
	return false;
};

export const logOut = () => {
	const logOutSession = authClient().account.deleteSession('current');

	logOutSession.then(
		function success(response) {
			// console.log(response); // Success
			dispatch('maxiBlocks/pro').saveMaxiProStatus({
				status: 'no',
				name: '',
			});
		},
		function error(error) {
			console.error(error); // Failure
		}
	);
};
