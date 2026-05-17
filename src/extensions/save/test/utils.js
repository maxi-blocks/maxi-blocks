import { createElement } from '@wordpress/element';

import { getHasLink, WithLink } from '../utils';

describe('save link utils', () => {
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
