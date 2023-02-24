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

	return { client, account };
};

export async function authConnect(withRedirect = false) {
	const url = 'https://maxiblocks.com/go/user-login';

	const userInfo = authClient().account.get();
	userInfo
		.then(response => {
			if (response.status) {
				dispatch('maxiBlocks/pro').saveMaxiProStatus({
					status: 'yes',
					name: response?.name,
				});
			} else {
				dispatch('maxiBlocks/pro').saveMaxiProStatus({
					status: 'no',
					name: '',
				});
				withRedirect && window.open(url, '_blank')?.focus();
			}
		})
		.catch(error => {
			console.error(error);
			dispatch('maxiBlocks/pro').saveMaxiProStatus({
				status: 'no',
				name: '',
			});
			withRedirect && window.open(url, '_blank')?.focus();
		});
}

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
			console.log(response); // Success
			dispatch('maxiBlocks/pro').saveMaxiProStatus({
				status: 'no',
				name: '',
			});
		},
		function error(error) {
			console.log(error); // Failure
		}
	);
};
