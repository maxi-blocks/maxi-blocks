/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { activateTheme, insertMaxiBlock } from '../utils';

const testContainerWidth = async () => {
	const containerElement = await page.$('.maxi-container-block');
	const editorWrapper = await page.$('.editor-styles-wrapper');

	const containerWidth = await containerElement.evaluate(
		el => el.offsetWidth
	);
	const editorWidth = await editorWrapper.evaluate(el => el.offsetWidth);

	return { containerWidth, editorWidth };
};

describe('Full width blocks', () => {
	it('Should have width of editor in theme 2021', async () => {
		await activateTheme('twentytwentyone');
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		const { containerWidth, editorWidth } = await testContainerWidth();

		expect(containerWidth).toBe(editorWidth);
	});

	it('Should have width of editor in theme 2022', async () => {
		await activateTheme('twentytwentytwo');
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		const { containerWidth, editorWidth } = await testContainerWidth();

		expect(containerWidth).toBe(editorWidth);
	});

	it('Should have width of editor in theme 2023', async () => {
		await activateTheme('twentytwentythree');
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		const { containerWidth, editorWidth } = await testContainerWidth();

		expect(containerWidth).toBe(editorWidth);
	});
});
