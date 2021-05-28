/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const name = 'maxi-blocks/image-maxi';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/image'],
			transform({ id, url }) {
				return createBlock(name, {
					mediaID: id,
					mediaURL: url,
				});
			},
		},
	],
};

export default transforms;
