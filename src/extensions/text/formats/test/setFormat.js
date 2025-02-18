import setFormat from '@extensions/text/formats/setFormat';

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(() => ({
		__unstableMarkLastChangeAsPersistent: jest.fn(),
	})),
	select: jest.fn(() => ({
		receiveMaxiSelectedStyleCard: jest.fn(() => ({ value: {} })),
	})),
}));
jest.mock('@extensions/styles', () => ({
	getBlockStyle: jest.fn(() => 'light'),
}));
jest.mock('@extensions/style-cards', () => ({
	updateSCOnEditor: jest.fn(),
	getTypographyFromSC: jest.fn(() => ({})),
}));

const colorFormatObject = {
	formatValue: {
		formats: Array(12),
		replacements: Array(12),
		text: 'Hello world!',
		start: 6,
		end: 11,
		activeFormats: [],
	},
	typography: {
		'palette-status-general': true,
		'palette-sc-status-general': false,
		'palette-color-general': 3,
	},
	value: {
		color: null,
		'palette-color': 4,
		'palette-status': true,
		'palette-sc-status': false,
		'palette-opacity': 1,
	},
	breakpoint: 'general',
	textLevel: 'p',
	returnFormatValue: true,
};

describe('setFormat', () => {
	let windowSpy;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, 'window', 'get');
	});

	afterEach(() => {
		windowSpy.mockRestore();
	});

	it('Should correctly set the format when changing the color of part of the text', () => {
		const result = setFormat(colorFormatObject);

		expect(result).toMatchSnapshot();
	});

	it('Should just set and return the attributes when disableCustomFormats is true', () => {
		const result = setFormat({
			...colorFormatObject,
			value: {
				color: '#000',
			},
			disableCustomFormats: true,
		});

		expect(result).toEqual({
			'color-general': '#000',
		});
	});

	it('Should work when the selection is collapsed', () => {
		windowSpy.mockImplementation(() => ({
			getSelection: () => ({
				getRangeAt: () => ({
					startOffset: 1,
					endOffset: 1,
				}),
			}),
		}));

		const result = setFormat({
			...colorFormatObject,
			formatValue: {
				...colorFormatObject.formatValue,
				start: 1,
				end: 1,
			},
		});

		expect(result).toMatchSnapshot();
	});

	it('Should work when the selection is collapsed on existing format', () => {
		windowSpy.mockImplementation(() => ({
			getSelection: () => ({
				getRangeAt: () => ({
					startOffset: 7,
					endOffset: 7,
				}),
			}),
		}));

		const result = setFormat({
			...colorFormatObject,
			formatValue: {
				...colorFormatObject.formatValue,
				activeFormats: [
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
					},
				],
				formats: Array(12).fill(
					[
						{
							type: 'maxi-blocks/text-custom',
							attributes: {
								className: 'maxi-text-block__custom-format--0',
							},
						},
					],
					6,
					11
				),
				start: 7,
				end: 7,
			},
			typography: {
				...colorFormatObject.typography,
				'custom-formats': {
					'maxi-text-block__custom-format--0': {
						'palette-color-general': 4,
						'palette-opacity-general': 1,
					},
				},
			},
			value: {
				...colorFormatObject.value,
				'palette-color': 5,
			},
		});

		expect(result).toMatchSnapshot();
	});
});
