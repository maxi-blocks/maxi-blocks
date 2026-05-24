import {
	getUpdatedSavedStyles,
	hasReachedSavedStylesLimit,
} from '../utils';

describe('copy paste saved style utils', () => {
	it('creates the next saved style name and payload', () => {
		const now = {
			toLocaleDateString: jest.fn(() => '5/24/2026'),
			toLocaleTimeString: jest.fn(() => '14:07'),
		};

		expect(
			getUpdatedSavedStyles({
				savedStyles: {
					'Style 2 - old': { styles: { color: 'red' } },
					'Style 7 - old': { styles: { color: 'blue' } },
				},
				blockName: 'maxi-blocks/text-maxi',
				blockAttributes: { color: 'green' },
				now,
			})
		).toEqual({
			newStyleName: 'Style 8 - 5/24/2026 14:07',
			updatedStyles: {
				'Style 2 - old': { styles: { color: 'red' } },
				'Style 7 - old': { styles: { color: 'blue' } },
				'Style 8 - 5/24/2026 14:07': {
					blockType: 'maxi-blocks/text-maxi',
					styles: { color: 'green' },
				},
			},
		});
	});

	it('detects the saved styles limit', () => {
		const savedStyles = Object.fromEntries(
			Array.from({ length: 100 }, (_, index) => [
				`Style ${index + 1}`,
				{ styles: {} },
			])
		);

		expect(hasReachedSavedStylesLimit(savedStyles)).toBe(true);
		expect(hasReachedSavedStylesLimit({ 'Style 1': { styles: {} } })).toBe(
			false
		);
	});
});
