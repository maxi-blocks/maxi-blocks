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
				.startsWith(`${import.meta.env.VITE_MAXI_BLOCKS_AUTH_KEY}=`)
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
				.startsWith(`${import.meta.env.VITE_MAXI_BLOCKS_AUTH_KEY}=`)
		)
		?.split('=')[1];

	if (cookie) {
		document.cookie = `${
			import.meta.env.VITE_MAXI_BLOCKS_AUTH_KEY
		}=${cookie};max-age=0; Path=${getPathToAdmin()};Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	}
};

/**
 * Purchase code authentication functions
 */

/**
 * Processes purchase code activation and saves to local storage
 * @param {string} purchaseCode - The purchase code
 * @param {string} domain       - The domain
 * @param {Object} responseData - Response data from middleware
 * @param {string} status       - Status ('yes', 'expired', 'no')
 */
export const processLocalPurchaseCodeActivation = (
	purchaseCode,
	domain,
	responseData,
	status = 'yes'
) => {
	const codeKey = `code_${purchaseCode}`;

	// Extract useful info from the new data structure
	const marketplace = responseData?.marketplace || 'unknown';
	const userId = responseData?.delivery_data?.user_id || null;
	const productId = responseData?.delivery_data?.product_id || null;
	const productType = responseData?.delivery_data?.product_type || 'plugin';
	const orderId = responseData?.delivery_data?.order_id || null;

	// Use marketplace for display name
	const displayName =
		marketplace && marketplace !== 'unknown'
			? `${marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}`
			: 'Marketplace';

	const newPro = {
		[codeKey]: {
			status,
			name: displayName,
			purchase_code: purchaseCode,
			domain,
			marketplace,
			user_id: userId,
			product_id: productId,
			product_type: productType,
			order_id: orderId,
			activated_at: new Date().toISOString(),
			auth_type: 'purchase_code',
		},
	};

	const oldPro = select('maxiBlocks/pro').receiveMaxiProStatus();
	let obj = newPro;

	if (typeof oldPro === 'string') {
		const oldProObj = JSON.parse(oldPro);

		// Remove any existing email authentications when activating purchase code
		// Purchase code takes priority and should be the only active auth method
		const filteredObj = {};
		for (const [key, value] of Object.entries(oldProObj)) {
			// Keep only non-email entries (but keep purchase codes and general status)
			if (
				key === 'status' ||
				key.startsWith('code_') ||
				value?.auth_type === 'purchase_code'
			) {
				filteredObj[key] = value;
			}
		}

		// Add the new purchase code activation
		obj = { ...filteredObj, ...newPro };
	}

	const objString = JSON.stringify(obj);
	dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);

	console.log(
		JSON.stringify({ message: 'Purchase code activation saved', obj })
	);
};

/**
 * Removes purchase code activation
 * @param {string} purchaseCode - The purchase code to remove
 */
export const removeLocalPurchaseCodeActivation = purchaseCode => {
	const codeKey = `code_${purchaseCode}`;
	const oldPro = select('maxiBlocks/pro').receiveMaxiProStatus();

	if (typeof oldPro === 'string') {
		const oldProObj = JSON.parse(oldPro);
		delete oldProObj[codeKey];
		const objString = JSON.stringify(oldProObj);
		dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
	}
};

/**
 * Gets purchase code info from local storage
 * @returns {Object|false} - Purchase code info or false
 */
const getProInfoByPurchaseCode = () => {
	const pro = select('maxiBlocks/pro').receiveMaxiProStatus();

	if (typeof pro === 'string') {
		const proJson = JSON.parse(pro);

		// Find the first active purchase code entry
		for (const [key, value] of Object.entries(proJson)) {
			if (
				key.startsWith('code_') &&
				value?.auth_type === 'purchase_code'
			) {
				return { codeKey: key, info: value };
			}
		}
	}

	return false;
};

/**
 * Checks if purchase code subscription is active
 * @returns {boolean} - True if active
 */
export const isPurchaseCodeActive = () => {
	const codeInfo = getProInfoByPurchaseCode();
	return codeInfo && codeInfo.info?.status === 'yes';
};

/**
 * Gets purchase code user name
 * @returns {string|false} - User name or false
 */
export const getPurchaseCodeUserName = () => {
	const codeInfo = getProInfoByPurchaseCode();
	if (codeInfo && codeInfo.info) {
		const { name } = codeInfo.info;
		return name && name !== '' && name !== '1' ? name : false;
	}
	return false;
};

/**
 * Combined functions that check both email and purchase code auth
 */

const getProInfoByEmail = () => {
	const cookie = getMaxiCookieKey();
	if (!cookie) return false;
	const { email, key } = cookie;

	const pro = select('maxiBlocks/pro').receiveMaxiProStatus();

	if (typeof pro === 'string') {
		const proJson = JSON.parse(pro);

		const response = proJson?.[email];

		if (response) return { email, info: response, key };
	}
	return false;
};

export const isProSubActive = () => {
	// Check purchase code auth first - it takes priority
	if (isPurchaseCodeActive()) {
		return true;
	}

	// Check email auth only if no active purchase code
	const emailInfo = getProInfoByEmail();
	if (emailInfo) {
		const { info, key } = emailInfo;
		if (info && info?.status === 'yes' && info?.key) {
			const keysArray = info?.key.split(',');
			if (keysArray.includes(key)) return true;
		}
	}

	return false;
};

export const isProSubExpired = () => {
	// Check email auth first
	const emailInfo = getProInfoByEmail();
	if (emailInfo) {
		const { info, key } = emailInfo;
		if (info && info?.status === 'expired' && info?.key) {
			const keysArray = info?.key.split(',');
			if (keysArray.includes(key)) return true;
		}
	}

	// Purchase codes don't expire in the same way, return false
	return false;
};

export const getUserName = () => {
	// Check purchase code auth first - it takes priority
	const purchaseCodeName = getPurchaseCodeUserName();
	if (purchaseCodeName) {
		return purchaseCodeName;
	}

	// Check email auth only if no active purchase code
	const emailInfo = getProInfoByEmail();
	if (emailInfo) {
		const { email, info, key } = emailInfo;
		if (info && info?.key) {
			const keysArray = info?.key.split(',');
			if (keysArray.includes(key)) {
				const name = info?.name;
				if (name && name !== '' && name !== '1') return name;
				return email;
			}
		}
	}

	return false;
};

export const getUserEmail = () => {
	const emailInfo = getProInfoByEmail();
	if (emailInfo) {
		const { email, info, key } = emailInfo;
		if (info && info?.key) {
			const keysArray = info?.key.split(',');
			if (keysArray.includes(key)) return email;
		}
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
				.startsWith(`${import.meta.env.VITE_MAXI_BLOCKS_AUTH_KEY}=`)
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
			import.meta.env.VITE_MAXI_BLOCKS_AUTH_KEY
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
			const fetchUrl = import.meta.env.VITE_MAXI_BLOCKS_AUTH_URL;
			const checkTitle = import.meta.env
				.VITE_MAXI_BLOCKS_AUTH_HEADER_TITLE;
			const checkValue = import.meta.env
				.VITE_MAXI_BLOCKS_AUTH_HEADER_VALUE;

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

/**
 * Deactivates purchase code with middleware
 * @param {string} purchaseCode - The purchase code to deactivate
 * @param {string} domain       - The domain to deactivate
 * @param {string} reason       - Reason for deactivation
 * @returns {Promise<Object>} - Deactivation result
 */
const deactivatePurchaseCode = async (
	purchaseCode,
	domain,
	reason = 'Plugin deactivated by user'
) => {
	const middlewareUrl = import.meta.env.VITE_MAXI_BLOCKS_AUTH_MIDDLEWARE_URL;
	const middlewareKey = import.meta.env.VITE_MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY;

	if (!middlewareUrl || !middlewareKey) {
		console.error('Missing middleware configuration');
		return { success: false, error: 'Configuration error' };
	}

	// Replace 'verify' with 'deactivate' in the URL
	const deactivateUrl = middlewareUrl.replace('/verify', '/deactivate');

	// Get plugin version from global settings
	const pluginVersion = window.maxiLicenseSettings?.pluginVersion || '';

	const requestBody = {
		domain,
		reason,
		plugin_version: pluginVersion,
	};

	// Only include purchase code if it's provided
	if (purchaseCode) {
		requestBody.purchase_code = purchaseCode;
	}

	try {
		const response = await fetch(deactivateUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: middlewareKey,
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();

		return result;
	} catch (error) {
		console.error('Purchase code deactivation error:', error);
		return { success: false, error: error.message };
	}
};

export const logOut = redirect => {
	let hasEmailAuth = false;

	// Handle email auth logout
	const emailCookie = getMaxiCookieKey();
	if (emailCookie) {
		const { key } = emailCookie;
		const email = getUserEmail();
		const name = getUserName();
		if (email) {
			processLocalActivationRemoveDevice(email, name, 'no', key);
			removeMaxiCookie();
			hasEmailAuth = true;
		}
	}

	// Handle purchase code logout - deactivate and remove all purchase code activations
	const pro = select('maxiBlocks/pro').receiveMaxiProStatus();
	if (typeof pro === 'string') {
		const proObj = JSON.parse(pro);
		const filteredObj = {};
		const domain = window.location.hostname;

		// Find purchase codes to deactivate
		const purchaseCodesToDeactivate = [];
		for (const [key, value] of Object.entries(proObj)) {
			if (
				key.startsWith('code_') &&
				value?.auth_type === 'purchase_code'
			) {
				const purchaseCode = key.replace('code_', '');
				purchaseCodesToDeactivate.push(purchaseCode);
			} else {
				// Keep non-purchase-code entries
				filteredObj[key] = value;
			}
		}

		// Deactivate purchase codes with middleware (async, but don't wait)
		purchaseCodesToDeactivate.forEach(async purchaseCode => {
			try {
				const result = await deactivatePurchaseCode(
					purchaseCode,
					domain,
					'Plugin deactivated by user'
				);
				if (!result.success) {
					console.error(
						'Purchase code deactivation failed:',
						JSON.stringify(result)
					);
				}
			} catch (error) {
				console.error('Purchase code deactivation error:', error);
			}
		});

		// Update local storage immediately (don't wait for deactivation API calls)
		const objString = JSON.stringify(filteredObj);
		dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
	}

	// Only redirect to email logout page if user was authenticated via email
	if (redirect && hasEmailAuth) {
		const url = 'https://my.maxiblocks.com/log-out?plugin';
		window.open(url, '_blank')?.focus();
	}
};

export const isValidEmail = email => {
	const emailPattern =
		/^(?![.])(([^<>()\[\]\\.,;:\s@"']+(\.[^<>()\[\]\\.,;:\s@"']+)*|"(.+?)")|(".+?"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailPattern.test(email);
};
