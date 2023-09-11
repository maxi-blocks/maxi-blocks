/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe.skip('ImageURL', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');
		await updateAllBlockUniqueIds(page);
	});

	it('Check imageUrl', async () => {
		// select img
		await page.$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button button',
			url => url.click()
		);

		await page.$eval(
			'.maxi-editor-url-input__button-modal .block-editor-url-input__input',
			input => input.focus()
		);

		const linkImage =
			'https://www.dzoom.org.es/wp-content/uploads/2017/07/seebensee-2384369-810x540.jpg';

		await page.keyboard.type(linkImage);

		await page.$$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button .maxi-editor-url-input__button-modal-line button',
			submitUrl => submitUrl[0].click()
		);

		expect(await getAttributes('externalUrl')).toStrictEqual(linkImage);
	});

	it('Check invalid imageUrl', async () => {
		console.error = jest.fn();

		// select img
		await page.$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button button',
			url => url.click()
		);

		await page.keyboard.type(
			'https://www.testImage/this/image/does/not/exist.jpg'
		);

		await page.$$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button .maxi-editor-url-input__button-modal-line button',
			submitUrl => submitUrl[0].click()
		);

		const error = await page.$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button .maxi-editor-url-input__warning',
			expectHtml => expectHtml.innerHTML
		);

		expect(error).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
