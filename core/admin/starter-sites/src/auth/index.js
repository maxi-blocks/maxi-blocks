import './store';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

export const getMaxiCookieKey = () => {
	const cookie = document.cookie
		.split(';')
		.find(row =>
			row
				.trim()
				.startsWith(`${process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY}=`)
		)
		?.split('=')[1];

	if (!cookie) return false;

	try {
		const obj = JSON.parse(cookie);
		const email = Object.keys(obj)[0];
		const key = obj[email];

		return { email, key };
	} catch (error) {
		console.error('Failed to parse cookie JSON:', error);
		// Remove corrupted cookie
		removeMaxiCookie();
		return false;
	}
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
			row
				.trim()
				.startsWith(`${process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY}=`)
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

	const pro =
		// eslint-disable-next-line no-undef
		maxiStarterSites?.proInitialState ||
		select('maxiBlocks/pro').receiveMaxiProStatus();

	if (typeof pro === 'string') {
		const proJson = JSON.parse(
			// eslint-disable-next-line no-undef
			maxiStarterSites?.proInitialState ||
				select('maxiBlocks/pro').receiveMaxiProStatus()
		);

		const response = proJson?.[email];

		if (response) return { email, info: response, key };
	}
	return false;
};

export const isProSubActive = () => {
	const proInfo = getProInfoByEmail();
	if (!proInfo) return false;

	const { info, key } = proInfo;

	if (info && info?.status === 'yes' && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return true;
		return false;
	}
	return false;
};

export const isProSubExpired = () => {
	const proInfo = getProInfoByEmail();
	if (!proInfo) return false;

	const { info, key } = proInfo;

	if (info && info?.status === 'expired' && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return true;
		return false;
	}
	return false;
};

export const getUserName = () => {
	const proInfo = getProInfoByEmail();
	if (!proInfo) return false;

	const { email, info, key } = proInfo;

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
	const proInfo = getProInfoByEmail();
	if (!proInfo) return false;

	const { email, info, key } = proInfo;

	if (info && info?.key) {
		const keysArray = info?.key.split(',');
		if (keysArray.includes(key)) return email;
		return false;
	}
	return false;
};

export const processLocalActivation = (email, name, status, key) => {
	let newPro = {
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
	key
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
				},
			};
			const oldKeysArray = oldEmailInfo?.key.split(',');
			const newKeysArray = oldKeysArray.filter(item => item !== key);
			if (newKeysArray.length !== 0) {
				const newKey = newKeysArray.join();
				const oldStatus = oldEmailInfo?.status;
				newPro = {
					[email]: {
						status: oldStatus,
						name,
						key: newKey,
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
			row
				.trim()
				.startsWith(`${process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY}=`)
		)
		?.split('=')[1];

	if (!cookieKey && !email) return;

	if (cookieKey) {
		try {
			const cookieObj = JSON.parse(cookieKey);
			const cookieEmail = Object.keys(cookieObj)[0];
			if (cookieEmail !== email) {
				removeMaxiCookie();
				cookieKey = false;
			}
		} catch (error) {
			console.error('Failed to parse cookie JSON in authConnect:', error);
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
			JSON.stringify({ status: 'no' })
		);
		return false;
	};

	let key;
	try {
		key = JSON.parse(cookieKey)?.[email];
	} catch (error) {
		console.error('Failed to parse cookieKey for key extraction:', error);
		key = null;
	}

	const useEmail = email;

	// eslint-disable-next-line consistent-return
	return new Promise((resolve, reject) => {
		if (!useEmail) {
			deactivateLocal();
			redirect();
			resolve(false);
		} else {
			const fetchUrl = process.env.REACT_APP_MAXI_BLOCKS_AUTH_URL;
			const checkTitle =
				process.env.REACT_APP_MAXI_BLOCKS_AUTH_HEADER_TITLE;
			const checkValue =
				process.env.REACT_APP_MAXI_BLOCKS_AUTH_HEADER_VALUE;

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
						deactivateLocal();
						redirect();
						resolve(false);
					}

					response.json().then(data => {
						if (data && data.status === 'ok') {
							const today = new Date().toISOString().slice(0, 10);
							const expirationDate = data?.expiration_date;
							const { name } = data;

							if (today > expirationDate) {
								processLocalActivation(
									useEmail,
									name,
									'expired',
									key
								);
								redirect();
								resolve(false);
							} else {
								processLocalActivation(
									useEmail,
									name,
									'yes',
									key
								);
								resolve(true);
							}
						} else {
							if (data?.error) {
								console.error(data.error);
							}
							deactivateLocal();
							redirect();
							resolve(false);
						}
					});
				})
				.catch(err => {
					console.error('Fetch Error for the API call:', err);
					deactivateLocal();
					redirect();
					resolve(false);
				});
		}
	});
}

export const logOut = redirect => {
	const cookieData = getMaxiCookieKey();
	if (!cookieData) {
		// No cookie exists, just handle redirect if needed
		if (redirect) {
			const url = 'https://my.maxiblocks.com/log-out?plugin';
			window.open(url, '_blank')?.focus();
		}
		return;
	}

	const { key } = cookieData;
	const email = getUserEmail();
	const name = getUserName();

	if (email && name && key) {
		processLocalActivationRemoveDevice(email, name, 'no', key);
	}

	removeMaxiCookie();

	if (redirect) {
		const url = 'https://my.maxiblocks.com/log-out?plugin';
		window.open(url, '_blank')?.focus();
	}
};

export const isValidEmail = email => {
	const emailPattern =
		/^(?![.])(([^<>()\[\]\\.,;:\s@"']+(\.[^<>()\[\]\\.,;:\s@"']+)*|"(.+?)")|(".+?"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailPattern.test(email);
};
