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

	const select = document.getElementById('maxi-versions');
	const version = document.getElementById('maxi-rollback-version');

	select?.addEventListener('change', function updateBreakpoints() {
		const { value } = select;
		version.value = value;
	});

	const chatLink = document.getElementById('chat-with-maxi-support');

	chatLink?.addEventListener('click', function openChatSupport(e) {
		e.preventDefault();

		const chat = document.getElementById('crisp-chatbox');

		if (chat) {
			window.$crisp.push(['do', 'chat:open']);
		} else {
			window.$crisp = [];
			window.CRISP_WEBSITE_ID = '8434178e-1d60-45d5-b112-14a32ee6903c';
			const crispScript = document.createElement('script');
			crispScript.type = 'text/javascript';
			crispScript.src = 'https://client.crisp.chat/l.js';
			crispScript.async = 1;
			document.getElementsByTagName('head')[0].appendChild(crispScript);
			window.$crisp.push(['do', 'chat:open']);
		}
	});
});
