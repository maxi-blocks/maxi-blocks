import { dispatch, select } from '@wordpress/data';

import '../../src/store/mcpAbilities';
import { STORE_NAME as MCP_STORE_NAME } from '../../src/store/mcpAbilities';
import {
	createMcpClient,
	getMcpBaseUrl,
} from '../../src/services/mcpClient';

// Keep track of active polling to prevent multiple instances
let activePollingEmail = null;

document.addEventListener('DOMContentLoaded', function maxiAdmin() {
	// &panel=documentation-support will open the tab in the accordion
	const urlStr = window.location.href;
	const url = new URL(urlStr);
	const toCheck = url.searchParams.get('panel');
	const checkBox = document.getElementById(toCheck);
	if (checkBox) checkBox.checked = true;

	// Hide the "Pro" tab if the user is not logged in
	const proDiv = document.getElementById('maxi-dashboard_main-content_pro');
	if (proDiv) proDiv.style.display = 'none';

	const notProDiv = document.getElementById(
		'maxi-dashboard_main-content_not-pro'
	);
	if (notProDiv) {
		notProDiv.style.display = 'block';
		const proNotProDiv = document.getElementById(
			'maxi-dashboard_main-content_pro-not-pro'
		);
		if (proNotProDiv) proNotProDiv.style.display = 'block';
	}

	// save new breakpoints to the hidden input
	const inputs = document.getElementsByClassName(
		'maxi-dashboard_main-content_accordion-item-input'
	);

	const breakpointsInput = document.getElementById('maxi-breakpoints');

	if (inputs && breakpointsInput) {
		const breakpoints = breakpointsInput?.value;
		const breakpointsArray = JSON.parse(breakpoints);

		Array.from(inputs)?.forEach(input => {
			const inputId = input.id;
			const breakpoint = inputId.replace('maxi-breakpoint-', '');

			input.addEventListener('input', function updateBreakpoints() {
				const inputValue = input.value;
				breakpointsArray[breakpoint] = parseInt(inputValue);
				breakpointsInput.value = JSON.stringify(breakpointsArray);
			});
		});
	}

	const versionSelect = document.getElementById('maxi-versions');
	const version = document.getElementById('maxi-rollback-version');

	versionSelect?.addEventListener('change', function updateBreakpoints() {
		const { value } = versionSelect;
		version.value = value;
	});

	// Generic dropdown sync logic removed (handled standard form submission now)
	// old block lines 67-85 removed

	// test map for google api key
	// Initialize and add the map
	const initTestMap = () => {
		// The location of Uluru
		const uluru = { lat: -25.344, lng: 131.031 };
		// The map, centered at Uluru
		// eslint-disable-next-line no-undef
		const map = new google.maps.Map(
			document.getElementById('maxi-api-test'),
			{
				zoom: 4,
				center: uluru,
			}
		);
		// The marker, positioned at Uluru
		// eslint-disable-next-line no-undef, no-unused-vars
		const marker = new google.maps.Marker({
			position: uluru,
			map,
		});
	};

	const customValidation = (
		type,
		getKey,
		hiddenInput,
		validationDiv,
		validationLoadingClass = 'api-validation-loading',
		errorClass = 'api-error'
	) => {
		const key = getKey();
		let validationMessage = '';

		// Use window.localization directly for consistency

		if (type === 'validating') {
			validationMessage = window.localization.loading_status_message;
			validationDiv.classList.add(validationLoadingClass);
			validationDiv.classList.remove(errorClass);
		} else {
			validationDiv.classList.remove(validationLoadingClass);

			if (key === '' || type === 'EmptyKeyError') {
				hiddenInput.value = '';
				validationDiv.classList.add(errorClass);
				validationMessage = window.localization.please_add_api_key;
			} else {
				validationDiv.classList.add(errorClass);
				switch (type) {
					case 'InvalidKeyError':
						validationMessage = window.localization.invalid_api_key;
						break;
					case 'RefererNotAllowedError':
						validationMessage =
							window.localization.referer_not_allowed;
						break;
					case 'InvalidCharactersError':
						validationMessage =
							window.localization.invalid_characters;
						break;
					case 'ServerError':
						validationMessage = window.localization.server_error;
						break;
					case true:
						hiddenInput.value = key;
						validationDiv.classList.remove(errorClass);
						break;
					default:
						break;
				}
			}
		}

		validationDiv.innerHTML = validationMessage;
	};

	const makeInputPasswordVisible = input => {
		if (!input) return;

		input.addEventListener('focus', () => {
			input.type = 'text';
		});

		input.addEventListener('blur', () => {
			input.type = 'password';
		});
	};

	// Google API Key validation
	const googleApiKeyVisibleInput = document.querySelector(
		'.google-api-key-option-visible-input'
	);
	const googleApiKeyHiddenInput = document.getElementById(
		'google_api_key_option_hidden'
	);
	const googleValidationDiv = document.getElementById(
		'maxi-api-test__validation-message'
	);

	makeInputPasswordVisible(googleApiKeyVisibleInput);

	const head = document.getElementsByTagName('head')[0];

	const getGoogleApiKey = () => googleApiKeyVisibleInput.value;

	const checkForInvalidCharactersError = googleApiKey =>
		!googleApiKey.match(/^[a-zA-Z0-9_$.[\]]+$/);

	const googleMapsCustomValidation = type => {
		customValidation(
			type,
			getGoogleApiKey,
			googleApiKeyHiddenInput,
			googleValidationDiv
		);
	};

	const testGoogleApiKey = () => {
		const googleApiKey = getGoogleApiKey();

		if (checkForInvalidCharactersError(googleApiKey)) {
			googleMapsCustomValidation('InvalidCharactersError');
			return;
		}

		const oldScript = document.getElementById(
			'maxi-test-google-map-script'
		);
		if (oldScript) head.removeChild(oldScript);

		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
		script.id = 'maxi-test-google-map-script';
		script.defer = true;
		script.async = true;

		head.appendChild(script);
		window.initMap = initTestMap;
		googleValidationDiv.innerHTML = '';
		googleValidationDiv.classList.remove('api-error');
	};

	const catchGoogleMapsApiErrors = () => {
		// based on http://tobyho.com/2012/07/27/taking-over-console-log/
		const { console } = window;
		if (!console) return;

		const intercept = method => {
			const original = console[method];
			console[method] = function () {
				// eslint-disable-next-line prefer-rest-params
				if (arguments[0]) {
					if (
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('InvalidKeyMapError') ||
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('InvalidKeyError') ||
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('API multiple times')
					) {
						googleMapsCustomValidation('InvalidKeyError');
					} else if (
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('RefererNotAllowedMapError') ||
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('RefererNotAllowedError')
					) {
						googleMapsCustomValidation('RefererNotAllowedError');
					} else if (
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('API without a key') ||
						// eslint-disable-next-line prefer-rest-params
						arguments[0].includes('EmptyKeyError')
					) {
						googleMapsCustomValidation('EmptyKeyError');
					} else {
						googleMapsCustomValidation(true);
					}
				}

				if (original.apply) {
					// eslint-disable-next-line prefer-rest-params
					original.apply(console, arguments);
				}
			};
		};
		intercept(['error']);
	};

	// eslint-disable-next-line func-names
	googleApiKeyVisibleInput?.addEventListener('input', function () {
		testGoogleApiKey();
		catchGoogleMapsApiErrors();
	});

	// AI Provider and API Key validation
	const getProviderApiKey = provider => {
		const selector = `.${provider}-api-key-option-visible-input`;
		const input = document.querySelector(selector);
		return input?.value || '';
	};

	const getApiKeyInputByProvider = provider => {
		const selector = `.${provider}-api-key-option-visible-input`;
		return document.querySelector(selector);
	};

	const getHiddenApiKeyInputByProvider = provider => {
		return document.getElementById(`${provider}_api_key_option_hidden`);
	};

	const getValidationDivByProvider = provider => {
		return document.getElementById(
			`maxi-api-test__validation-message-${provider}_api_key_option`
		);
	};

	// Initialize password visibility for all provider inputs
	['openai', 'anthropic', 'gemini', 'mistral'].forEach(provider => {
		const input = getApiKeyInputByProvider(provider);
		if (input) {
			makeInputPasswordVisible(input);
		}
	});

	const customApiKeyValidation = (provider, type) => {
		const getKey = () => getProviderApiKey(provider);
		const hiddenInput = getHiddenApiKeyInputByProvider(provider);
		const validationDiv = getValidationDivByProvider(provider);

		if (hiddenInput && validationDiv) {
			customValidation(type, getKey, hiddenInput, validationDiv);
		}
	};

	const fetchAnthropicModels = async apiKey => {
		// Anthropic models are static for now as they don't have a public models endpoint that is easily accessible from frontend without proxy
		// We will return a predefined list of supported models (updated January 2026)
		return [
			'claude-opus-4-1-20250805',
			'claude-sonnet-4-20250514',
			'claude-3-7-sonnet-20250219',
			'claude-3-5-haiku-20241022',
			'claude-3-5-sonnet-20240620',
			'claude-3-opus-20240229',
			'claude-3-sonnet-20240229',
			'claude-3-haiku-20240307',
		];
	};

	const buildModelFetchError = (error, providerLabel) => {
		const modelError = new Error(
			`Failed to fetch ${providerLabel} models`
		);
		const status = error?.status || error?.data?.status;
		if (status) {
			modelError.status = status;
		}
		return modelError;
	};

	const fetchProviderModels = async (provider, apiKey, providerLabel) => {
		if (!window.wp?.apiFetch) {
			throw buildModelFetchError({ status: 500 }, providerLabel);
		}

		try {
			return await window.wp.apiFetch({
				path: '/maxi-blocks/v1.0/ai/models',
				method: 'POST',
				data: {
					provider,
					...(apiKey ? { api_key: apiKey } : {}),
				},
			});
		} catch (error) {
			throw buildModelFetchError(error, providerLabel);
		}
	};

	const fetchGeminiModels = async apiKey =>
		fetchProviderModels('gemini', apiKey, 'Gemini');

	const fetchMistralModels = async apiKey =>
		fetchProviderModels('mistral', apiKey, 'Mistral');

	const fetchOpenAIModels = async apiKey =>
		fetchProviderModels('openai', apiKey, 'OpenAI');

	let isUpdatingDropdown = false;
	let pendingModelUpdate = null;

	const updateModelDropdown = async (provider, apiKey) => {
		if (isUpdatingDropdown) {
			pendingModelUpdate = { provider, apiKey };
			return null;
		}
		isUpdatingDropdown = true;
		const requestKey = apiKey;

		const modelSelect = document.getElementById('maxi_ai_model');

		if (!modelSelect) {
			isUpdatingDropdown = false;
			return null;
		}

		// Only show loading message if we have a valid API key
		if (apiKey) {
			modelSelect.innerHTML = `<option value="">${window.localization.loading_available_models}</option>`;
		} else {
			modelSelect.innerHTML = `<option value="">${window.localization.please_add_api_key}</option>`;
			isUpdatingDropdown = false;
			return null;
		}

		try {
			let models = [];
			switch (provider) {
				case 'anthropic':
					models = await fetchAnthropicModels(apiKey);
					break;
				case 'gemini':
					models = await fetchGeminiModels(apiKey);
					break;
				case 'mistral':
					models = await fetchMistralModels(apiKey);
					break;
				case 'openai':
				default:
					models = await fetchOpenAIModels(apiKey);
					break;
			}

			// Ignore stale responses
			if (getProviderApiKey(provider) !== requestKey) {
				return { ok: false, stale: true };
			}

			// Clear existing options
			modelSelect.innerHTML = '';

			if (models.length === 0) {
				const option = document.createElement('option');
				option.value = '';
				option.textContent = window.localization.no_models_available;
				modelSelect.appendChild(option);
				return { ok: true };
			}

			// Add available models
			models.forEach(modelId => {
				const option = document.createElement('option');
				option.value = modelId;
				option.textContent = modelId;
				modelSelect.appendChild(option);
			});

			// Get the saved value from WordPress options via localized script
			const currentValue =
				window.maxiAiSettings?.defaultModel ||
				(provider === 'openai' ? 'gpt-3.5-turbo' : models[0]);

			// If the stored model matches one of the new provider's models, use it
			// Otherwise default to the first available model
			if (models.includes(currentValue)) {
				modelSelect.value = currentValue;
			} else {
				// eslint-disable-next-line prefer-destructuring
				modelSelect.value = models[0];
			}
			return { ok: true };
		} catch (error) {
			console.error('Error updating model dropdown:', error);
			modelSelect.innerHTML = `<option value="">${window.localization.error_loading_models}</option>`;
			return { ok: false, error };
		} finally {
			isUpdatingDropdown = false;
			if (pendingModelUpdate) {
				const next = pendingModelUpdate;
				pendingModelUpdate = null;
				updateModelDropdown(next.provider, next.apiKey);
			}
		}
	};

	const testProviderApiKey = async provider => {
		const apiKey = getProviderApiKey(provider);
		const requestKey = apiKey;

		if (apiKey === '') {
			customApiKeyValidation(provider, 'EmptyKeyError');
			return;
		}

		customApiKeyValidation(provider, 'validating');

		// For validation, we'll try to update the dropdown which does a fetch
		try {
			const result = await updateModelDropdown(provider, requestKey);
			if (!result) return;
			if (getProviderApiKey(provider) !== requestKey) return;

			if (result.ok) {
				customApiKeyValidation(provider, true);
				return;
			}

			const status = result.error?.status;
			if (status === 401 || status === 403) {
				customApiKeyValidation(provider, 'InvalidKeyError');
				return;
			}

			customApiKeyValidation(provider, 'ServerError');
		} catch (error) {
			console.error(error);
			customApiKeyValidation(provider, 'ServerError');
		}
	};

	// Initialization logic
	const providerSelect = document.getElementById('maxi_ai_provider');
	if (providerSelect) {
		const initialProvider = providerSelect.value || 'openai';
		const initialKey = getProviderApiKey(initialProvider);

		// Initial load
		if (initialKey) {
			updateModelDropdown(initialProvider, initialKey);
		}

		// Handle provider change
		providerSelect.addEventListener('change', function () {
			const newProvider = this.value;
			const newKey = getProviderApiKey(newProvider);
			updateModelDropdown(newProvider, newKey);
		});

		// Handle API key changes for all providers
		['openai', 'anthropic', 'gemini', 'mistral'].forEach(provider => {
			const input = getApiKeyInputByProvider(provider);
			if (input) {
				input.addEventListener('input', () => {
					// Debounce or just run? The original ran immediately.
					testProviderApiKey(provider);
				});
			}
		});

		// Handle model select changes (no longer needed for sync, just for any other listeners if needed)
		// const modelSelect = document.getElementById('maxi_ai_model');
	}

	// MCP API token and abilities
	const mcpTokenInput = document.getElementById('maxi_mcp_token');
	const mcpStatusElement = document.getElementById(
		'maxi-mcp-connection-status'
	);
	const mcpAbilitiesElement = document.getElementById('maxi-mcp-abilities');
	const mcpErrorElement = document.getElementById('maxi-mcp-error');
	const mcpStatusClassMap = {
		connected: 'is-connected',
		loading: 'is-loading',
		unauthorized: 'is-error',
		unreachable: 'is-error',
		error: 'is-error',
		idle: 'is-idle',
	};

	const formatAbilityLabel = ability => {
		if (typeof ability === 'string') {
			return ability;
		}

		if (ability?.name) {
			return ability.name;
		}

		if (ability?.id) {
			return ability.id;
		}

		return JSON.stringify(ability);
	};

	const renderMcpAbilities = abilities => {
		if (!mcpAbilitiesElement) return;

		mcpAbilitiesElement.innerHTML = '';

		if (!abilities?.length) {
			const emptyItem = document.createElement('li');
			emptyItem.textContent = window.localization.mcp_no_abilities;
			emptyItem.classList.add('maxi-mcp-abilities__empty');
			mcpAbilitiesElement.appendChild(emptyItem);
			return;
		}

		abilities.forEach(ability => {
			const item = document.createElement('li');
			item.textContent = formatAbilityLabel(ability);
			mcpAbilitiesElement.appendChild(item);
		});
	};

	const updateMcpUiFromStore = () => {
		if (!mcpStatusElement || !mcpErrorElement || !mcpAbilitiesElement) {
			return;
		}

		const store = select(MCP_STORE_NAME);
		if (!store) {
			return;
		}

		const status = store.getStatus();
		const abilities = store.getAbilities();
		const error = store.getError();

		const statusMessageMap = {
			connected: window.localization.mcp_status_connected,
			loading: window.localization.mcp_status_loading,
			unauthorized: window.localization.mcp_status_unauthorized,
			unreachable: window.localization.mcp_status_unreachable,
			error: window.localization.mcp_status_error,
			idle: window.localization.mcp_status_idle,
		};

		mcpStatusElement.textContent =
			statusMessageMap[status] || window.localization.mcp_status_idle;

		mcpStatusElement.classList.remove(...Object.values(mcpStatusClassMap));
		if (mcpStatusClassMap[status]) {
			mcpStatusElement.classList.add(mcpStatusClassMap[status]);
		}

		mcpErrorElement.textContent = error || '';

		if (status === 'connected') {
			renderMcpAbilities(abilities);
		} else {
			mcpAbilitiesElement.innerHTML = '';
		}
	};

	const fetchMcpAbilities = async token => {
		const trimmedToken = token.trim();

		if (!trimmedToken) {
			dispatch(MCP_STORE_NAME).reset();
			updateMcpUiFromStore();
			return;
		}

		const store = select(MCP_STORE_NAME);
		const cachedToken = store?.getToken();
		const cachedAbilities = store?.getAbilities();
		const cachedStatus = store?.getStatus();

		if (
			cachedStatus === 'connected' &&
			cachedToken === trimmedToken &&
			cachedAbilities?.length
		) {
			updateMcpUiFromStore();
			return;
		}

		const requestToken = trimmedToken;

		dispatch(MCP_STORE_NAME).setToken(requestToken);
		dispatch(MCP_STORE_NAME).setStatus('loading');
		dispatch(MCP_STORE_NAME).setError(null);
		updateMcpUiFromStore();

		try {
			const client = createMcpClient({
				baseUrl: getMcpBaseUrl(),
				token: requestToken,
			});
			const abilities = await client.getAbilities();
			const latestToken = select(MCP_STORE_NAME)?.getToken();
			if (latestToken !== requestToken) {
				return;
			}
			dispatch(MCP_STORE_NAME).setAbilities(abilities);
			dispatch(MCP_STORE_NAME).setStatus('connected');
			dispatch(MCP_STORE_NAME).setError(null);
		} catch (error) {
			const latestToken = select(MCP_STORE_NAME)?.getToken();
			if (latestToken !== requestToken) {
				return;
			}

			let status = 'error';
			let message = window.localization.mcp_error_generic;

			if (error?.code === 'unauthorized') {
				status = 'unauthorized';
				message = window.localization.mcp_error_unauthorized;
			} else if (
				error?.code === 'unreachable' ||
				error?.code === 'missing_base_url'
			) {
				status = 'unreachable';
				message = window.localization.mcp_error_unreachable;
			}

			dispatch(MCP_STORE_NAME).setStatus(status);
			dispatch(MCP_STORE_NAME).setError(message);
			dispatch(MCP_STORE_NAME).setAbilities([]);
		} finally {
			const latestToken = select(MCP_STORE_NAME)?.getToken();
			if (latestToken === requestToken) {
				updateMcpUiFromStore();
			}
		}
	};

	let mcpDebounceTimer;

	const handleMcpTokenUpdate = () => {
		if (!mcpTokenInput) return;
		clearTimeout(mcpDebounceTimer);
		mcpDebounceTimer = setTimeout(() => {
			fetchMcpAbilities(mcpTokenInput.value);
		}, 400);
	};

	if (mcpTokenInput) {
		makeInputPasswordVisible(mcpTokenInput);
		handleMcpTokenUpdate();
		mcpTokenInput.addEventListener('input', handleMcpTokenUpdate);
		mcpTokenInput.addEventListener('blur', handleMcpTokenUpdate);
	}

	function autoResize(textarea) {
		const maxHeight = 300; // Set this to your preferred maximum height, e.g., 200, 300, or 400 px

		textarea.style.height = 'auto';

		if (textarea.scrollHeight > maxHeight) {
			textarea.style.height = `${maxHeight}px`;
			textarea.style.overflowY = 'scroll'; // Enable vertical scrolling
		} else {
			textarea.style.height = `${textarea.scrollHeight}px`;
			textarea.style.overflowY = 'hidden'; // Hide vertical scrollbar
		}
	}

	// Get all textareas with the given class
	const textareas = document.querySelectorAll(
		'textarea.maxi-dashboard_main-content_accordion-item-input'
	);
	Array.from(textareas).forEach(textarea => {
		// Initialize the height
		autoResize(textarea);

		// Add the auto-resizing functionality on input event
		textarea.addEventListener('input', () => {
			autoResize(textarea);
		});
	});

	// Handle admin menu active states
	function setAdminMenuActive() {
		const adminMenu = document.querySelector(
			'#toplevel_page_maxi-blocks-dashboard'
		);
		if (!adminMenu) return;

		// Get the current tab from URL
		const urlParams = new URLSearchParams(window.location.search);
		const currentTab = urlParams.get('tab');
		const currentPage = urlParams.get('page');

		// Remove all current classes first
		const allMenuItems = adminMenu.querySelectorAll('li');
		allMenuItems.forEach(item => {
			item.classList.remove('current');
			const anchor = item.querySelector('a');
			if (anchor) {
				anchor.classList.remove('current');
				anchor.setAttribute('aria-current', 'false');
			}
		});

		// Find and set the active menu item
		const menuItems = adminMenu.querySelectorAll('a');
		menuItems.forEach(link => {
			let isActive = false;

			// Special case for Quick Start
			if (
				currentPage === 'maxi-blocks-quick-start' &&
				link.href.includes('maxi-blocks-quick-start')
			) {
				isActive = true;
			}
			// Handle other menu items
			else if (currentTab) {
				// Check if the link contains the current tab
				const tabInUrl = link.href.match(/tab=([^&]*)/);
				if (tabInUrl) {
					isActive = tabInUrl[1] === currentTab;
				}
			}
			// Handle Welcome page (no tab)
			else if (
				currentPage === 'maxi-blocks-dashboard' &&
				link.href.includes('maxi-blocks-dashboard') &&
				!link.href.includes('tab=')
			) {
				isActive = true;
			}

			if (isActive) {
				// Set active state
				const menuItem = link.closest('li');
				if (menuItem) {
					menuItem.classList.add('current');
					link.classList.add('current');
					link.setAttribute('aria-current', 'page');
				}
			}
		});
	}

	// Call the function on page load
	setAdminMenuActive();
});

