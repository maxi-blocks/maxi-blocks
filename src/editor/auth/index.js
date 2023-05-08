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

export const getPathToAdmin = () => {
	const path = window.location.pathname;
	const subfolder = path.substring(0, path.lastIndexOf('/'));
	return subfolder;
};

export const removeMaxiCookie = () => {
	const cookie = document.cookie
		.split(';')
		.find(row => row.startsWith('maxi_blocks_key='))
		?.split('=')[1];

	if (cookie) {
		document.cookie = `maxi_blocks_key=${cookie};max-age=0; Path=${getPathToAdmin()};Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	}
};

const getProInfoByEmail = () => {
	const cookie = getMaxiCookieKey();
	if (!cookie) return false;
	const { email, key } = cookie;

	const pro = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (typeof pro === 'string') {
		const proJson = JSON.parse(
			select('maxiBlocks/pro').receiveMaxiProStatus()
		);

		const response = proJson?.[email];

		if (response) return { email, info: response, key };
	}
	return false;
};

export const isProSubActive = () => {
	const { info, key } = getProInfoByEmail();

	if (info && info?.key === key && info?.status === 'yes') return true;
	return false;
};

export const isProSubExpired = () => {
	const { info, key } = getProInfoByEmail();

	if (info && info?.key === key && info?.status === 'expired') return true;
	return false;
};

export const getUserName = () => {
	const { email, info, key } = getProInfoByEmail();

	if (info && info?.key === key) {
		const name = info?.name;
		if (name && name !== '' && name !== '1') return name;
		return email;
	}
	return false;
};

export const getUserEmail = () => {
	const { email, info, key } = getProInfoByEmail();

	if (info && info?.key === key) return email;
	return false;
};

export const processLocalActivation = (email, name, status, key) => {
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

	const objString = JSON.stringify(obj);

	dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
};

export const removeLocalActivation = email => {
	const oldPro = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (typeof oldPro === 'string') {
		const oldProObj = JSON.parse(oldPro);
		delete oldProObj[email];
		const objString = JSON.stringify(oldProObj);
		dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
	}
};

export async function authConnect(withRedirect = false, email = false) {
	const url = 'https://my.maxiblocks.com/login?plugin';

	let cookieKey = document.cookie
		.split(';')
		.find(row => row.startsWith('maxi_blocks_key='))
		?.split('=')[1];

	if (!cookieKey && !email) return;

	if (!cookieKey && email) {
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

			return JSON.stringify(obj);
		};
		cookieKey = generateCookieKey(email, 20);

		document.cookie = `maxi_blocks_key=${cookieKey};max-age=2592000;Path=${getPathToAdmin()};`;
	}

	const redirect = () => {
		withRedirect && window.open(url, '_blank')?.focus();
	};

	const deactivateLocal = () => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus(
			JSON.stringify({
				status: 'no',
			})
		);
	};

	const key = JSON.parse(cookieKey)?.[email];

	const useEmail = email;

	if (useEmail) {
		const fetchUrl = 'https://my.maxiblocks.com/plugin-api-fwefqw.php';

		const fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Xaiscmolkb': 'sdeqw239ejkdgaorti482',
			},
			body: JSON.stringify({ email: useEmail, cookie: key }),
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
							deactivateLocal();
							return;
						}
						const date = data?.expiration_date;
						const { name, status } = data;

						if (status === 'ok') {
							const today = new Date().toISOString().slice(0, 10);
							if (today > date) {
								processLocalActivation(
									useEmail,
									name,
									'expired',
									key
								);
								redirect();
							} else {
								processLocalActivation(
									useEmail,
									name,
									'yes',
									key
								);
							}
						}
						if (
							status === 'error' &&
							data.message === 'already logged in'
						) {
							processLocalActivation(useEmail, name, 'no', key);
						}
						if (
							status === 'error' &&
							data.message === 'no such user'
						) {
							removeLocalActivation(useEmail);
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
	const { key } = getMaxiCookieKey();
	const email = getUserEmail();
	const name = getUserName();
	processLocalActivation(email, name, 'no', key);
	removeMaxiCookie();
	const url = 'https://my.maxiblocks.com/log-out?plugin';
	window.open(url, '_blank')?.focus();
};

export const isValidEmail = email => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
	return emailPattern.test(email);
};
