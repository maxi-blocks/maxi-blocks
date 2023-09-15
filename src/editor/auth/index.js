import './store';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

export const getMaxiCookieKey = () => {
	const cookie = document.cookie
		.split(';')
		.find(row =>
			row.startsWith(`${process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY}=`)
		)
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
		.find(row =>
			row.startsWith(`${process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY}=`)
		)
		?.split('=')[1];

	if (cookie) {
		document.cookie = `${
			process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY
		}=${cookie};max-age=0; Path=${getPathToAdmin()};Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
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

	if (info && info?.status === 'yes' && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return true;
		return false;
	}
	return false;
};

export const isProSubExpired = () => {
	const { info, key } = getProInfoByEmail();

	if (info && info?.status === 'expired' && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return true;
		return false;
	}
	return false;
};

export const getUserName = () => {
	const { email, info, key } = getProInfoByEmail();

	if (info && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) {
			const name = info?.name;
			if (name && name !== '' && name !== '1') return name;
			return email;
		}
		return false;
	}
	return false;
};

export const getUserEmail = () => {
	const { email, info, key } = getProInfoByEmail();

	if (info && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return email;
		return false;
	}
	return false;
};

export const getSessionsCount = () => {
	const { info, key } = getProInfoByEmail();

	if (info && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return info?.count;
		return false;
	}
	return false;
};

export const processLocalActivation = (email, name, status, key, count) => {
	let newPro = {
		[email]: {
			status,
			name,
			key,
			count,
		},
	};
	let obj = newPro;

	const oldPro = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (typeof oldPro === 'string') {
		const oldProObj = JSON.parse(oldPro);
		const oldEmailInfo = oldProObj?.[email];
		if (oldEmailInfo && oldEmailInfo?.key) {
			const arrayUnique = (value, index, self) => {
				return self.indexOf(value) === index;
			};

			const oldKeysArray = oldEmailInfo?.key.split(',');
			oldKeysArray.push(key);
			const oldKeysArrayUnique = oldKeysArray.filter(arrayUnique);
			const newKey = oldKeysArrayUnique.join();
			newPro = {
				[email]: {
					status,
					name,
					key: newKey,
					count,
				},
			};
		}

		if (oldProObj?.status !== 'no') obj = { ...oldProObj, ...newPro };
	}

	const objString = JSON.stringify(obj);

	dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
};

export const processLocalActivationRemoveDevice = (
	email,
	name,
	status,
	key,
	count
) => {
	const oldPro = select('maxiBlocks/pro').receiveMaxiProStatus();
	let obj = {};
	if (typeof oldPro === 'string') {
		const oldProObj = JSON.parse(oldPro);
		const oldEmailInfo = oldProObj?.[email];
		if (oldEmailInfo && oldEmailInfo?.key) {
			let newPro = {
				[email]: {
					status,
					name,
					key,
					count: 1,
				},
			};
			const oldKeysArray = oldEmailInfo?.key.split(',');
			const newKeysArray = oldKeysArray.filter(item => item !== key);
			if (newKeysArray.length !== 0) {
				const newKey = newKeysArray.join();
				const oldStatus = oldEmailInfo?.status;
				const newCount = oldEmailInfo?.count || count;
				newPro = {
					[email]: {
						status: oldStatus,
						name,
						key: newKey,
						count: newCount - 1,
					},
				};
			}

			if (oldProObj?.status !== 'no') obj = { ...oldProObj, ...newPro };
			const objString = JSON.stringify(obj);
			dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
		}
	}
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
		.find(row =>
			row.startsWith(`${process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY}=`)
		)
		?.split('=')[1];

	if (!cookieKey && !email) return;

	if (cookieKey) {
		const cookieObj = JSON.parse(cookieKey);
		const cookieEmail = Object.keys(cookieObj)[0];
		if (cookieEmail !== email) {
			removeMaxiCookie();
			cookieKey = false;
		}
	}

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
		document.cookie = `${
			process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY
		}=${cookieKey};max-age=2592000;Path=${getPathToAdmin()};`;
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
		const fetchUrl = process.env.REACT_APP_MAXI_BLOCKS_AUTH_URL;
		const checkTitle = process.env.REACT_APP_MAXI_BLOCKS_AUTH_HEADER_TITLE;
		const checkValue = process.env.REACT_APP_MAXI_BLOCKS_AUTH_HEADER_VALUE;

		const fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				[checkTitle]: checkValue,
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
						const { name, status, count } = data;

						if (status === 'ok') {
							const today = new Date().toISOString().slice(0, 10);
							if (today > date) {
								processLocalActivation(
									useEmail,
									name,
									'expired',
									key,
									count
								);
								redirect();
							} else {
								processLocalActivation(
									useEmail,
									name,
									'yes',
									key,
									count
								);
							}
						}
						if (
							status === 'error' &&
							data.message === 'already logged in'
						) {
							processLocalActivation(
								useEmail,
								name,
								'no',
								key,
								count
							);
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

export const logOut = redirect => {
	const { key } = getMaxiCookieKey();
	const email = getUserEmail();
	const name = getUserName();
	const count = getSessionsCount();
	processLocalActivationRemoveDevice(email, name, 'no', key, count);
	removeMaxiCookie();
	if (redirect) {
		const url = 'https://my.maxiblocks.com/log-out?plugin';
		window.open(url, '_blank')?.focus();
	}
};

export const isValidEmail = email => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
	return emailPattern.test(email);
};
