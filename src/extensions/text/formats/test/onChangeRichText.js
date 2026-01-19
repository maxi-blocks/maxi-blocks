import getHasNativeFormat from '@extensions/text/formats/getHasNativeFormat';
import onChangeRichText from '@extensions/text/formats/onChangeRichText';

jest.mock('@extensions/text/formats/getHasNativeFormat', () =>
	jest.fn(() => true)
);
jest.mock('@extensions/text/formats/setCustomFormatsWhenPaste', () =>
	jest.fn(() => ({
		someCleanProp: 'value',
	}))
);
jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(el => el),
}));

describe('onChangeRichText', () => {
	it('Handles native format paste correctly', () => {
		const formatValue = {
			typography: {
				fontSize: '16px',
			},
			start: 0,
			end: 5,
		};

		const oldFormatValue = {
			typography: {
				fontSize: '15px',
			},
			start: 0,
			end: 5,
		};

		const mockProps = {
			attributes: {
				typeOfList: 'bullet',
				content: 'test content',
				textLevel: 1,
				isList: false,
			},
			maxiSetAttributes: jest.fn(),
			oldFormatValue,
			onChange: jest.fn(),
			richTextValues: {
				value: formatValue,
				onChange: jest.fn(),
			},
		};

		onChangeRichText(mockProps);

		expect(mockProps.maxiSetAttributes).toHaveBeenCalledWith({
			someCleanProp: 'value',
		});

		expect(mockProps.onChange).toHaveBeenCalledWith({
			formatValue,
			onChangeFormat: mockProps.richTextValues.onChange,
		});
	});

	it('Skips native format handling when conditions are not met', () => {
		getHasNativeFormat.mockReturnValue(false);
		const formatValue = {
			typography: {
				fontSize: '16px',
			},
			start: 0,
			end: 5,
		};

		const oldFormatValue = {
			typography: {
				fontSize: '15px',
			},
			start: 0,
			end: 5,
		};

		const mockProps = {
			attributes: {},
			maxiSetAttributes: jest.fn(),
			oldFormatValue,
			onChange: jest.fn(),
			richTextValues: {
				value: formatValue,
				onChange: jest.fn(),
			},
		};

		onChangeRichText(mockProps);

		expect(mockProps.maxiSetAttributes).not.toHaveBeenCalled();

		expect(mockProps.onChange).toHaveBeenCalledWith({
			formatValue,
			onChangeFormat: mockProps.richTextValues.onChange,
		});
	});

	it('Does not call onChange when formatValue equals oldFormatValue', () => {
		const formatValue = {
			start: 0,
			end: 5,
		};

		const oldFormatValue = {
			start: 0,
			end: 5,
		};

		const mockProps = {
			attributes: {},
			maxiSetAttributes: jest.fn(),
			oldFormatValue,
			onChange: jest.fn(),
			richTextValues: {
				value: formatValue,
				onChange: jest.fn(),
			},
		};

		onChangeRichText(mockProps);

		expect(mockProps.onChange).not.toHaveBeenCalled();
	});
});
