/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockStyle, openSidebarTab, getAttributes } from '../../utils';

describe('Button Maxi', () => {
	it('Button Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello', { delay: 100 });
		await page.waitForTimeout(150);

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button Style', async () => {
		await openSidebarTab(page, 'style', 'style shortcut');

		const buttons = await page.$$('.maxi-button-default-styles button');
		await buttons[4].click();

		await expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Button background', async () => {
		await openSidebarTab(page, 'style', 'button background');

		await page.$$eval(
			'.maxi-settingstab-control .maxi-background-control__simple .maxi-tabs-control__full-width button',
			button => button[2].click()
		);

		await page.$eval(
			'.maxi-gradient-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50');

		const selector = await page.$(
			'.maxi-gradient-control .components-custom-gradient-picker select'
		);

		await selector.select('radial-gradient');

		expect(
			await getAttributes('button-background-gradient-general')
		).toStrictEqual(
			'radial-gradient(rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)'
		);

		expect(
			await getAttributes('button-background-active-media-general')
		).toStrictEqual('gradient');
	});

	/*
	it('Check Button Icon', async () => {
		await insertBlock('Button Maxi');

		await page.keyboard.type('Hello');

		const accordionPanel = await openSidebarTab(page, 'style', 'icon');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-library-modal__action-section__buttons button',
			click => click[0].click()
		);

		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('alert');
		await page.waitForTimeout(1000);
		await page.waitForSelector('.alert-maxi-svg');
		await modal.$eval(
			'.maxi-cloud-masonry-card__svg-container__button',
			button => button.click()
		);
		const expectShape =
			'<svg stroke-linejoin="round" stroke-width="2" stroke="#081219" data-stroke="" fill="none" viewBox="0 0 24 24" height="64px" width="64px" class="alert-maxi-svg"><g stroke-miterlimit="10"><path d="M11.157 3.995L2.521 19.037c-.372.648.096 1.456.843 1.456h17.272c.747 0 1.215-.808.843-1.456L12.843 3.995c-.373-.651-1.312-.651-1.685 0z"></path><path stroke-linecap="round" d="M12 9.615v5.003"></path></g><circle r=".202" cy="17.251" cx="12"></circle></svg>';

		const attributes = await getBlockAttributes();

		expect(
			attributes['icon-content']
				.replace(/(\r\n|\n|\r)/g, '')
				.replace(/\s/g, '')
		).toEqual(expectShape.replace(/(\r\n|\n|\r)/g, '').replace(/\s/g, ''));
	}); */
});
