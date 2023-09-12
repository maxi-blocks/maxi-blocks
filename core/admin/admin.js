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
		document.getElementById(
			'maxi-dashboard_main-content_pro-not-pro'
		).style.display = 'block';
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

	// test map for google api key
	// Initialize and add the map
	const initTestMap = () => {
		// The location of Uluru
		const uluru = { lat: -25.344, lng: 131.031 };
		// The map, centered at Uluru
		const map = new google.maps.Map(
			document.getElementById('maxi-google-test-map'),
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

	const googleApiKeyInput = document.getElementById('google_api_key_option');
	const validationDiv = document.getElementById(
		'maxi-google-test-map_validation-message'
	);
	const head = document.getElementsByTagName('head')[0];

	const getGoogleApiKey = () =>
		document.getElementById('google_api_key_option').value;

	const testGoogleApiKey = () => {
		const oldScript = document.getElementById(
			'maxi-test-google-map-script'
		);
		if (oldScript) head.removeChild(oldScript);

		const googleApiKey = getGoogleApiKey();

		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
		script.id = 'maxi-test-google-map-script';
		script.defer = true;
		script.async = true;

		head.appendChild(script);
		window.initMap = initTestMap;
		validationDiv.innerHTML = '';
		validationDiv.classList.remove('map-error');
	};

	const googleMapsCustomValidation = type => {
		const googleApiKey = getGoogleApiKey();
		let validationMessage = '';

		if (googleApiKey === '') {
			validationMessage = 'Please add your Google Maps API key';
		} else
			switch (type) {
				case 'InvalidKeyMapError':
					validationMessage =
						'Invalid API Key, please check your key and try again';
					break;
				case 'RefererNotAllowedMapError':
					validationMessage =
						'Referer not allowed, please allow your domain for that key';
					break;
				case 'EmptyKeyMapError':
					validationMessage = 'Please add your Google Maps API key';
					break;
				default:
					break;
			}

		validationDiv.classList.add('map-error');
		validationDiv.innerHTML = validationMessage;
	};

	const catchGoogleMapsApiErrors = () => {
		// based on http://tobyho.com/2012/07/27/taking-over-console-log/
		const { console } = window;
		if (!console) return;

		const intercept = method => {
			const original = console[method];
			console[method] = function () {
				if (arguments[0]) {
					if (arguments[0].includes('InvalidKeyMapError')) {
						googleMapsCustomValidation('InvalidKeyMapError');
					}
					if (arguments[0].includes('RefererNotAllowedMapError')) {
						googleMapsCustomValidation('RefererNotAllowedMapError');
					}
					if (arguments[0].includes('API without a key')) {
						googleMapsCustomValidation('EmptyKeyMapError');
					}
				}

				if (original.apply) {
					original.apply(console, arguments);
				}
			};
		};
		intercept(['error']);
	};

	googleApiKeyInput?.addEventListener('input', function () {
		testGoogleApiKey();
		catchGoogleMapsApiErrors();
	});
});
