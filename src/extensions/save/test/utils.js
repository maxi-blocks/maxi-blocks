import { createElement } from '@wordpress/element';

import {
	getLinkAttributesFromLinkSettings,
	getHasLink,
	WithLink,
} from '../utils';

jest.mock('@extensions/DC/constants', () => ({
	inlineLinkFields: ['categories', 'tags'],
}));

jest.mock('@extensions/DC/utils', () => ({
	isLinkObfuscationEnabled: jest.fn(() => false),
}));

describe('save link utils', () => {
	it('never includes title or aria-label on the block link wrapper', () => {
		const result = getLinkAttributesFromLinkSettings(
			{
				url: 'https://example.com',
				title: 'Some title',
				ariaLabel: 'Some label',
			},
			false,
			false
		);

		expect(result).not.toHaveProperty('title');
		expect(result).not.toHaveProperty('aria-label');
		expect(result).toHaveProperty('href', 'https://example.com');
	});

	it('detects static and dynamic links that render a wrapper', () => {
		expect(getHasLink({ url: '#' }, {})).toBe(true);
		expect(getHasLink({ url: '#', disabled: true }, {})).toBe(false);
		expect(
			getHasLink(
				{},
				{
					'dc-status': true,
					'dc-link-status': true,
					'dc-link-target': 'custom_url',
				}
			)
		).toBe(true);
		expect(
			getHasLink(
				{},
				{
					'dc-status': true,
					'dc-link-status': true,
					'dc-link-target': 'categories',
				}
			)
		).toBe(false);
	});

	it('keeps custom classes on the generated link wrapper', () => {
		const element = WithLink({
			linkSettings: { url: '#', opensInNewTab: false },
			dynamicContent: {},
			className: 'maxi-svg-icon-block__icon',
			children: createElement('svg'),
		});

		expect(element.props.className).toBe(
			'maxi-link-wrapper maxi-svg-icon-block__icon'
		);
	});
});
