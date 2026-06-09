import {
	isInteractionBuilderMessage,
	isTextContextForMessage,
} from '../ai/utils/contextDetection';

describe('isTextContextForMessage', () => {
	test('returns true for text selections', () => {
		expect(
			isTextContextForMessage(
				'set counter text color to palette 4',
				'maxi-blocks/text-maxi'
			)
		).toBe(true);
	});

	test('returns false for number counter prompts (even if they mention "text")', () => {
		expect(
			isTextContextForMessage(
				'set counter text color to palette 4',
				'maxi-blocks/number-counter-maxi'
			)
		).toBe(false);
	});

	test('returns false when a number counter is selected', () => {
		expect(
			isTextContextForMessage(
				'set text color to palette 4',
				'maxi-blocks/number-counter-maxi'
			)
		).toBe(false);
	});
});

describe('isInteractionBuilderMessage', () => {
	test('returns true for explicit interaction builder phrasing (including common typos)', () => {
		expect(
			isInteractionBuilderMessage('on hover, scale this to 110% (interaction builder)')
		).toBe(true);
		expect(isInteractionBuilderMessage('interecation builder: fade this on hover')).toBe(true);
	});

	test('returns true for hover interaction intents', () => {
		const samples = [
			'animate a line from left to right on hover',
			'on hover, slide a divider line in from the left',
			'make the underline disappear again when hover ends',
			'on hover, reveal a bottom border line',
			'fade this block in when i hover it',
			'fade this block to 60% on hover',
			'show extra text on hover',
			'on hover, hide the icon and show the text',
			'animate this when hovered',
			'give this button a nice hover effect',
			'move this block up slightly on hover',
		];

		samples.forEach(sample =>
			expect(isInteractionBuilderMessage(sample)).toBe(true)
		);
	});

	test('returns true for click/toggle interaction intents', () => {
		const samples = [
			'on click, toggle this block’s visibility',
			'click to open a hidden panel',
			'click to close this section',
			'when i click, show a message below',
			'make this section open when clicked',
		];

		samples.forEach(sample =>
			expect(isInteractionBuilderMessage(sample)).toBe(true)
		);
	});

	test('returns false for non-interaction styling requests', () => {
		const samples = [
			'set padding to 24px',
			'make the background color palette 3',
			'align items center',
			'set z-index to 10',
		];

		samples.forEach(sample =>
			expect(isInteractionBuilderMessage(sample)).toBe(false)
		);
	});
});