// License page functionality
document.addEventListener('DOMContentLoaded', function () {
	// Handle license validation (email or purchase code)
	const validateButton = document.getElementById('maxi-validate-license');
	const licenseInput = document.getElementById('maxi-license-input');
	const validationMessage = document.getElementById(
		'maxi-license-validation-message'
	);
	const currentStatus = document.getElementById('current-license-status');
	const currentUser = document.getElementById('current-license-user');
	const logoutButton = document.getElementById('maxi-license-logout');

	// Click count for email show/hide functionality
	let clickCount = 0;

	/**
	 * Initialize email show/hide functionality for existing user
	 */
	function initializeEmailToggle() {
		if (currentUser && currentUser.textContent) {
			const userName = currentUser.textContent.trim();

			if (isValidEmail(userName)) {
				currentUser.style.cursor = 'pointer';
				currentUser.title = window.localization.click_to_show;

				// Add click handler for email show/hide
				currentUser.onclick = function () {
					clickCount += 1;
					if (clickCount % 2 !== 0) {
						currentUser.textContent = userName;
						currentUser.title = window.localization.click_to_hide;
					} else {
						currentUser.textContent = '******@***.***';
						currentUser.title = window.localization.click_to_show;
					}
				};

				// Set initial masked display
				currentUser.textContent = '******@***.***';
			}
		}
	}

	// Initialize email toggle functionality on page load
	initializeEmailToggle();

	/**
	 * Show validation message
	 */
	function showMessage(message, isError = false) {
		if (validationMessage) {
			validationMessage.style.display = 'block';
			validationMessage.textContent = message;
			validationMessage.className = `maxi-license-message ${
				isError ? 'error' : 'success'
			}`;
		}
	}

	/**
	 * Update license status display
	 */
	function updateLicenseStatus(status, userName = '') {
		if (currentStatus) {
			currentStatus.textContent = status;
		}

		if (currentUser) {
			if (userName) {
				currentUser.textContent =
					userName === 'Maxiblocks' ? 'MaxiBlocks' : userName;
				currentUser.parentElement.style.display = 'block';

				// Add email show/hide functionality if it's an email
				if (isValidEmail(userName)) {
					currentUser.style.cursor = 'pointer';
					currentUser.title =
						clickCount % 2 !== 0
							? window.localization.click_to_hide
							: window.localization.click_to_show;

					// Remove any existing click handlers
					currentUser.onclick = null;

					// Add click handler for email show/hide
					currentUser.onclick = function () {
						clickCount += 1;
						if (clickCount % 2 !== 0) {
							currentUser.textContent = userName;
							currentUser.title =
								window.localization.click_to_hide;
						} else {
							currentUser.textContent = '******@***.***';
							currentUser.title =
								window.localization.click_to_show;
						}
					};

					// Set initial display
					currentUser.textContent =
						clickCount % 2 !== 0 ? userName : '******@***.***';
				} else {
					// For purchase codes, show as-is without click functionality
					currentUser.style.cursor = 'default';
					currentUser.title = '';
					currentUser.onclick = null;
					currentUser.textContent = userName;
				}
			} else {
				currentUser.parentElement.style.display = 'none';
			}
		}

		// Since we're combining sections, we need to reload the page to show the correct UI
		// This ensures the proper elements (logout button vs input form) are displayed
		if (status === 'Active' || status === 'Not activated') {
			setTimeout(() => {
				window.location.reload();
			}, 300); // Give time to show the success message
		}
	}

	/**
	 * Helper functions for authentication
	 */

	/**
	 * Detects if input is an email or purchase code
	 * @param {string} input - The input string to check
	 * @returns {string} - 'email' or 'code'
	 */
	function detectInputType(input) {
		if (!input || typeof input !== 'string') return 'email';

		const trimmedInput = input.trim();

		// If it contains @ or . (dot), it's likely an email
		const hasAtSymbol = trimmedInput.includes('@');
		const hasDot = trimmedInput.includes('.');

		if (hasAtSymbol || hasDot) {
			return 'email';
		}

		// Purchase codes are typically alphanumeric strings without @ or . symbols
		// and are usually longer than 6 characters
		const isAlphanumeric = /^[a-zA-Z0-9\-_]+$/.test(trimmedInput);
		const isLongEnough = trimmedInput.length >= 6;

		// If it doesn't have @ or . and looks like a code, treat as purchase code
		if (isAlphanumeric && isLongEnough) {
			return 'code';
		}

		// Default to email for other cases
		return 'email';
	}

	/**
	 * Validates email format
	 * @param {string} email - Email to validate
	 * @returns {boolean} - True if valid email
	 */
	function isValidEmail(email) {
		const emailPattern =
			/^(?![.])(([^<>()[\]\\.,;:\s@"']+(\.[^<>()[\]\\.,;:\s@"']+)*|"(.+?)")|(".+?"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailPattern.test(email);
	}

	/**
	 * Validate license (email or purchase code)
	 */
	function validateLicense() {
		const inputValue = licenseInput ? licenseInput.value.trim() : '';

		if (!inputValue) {
			showMessage(window.localization.please_enter_email_or_code, true);
			return;
		}

		const inputType = detectInputType(inputValue);

		// Show loading state
		if (validateButton) {
			validateButton.disabled = true;
			validateButton.textContent = window.localization.validating;
		}

		if (inputType === 'email') {
			// Handle email authentication
			if (!isValidEmail(inputValue)) {
				showMessage(window.localization.the_email_is_not_valid, true);
				resetValidateButton();
				return;
			}

			// For email authentication, send to WordPress backend and open login page

			const formData = new FormData();
			formData.append('action', 'maxi_validate_license');
			// eslint-disable-next-line no-undef
			formData.append('nonce', maxiLicenseSettings.nonce);
			formData.append('license_input', inputValue);
			formData.append('license_action', 'activate');

			// eslint-disable-next-line no-undef
			fetch(maxiLicenseSettings.ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				.then(response => {
					return response.json();
				})
				.then(data => {
					if (data.success && data.data.auth_type === 'email') {
						// Open the login URL in a new tab
						window.open(data.data.login_url, '_blank')?.focus();
						showMessage(
							window.localization.email_authentication_started,
							false
						);

						// Start smart email authentication checking
						startSmartAuthCheck(inputValue);
					} else {
						console.error(
							JSON.stringify({
								message:
									'MaxiBlocks Email Auth JS INIT: Email auth failed',
								errorMessage:
									data.data?.message || 'Unknown error',
							})
						);
						showMessage(
							data.data.message || 'Email authentication failed',
							true
						);
					}
				})
				.catch(error => {
					console.error(
						JSON.stringify({
							message:
								'MaxiBlocks Email Auth JS INIT: Request failed',
							error: error.message,
						})
					);
					showMessage(
						window.localization.failed_to_initiate_email_auth,
						true
					);
				})
				.finally(() => {
					resetValidateButton();
				});
		} else {
			// Handle purchase code authentication
			const formData = new FormData();
			formData.append('action', 'maxi_validate_license');
			// eslint-disable-next-line no-undef
			formData.append('nonce', maxiLicenseSettings.nonce);
			formData.append('license_input', inputValue);
			formData.append('license_action', 'activate');

			// eslint-disable-next-line no-undef
			fetch(maxiLicenseSettings.ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						showMessage(data.data.message);
						updateLicenseStatus(
							data.data.status,
							data.data.user_name
						);
						// Reload page to show activated state
						setTimeout(() => {
							window.location.reload();
						}, 1500);
					} else {
						showMessage(
							data.data.message || 'Validation failed',
							true
						);
					}
				})
				.catch(error => {
					showMessage(
						window.localization.failed_to_validate_license,
						true
					);
				})
				.finally(() => {
					resetValidateButton();
				});
		}
	}

	/**
	 * Start smart authentication checking using Page Visibility API and focus events
	 * This is much more efficient than constant polling - only checks when user returns to tab
	 */
	function startSmartAuthCheck(email) {
		// Set active polling email to prevent duplicates
		activePollingEmail = email;

		let fallbackTimeout;
		let isCheckingAuth = false;
		let handleVisibilityChange;
		let handleWindowFocus;

		const stopAuthCheck = () => {
			activePollingEmail = null;
			if (fallbackTimeout) {
				clearTimeout(fallbackTimeout);
			}
			// Remove event listeners
			if (handleVisibilityChange) {
				document.removeEventListener(
					'visibilitychange',
					handleVisibilityChange
				);
			}
			if (handleWindowFocus) {
				window.removeEventListener('focus', handleWindowFocus);
			}
		};

		const checkAuth = async (trigger = 'unknown') => {
			if (isCheckingAuth) return false; // Prevent multiple simultaneous checks

			isCheckingAuth = true;

			try {
				const authResult = await checkEmailAuthentication(email);

				if (authResult && authResult.success) {
					// User is fully authenticated (both subscription valid and logged into Appwrite)
					stopAuthCheck();

					showMessage(window.localization.successfully_authenticated);
					updateLicenseStatus('Active ✓', authResult.user_name);
					setTimeout(() => {
						window.location.reload();
					}, 1500);

					return true;
				}

				if (
					authResult &&
					authResult.subscription_valid &&
					!authResult.appwrite_login_verified
				) {
					// Subscription is valid but user hasn't logged into Appwrite yet
					// Don't stop checking - keep polling until they log in
					showMessage(
						window.localization.please_log_into_maxiblocks,
						false
					);
					return false;
				}

				if (authResult && authResult.error) {
					// Handle specific errors like seat limit
					console.error(
						JSON.stringify({
							message:
								'MaxiBlocks Email Auth JS: Authentication error',
							email,
							trigger,
							errorMessage: authResult.error_message,
							errorCode: authResult.error_code,
						})
					);

					// Stop auth checking on error
					stopAuthCheck();

					showMessage(authResult.error_message, true);
					return false;
				}

				// If we get here, authentication failed for unknown reasons
			} catch (error) {
				console.error(
					JSON.stringify({
						message:
							'MaxiBlocks Email Auth JS: Auth check exception',
						email,
						trigger,
						error: error.message,
						stack: error.stack,
					})
				);
			} finally {
				isCheckingAuth = false;
			}

			return false;
		};

		// Define event handlers
		handleVisibilityChange = () => {
			if (
				document.visibilityState === 'visible' &&
				activePollingEmail === email
			) {
				checkAuth('visibility-change');
			}
		};

		handleWindowFocus = () => {
			if (activePollingEmail === email) {
				checkAuth('window-focus');
			}
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
				stopAuthCheck();
			}
		}, 600000); // 10 minutes
	}

	/**
	 * Check email authentication directly (similar to toolbar)
	 */
	async function checkEmailAuthentication(email) {
		try {
			// Get the auth key from cookie
			const cookies = document.cookie.split(';');
			let authKey = null;

			for (const cookie of cookies) {
				const [name, value] = cookie.trim().split('=');
				if (name === 'maxi_blocks_key') {
					try {
						const cookieData = JSON.parse(value);
						authKey = cookieData[email];

						break;
					} catch (e) {
						console.error(
							JSON.stringify({
								message:
									'MaxiBlocks Email Auth JS: Error parsing cookie',
								email,
								error: e.message,
								cookieValue: value,
							})
						);
					}
				}
			}

			if (!authKey) {
				console.error(
					JSON.stringify({
						message:
							'MaxiBlocks Email Auth JS: No auth key found for email',
						email,
					})
				);
				return false;
			}

			// Call WordPress AJAX endpoint to check authentication status
			const formData = new FormData();
			formData.append('action', 'maxi_check_auth_status');
			// eslint-disable-next-line no-undef
			formData.append('nonce', maxiLicenseSettings.nonce);

			// eslint-disable-next-line no-undef
			const endpoint = maxiLicenseSettings.ajaxUrl;

			// eslint-disable-next-line no-undef
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				console.error(
					JSON.stringify({
						message:
							'MaxiBlocks Email Auth JS: API response not ok',
						email,
						status: response.status,
						statusText: response.statusText,
					})
				);
				return false;
			}

			const data = await response.json();

			if (data && data.success) {
				if (data.data.is_authenticated) {
					// User is fully authenticated (both subscription valid and logged into Appwrite)

					return {
						success: true,
						user_name: data.data.user_name,
					};
				}

				// Check for the new intermediate state: subscription valid but not logged into Appwrite
				if (
					data.data.subscription_valid &&
					!data.data.appwrite_login_verified
				) {
					return {
						success: false,
						subscription_valid: true,
						appwrite_login_verified: false,
						message:
							data.data.message ||
							window.localization.please_log_into_maxiblocks,
					};
				}

				if (data.data.error && data.data.error_message) {
					// Handle specific errors like seat limit
					console.error(
						JSON.stringify({
							message:
								'MaxiBlocks Email Auth JS: ERROR response from server',
							email,
							errorCode: data.data.error_code,
							errorMessage: data.data.error_message,
						})
					);
					return {
						success: false,
						error: true,
						error_message: data.data.error_message,
						error_code: data.data.error_code,
					};
				}
			} else {
				console.error(
					JSON.stringify({
						message:
							'MaxiBlocks Email Auth JS: Response unsuccessful or malformed',
						email,
						responseSuccess: data?.success,
						responseData: data,
					})
				);
			}

			return false;
		} catch (error) {
			console.error(
				JSON.stringify({
					message:
						'MaxiBlocks Email Auth JS: Exception caught in checkEmailAuthentication',
					email,
					error: error.message,
					stack: error.stack,
				})
			);
			return false;
		}
	}

	/**
	 * Reset validate button state
	 */
	function resetValidateButton() {
		if (validateButton) {
			validateButton.disabled = false;
			validateButton.textContent = window.localization.activate;
		}
	}

	/**
	 * Handle logout
	 */
	function handleLogout() {
		if (logoutButton) {
			logoutButton.disabled = true;
			logoutButton.textContent = window.localization.signing_out;
		}

		// Check if this is an email logout (check for the maxi_blocks_key cookie)
		const isEmailLogout = document.cookie
			.split(';')
			.some(cookie => cookie.trim().startsWith('maxi_blocks_key='));

		// If email logout, open logout page
		if (isEmailLogout) {
			const logoutUrl = 'https://my.maxiblocks.com/log-out?plugin';
			window.open(logoutUrl, '_blank')?.focus();
		}

		const formData = new FormData();
		formData.append('action', 'maxi_validate_license');
		// eslint-disable-next-line no-undef
		formData.append('nonce', maxiLicenseSettings.nonce);
		formData.append('license_action', 'logout');

		// eslint-disable-next-line no-undef
		fetch(maxiLicenseSettings.ajaxUrl, {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					showMessage(data.data.message);
					updateLicenseStatus(data.data.status, data.data.user_name);
				} else {
					showMessage(
						data.data.message ||
							window.localization.failed_to_sign_out,
						true
					);
				}
			})
			.catch(error => {
				console.error('Logout error:', error);
				showMessage(window.localization.failed_to_sign_out, true);
			})
			.finally(() => {
				if (logoutButton) {
					logoutButton.disabled = false;
					logoutButton.textContent = window.localization.sign_out;
				}
			});
	}

	// Event listeners
	if (validateButton) {
		validateButton.addEventListener('click', validateLicense);
	}

	if (logoutButton) {
		logoutButton.addEventListener('click', handleLogout);
	}

	if (licenseInput) {
		// Store original placeholder
		const originalPlaceholder = licenseInput.placeholder;

		// Hide placeholder on focus
		// eslint-disable-next-line func-names
		licenseInput.addEventListener('focus', function () {
			this.placeholder = '';
		});

		// Restore placeholder on blur if input is empty
		// eslint-disable-next-line func-names
		licenseInput.addEventListener('blur', function () {
			if (!this.value.trim()) {
				this.placeholder = originalPlaceholder;
			}
		});

		// eslint-disable-next-line func-names
		licenseInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				validateLicense();
			}
		});
	}
});

