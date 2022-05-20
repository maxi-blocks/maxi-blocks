/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, editAdvancedNumberControl } from '../../utils';

describe('inspector Z-index', () => {
	it('check Z-index inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		await openSidebarTab(page, 'advanced', 'z index');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-zIndex-control .maxi-base-control__field'
			),
			newNumber: '20',
		});

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Z-index');
	});
});
