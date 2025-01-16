import { getClosestAvailableFontWeight } from '@components/typography-control/utils';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getFont: jest.fn(() => ({
					files: {
						100: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap',
						300: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap',
						400: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap',
						800: 'https://fonts.googleapis.com/css2?family=Roboto:wght@800&display=swap',
					},
				})),
			};
		}),
	};
});

describe('getClosestAvailableFontWeight', () => {
	it('should return the closest available font weight', () => {
		const targetWeight = '400';
		const font = 'Roboto';

		const result = getClosestAvailableFontWeight(font, targetWeight);

		expect(result).toBe('400');
	});

	it('should return the lower closest value', () => {
		const targetWeight = '200';
		const font = 'Roboto';

		const result = getClosestAvailableFontWeight(font, targetWeight);

		expect(result).toBe('100');
	});
});
