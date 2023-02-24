document.addEventListener('DOMContentLoaded', function maxiAdmin() {
	// &panel=documentation-support will open the tab in the accordion
	const urlStr = window.location.href;
	const url = new URL(urlStr);
	const toCheck = url.searchParams.get('panel');
	const checkBox = document.getElementById(toCheck);
	if (checkBox) checkBox.checked = true;

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

	// for the version rollback
	const select = document.getElementById('maxi-versions');
	const version = document.getElementById('maxi-rollback-version');

	select?.addEventListener('change', function updateBreakpoints() {
		const { value } = select;
		version.value = value;
	});

	// auth for pro
	const authClient = () => {
		// eslint-disable-next-line no-undef
		const client = new Appwrite.Client();

		client
			.setEndpoint('https://auth.maxiblocks.com/v1') // Your API Endpoint
			.setProject('maxi'); // Your project ID

		// eslint-disable-next-line no-undef
		const account = new Appwrite.Account(client);

		const promise = account.get();

		promise.then(
			function success(response) {
				if (response.status) {
					document.getElementById(
						'maxi-dashboard_main-content_not-pro'
					).style.display = 'none';
					document.getElementById(
						'maxi-dashboard_main-content_pro'
					).style.display = 'block';
					document.getElementById(
						'maxi-dashboard_main-content_pro-not-pro'
					).style.display = 'block';
				} else {
					document.getElementById(
						'maxi-dashboard_main-content_pro'
					).style.display = 'none';
					document.getElementById(
						'maxi-dashboard_main-content_not-pro'
					).style.display = 'block';
					document.getElementById(
						'maxi-dashboard_main-content_pro-not-pro'
					).style.display = 'block';
				}
			},
			function error(error) {
				console.error(error); // Failure
				document.getElementById(
					'maxi-dashboard_main-content_pro'
				).style.display = 'none';
				document.getElementById(
					'maxi-dashboard_main-content_not-pro'
				).style.display = 'block';
				document.getElementById(
					'maxi-dashboard_main-content_pro-not-pro'
				).style.display = 'block';
			}
		);
	};
	if (document.getElementById('maxi-dashboard_main-content_pro-not-pro'))
		authClient();
});
