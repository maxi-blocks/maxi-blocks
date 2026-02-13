import removeLinkFormat from '@extensions/text/formats/removeLinkFormat';

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
	getLastBreakpointAttribute: jest.fn(
		({ target, breakpoint, attributes }) =>
			attributes[`${target}-${breakpoint}`]
	),
}));
jest.mock('@extensions/style-cards', () => ({
	updateSCOnEditor: jest.fn(),
	getTypographyFromSC: jest.fn(() => ({})),
}));

const partialLinkFormatObject = {
	attributes: {
		url: 'https://test.com',
		opensInNewTab: false,
		title: '',
	},
	formatValue: {
		formats: Array(21).fill(
			[
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
				},
			],
			6,
			12
		),
		replacements: Array(21),
		text: 'lorem ipsum dolor sit',
		start: 6,
		end: 12,
		activeFormats: [
			{
				type: 'maxi-blocks/text-link',
				attributes: {
					url: 'https://test.com',
					title: '',
				},
			},
			{
				type: 'maxi-blocks/text-custom',
				attributes: {
					className: 'maxi-text-block__custom-format--0',
				},
			},
		],
	},
	blockStyle: 'light',
	textLevel: 'p',
	styleCard: {
		light: {
			defaultStyleCard: {
				p: {},
			},
		},
	},
	typography: {
		customFormats: {
			'maxi-text-block__custom-format--0': {
				'text-decoration-general': 'underline',
			},
		},
	},
};
const wholeLinkFormatObject = {
	...partialLinkFormatObject,
	formatValue: {
		...partialLinkFormatObject.formatValue,
		activeFormats: [
			{
				type: 'maxi-blocks/text-link',
				attributes: {
					url: 'https://test.com',
					title: '',
				},
			},
		],
		formats: Array(21).fill([
			{
				type: 'maxi-blocks/text-link',
				attributes: {
					url: 'https://test.com',
					title: '',
				},
			},
		]),
		start: 1,
		end: 1,
	},
	typography: {
		'text-decoration-general': 'underline',
		customFormats: {},
	},
};

describe('removeLinkFormat', () => {
	let windowSpy;

	beforeEach(() => {
		windowSpy = jest.spyOn(window, 'window', 'get');
	});

	afterEach(() => {
		windowSpy.mockRestore();
	});

	it('Should remove custom formats when removing partial link', () => {
		const result = removeLinkFormat(partialLinkFormatObject);

		expect(result).toMatchSnapshot();
	});

	it('Should remove custom formats when removing whole link', () => {
		windowSpy.mockImplementation(() => ({
			getSelection: () => ({
				getRangeAt: () => ({
					startOffset: 1,
					endOffset: 1,
				}),
			}),
		}));

		const result = removeLinkFormat(wholeLinkFormatObject);

		expect(result).toMatchSnapshot();
	});

	it('Should remove custom formats when removing partial of whole link', () => {
		const result = removeLinkFormat({
			...wholeLinkFormatObject,
			formatValue: {
				...wholeLinkFormatObject.formatValue,
				start: 6,
				end: 12,
			},
		});

		expect(result).toMatchSnapshot();
	});
});
