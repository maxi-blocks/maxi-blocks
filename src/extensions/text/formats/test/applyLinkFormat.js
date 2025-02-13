/**
 * WordPress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import applyLinkFormat from '../applyLinkFormat';
import getFormattedString from '../getFormattedString';
import setFormat from '../setFormat';

jest.mock('@wordpress/rich-text', () => ({
	applyFormat: jest.fn(value => ({
		...value,
		type: 'maxi-blocks/text-link',
	})),
}));

jest.mock('../getFormattedString', () => jest.fn(() => 'formatted content'));

jest.mock('../setFormat', () =>
	jest.fn(({ formatValue, typography, value }) => ({
		formatValue,
		typography,
		styles: value,
	}))
);

describe('applyLinkFormat', () => {
	beforeEach(() => {
		applyFormat.mockClear();
		getFormattedString.mockClear();
		setFormat.mockClear();
	});

	it('Applies link format with basic configuration', () => {
		const props = {
			formatValue: { text: 'test' },
			typography: { size: '16px' },
			linkAttributes: { href: 'https://example.com' },
			isList: false,
			textLevel: 1,
			breakpoint: 'general',
		};

		const result = applyLinkFormat(props);

		expect(applyFormat).toHaveBeenCalledWith(props.formatValue, {
			type: 'maxi-blocks/text-link',
			attributes: props.linkAttributes,
		});

		expect(setFormat).toHaveBeenCalledWith(
			expect.objectContaining({
				formatValue: expect.any(Object),
				typography: props.typography,
				isList: props.isList,
				value: {
					'text-decoration': 'underline',
				},
				breakpoint: 'general',
				isHover: false,
				textLevel: 1,
				returnFormatValue: false,
			})
		);

		expect(result).toHaveProperty('content', 'formatted content');
	});

	it('Handles hover state', () => {
		const props = {
			formatValue: { text: 'test' },
			typography: { size: '16px' },
			isHover: true,
			breakpoint: 'general',
		};

		applyLinkFormat(props);

		expect(setFormat).toHaveBeenCalledWith(
			expect.objectContaining({
				isHover: true,
			})
		);
	});

	it('Returns format value when returnFormatValue is true', () => {
		const props = {
			formatValue: { text: 'test' },
			typography: { size: '16px' },
			returnFormatValue: true,
		};

		const result = applyLinkFormat(props);

		expect(result).toHaveProperty('formatValue');
	});

	it('Saves format value when saveFormatValue is true', () => {
		const onChangeTextFormat = jest.fn();
		const props = {
			formatValue: { text: 'test' },
			typography: { size: '16px' },
			saveFormatValue: true,
			onChangeTextFormat,
		};

		applyLinkFormat(props);

		expect(onChangeTextFormat).toHaveBeenCalled();
	});

	it('Returns only response when content is present in setFormat result', () => {
		setFormat.mockImplementationOnce(() => ({
			content: 'direct content',
			styles: {},
		}));

		const props = {
			formatValue: { text: 'test' },
			typography: { size: '16px' },
		};

		const result = applyLinkFormat(props);

		expect(result).toEqual({
			content: 'direct content',
			styles: {},
		});
		expect(getFormattedString).not.toHaveBeenCalled();
	});

	it('Handles empty linkAttributes', () => {
		const props = {
			formatValue: { text: 'test' },
			typography: { size: '16px' },
		};

		applyLinkFormat(props);

		expect(applyFormat).toHaveBeenCalledWith(props.formatValue, {
			type: 'maxi-blocks/text-link',
			attributes: {},
		});
	});
});