// Custom Fonts Manager with AJAX
document.addEventListener('DOMContentLoaded', () => {
	const submitBtn = document.getElementById('maxi-custom-font-submit');

	if (!submitBtn) {
		return;
	}

	// Check if wp.apiFetch is available
	if (!window.wp || !window.wp.apiFetch) {
		console.error('wp.apiFetch is not available');
		return;
	}

	const noticeContainer = document.getElementById('maxi-custom-fonts-notice');
	const fontsListContainer = document.querySelector(
		'.maxi-custom-fonts-list'
	);

	/**
	 * Display a notice message using DOM-safe element creation
	 *
	 * @param {string} message - The message to display (will be escaped)
	 * @param {string} type    - Notice type: 'success' or 'error'
	 */
	const showNotice = (message, type = 'success') => {
		if (!noticeContainer) {
			return;
		}

		// Determine notice classes based on type
		const noticeClass =
			type === 'success'
				? 'notice notice-success'
				: 'notice notice-error';

		// Create wrapper div with notice classes
		const wrapperDiv = document.createElement('div');
		wrapperDiv.className = `${noticeClass} is-dismissible`;

		// Create paragraph element and set text content (XSS-safe)
		const paragraph = document.createElement('p');
		paragraph.textContent = message;

		// Append paragraph to wrapper
		wrapperDiv.appendChild(paragraph);

		// Clear and update notice container
		noticeContainer.innerHTML = '';
		noticeContainer.appendChild(wrapperDiv);
	};

	const refreshFontsList = async () => {
		if (!fontsListContainer) {
			return;
		}

		try {
			const fonts = await wp.apiFetch({
				path: '/maxi-blocks/v1.0/fonts/custom',
			});

			const fontsArray = Object.values(fonts);

			// Find or create the container element
			let container = document.querySelector(
				'.maxi-custom-fonts-list-container'
			);
			if (!container) {
				container = fontsListContainer.parentElement;
			}

			if (!fontsArray.length) {
				container.innerHTML =
					'<p>No custom fonts have been uploaded yet.</p>';
				return;
			}

			let html = '';
			
			// Helper to escape HTML to prevent XSS
			const escapeHtml = str => {
				const div = document.createElement('div');
				div.textContent = str;
				return div.innerHTML;
			};

			fontsArray.forEach(font => {
				const family = font.value || '';
				const variants = font.variants || [];

				// Collect unique weights and styles
				const weights = [];
				const styles = [];

				variants.forEach(v => {
					const weight = v.weight || '';
					const style = v.style || '';

					if (weight && !weights.includes(weight)) {
						weights.push(weight);
					}
					if (style && !styles.includes(style)) {
						styles.push(style);
					}
				});

				// Sort weights numerically
				weights.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

				const weightsHtml = weights.length
					? `<span class="maxi-font-weights">${escapeHtml(weights.join(', '))}</span>`
					: '—';
				const stylesHtml = styles.length
					? `<span class="maxi-font-styles">${escapeHtml(styles.join(', '))}</span>`
					: '—';

				html += '<tr>';
				html += `<td><strong>${escapeHtml(family)}</strong></td>`;
				html += `<td>${weightsHtml}</td>`;
				html += `<td>${stylesHtml}</td>`;
				html += '<td>';
				if (font.id) {
					html += `<button type="button" class="button-link-delete maxi-delete-custom-font" data-font-id="${escapeHtml(String(font.id))}">Remove</button>`;
				}
				html += '</td></tr>';
			});

			// Only update tbody to preserve event listeners on delete buttons
			const tbody = fontsListContainer.querySelector('tbody');
			if (tbody) {
				tbody.innerHTML = html;
			} else {
				// If table doesn't exist yet, create it
				container.innerHTML = `
					<table class="widefat striped maxi-custom-fonts-list">
						<thead>
							<tr>
								<th>Font family</th>
								<th>Weights</th>
								<th>Styles</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>${html}</tbody>
					</table>
				`;
			}

			// Reattach handlers to new buttons
			attachDeleteHandlers();
		} catch (error) {
			console.error('Error refreshing fonts list:', error);
		}
	};

	const handleDelete = async event => {
		const { target: btn } = event;
		const { fontId } = btn.dataset;

		if (!fontId) {
			return;
		}

		// eslint-disable-next-line no-alert
		if (!window.confirm('Are you sure you want to remove this font?')) {
			return;
		}

		btn.disabled = true;
		btn.textContent = 'Removing...';

		try {
			await wp.apiFetch({
				path: `/maxi-blocks/v1.0/fonts/custom/${fontId}`,
				method: 'DELETE',
			});

			showNotice('Custom font removed successfully.', 'success');
			await refreshFontsList();
		} catch (error) {
			showNotice(error.message || 'Failed to remove font.', 'error');
			btn.disabled = false;
			btn.textContent = 'Remove';
		}
	};

	function attachDeleteHandlers() {
		document.querySelectorAll('.maxi-delete-custom-font').forEach(btn => {
			btn.addEventListener('click', handleDelete);
		});
	}

	// Handle button click
	submitBtn.addEventListener('click', async () => {
		const familyInput = document.getElementById('maxi-custom-font-family');
		const fileInput = document.getElementById('maxi-custom-font-file');

		if (!familyInput || !fileInput || !fileInput.files[0]) {
			showNotice('Please fill in all required fields.', 'error');
			return;
		}

		const family = familyInput.value.trim();
		const file = fileInput.files[0];

		if (!family) {
			showNotice('Font family name is required.', 'error');
			return;
		}

		// Disable submit button
		submitBtn.disabled = true;
		submitBtn.textContent = 'Uploading...';

		try {
			// First upload the file to media library
			const formData = new FormData();
			formData.append('file', file);

			const attachment = await wp.apiFetch({
				path: '/wp/v2/media',
				method: 'POST',
				body: formData,
			});

			// Then add it as a custom font
			try {
				await wp.apiFetch({
					path: '/maxi-blocks/v1.0/fonts/custom',
					method: 'POST',
					data: {
						family,
						attachment_id: attachment.id,
					},
				});

				showNotice('Custom font added successfully!', 'success');

				// Clear inputs
				familyInput.value = '';
				fileInput.value = '';

				await refreshFontsList();
			} catch (fontError) {
				// Delete the uploaded attachment if font creation fails
				await wp.apiFetch({
					path: `/wp/v2/media/${attachment.id}`,
					method: 'DELETE',
				});
				throw fontError;
			}
		} catch (error) {
			showNotice(error.message || 'Failed to upload font.', 'error');
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Add custom font';
		}
	});

	// Initial attachment of delete handlers
	attachDeleteHandlers();
});

