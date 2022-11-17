/**
 * WordPress dependencies
 */

const crispChat = (id = null) => {
	console.log('crisp chat');
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
	console.log(chat);

	if (chat) {
		console.log('chat exists');
		window.$crisp.push(['do', 'chat:open']);
		return;
	}

	if (id) {
		console.log('id is here');
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
