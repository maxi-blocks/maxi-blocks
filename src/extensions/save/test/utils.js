import { createElement } from '@wordpress/element';

import {
	getLinkAttributesFromLinkSettings,
	getHasLink,
	WithLink,
} from '../utils';

jest.mock('@extensions/DC/constants', () => ({
	inlineLinkFields: [],
}));

jest.mock('@extensions/DC/utils', () => ({
	isLinkObfuscationEnabled: jest.fn(() => false),
}));

describe('save link utils', () => {
	it('omits empty title and aria label attributes', () => {
		const result = getLinkAttributesFromLinkSettings(
			{
				url: 'https://example.com',
				title: '',
				ariaLabel: '',
			},
			false,
			false
		);

		expect(result).not.toHaveProperty('title');
		expect(result).not.toHaveProperty('aria-label');
	});

	it('preserves trimmed manual title and aria label attributes', () => {
		const result = getLinkAttributesFromLinkSettings(
			{
				url: 'https://example.com',
				title: '  Example title  ',
				ariaLabel: '  Accessible example link  ',
			},
			false,
			false
		);

		expect(result).toMatchObject({
			title: 'Example title',
			'aria-label': 'Accessible example link',
		});
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
