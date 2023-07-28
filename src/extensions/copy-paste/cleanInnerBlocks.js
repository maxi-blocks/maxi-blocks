/**
 * WordPress dependencies
 */
import { cloneBlock } from '@wordpress/blocks';

const cleanInnerBlocks = blocks =>
	blocks.map(block => {
		const newInnerBlocks = block.innerBlocks
			? cleanInnerBlocks(block.innerBlocks)
			: [];

		return cloneBlock(block, null, newInnerBlocks);
	});

export default cleanInnerBlocks;
