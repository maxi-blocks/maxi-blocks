import getStyles from '../styles';
import { getSVGListStyle } from '../utils';

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
	getSVGListStyle: jest.fn(svg => `encoded-${svg}`),
}));

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		getEditorSettings: jest.fn(() => ({ isRTL: false })),
	})),
}));

describe('text-maxi list marker styles', () => {
	const getBaseAttributes = customAttributes => ({
		uniqueID: 'text-list',
		isList: true,
		textLevel: 'p',
		typeOfList: 'ul',
		listStyle: 'custom',
		blockStyle: 'light',
		'list-gap-general': 1,
		'list-gap-unit-general': 'em',
		'list-marker-size-general': 2,
		'list-marker-size-unit-general': 'em',
		'list-marker-indent-general': 15,
		'list-marker-indent-unit-general': 'px',
		'list-marker-line-height-general': 0.5,
		'list-marker-line-height-unit-general': 'em',
		'list-style-position-general': 'outside',
		'list-text-position-general': 'middle',
		...customAttributes,
	});

	const getGeneratedStyles = attributes =>
		getStyles(attributes, () => 1)[attributes.uniqueID];

	const getListStyles = styles => styles[' ul'];

	const getMarkerStyles = styles =>
		styles[' ul li .maxi-list-item-block__content::before'];

	it('reserves the configured marker-size slot for custom text markers', () => {
		const styles = getGeneratedStyles(
			getBaseAttributes({ listStyleCustom: '*' })
		);
		const listStyles = getListStyles(styles);
		const markerStyles = getMarkerStyles(styles);

		expect(listStyles.listGap.general).toEqual(
			expect.objectContaining({
				'padding-left': 'calc(1em + 2em + 15px)',
			})
		);
		expect(markerStyles.listStyle.general).toEqual({
			content: '"*"',
		});
		expect(markerStyles.listSize.general).toEqual(
			expect.objectContaining({
				'font-size': '2em',
				width: '2em',
				'margin-left': '-2em',
			})
		);
	});

	it('reserves a larger slot for multi-character custom text markers', () => {
		const styles = getGeneratedStyles(
			getBaseAttributes({
				listStyleCustom: 'text',
				'list-marker-size-general': 1,
				'list-marker-size-unit-general': 'em',
				'list-marker-indent-general': 16,
				'list-marker-indent-unit-general': 'px',
			})
		);
		const listStyles = getListStyles(styles);
		const markerStyles = getMarkerStyles(styles);

		expect(listStyles.listGap.general).toEqual(
			expect.objectContaining({
				'padding-left': 'calc(1em + max(1em, 4ch) + 16px)',
			})
		);
		expect(markerStyles.listSize.general).toEqual(
			expect.objectContaining({
				'font-size': '1em',
				width: 'max(1em, 4ch)',
				'margin-left': 'min(-1em, -4ch)',
			})
		);
	});

	it('keeps URL custom marker output unchanged', () => {
		const markerUrl = 'https://example.com/marker.png';
		const markerStyles = getMarkerStyles(
			getGeneratedStyles(
				getBaseAttributes({
					listStyleCustom: markerUrl,
					'list-marker-size-general': 48,
					'list-marker-size-unit-general': 'px',
				})
			)
		);

		expect(markerStyles.listStyle.general).toEqual({
			content: `url('${markerUrl}')`,
		});
		expect(markerStyles.listStyle.general).not.toHaveProperty(
			'background-image'
		);
		expect(markerStyles.listSize.general).toEqual(
			expect.objectContaining({
				'font-size': '48px',
				'margin-left': '-48px',
			})
		);
	});

	it('keeps SVG custom marker sizing unchanged', () => {
		const svg = '<svg><path d="M0 0" /></svg>';
		const markerStyles = getMarkerStyles(
			getGeneratedStyles(
				getBaseAttributes({
					listStyleCustom: svg,
					'list-marker-size-general': 20,
					'list-marker-size-unit-general': 'px',
					'list-marker-height-general': 30,
					'list-marker-height-unit-general': 'px',
				})
			)
		);

		expect(getSVGListStyle).toHaveBeenCalledWith(svg);
		expect(markerStyles.listStyle.general).toEqual({
			content: `url("data:image/svg+xml,encoded-${svg}")`,
		});
		expect(markerStyles.listSize.general).toEqual(
			expect.objectContaining({
				width: '20px',
				height: '30px',
				top: 'calc(15px - (10px))',
				'margin-left': '-20px',
			})
		);
	});
});
