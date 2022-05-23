/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, editAdvancedNumberControl } from '../../utils';

describe('Inspector opacity', () => {
	it('Check text opacity inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'advanced', 'opacity');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-opacity-control .maxi-base-control__field'
			),
			newNumber: '19',
		});

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Opacity');
	});
});
