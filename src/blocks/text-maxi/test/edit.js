/**
 * WordPress
 */
import { createBlock } from '@wordpress/blocks';

/**
 * External dependencies
 */
import 'jest-canvas-mock';

/**
 * Internal dependencies
 */
import '../text-maxi';

describe('TextMaxi', () => {
	it('renders without crashing', () => {
		const expectedBlock = createBlock('maxi-blocks/text-maxi', {
			content: 'Testing Text Maxi',
		});

		expect(expectedBlock.isValid).toBeTruthy();
	});
});
