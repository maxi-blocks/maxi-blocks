import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('text shadow control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the text shadow control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing shadow control');

		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-textshadow-control .components-base-control__field .components-radio-control__option label',
			select => select[1].click()
		);

		await accordionPanel.$$(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control'
		);

		const shadowStyles = [
			'none',
			'0px 0px 5px #a2a2a2',
			'5px 0px 3px #a2a2a2',
			'2px 4px 0px #a2a2a2',
		];

		for (let i = 0; i < shadowStyles.length; i++) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const shadowAttributes = await getBlockAttributes();

			expect(shadowAttributes['text-shadow-general']).toStrictEqual(
				setting
			);
		}
	});
});
