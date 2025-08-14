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
		const proJson = JSON.parse(
			select('maxiBlocks/pro').receiveMaxiProStatus()
		);

		const response = proJson?.[email];

		if (response) return { email, info: response, key };
	}
	return false;
};

export const isProSubActive = () => {
	// Check for network license first (multisite)
	const licenseSettings = window.maxiLicenseSettings || {};
	if (licenseSettings.isMultisite && licenseSettings.hasNetworkLicense) {
		return true;
	}

	// Check purchase code auth - it takes priority over email
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
	// Check for network license first (multisite)
	const licenseSettings = window.maxiLicenseSettings || {};
	if (licenseSettings.isMultisite && licenseSettings.hasNetworkLicense) {
		return licenseSettings.networkLicenseName || 'Marketplace';
	}

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

/**
 * Helper function to get cookie value for a specific email
 */
const getMaxiCookieForEmail = email => {
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === process.env.REACT_APP_MAXI_BLOCKS_AUTH_KEY) {
			try {
				const cookieData = JSON.parse(value);
				return cookieData[email] || null;
			} catch (e) {
				console.error('Error parsing auth cookie:', e);
				return null;
			}
		}
	}
	return null;
};

/**
 * Helper function to check existing authentication from local storage
 */
const checkExistingAuthentication = () => {
	// Check for purchase code authentication first
	if (isPurchaseCodeActive()) {
		return true;
	}

	// Check for email authentication
	const emailInfo = getProInfoByEmail();
	if (emailInfo && emailInfo.info?.status === 'yes') {
		return true;
	}

	return false;
};

/**
 * Initiate email authentication via WordPress AJAX (same as dashboard)
 */
const initiateEmailAuthentication = async email => {
	try {
		const licenseSettings = window.maxiLicenseSettings || {};
		const { ajaxUrl, nonce } = licenseSettings;

		if (!ajaxUrl || !nonce) {
			console.error('Missing WordPress AJAX configuration');
			return false;
		}

		const formData = new FormData();
		formData.append('action', 'maxi_validate_license');
		formData.append('nonce', nonce);
		formData.append('license_input', email);
		formData.append('license_action', 'activate');

		const response = await fetch(ajaxUrl, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			console.error(
				'WordPress AJAX call failed. Status:',
				response.status
			);
			return false;
		}

		const data = await response.json();

		console.error(
			JSON.stringify({
				message: 'Email auth initiation response',
				email,
				response: data,
			})
		);

		return data;
	} catch (error) {
		console.error('Email auth initiation error:', error);
		return false;
	}
};

/**
 * Check email authentication status via WordPress AJAX (similar to admin.js)
 */
const checkEmailAuthenticationStatus = async email => {
	try {
		// Get the auth key from cookie
		const authKey = getMaxiCookieForEmail(email);

		if (!authKey) {
			console.error('No auth key found for email:', email);
			return false;
		}

		// Use WordPress AJAX endpoint
		const licenseSettings = window.maxiLicenseSettings || {};
		const { ajaxUrl, nonce } = licenseSettings;

		if (!ajaxUrl || !nonce) {
			console.error('Missing WordPress AJAX configuration');
			return false;
		}

		const formData = new FormData();
		formData.append('action', 'maxi_check_auth_status');
		formData.append('nonce', nonce);

		const response = await fetch(ajaxUrl, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			console.error(
				'WordPress AJAX call failed. Status:',
				response.status
			);
			return false;
		}

		const data = await response.json();

		console.error(
			JSON.stringify({
				message: 'Auth check response',
				email,
				authKey: `${authKey.substring(0, 4)}...`,
				response: data,
				cookieData:
					document.cookie
						.split(';')
						.find(c => c.includes('maxi_blocks_key')) ||
					'No maxi_blocks_key cookie found',
			})
		);

		if (data && data.success && data.data) {
			if (data.data.is_authenticated) {
				return {
					success: true,
					user_name: data.data.user_name,
				};
			}
			if (data.data.error && data.data.error_message) {
				// Handle specific errors like seat limit
				console.error(
					`Authentication error: ${data.data.error_message}`
				);
				// Return error details for UI handling
				return {
					success: false,
					error: true,
					error_message: data.data.error_message,
					error_code: data.data.error_code || 'UNKNOWN_ERROR',
				};
			}
		}

		return false;
	} catch (error) {
		console.error('Email auth check error:', error);
		return false;
	}
};

