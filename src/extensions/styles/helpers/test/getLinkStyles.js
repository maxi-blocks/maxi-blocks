import getLinkStyles from '../getLinkStyles';

describe('getLinkStyles', () => {
	it('Returns a correct object', () => {
		const obj = {
			'link-palette-color-status-general': false,
			'link-palette-color-general': 4,
			'link-color-general': 'rgba(57,189,39,1)',
			'link-hover-palette-color-status-general': false,
			'link-hover-palette-color-general': 4,
			'link-hover-color-general': 'rgba(191,192,86,1)',
			'link-active-palette-color-status-general': false,
			'link-active-palette-color-general': 3,
			'link-active-color-general': 'rgba(221,32,32,1)',
			'link-visited-palette-color-status-general': false,
			'link-visited-palette-color-general': 3,
			'link-visited-color-general': 'rgba(27,109,168,1)',
		};
		const target = ' p.maxi-text-block__content a';
		const parentBlockStyles = 'light';

		const result = getLinkStyles(obj, target, parentBlockStyles);

		expect(result).toMatchSnapshot();
	});
});
