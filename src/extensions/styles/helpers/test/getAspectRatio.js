import getAspectRatio from '@extensions/styles/helpers/getAspectRatio';

describe('getAspectRatio', () => {
	it('Should return null for input "original"', () => {
		expect(getAspectRatio('original')).toBeNull();
	});

	it('Should return "1 / 1" for input "ar11"', () => {
		expect(getAspectRatio('ar11').ratio.general['aspect-ratio']).toBe(
			'1 / 1'
		);
	});

	it('Should return "2 / 3" for input "ar23"', () => {
		expect(getAspectRatio('ar23').ratio.general['aspect-ratio']).toBe(
			'2 / 3'
		);
	});

	it('Should return "3 / 2" for input "ar32"', () => {
		expect(getAspectRatio('ar32').ratio.general['aspect-ratio']).toBe(
			'3 / 2'
		);
	});

	it('Should return custom aspect ratio for input "custom" with "1.7778"', () => {
		const customRatio = '1.7778';
		expect(
			getAspectRatio('custom', customRatio).ratio.general['aspect-ratio']
		).toBe('1.7778');
	});

	it('Should return custom aspect ratio for input "custom" with "16/9"', () => {
		const customRatio = '16/9';
		expect(
			getAspectRatio('custom', customRatio).ratio.general['aspect-ratio']
		).toBe('1.7778');
	});

	it('Should return custom aspect ratio for input "custom" with "32/18"', () => {
		const customRatio = '32/18';
		expect(
			getAspectRatio('custom', customRatio).ratio.general['aspect-ratio']
		).toBe('1.7778');
	});

	it('Should return custom aspect ratio for input "custom" with "1/"', () => {
		const customRatio = '1/';
		expect(
			getAspectRatio('custom', customRatio).ratio.general['aspect-ratio']
		).toBe('1');
	});

	it('Should return custom aspect ratio for input "custom" with "16/0"', () => {
		const customRatio = '16/0';
		expect(
			getAspectRatio('custom', customRatio).ratio.general['aspect-ratio']
		).toBe('1');
	});

	it('Should return empty string for unsupported ratio', () => {
		expect(
			getAspectRatio('unsupported').ratio.general['aspect-ratio']
		).toBe('');
	});
});
