/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { activateTheme, insertMaxiBlock, getEditorFrame } from '../utils';

const testContainerWidth = async () => {
	const frame = await getEditorFrame(page);
	const containerElement = await frame.$('.maxi-container-block');
	const editorWrapper = await frame.$('.editor-styles-wrapper');

	const containerWidth = await containerElement.evaluate(
		el => el.offsetWidth
	);
	const editorWidth = await editorWrapper.evaluate(el => el.clientWidth);

	return { containerWidth, editorWidth };
};

describe('Full width blocks', () => {
	it('Should have width of editor in theme 2021', async () => {
		await activateTheme('twentytwentyone');
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		const { containerWidth, editorWidth } = await testContainerWidth();

		expect(Math.abs(containerWidth - editorWidth)).toBeLessThanOrEqual(1);
	});

	it('Should have width of editor in theme 2022', async () => {
		await activateTheme('twentytwentytwo');
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		const { containerWidth, editorWidth } = await testContainerWidth();

		expect(Math.abs(containerWidth - editorWidth)).toBeLessThanOrEqual(1);
	});

	it('Should have width of editor in theme 2023', async () => {
		await activateTheme('twentytwentythree');
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		const { containerWidth, editorWidth } = await testContainerWidth();

		expect(Math.abs(containerWidth - editorWidth)).toBeLessThanOrEqual(1);
	});
});