// Keep track of active polling to prevent multiple instances
let activePollingEmail = null;

/**
 * Start smart authentication checking using Page Visibility API and focus events
 * This is much more efficient than constant polling - only checks when user returns to tab
 */
const startSmartAuthCheck = email => {
	// Set active polling email to prevent duplicates
	activePollingEmail = email;

	console.error(
		JSON.stringify({
			message: 'Starting smart auth checking (Page Visibility API)',
			email,
		})
	);

	let fallbackTimeout;
	let isCheckingAuth = false;

	const stopAuthCheck = () => {
		activePollingEmail = null;
		if (fallbackTimeout) {
			clearTimeout(fallbackTimeout);
		}
		// Remove event listeners
		document.removeEventListener(
			'visibilitychange',
			handleVisibilityChange
		);
		window.removeEventListener('focus', handleWindowFocus);
	};

	const checkAuth = async (trigger = 'unknown') => {
		if (isCheckingAuth) return false; // Prevent multiple simultaneous checks

		isCheckingAuth = true;

		console.error(
			JSON.stringify({
				message: 'Checking auth status',
				email,
				trigger,
				timestamp: new Date().toISOString(),
			})
		);

		try {
			const authResult = await checkEmailAuthenticationStatus(email);
			if (authResult && authResult.success) {
				console.error(
					JSON.stringify({
						message: 'Email authentication completed!',
						email,
						userName: authResult.user_name,
						trigger,
					})
				);

				// Stop auth checking
				stopAuthCheck();

				// Update local storage to reflect the authenticated state
				const cookieKey = getMaxiCookieForEmail(email);
				if (cookieKey) {
					processLocalActivation(
						email,
						authResult.user_name || email,
						'yes',
						cookieKey
					);
				}

				// Trigger a custom event that the UI can listen to
				const authEvent = new CustomEvent('maxiEmailAuthSuccess', {
					detail: {
						email,
						userName: authResult.user_name,
						status: 'authenticated',
					},
				});
				window.dispatchEvent(authEvent);

				return true;
			}
			if (authResult && authResult.error) {
				// Handle authentication errors (like seat limit)
				console.error(
					JSON.stringify({
						message: 'Email authentication error',
						email,
						error: authResult.error_message,
						errorCode: authResult.error_code,
						trigger,
					})
				);

				// Stop auth checking for errors
				stopAuthCheck();

				// Trigger a custom event that the UI can listen to for errors
				const authErrorEvent = new CustomEvent('maxiEmailAuthError', {
					detail: {
						email,
						error: authResult.error_message,
						errorCode: authResult.error_code,
						status: 'error',
					},
				});
				console.error(
					JSON.stringify({
						message: 'Dispatching auth error event',
						email,
						error: authResult.error_message,
						errorCode: authResult.error_code,
					})
				);
				window.dispatchEvent(authErrorEvent);

				return false;
			}
		} catch (error) {
			console.error('Error checking auth status:', error);
		} finally {
			isCheckingAuth = false;
		}

		return false;
	};

	// Handle when user returns to tab (most important trigger)
	const handleVisibilityChange = () => {
		if (document.visibilityState === 'visible') {
			console.error(
				JSON.stringify({
					message: 'Tab became visible - checking auth',
					email,
				})
			);
			checkAuth('tab-visible');
		}
	};

	// Handle when window gets focus (backup trigger)
	const handleWindowFocus = () => {
		console.error(
			JSON.stringify({
				message: 'Window gained focus - checking auth',
				email,
			})
		);
		checkAuth('window-focus');
	};

	// Add event listeners
	document.addEventListener('visibilitychange', handleVisibilityChange);
	window.addEventListener('focus', handleWindowFocus);

	// Check immediately
	checkAuth('initial');

	// Fallback: Check once every 60 seconds as a safety net (much less frequent than before)
	const fallbackCheck = () => {
		if (activePollingEmail === email) {
			// Only check if tab is visible to avoid unnecessary API calls
			if (document.visibilityState === 'visible') {
				checkAuth('fallback-timer');
			}
			fallbackTimeout = setTimeout(fallbackCheck, 60000); // 60 seconds
		}
	};
	fallbackTimeout = setTimeout(fallbackCheck, 60000);

	// Stop checking after 10 minutes
	setTimeout(() => {
		if (activePollingEmail === email) {
			console.error(
				JSON.stringify({
					message: 'Smart auth check timeout - stopping',
					email,
				})
			);
			stopAuthCheck();
		}
	}, 600000); // 10 minutes
};

