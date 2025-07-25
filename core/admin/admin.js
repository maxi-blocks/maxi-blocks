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

	const select = document.getElementById('maxi-versions');
	const version = document.getElementById('maxi-rollback-version');

	select?.addEventListener('change', function updateBreakpoints() {
		const { value } = select;
		version.value = value;
	});

	const dropdowns = document.querySelectorAll(
		'.maxi-dashboard_main-content_accordion-item-content-switcher__dropdown select'
	);

	if (dropdowns) {
		Array.from(dropdowns).forEach(dropdown => {
			const dropdownInput = document.querySelector(
				`input#${dropdown.id}`
			);

			dropdownInput.value = dropdown.value;

			dropdown.addEventListener('change', function updateInputs() {
				dropdownInput.value = dropdown.value;
			});
		});
	}

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

		const { localization } = window;

		if (type === 'validating') {
			validationMessage = localization.loading_status_message;
			validationDiv.classList.add(validationLoadingClass);
			validationDiv.classList.remove(errorClass);
		} else {
			validationDiv.classList.remove(validationLoadingClass);

			if (key === '' || type === 'EmptyKeyError') {
				hiddenInput.value = '';
				validationDiv.classList.add(errorClass);
				validationMessage = localization.please_add_api_key;
			} else {
				validationDiv.classList.add(errorClass);
				switch (type) {
					case 'InvalidKeyError':
						validationMessage = localization.invalid_api_key;
						break;
					case 'RefererNotAllowedError':
						validationMessage = localization.referer_not_allowed;
						break;
					case 'InvalidCharactersError':
						validationMessage = localization.invalid_characters;
						break;
					case 'ServerError':
						validationMessage = localization.server_error;
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
		'google_api_key_option'
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

	// OpenAI API Key validation
	const openAIApiKeyVisibleInput = document.querySelector(
		'.openai-api-key-option-visible-input'
	);
	const openAIApiKeyHiddenInput = document.getElementById(
		'openai_api_key_option'
	);
	const openAIValidationDiv = document.getElementById(
		'maxi-api-test__validation-message'
	);

	makeInputPasswordVisible(openAIApiKeyVisibleInput);

	const getOpenAIApiKey = () => openAIApiKeyVisibleInput.value;

	const openAIApiKeyCustomValidation = type => {
		customValidation(
			type,
			getOpenAIApiKey,
			openAIApiKeyHiddenInput,
			openAIValidationDiv
		);
	};

	const fetchOpenAIModels = async apiKey => {
		try {
			const response = await fetch('https://api.openai.com/v1/models', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch models');
			}

			const data = await response.json();

			const excludedPatterns = [
				'audio',
				'gpt-3.5-turbo-instruct',
				'gpt-4o-mini-realtime-preview',
				'gpt-4o-realtime-preview',
			];

			const includedPatterns = ['o1', 'o3', 'gpt'];

			return data.data
				.filter(model => {
					const modelId = model.id;
					const isExcluded = excludedPatterns.some(pattern =>
						modelId.includes(pattern)
					);
					const isIncluded = includedPatterns.some(pattern =>
						modelId.includes(pattern)
					);

					return !isExcluded && isIncluded;
				})
				.map(model => model.id)
				.sort();
		} catch (error) {
			console.error('Error fetching OpenAI models:', error);
			return [];
		}
	};

	let isUpdatingDropdown = false;

	const updateModelDropdown = async apiKey => {
		if (isUpdatingDropdown) return;
		isUpdatingDropdown = true;

		const modelSelect = document.getElementById('maxi_ai_model');
		const modelInput = document.querySelector('input#maxi_ai_model');

		if (!modelSelect || !modelInput) {
			isUpdatingDropdown = false;
			return;
		}

		// Only show loading message if we have a valid API key
		if (apiKey) {
			modelSelect.innerHTML =
				'<option value="">Loading available models...</option>';
		} else {
			modelSelect.innerHTML =
				'<option value="">Please add your API key</option>';
			modelInput.value = '';
			isUpdatingDropdown = false;
			return;
		}

		try {
			const models = await fetchOpenAIModels(apiKey);

			// Clear existing options
			modelSelect.innerHTML = '';

			if (models.length === 0) {
				const option = document.createElement('option');
				option.value = '';
				option.textContent = 'No models available - check API key';
				modelSelect.appendChild(option);
				modelInput.value = '';
				isUpdatingDropdown = false;
				return;
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
				window.maxiAiSettings?.defaultModel || 'gpt-3.5-turbo';
			modelInput.value = currentValue;

			// Try to restore previous selection if available
			if (models.includes(currentValue)) {
				modelSelect.value = currentValue;
			} else {
				// If previous selection not available, use first model
				// eslint-disable-next-line prefer-destructuring
				modelSelect.value = models[0];
				// eslint-disable-next-line prefer-destructuring
				modelInput.value = models[0];
			}
		} catch (error) {
			console.error('Error updating model dropdown:', error);
			modelSelect.innerHTML =
				'<option value="">Error loading models</option>';
			modelInput.value = '';
		} finally {
			isUpdatingDropdown = false;
		}
	};

	const testOpenAIApiKey = () => {
		const openAIApiKey = getOpenAIApiKey();

		if (openAIApiKey === '') {
			openAIApiKeyCustomValidation('');
			return;
		}

		openAIApiKeyCustomValidation('validating');

		// Test the API key and update models
		Promise.all([
			fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${openAIApiKey}`,
				},
				body: JSON.stringify({
					messages: [{ role: 'user', content: 'Hello' }],
					model: 'gpt-3.5-turbo',
					max_tokens: 1,
				}),
			}),
			updateModelDropdown(openAIApiKey),
		])
			.then(([response]) => {
				if (response.ok) {
					openAIApiKeyCustomValidation(true);
				} else {
					openAIApiKeyCustomValidation('InvalidKeyError');
				}
			})
			.catch(error => {
				console.error(error);
				openAIApiKeyCustomValidation('ServerError');
			});
	};

	// Check if openAIApiKeyVisibleInput exists before executing related code
	if (openAIApiKeyVisibleInput) {
		const openAIApiKey = getOpenAIApiKey();
		if (openAIApiKey) {
			updateModelDropdown(openAIApiKey);
		}

		// Handle select changes
		const modelSelect = document.getElementById('maxi_ai_model');
		if (modelSelect) {
			modelSelect.addEventListener('change', function () {
				const modelInput = document.querySelector(
					'input#maxi_ai_model'
				);
				if (modelInput) {
					modelInput.value = this.value;
				}
			});
		}

		// Handle API key changes
		openAIApiKeyVisibleInput.addEventListener('input', () => {
			testOpenAIApiKey();
		});
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
				currentUser.title = 'Click to show';

				// Add click handler for email show/hide
				currentUser.onclick = function () {
					clickCount += 1;
					if (clickCount % 2 !== 0) {
						currentUser.textContent = userName;
						currentUser.title = 'Click to hide';
					} else {
						currentUser.textContent = '******@***.***';
						currentUser.title = 'Click to show';
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
				currentUser.textContent = userName;
				currentUser.parentElement.style.display = 'block';

				// Add email show/hide functionality if it's an email
				if (isValidEmail(userName)) {
					currentUser.style.cursor = 'pointer';
					currentUser.title =
						clickCount % 2 !== 0
							? 'Click to hide'
							: 'Click to show';

					// Remove any existing click handlers
					currentUser.onclick = null;

					// Add click handler for email show/hide
					currentUser.onclick = function () {
						clickCount += 1;
						if (clickCount % 2 !== 0) {
							currentUser.textContent = userName;
							currentUser.title = 'Click to hide';
						} else {
							currentUser.textContent = '******@***.***';
							currentUser.title = 'Click to show';
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
			showMessage('Please enter an email or purchase code', true);
			return;
		}

		const inputType = detectInputType(inputValue);

		// Show loading state
		if (validateButton) {
			validateButton.disabled = true;
			validateButton.textContent = 'Validating...';
		}

		if (inputType === 'email') {
			// Handle email authentication
			if (!isValidEmail(inputValue)) {
				showMessage('The email is not valid', true);
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
				.then(response => response.json())
				.then(data => {
					if (data.success && data.data.auth_type === 'email') {
						// Open the login URL in a new tab
						window.open(data.data.login_url, '_blank')?.focus();
						showMessage(
							'Email authentication started. Please complete login in the new tab.',
							false
						);

						// Start direct email polling (like toolbar)
						startDirectEmailPolling(inputValue);
					} else {
						showMessage(
							data.data.message || 'Email authentication failed',
							true
						);
					}
				})
				.catch(error => {
					showMessage(
						'Failed to initiate email authentication',
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
					showMessage('Failed to validate license', true);
				})
				.finally(() => {
					resetValidateButton();
				});
		}
	}

	/**
	 * Start direct email polling (similar to toolbar approach)
	 */
	function startDirectEmailPolling(email) {
		const intervalId = setInterval(async () => {
			try {
				// Call the email authentication API directly
				const authResult = await checkEmailAuthentication(email);

				if (authResult && authResult.success) {
					clearInterval(intervalId);
					showMessage('Authentication successful!');
					updateLicenseStatus('Active ✓', authResult.user_name);
					setTimeout(() => {
						window.location.reload();
					}, 1500);
				}
			} catch (error) {
				console.error('Poll error:', error);
				// Continue polling on error
			}
		}, 1000); // Poll every 1 second like toolbar

		// Stop polling after 5 minutes
		setTimeout(() => {
			clearInterval(intervalId);
		}, 300000);
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
						console.error('Error parsing cookie:', e);
					}
				}
			}

			if (!authKey) {
				console.error('No auth key found for email:', email);
				return false;
			}

			// Call the MaxiBlocks API directly
			const response = await fetch(
				'https://my.maxiblocks.com/plugin-api-fwefqw.php',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Xaiscmolkb': 'sdeqw239ejkdgaorti482',
					},
					body: JSON.stringify({
						email,
						cookie: authKey,
					}),
				}
			);

			if (!response.ok) {
				console.error('API response not ok:', response.status);
				return false;
			}

			const data = await response.json();

			if (data && data.status === 'ok') {
				const today = new Date().toISOString().slice(0, 10);
				const expirationDate = data.expiration_date || today;
				const name = data.name || email;

				if (today > expirationDate) {
					console.error('License expired');
					// Save expired status via WordPress
					await saveLicenseData(email, name, 'expired', authKey);
					return false;
				}
				// Save active status via WordPress
				await saveLicenseData(email, name, 'yes', authKey);
				return { success: true, user_name: name };
			}

			return false;
		} catch (error) {
			console.error('Email auth check error:', error);
			return false;
		}
	}

	/**
	 * Save license data via WordPress AJAX
	 */
	async function saveLicenseData(email, name, status, authKey) {
		try {
			const formData = new FormData();
			formData.append('action', 'maxi_save_email_license');
			// eslint-disable-next-line no-undef
			formData.append('nonce', maxiLicenseSettings.nonce);
			formData.append('email', email);
			formData.append('name', name);
			formData.append('status', status);
			formData.append('auth_key', authKey);

			// eslint-disable-next-line no-undef
			const response = await fetch(maxiLicenseSettings.ajaxUrl, {
				method: 'POST',
				body: formData,
			});

			// eslint-disable-next-line no-unused-vars
			const data = await response.json();
		} catch (error) {
			console.error('Error saving license data:', error);
		}
	}

	/**
	 * Reset validate button state
	 */
	function resetValidateButton() {
		if (validateButton) {
			validateButton.disabled = false;
			validateButton.textContent = 'Activate';
		}
	}

	/**
	 * Handle logout
	 */
	function handleLogout() {
		if (logoutButton) {
			logoutButton.disabled = true;
			logoutButton.textContent = 'Signing out...';
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
						data.data.message || 'Failed to sign out',
						true
					);
				}
			})
			.catch(error => {
				console.error('Logout error:', error);
				showMessage('Failed to sign out', true);
			})
			.finally(() => {
				if (logoutButton) {
					logoutButton.disabled = false;
					logoutButton.textContent = 'Sign out';
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
				showNetworkMessage('Please enter a purchase code', 'error');
				return;
			}

			// Show loading state
			validateButton.disabled = true;
			validateButton.textContent = 'Activating…';

			// Send AJAX request for network license validation
			sendNetworkLicenseRequest('validate', licenseValue);
		});
	}

	if (logoutButton) {
		// eslint-disable-next-line func-names
		logoutButton.addEventListener('click', function () {
			if (
				// eslint-disable-next-line no-undef, no-undef, no-restricted-globals, no-alert
				confirm(
					'Are you sure you want to deactivate the network license? This will affect all sites in the network.'
				)
			) {
				logoutButton.disabled = true;
				logoutButton.textContent = 'Deactivating…';

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
						'Only email authentication is allowed when a network license is active.',
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
			handleNetworkLicenseError('Network error occurred', action);
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
		validateButton.textContent = 'Activate network license';
	} else if (action === 'logout' && logoutButton) {
		logoutButton.disabled = false;
		logoutButton.textContent = 'Deactivate network license';
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
