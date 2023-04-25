/**
 * WordPress dependencies
 */
import { cloneBlock } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';

const cleanInnerBlocks = (blocks, callback) =>
	blocks.map(block => {
		if (isFunction(callback)) callback(block);

		const newInnerBlocks = block.innerBlocks
			? cleanInnerBlocks(block.innerBlocks)
			: [];

		return cloneBlock(block, null, newInnerBlocks);
	});

export default cleanInnerBlocks;
