/**
 * WordPress dependencies
 */

const crispChat = (id = '8434178e-1d60-45d5-b112-14a32ee6903c') => {
	const crispChat = () => {
		window.$crisp = [];
		window.CRISP_WEBSITE_ID = id;
		const crispScript = document.createElement('script');
		crispScript.type = 'text/javascript';
		crispScript.src = 'https://client.crisp.chat/l.js';
		crispScript.async = 1;
		document.getElementsByTagName('head')[0].appendChild(crispScript);
	};

	const chat = document.getElementById('crisp-chatbox');

	if (chat) {
		window.$crisp.push(['do', 'chat:open']);
		return;
	}

	if (id) {
		if (document.readyState === 'complete') crispChat();
		else {
			window.attachEvent
				? window.attachEvent('onload', crispChat)
				: window.addEventListener('load', crispChat);
		}
		window.$crisp.push(['do', 'chat:open']);
	}
};

export default crispChat;
