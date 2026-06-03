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

const entry = deprecated({})[0];

const renderDeprecatedSvgIcon = linkSettings =>
	entry.save({
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
	it('wraps canvas in a link when linkElement is missing (legacy shape)', () => {
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

	it('renders without a link wrapper when there is no URL', () => {
		const markup = renderDeprecatedSvgIcon(undefined);
		const block = resolveElement(markup);

		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
	});
});

describe('svg icon deprecated migrate', () => {
	it('sets linkElement to canvas to preserve legacy canvas-link behaviour', () => {
		const result = entry.migrate({
			linkSettings: { url: 'https://example.com' },
		});

		expect(result.linkSettings.linkElement).toBe('canvas');
		expect(result.linkSettings.url).toBe('https://example.com');
	});

	it('leaves linkSettings untouched when there are none', () => {
		const result = entry.migrate({ linkSettings: undefined });

		expect(result.linkSettings).toBeUndefined();
	});
});