// Network License Management for Multisite
// eslint-disable-next-line func-names
document.addEventListener('DOMContentLoaded', function () {
	// Check if we're in network admin and have the necessary elements
	if (
		typeof maxiNetworkLicenseSettings !== 'undefined' &&
		// eslint-disable-next-line no-undef
		maxiNetworkLicenseSettings.isNetworkAdmin
	) {
		initNetworkLicenseHandlers();
	}

	// Also initialize for regular site admin
	if (typeof maxiLicenseSettings !== 'undefined') {
		// Existing license handlers are already in place
		// Just ensure they work with network license context
		initSiteLicenseHandlers();
	}
});

/**
 * Initialize network license handlers
 */
function initNetworkLicenseHandlers() {
	const validateButton = document.getElementById(
		'maxi-validate-network-license'
	);
	const logoutButton = document.getElementById('maxi-network-license-logout');
	const licenseInput = document.getElementById('maxi-network-license-input');

	if (validateButton) {
		// eslint-disable-next-line func-names
		validateButton.addEventListener('click', function () {
			const licenseValue = licenseInput ? licenseInput.value.trim() : '';

			if (!licenseValue) {
				showNetworkMessage(
					window.localization.please_enter_purchase_code,
					'error'
				);
				return;
			}

			// Show loading state
			validateButton.disabled = true;
			validateButton.textContent = window.localization.activating;

			// Send AJAX request for network license validation
			sendNetworkLicenseRequest('validate', licenseValue);
		});
	}

	if (logoutButton) {
		// eslint-disable-next-line func-names
		logoutButton.addEventListener('click', function () {
			if (
				// eslint-disable-next-line no-undef, no-undef, no-restricted-globals, no-alert
				confirm(window.localization.deactivate_network_license_confirm)
			) {
				logoutButton.disabled = true;
				logoutButton.textContent = window.localization.deactivating;

				sendNetworkLicenseRequest('logout', '');
			}
		});
	}

	// Check initial network license status
	checkNetworkAuthStatus();
}

