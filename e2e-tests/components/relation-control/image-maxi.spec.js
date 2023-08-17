/**
 * WordPress dependencies
 */
import { createNewPost, saveDraft } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	addImageToImageMaxi,
	getAttributes,
	openPreviewPage,
	insertMaxiBlock,
} from '../../utils';

describe('Image Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');
		const imageBlock = await page.$('.maxi-image-block');
		await addImageToImageMaxi(page, imageBlock);

		await insertMaxiBlock(page, 'Button Maxi');
		await openSidebarTab(page, 'advanced', 'interaction builder');

		// Add interaction
		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		// Add title
		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();
		await page.keyboard.type('Hello World!');
		await page.waitForTimeout(150);

		// Add target
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('image-maxi-4se8ef1z-u');

		// Add action
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('hover');
	});

	const checkFrontend = async (disableTransition = false) => {
		await saveDraft();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await previewPage.waitForSelector(
			'#button-maxi-4se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.hover(
			'#button-maxi-4se8ef1z-u .maxi-button-block__button'
		);
		await previewPage.waitForTimeout(100);

		await previewPage.waitForSelector(
			'#relations--image-maxi-4se8ef1z-u-styles'
		);
		const stylesCSS = await previewPage.$eval(
			'#relations--image-maxi-4se8ef1z-u-styles',
			el => el.textContent
		);
		expect(stylesCSS).toMatchSnapshot();

		if (!disableTransition) {
			await previewPage.waitForSelector(
				'#relations--image-maxi-4se8ef1z-u-in-transitions'
			);
			const inTransitionsCSS = await previewPage.$eval(
				'#relations--image-maxi-4se8ef1z-u-in-transitions',
				el => el.textContent
			);
			expect(inTransitionsCSS).toMatchSnapshot();

			await previewPage.mouse.move(0, 0);

			await previewPage.waitForSelector(
				'#relations--image-maxi-4se8ef1z-u-out-transitions'
			);
			const outTransitionsCSS = await previewPage.$eval(
				'#relations--image-maxi-4se8ef1z-u-out-transitions',
				el => el.textContent
			);
			expect(outTransitionsCSS).toMatchSnapshot();
		}
	};

	it('Alignment', async () => {
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('a');

		await page.$eval(
			'.maxi-alignment-control .maxi-tabs-control__button.maxi-tabs-control__button-right',
			button => button.click()
		);
		expect(await getAttributes('relations')).toMatchSnapshot();

		await checkFrontend(true);
	});

	// TODO: shape mask (need)
});
