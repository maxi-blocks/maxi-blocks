import './store';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

export const getMaxiCookieKey = () => {
	const cookie = document.cookie
		.split(';')
		.find(row => row.startsWith('maxi_blocks_key='))
		?.split('=')[1];

	if (!cookie) return false;

	const obj = JSON.parse(cookie);
	const email = Object.keys(obj)[0];
	const key = obj[email];

	return { email, key };
};

const getProInfoByEmail = () => {
	const cookie = getMaxiCookieKey();
	if (!cookie) return false;
	const { email, key } = cookie;

	const pro = JSON.parse(select('maxiBlocks/pro').receiveMaxiProStatus());

	return { address: pro?.[email], key };
};

export const isProSubActive = () => {
	const { address, key } = getProInfoByEmail();

	if (address && address?.key === key && address?.status === 'yes')
		return true;
	return false;
};

export const isProSubExpired = () => {
	const { address, key } = getProInfoByEmail();

	if (address && address?.key === key && address?.status === 'expired')
		return true;
	return false;
};

export const getUserName = () => {
	const { address, key } = getProInfoByEmail();

	if (address && address?.key === key) {
		const name = address?.name;
		if (name && name !== '') return name;
		return address;
	}
	return false;
};

export const getUserEmail = () => {
	const { address, key } = getProInfoByEmail();

	if (address && address?.key === key) return address;
	return false;
};

export async function authConnect(withRedirect = false, email = false) {
	const url = 'https://my.maxiblocks.com/login?plugin'; // 'https://maxiblocks.com/go/user-login'

	let cookieKey = document.cookie
		.split(';')
		.find(row => row.startsWith('maxi_blocks_key='))
		?.split('=')[1];

	if (!cookieKey) {
		const generateCookieKey = (email, length) => {
			let key = '';
			const string =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const stringLength = string.length;
			let i = 0;
			while (i < length) {
				key += string.charAt(Math.floor(Math.random() * stringLength));
				i += 1;
			}

			const obj = { [email]: key };
			console.log('email', email);
			console.log('key', key);
			console.log('obj', obj);
			return JSON.stringify(obj);
		};
		cookieKey = generateCookieKey(email, 20);
		document.cookie = `maxi_blocks_key=${cookieKey};max-age=2592000`;
	}

	const redirect = () => {
		withRedirect && window.open(url, '_blank')?.focus();
	};

	const processLocalActivation = (email, name, status) => {
		console.log('processLocalActivation', status);
		const key = JSON.parse(cookieKey)[email];
		const newPro = {
			[email]: {
				status,
				name,
				key,
			},
		};
		let obj = newPro;
		const oldPro = select('maxiBlocks/pro').receiveMaxiProStatus();
		if (typeof oldPro === 'string') {
			const oldProObj = JSON.parse(oldPro);
			if (oldProObj?.status !== 'no') obj = { ...oldProObj, ...newPro };
		}

		console.log('obj', obj);
		const objString = JSON.stringify(obj);
		console.log('objString', objString);

		dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
	};

	const deactivateLocal = () => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus(
			JSON.stringify({
				status: 'no',
			})
		);
	};

	const useEmail = email || getUserEmail();

	// console.log('useEmail', useEmail);
	// console.log('getUserEmail', getUserEmail());

	if (useEmail) {
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
						console.log('data', data);
						if (data.error) {
							console.error(data.error);
							deactivateLocal();
							return;
						}
						const date = data?.expiration_date;
						const { name, status } = data;
						console.log(`exp date: ${date}`);
						console.log(`name: ${name}`);
						console.log(`status: ${status}`);

						if (status === 'ok') {
							const today = new Date().toISOString().slice(0, 10);
							if (today > date) {
								processLocalActivation(
									useEmail,
									name,
									'expired'
								);
								redirect();
							} else {
								console.log('not expired');
								processLocalActivation(useEmail, name, 'yes');
							}
						}
						if (
							status === 'error' &&
							data.message === 'already logged in'
						) {
							processLocalActivation(useEmail, name, 'no');
						}
					}
					if (!data) {
						// no email
						deactivateLocal();
						redirect();
					}
				});
			})
			.catch(err => {
				console.error('Fetch Error for the API call:', err);
				deactivateLocal();
				redirect();
			});
	}
}

export const logOut = () => {
	const url = 'https://my.maxiblocks.com/log-out?plugin';
	window.open(url, '_blank')?.focus();
};

export const isValidEmail = email => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(email);
};
