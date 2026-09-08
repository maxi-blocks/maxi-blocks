import { BUTTON_PATTERNS } from '../ai/blocks/button';

const matchPattern = message =>
	BUTTON_PATTERNS.find(pattern => pattern.regex.test(message));

describe('button icon patterns', () => {
	test.each([
		['Make icon only', { property: 'button_icon', value: 'only' }],
		['Remove icon', { property: 'button_icon', value: 'none' }],
		['Add an icon', { property: 'button_icon_add', value: 'arrow-right' }],
		[
			'Change to cart icon',
			{ property: 'button_icon_change', value: 'shopping-cart' },
		],
		['Move icon to the left', { property: 'icon_position', value: 'left' }],
		['Put icon on the right', { property: 'icon_position', value: 'right' }],
		['Circle icon', { property: 'icon_style', value: 'circle' }],
		['Bigger icon', { property: 'icon_size', value: 24 }],
		['Smaller icon', { property: 'icon_size', value: 16 }],
		['More space between icon and text', { property: 'icon_spacing', value: 10 }],
		['Remove space between icon and text', { property: 'icon_spacing', value: 2 }],
		['White icon', { property: 'icon_color', value: '#ffffff' }],
		['Change icon colour', { property: 'flow_button_icon_color', value: 'start' }],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toEqual(expected.value);
	});
});