/**
 * Initialize site license handlers with network awareness
 */
function initSiteLicenseHandlers() {
	// The existing license handlers should already be working
	// We just need to ensure they understand network license context

	// If there's a network license input restriction, handle it
	const licenseInput = document.getElementById('maxi-license-input');
	const validateButton = document.getElementById('maxi-validate-license');

	if (licenseInput && validateButton) {
		// Check if we're in a network-restricted mode (email only)
		const emailOnlyForm = document.querySelector('.maxi-email-only');
		if (emailOnlyForm) {
			// Modify validation to only allow email format
			// eslint-disable-next-line func-names, consistent-return
			validateButton.addEventListener('click', function (e) {
				const inputValue = licenseInput.value.trim();
				if (inputValue && !isValidEmail(inputValue)) {
					e.preventDefault();
					// eslint-disable-next-line no-undef
					showMessage(
						window.localization.only_email_authentication_allowed,
						'error'
					);
					return false;
				}
			});
		}
	}
}

/**
 * Send network license AJAX request
 */
function sendNetworkLicenseRequest(action, licenseInput) {
	const data = new FormData();
	data.append('action', 'maxi_network_validate_license');
	// eslint-disable-next-line no-undef
	data.append('nonce', maxiNetworkLicenseSettings.nonce);
	data.append('license_action', action);
	if (licenseInput) {
		data.append('license_input', licenseInput);
	}

	// eslint-disable-next-line no-undef
	fetch(maxiNetworkLicenseSettings.ajaxUrl, {
		method: 'POST',
		body: data,
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				handleNetworkLicenseSuccess(data.data, action);
			} else {
				handleNetworkLicenseError(
					data.data.message || 'An error occurred',
					action
				);
			}
		})
		.catch(error => {
			console.error('Network license request failed:', error);
			handleNetworkLicenseError(
				window.localization.network_error_occurred,
				action
			);
		});
}

