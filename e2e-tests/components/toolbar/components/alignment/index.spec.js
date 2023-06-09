/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	changeResponsive,
	getAttributes,
	insertMaxiBlock,
} from '../../../../utils';

const changeAlignment = async (page, index = 0) => {
	await page.waitForSelector('.toolbar-item__typography-control button');
	await page.$eval('.toolbar-item__typography-control button', button =>
		button.click()
	);
	await page.waitForSelector('.maxi-alignment-control');
	await page.$$eval(
		'.maxi-alignment-control button',
		(buttons, _index) => buttons[_index].click(),
		index
	);

	await page.keyboard.press('Escape');
	await page.$eval('.maxi-text-block__content', el => el.focus());
};

const checkAlignment = async (page, index = 0) => {
	await page.waitForSelector('.toolbar-item__typography-control button');
	await page.$eval('.toolbar-item__typography-control button', button =>
		button.click()
	);
	await page.waitForSelector('.maxi-alignment-control');
	const pressed = await page.$$eval(
		'.maxi-alignment-control button',
		(buttons, _index) => buttons[_index].ariaPressed,
		index
	);

	await page.keyboard.press('Escape');
	await page.$eval('.maxi-text-block__content', el => el.focus());

	return pressed;
};

describe('AlignmentControl', () => {
	it('Checking alignment in toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		const alignments = ['center', 'right', 'justify', 'left'];

		for (let i = 0; i < alignments.length; i += 1) {
			await changeAlignment(page, i !== 3 ? i + 1 : 0);

			const attributes = await getBlockAttributes();
			const attribute = attributes['_ta-g'];
			expect(attribute).toStrictEqual(alignments[i]);
		}
	});

	it('Checking alignment in toolbar responsive', async () => {
		// check g
		expect(await getAttributes('_ta-g')).toStrictEqual('left');

		// responsive s
		await changeResponsive(page, 's');

		await changeAlignment(page, 1);

		expect(await getAttributes('_ta-s')).toStrictEqual('center');

		// responsive xs
		await changeResponsive(page, 'xs');

		expect(await checkAlignment(page, 1)).toBe('true');

		// responsive m
		await changeResponsive(page, 'm');

		expect(await checkAlignment(page, 0)).toBe('true');
	});
});
