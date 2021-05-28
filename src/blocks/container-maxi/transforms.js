/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const name = 'maxi-blocks/container-maxi';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/columns'],
			transform: (attributes, innerBlocks) => createBlock(name, {}),
		},
	],
};

export default transforms;