/**
 * Handle successful network license response
 */
function handleNetworkLicenseSuccess(data, action) {
	if (action === 'validate') {
		showNetworkMessage(data.message, 'success');
		// Refresh the page to show new status
		setTimeout(() => {
			window.location.reload();
		}, 1500);
	} else if (action === 'logout') {
		showNetworkMessage(data.message, 'success');
		// Refresh the page to show new status
		setTimeout(() => {
			window.location.reload();
		}, 1500);
	}
}

/**
 * Handle network license error response
 */
function handleNetworkLicenseError(message, action) {
	showNetworkMessage(message, 'error');

	// Reset button states
	const validateButton = document.getElementById(
		'maxi-validate-network-license'
	);
	const logoutButton = document.getElementById('maxi-network-license-logout');

	if (action === 'validate' && validateButton) {
		validateButton.disabled = false;
		validateButton.textContent =
			window.localization.activate_network_license;
	} else if (action === 'logout' && logoutButton) {
		logoutButton.disabled = false;
		logoutButton.textContent =
			window.localization.deactivate_network_license;
	}
}

/**
 * Show network license message
 */
function showNetworkMessage(message, type) {
	const messageDiv = document.getElementById(
		'maxi-network-license-validation-message'
	);
	if (!messageDiv) return;

	messageDiv.style.display = 'block';
	messageDiv.textContent = message;
	messageDiv.className = `maxi-license-message maxi-license-${type}`;

	// Auto-hide success messages
	if (type === 'success') {
		setTimeout(() => {
			messageDiv.style.display = 'none';
		}, 5000);
	}
}

