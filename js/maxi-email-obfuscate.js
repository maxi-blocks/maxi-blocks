/**
 * XOR de-obfuscation function for email
 *
 * @param {string} encodedEmail - Base64 encoded obfuscated email string
 * @param {string} key          - The key used to XOR the string (same as in PHP)
 * @return {string} - The decoded email
 */
function xorDecode(encodedEmail, key = 'K') {
	const obfuscatedEmail = atob(encodedEmail, 'base64'); // Decode base64
	let email = '';
	for (let i = 0; i < obfuscatedEmail.length; i += 1) {
		email += String.fromCharCode(
			// eslint-disable-next-line no-bitwise
			obfuscatedEmail.charCodeAt(i) ^ key.charCodeAt(i % key.length)
		);
	}
	return email;
}

document.addEventListener('DOMContentLoaded', () => {
	const emailLinks = document.querySelectorAll(
		'a[data-email-obfuscated="true"]'
	);

	emailLinks.forEach(emailLink => {
		const encodedEmail = emailLink.getAttribute('href');
		const decodedEmail = xorDecode(encodedEmail, 'K'); // 'K' is the same key as in PHP

		// Update the href and text content to display the real email
		emailLink.setAttribute('href', `mailto:${decodedEmail}`);
		if (emailLink.getAttribute('title') === encodedEmail) {
			emailLink.setAttribute('title', decodedEmail);
		}
	});
});
