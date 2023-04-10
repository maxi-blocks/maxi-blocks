import './store';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

export const isProSubActive = () => {
	const { status } = select('maxiBlocks/pro').receiveMaxiProStatus();

	if (status === 'yes') return true;
	return false;
};

export const isProSubExpired = () => {
	const { status } = select('maxiBlocks/pro').receiveMaxiProStatus();

	if (status === 'expired') return true;
	return false;
};

export const getUserName = () => {
	const { name, email } = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (name && name !== '') return name;
	return email;
};

export const getUserEmail = () => {
	const { email } = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (email !== '') return email;
	return false;
};

export async function authConnect(withRedirect = false, email = false) {
	const url = 'https://my.maxiblocks.com/login?plugin'; // 'https://maxiblocks.com/go/user-login'

	const generateCookieKey = length => {
		let key = '';
		const string =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const stringLength = string.length;
		let i = 0;
		while (i < length) {
			key += string.charAt(Math.floor(Math.random() * stringLength));
			i += 1;
		}
		return key;
	};

	let cookieKey = document.cookie
		.split(';')
		.find(row => row.startsWith('maxi_blocks_key='))
		?.split('=')[1];

	if (!cookieKey) {
		cookieKey = generateCookieKey(20);
		document.cookie = `maxi_blocks_key=${cookieKey};max-age=2592000`;
	}

	const redirect = () => {
		withRedirect && window.open(url, '_blank')?.focus();
	};

	const emailActive = (name, info) => {
		console.log('emailActive');
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'yes',
			email,
			name,
			key: cookieKey,
			info,
		});
	};
	const emailNotActive = (name, info) => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'no',
			email,
			name,
			key: cookieKey,
			info,
		});
	};
	const emailExpired = (name, info) => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'expired',
			email,
			name,
			key: cookieKey,
			info,
		});
	};
	const notActive = () => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus({
			status: 'no',
			name: '',
			email: '',
			info: '',
			key: cookieKey,
		});
	};

	const useEmail = email || getUserEmail();

	const fetchUrl = 'https://my.maxiblocks.com/plugin-api-fwefqw.php';

	const fetchOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Xaiscmolkb': 'sdeqw239ejkdgaorti482',
		},
		body: JSON.stringify({ email: useEmail, cookie: cookieKey }),
	};

	fetch(fetchUrl, fetchOptions)
		.then(response => {
			if (response.status !== 200) {
				console.error(
					`There was a problem with an API call. Status Code: ${response.status}`
				);
				return;
			}

			response.json().then(data => {
				if (data) {
					if (data.error) {
						console.error(data.error);
						notActive();
						return;
					}
					const date = data.expiration_date;
					const { name, info, status } = data;
					console.log(`exp date: ${date}`);
					console.log(`name: ${name}`);
					console.log(`info: ${info}`);
					console.log(`status: ${status}`);

					if (status === 'ok') {
						const today = new Date().toISOString().slice(0, 10);
						if (today > date) {
							emailExpired(name, info);
							redirect();
						} else {
							console.log('not expired');
							emailActive(name, info);
						}
					}
					if (
						status === 'error' &&
						data.message === 'already logged in'
					) {
						emailNotActive(name, info);
					}
				}
				if (!data) {
					// no email
					notActive();
					redirect();
				}
			});
		})
		.catch(err => {
			console.error('Fetch Error for the API call:', err);
			notActive();
			redirect();
		});
}

export const logOut = () => {
	const url = 'https://my.maxiblocks.com/log-out?plugin';
	window.open(url, '_blank')?.focus();
};

export const isValidEmail = email => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(email);
};