/**
 * Check network authentication status
 */
function checkNetworkAuthStatus() {
	const data = new FormData();
	data.append('action', 'maxi_network_check_auth_status');
	// eslint-disable-next-line no-undef
	data.append('nonce', maxiNetworkLicenseSettings.nonce);

	// eslint-disable-next-line no-undef
	fetch(maxiNetworkLicenseSettings.ajaxUrl, {
		method: 'POST',
		body: data,
	})
		.then(response => response.json())
		.then(data => {
			if (data.success && data.data.is_authenticated) {
				// Update UI to reflect current status
				updateNetworkLicenseUI(data.data);
			}
		})
		.catch(error => {
			console.error('Network auth status check failed:', error);
		});
}

/**
 * Update network license UI
 */
function updateNetworkLicenseUI(data) {
	const statusElement = document.getElementById(
		'current-network-license-status'
	);
	const userElement = document.getElementById('current-network-license-user');

	if (statusElement) {
		statusElement.textContent = data.status;
		statusElement.className = data.is_authenticated
			? 'maxi-license-active'
			: 'maxi-license-inactive';
	}

	if (userElement) {
		userElement.textContent = data.user_name;
	}
}

/**
 * Validate email format
 */
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Show regular site license message (fallback for existing functionality)
 */
function showMessage(message, type) {
	const messageDiv = document.getElementById(
		'maxi-license-validation-message'
	);
	if (!messageDiv) {
		console.error(message);
		return;
	}

	messageDiv.style.display = 'block';
	messageDiv.textContent = message;
	messageDiv.className = `maxi-license-message maxi-license-${type}`;

	// Auto-hide success messages
	if (type === 'success') {
		setTimeout(() => {
			messageDiv.style.display = 'none';
		}, 5000);
	}
}
