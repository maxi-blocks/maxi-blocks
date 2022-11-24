/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const goThroughMaxiBlocks = callback => {
	const blocks = select('core/block-editor').getBlocks();
	const goThroughRecursive = (blocks, callback) => {
		blocks.forEach(block => {
			if (block.name.includes('maxi-blocks')) {
				callback(block);
			}

			if (block.innerBlocks.length) {
				goThroughRecursive(block.innerBlocks, callback);
			}
		});
	};
	goThroughRecursive(blocks, callback);
};

export default goThroughMaxiBlocks;