export async function authConnect(withRedirect = false, email = false) {
	const url = 'https://my.maxiblocks.com/login?plugin';

	// First, check if we should try to authenticate with existing stored data
	if (!email) {
		// Check if we have existing authentication data stored locally
		const existingAuth = checkExistingAuthentication();
		if (existingAuth) {
			return true;
		}
		// No existing auth and no email provided
		return false;
	}

	// Check if authentication is already in progress for this email
	if (activePollingEmail === email) {
		console.error(
			JSON.stringify({
				message: 'Authentication already in progress for this email',
				email,
			})
		);
		return false;
	}

	// Check if we already have a valid cookie for this email
	const existingCookie = getMaxiCookieForEmail(email);
	if (existingCookie) {
		// Try to authenticate with existing cookie
		const authResult = await checkEmailAuthenticationStatus(email);
		if (authResult && authResult.success) {
			return true;
		}
		if (authResult && authResult.error) {
			// Return error details for immediate display
			return {
				success: false,
				error: true,
				error_message: authResult.error_message,
				error_code: authResult.error_code,
			};
		}
	}

	// If no existing authentication, initiate email authentication like the dashboard does
	const authResult = await initiateEmailAuthentication(email);
	if (authResult && authResult.success) {
		// Authentication initiated successfully, redirect to login
		if (withRedirect && authResult.login_url) {
			window.open(authResult.login_url, '_blank')?.focus();
		}

		// Start smart auth checking for authentication completion
		startSmartAuthCheck(email);

		return false; // Return false initially, authentication will be completed after user logs in
	}

	// Fallback to old behavior if initiation fails
	const deactivateLocal = () => {
		dispatch('maxiBlocks/pro').saveMaxiProStatus(
			JSON.stringify({ status: 'no' })
		);
		return false;
	};

	const redirect = () => {
		withRedirect && window.open(url, '_blank')?.focus();
	};

	deactivateLocal();
	redirect();
	return false;
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
	const middlewareUrl = process.env.REACT_APP_MAXI_BLOCKS_AUTH_MIDDLEWARE_URL;
	const middlewareKey = process.env.REACT_APP_MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY;

	if (!middlewareUrl || !middlewareKey) {
		console.error('Missing middleware configuration');
		return { success: false, error: 'Configuration error' };
	}

	// Replace 'verify' with 'deactivate' in the URL
	const deactivateUrl = middlewareUrl.replace('/verify', '/deactivate');

	// Get plugin version and multisite info from global settings
	const licenseSettings = window.maxiLicenseSettings || {};
	const pluginVersion = licenseSettings.pluginVersion || '';
	const isMultisite = licenseSettings.isMultisite || false;

	const requestBody = {
		domain,
		reason,
		plugin_version: pluginVersion,
		multisite: isMultisite,
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

/**
 * Migrates purchase code domain with middleware
 * @param {string} purchaseCode - The purchase code
 * @param {string} oldDomain    - The old domain
 * @param {string} newDomain    - The new domain
 * @returns {Promise<Object>} - Migration result
 */
const migratePurchaseCodeDomain = async (
	purchaseCode,
	oldDomain,
	newDomain
) => {
	const middlewareUrl = process.env.REACT_APP_MAXI_BLOCKS_AUTH_MIDDLEWARE_URL;
	const middlewareKey = process.env.REACT_APP_MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY;

	if (!middlewareUrl || !middlewareKey) {
		console.error('Missing middleware configuration');
		return { success: false, valid: false, error: 'Configuration error' };
	}

	// Get plugin version and multisite info from global settings
	const licenseSettings = window.maxiLicenseSettings || {};
	const pluginVersion = licenseSettings.pluginVersion || '';
	const isMultisite = licenseSettings.isMultisite || false;

	try {
		const response = await fetch(middlewareUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: middlewareKey,
			},
			body: JSON.stringify({
				purchase_code: purchaseCode,
				old_domain: oldDomain,
				new_domain: newDomain,
				plugin_version: pluginVersion,
				multisite: isMultisite,
			}),
			signal: AbortSignal.timeout(5000), // 5 second timeout to prevent UI hanging
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();

		return result;
	} catch (error) {
		console.error('Purchase code migration error:', error);
		return { success: false, valid: false, error: error.message };
	}
};

/**
 * Checks and handles domain changes for purchase codes
 * @returns {Promise<void>}
 */
export const checkAndHandleDomainMigration = async () => {
	try {
		const currentDomain = window.location.hostname;
		const pro = select('maxiBlocks/pro').receiveMaxiProStatus();

		if (typeof pro !== 'string') {
			return;
		}

		const proObj = JSON.parse(pro);
		const migrationPromises = [];
		const updateData = { ...proObj };

		// Check each purchase code entry and prepare migration promises
		for (const [key, license] of Object.entries(proObj)) {
			if (
				key.startsWith('code_') &&
				license?.auth_type === 'purchase_code' &&
				license?.status === 'yes'
			) {
				const storedDomain = license.domain;
				const purchaseCode = license.purchase_code;

				// If domain has changed and we have a purchase code
				if (
					storedDomain &&
					purchaseCode &&
					storedDomain !== currentDomain
				) {
					console.error(
						JSON.stringify({
							message: 'Domain change detected',
							oldDomain: storedDomain,
							newDomain: currentDomain,
							purchaseCode,
						})
					);

					// Add migration promise to array
					migrationPromises.push(
						migratePurchaseCodeDomain(
							purchaseCode,
							storedDomain,
							currentDomain
						)
							.then(migrationResult => ({
								key,
								license,
								migrationResult,
								purchaseCode,
								storedDomain,
							}))
							.catch(error => ({
								key,
								license,
								error,
								purchaseCode,
								storedDomain,
							}))
					);
				}
			}
		}

		// Process all migrations in parallel
		if (migrationPromises.length > 0) {
			const results = await Promise.all(migrationPromises);
			let hasUpdates = false;

			results.forEach(
				({
					key,
					license,
					migrationResult,
					error,
					purchaseCode,
					storedDomain,
				}) => {
					if (error) {
						console.error(
							'Domain migration error:',
							JSON.stringify({ purchaseCode, error })
						);
					} else if (migrationResult && migrationResult.success) {
						// Update license data with new domain
						updateData[key] = {
							...license,
							domain: currentDomain,
							migrated_at: new Date().toISOString(),
							migrated_from: storedDomain,
						};

						// If migration info is provided, store it
						if (migrationResult.domain_migration) {
							updateData[key].migration_status =
								migrationResult.domain_migration;
						}

						hasUpdates = true;
						console.error(
							JSON.stringify({
								message: 'Domain migration successful',
								purchaseCode,
								migrationResult,
							})
						);
					} else {
						console.error(
							'Domain migration failed:',
							JSON.stringify({
								purchaseCode,
								migrationResult,
							})
						);
					}
				}
			);

			// Update local storage if there were changes
			if (hasUpdates) {
				const objString = JSON.stringify(updateData);
				dispatch('maxiBlocks/pro').saveMaxiProStatus(objString);
			}
		}
	} catch (error) {
		console.error('Domain migration check error:', error);
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
		/^(?![.])(([^<>()[\]\\.,;:\s@"']+(\.[^<>()[\]\\.,;:\s@"']+)*|"(.+?)")|(".+?"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailPattern.test(email);
};
