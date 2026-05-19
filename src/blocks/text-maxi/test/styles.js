import getStyles from '../styles';

jest.mock('@extensions/styles', () => ({
	getColorRGBAString: jest.fn(() => 'rgba(0, 0, 0, 1)'),
	getGroupAttributes: jest.fn(() => ({})),
	getLastBreakpointAttribute: jest.fn(
		({ target, breakpoint, attributes }) =>
			attributes[`${target}-${breakpoint}`] ??
			attributes[`${target}-general`]
	),
	getPaletteAttributes: jest.fn(({ obj, prefix }) => ({
		paletteStatus: obj[`${prefix}palette-status-general`] ?? false,
		color: obj[`${prefix}color-general`],
	})),
	styleProcessor: jest.fn(styles => styles),
}));

jest.mock('@extensions/styles/helpers', () => ({
	getAlignmentTextStyles: jest.fn(() => ({})),
	getBlockBackgroundStyles: jest.fn(() => ({})),
	getBorderStyles: jest.fn(() => ({})),
	getBoxShadowStyles: jest.fn(() => ({})),
	getCustomFormatsStyles: jest.fn(() => ({})),
	getDisplayStyles: jest.fn(() => ({})),
	getFlexStyles: jest.fn(() => ({})),
	getLinkStyles: jest.fn(() => ({})),
	getMarginPaddingStyles: jest.fn(() => ({})),
	getOpacityStyles: jest.fn(() => ({})),
	getOverflowStyles: jest.fn(() => ({})),
	getPositionStyles: jest.fn(() => ({})),
	getSizeStyles: jest.fn(() => ({})),
	getTypographyStyles: jest.fn(() => ({})),
	getZIndexStyles: jest.fn(() => ({})),
}));

jest.mock('../data', () => ({}));
jest.mock('../utils', () => ({
	getSVGListStyle: jest.fn(svg => svg),
}));

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => ({
			getEditorSettings: jest.fn(() => ({ isRTL: false })),
		})),
	};
});

describe('text-maxi styles', () => {
	it('uses marker size styles for custom URL list markers', () => {
		const styles = getStyles(
			{
				uniqueID: 'text-list',
				isList: true,
				typeOfList: 'ul',
				listStyle: 'custom',
				listStyleCustom: 'https://example.com/marker.png',
				blockStyle: 'light',
				'list-gap-general': 1,
				'list-gap-unit-general': 'em',
				'list-marker-size-general': 48,
				'list-marker-size-unit-general': 'px',
				'list-marker-indent-general': 0,
				'list-marker-indent-unit-general': 'px',
				'list-marker-line-height-general': 1,
				'list-marker-line-height-unit-general': 'em',
				'list-style-position-general': 'outside',
				'list-text-position-general': 'middle',
			},
			() => 1
		);

		const markerStyles =
			styles['text-list'][
				' ul li .maxi-list-item-block__content::before'
			];

		expect(markerStyles.listStyle.general).toEqual(
			expect.objectContaining({
				content: '""',
				'background-image': "url('https://example.com/marker.png')",
				'background-position': 'center',
				'background-repeat': 'no-repeat',
				'background-size': 'contain',
			})
		);
		expect(markerStyles.listSize.general).toEqual(
			expect.objectContaining({
				width: '48px',
				height: '48px',
			})
		);
	});
});
