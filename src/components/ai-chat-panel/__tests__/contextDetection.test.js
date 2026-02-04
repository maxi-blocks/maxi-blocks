import { isTextContextForMessage } from '../ai/utils/contextDetection';

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

