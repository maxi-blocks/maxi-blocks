import { BUTTON_PATTERNS, handleButtonUpdate } from '../ai/blocks/button';

const matchPattern = message =>
	BUTTON_PATTERNS.find(pattern => pattern.regex.test(message));

describe('button content patterns', () => {
	test('matches "content" button text prompts and updates attribute', () => {
		const message = 'Set button content to "Shop now"';
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe('button_text');
		expect(pattern.value).toBe('use_prompt');

		const block = { name: 'maxi-blocks/button-maxi', attributes: {} };
		const changes = handleButtonUpdate(block, 'button_text', 'Shop now', '');
		expect(changes).toEqual({ buttonContent: 'Shop now' });
	});
});

