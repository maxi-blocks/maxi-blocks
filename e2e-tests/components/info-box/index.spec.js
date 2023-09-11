/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('InfoBox', () => {
	it('Check Infobox', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await changeResponsive(page, 's');

		const warningBox = await page.$eval(
			'.components-panel .maxi-warning-box',
			warning => warning.innerHTML
		);

		expect(warningBox).toMatchSnapshot();
	});
});
