import deprecated from '../deprecated';

jest.mock('@components/maxi-block', () => {
	const { createElement } = require('@wordpress/element');

	return {
		MaxiBlock: {
			save: ({ children }) =>
				createElement('div', { className: 'maxi-block' }, children),
		},
		getMaxiBlockAttributes: jest.fn(() => ({})),
	};
});

jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(() => ({})),
}));

jest.mock('../save', () => ({
	addAlt: jest.fn(content => content),
}));

const renderDeprecatedSvgIcon = linkSettings =>
	deprecated({})[0].save({
		attributes: {
			content: '<svg><path></path></svg>',
			linkSettings,
			ariaLabels: {},
		},
	});

const resolveElement = element =>
	typeof element.type === 'function'
		? resolveElement(element.type(element.props))
		: element;

describe('svg icon deprecated save', () => {
	it('keeps legacy links wrapped around the canvas when linkElement is missing', () => {
		const markup = renderDeprecatedSvgIcon({
			url: 'https://example.com',
		});
		const link = resolveElement(markup);
		const block = resolveElement(link.props.children);

		expect(link.type).toBe('a');
		expect(link.props.className).toBe('maxi-link-wrapper');
		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
	});

	it('wraps only the icon when the svg link target is selected', () => {
		const markup = renderDeprecatedSvgIcon({
			url: 'https://example.com',
			linkElement: 'svg',
		});
		const block = resolveElement(markup);
		const link = resolveElement(block.props.children);
		const icon = link.props.children;

		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
		expect(link.type).toBe('a');
		expect(link.props.className).toBe('maxi-link-wrapper');
		expect(icon.props.className).toBe('maxi-svg-icon-block__icon');
	});

	it('does not wrap inside the deprecated save when the canvas link target is selected', () => {
		const markup = renderDeprecatedSvgIcon({
			url: 'https://example.com',
			linkElement: 'canvas',
		});
		const block = resolveElement(markup);
		const icon = block.props.children;

		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
		expect(icon.props.className).toBe('maxi-svg-icon-block__icon');
	});
});
