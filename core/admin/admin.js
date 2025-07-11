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
		const map = new google.maps.Map(
			document.getElementById('maxi-api-test'),
			{
				zoom: 4,
				center: uluru,
			}
		);
		// The marker, positioned at Uluru
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
				if (arguments[0]) {
					if (
						arguments[0].includes('InvalidKeyMapError') ||
						arguments[0].includes('API multiple times')
					) {
						googleMapsCustomValidation('InvalidKeyError');
					} else if (
						arguments[0].includes('RefererNotAllowedMapError')
					) {
						googleMapsCustomValidation('RefererNotAllowedError');
					} else if (arguments[0].includes('API without a key')) {
						googleMapsCustomValidation('EmptyKeyError');
					} else {
						googleMapsCustomValidation(true);
					}
				}

				if (original.apply) {
					original.apply(console, arguments);
				}
			};
		};
		intercept(['error']);
	};

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
				modelSelect.value = models[0];
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

// Licence page functionality
document.addEventListener('DOMContentLoaded', function () {
	console.log('MaxiBlocks licence page JavaScript loaded');

	// Handle purchase code validation
	const validateButton = document.getElementById(
		'maxi-validate-purchase-code'
	);
	const purchaseCodeInput = document.getElementById(
		'maxi-purchase-code-input'
	);
	const validationMessage = document.getElementById(
		'maxi-licence-validation-message'
	);
	const currentStatus = document.getElementById('current-licence-status');
	const currentUser = document.getElementById('current-licence-user');
	const logoutButton = document.getElementById('maxi-licence-logout');

	/**
	 * Show validation message
	 */
	function showMessage(message, isError = false) {
		if (validationMessage) {
			validationMessage.style.display = 'block';
			validationMessage.textContent = message;
			validationMessage.className = `maxi-licence-message ${
				isError ? 'error' : 'success'
			}`;
			console.log(
				'Licence validation message:',
				message,
				'isError:',
				isError
			);
		}
	}

	/**
	 * Update licence status display
	 */
	function updateLicenceStatus(status, userName = '') {
		console.log('Updating licence status:', status, 'userName:', userName);

		if (currentStatus) {
			currentStatus.textContent = status;
		}

		if (currentUser) {
			if (userName) {
				currentUser.textContent = userName;
				currentUser.parentElement.style.display = 'block';
			} else {
				currentUser.parentElement.style.display = 'none';
			}
		}

		// Since we're combining sections, we need to reload the page to show the correct UI
		// This ensures the proper elements (logout button vs input form) are displayed
		if (status === 'Active' || status === 'Not activated') {
			console.log('Reloading page to update UI state');
			setTimeout(() => {
				window.location.reload();
			}, 1500); // Give time to show the success message
		}
	}

	/**
	 * Validate purchase code
	 */
	function validatePurchaseCode() {
		const purchaseCode = purchaseCodeInput
			? purchaseCodeInput.value.trim()
			: '';

		if (!purchaseCode) {
			showMessage('Please enter a purchase code', true);
			return;
		}

		console.log('Validating purchase code:', purchaseCode);

		// Show loading state
		if (validateButton) {
			validateButton.disabled = true;
			validateButton.textContent = 'Validating...';
		}

		// Get middleware configuration from WordPress localized settings
		// eslint-disable-next-line no-undef
		const middlewareUrl = maxiLicenceSettings?.middlewareUrl || '';
		// eslint-disable-next-line no-undef
		const middlewareKey = maxiLicenceSettings?.middlewareKey || '';

		if (!middlewareUrl || !middlewareKey) {
			console.error('Missing middleware configuration');
			showMessage(
				'Configuration error: Missing middleware settings',
				true
			);
			resetValidateButton();
			return;
		}

		// Use the same verification logic as in toolbar.js
		fetch(middlewareUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: middlewareKey,
			},
			body: JSON.stringify({
				purchase_code: purchaseCode,
				domain: window.location.hostname,
			}),
		})
			.then(response => {
				console.log('Middleware response status:', response.status);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(result => {
				console.log(
					'Purchase code verification result:',
					JSON.stringify(result)
				);

				if (result.success && result.valid) {
					// Save licence data via AJAX to WordPress
					const formData = new FormData();
					formData.append('action', 'maxi_validate_licence');
					formData.append('nonce', maxiLicenceSettings.nonce);
					formData.append('purchase_code', purchaseCode);
					formData.append('licence_action', 'activate');

					fetch(maxiLicenceSettings.ajaxUrl, {
						method: 'POST',
						body: formData,
					})
						.then(response => response.json())
						.then(data => {
							console.log('WordPress AJAX response:', data);

							if (data.success) {
								showMessage(data.data.message);
								updateLicenceStatus(
									data.data.status,
									data.data.user_name
								);
							} else {
								showMessage(
									data.data.message ||
										'Failed to save licence data',
									true
								);
							}
						})
						.catch(error => {
							console.error('WordPress AJAX error:', error);
							showMessage('Failed to save licence data', true);
						})
						.finally(() => {
							resetValidateButton();
						});
				} else {
					showMessage(
						'Invalid purchase code or verification failed',
						true
					);
					resetValidateButton();
				}
			})
			.catch(error => {
				console.error('Purchase code verification error:', error);
				showMessage(
					`Failed to verify purchase code: ${error.message}`,
					true
				);
				resetValidateButton();
			});
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
		console.log('Handling licence logout');

		if (logoutButton) {
			logoutButton.disabled = true;
			logoutButton.textContent = 'Signing out...';
		}

		const formData = new FormData();
		formData.append('action', 'maxi_validate_licence');
		formData.append('nonce', maxiLicenceSettings.nonce);
		formData.append('licence_action', 'logout');

		fetch(maxiLicenceSettings.ajaxUrl, {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				console.log('Logout response:', data);

				if (data.success) {
					showMessage(data.data.message);
					updateLicenceStatus(data.data.status, data.data.user_name);
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
		validateButton.addEventListener('click', validatePurchaseCode);
		console.log('Added click listener to validate button');
	}

	if (logoutButton) {
		logoutButton.addEventListener('click', handleLogout);
		console.log('Added click listener to logout button');
	}

	if (purchaseCodeInput) {
		purchaseCodeInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				validatePurchaseCode();
			}
		});
		console.log('Added keypress listener to purchase code input');
	}
});
