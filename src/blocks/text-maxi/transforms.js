/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/paragraph'],
			transform: ({ content }) => {
				return createBlock('maxi-blocks/text-maxi', {
					content,
				});
			},
		},
		{
			type: 'block',
			blocks: ['core/heading'],
			transform: ({ content, level }) => {
				return createBlock('maxi-blocks/text-maxi', {
					content,
					textLevel: `h${level}`,
				});
			},
		},
	],
};

export default transforms;
