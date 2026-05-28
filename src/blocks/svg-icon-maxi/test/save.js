import save from '../save';

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

const renderSvgIcon = linkSettings =>
	save({
		attributes: {
			content: '<svg><path></path></svg>',
			linkSettings,
			ariaLabels: {},
			uniqueID: 'svg-icon-maxi-test',
		},
	});

const resolveElement = element =>
	typeof element.type === 'function'
		? resolveElement(element.type(element.props))
		: element;

describe('svg icon save', () => {
	it('keeps the original icon markup when no link is active', () => {
		const block = resolveElement(renderSvgIcon());
		const icon = block.props.children;

		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
		expect(icon.props.className).toBe('maxi-svg-icon-block__icon');
		expect(icon.props.children).toBe('<svg><path></path></svg>');
	});

	it('wraps only the icon when the svg link target is selected', () => {
		const block = resolveElement(
			renderSvgIcon({
				url: 'https://example.com',
				linkElement: 'svg',
			})
		);
		const wrapper = block.props.children;
		const link = resolveElement(wrapper.props.children);

		expect(wrapper.type).toBe('div');
		expect(wrapper.props.className).toBe(
			'maxi-svg-icon-block__icon-wrapper'
		);
		expect(link.type).toBe('a');
		expect(link.props.className).toBe(
			'maxi-link-wrapper maxi-svg-icon-block__icon'
		);
	});

	it('wraps the whole block when canvas target is selected', () => {
		const element = renderSvgIcon({
			url: 'https://example.com',
			linkElement: 'canvas',
		});
		const link = resolveElement(element);

		expect(link.type).toBe('a');
		expect(link.props.className).toBe('maxi-link-wrapper');

		const block = resolveElement(link.props.children);
		const icon = block.props.children;

		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
		expect(icon.props.className).toBe('maxi-svg-icon-block__icon');
	});

	it('wraps the whole block when linkElement is absent (backward compat)', () => {
		const element = renderSvgIcon({
			url: 'https://example.com',
		});
		const link = resolveElement(element);

		expect(link.type).toBe('a');
		expect(link.props.className).toBe('maxi-link-wrapper');

		const block = resolveElement(link.props.children);

		expect(block.type).toBe('div');
		expect(block.props.className).toBe('maxi-block');
	});
});
