/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { getAllFonts } from '.';
import { getGroupAttributes } from '../../styles';

const getPageFonts = () => {
	const { getBlocks } = select('core/block-editor');
	let response = {};

	const getBlockFonts = blocks => {
		Object.entries(blocks).forEach(([key, block]) => {
			const { attributes, innerBlocks, name } = block;

			if (name.includes('maxi') && !isEmpty(attributes)) {
				const typography = {
					...getGroupAttributes(attributes, 'typography'),
				};

				response = {
					...response,
					...getAllFonts(typography),
				};
			}

			if (!isEmpty(innerBlocks)) getBlockFonts(innerBlocks);
		});

		return null;
	};

	getBlockFonts(getBlocks());

	return response;
};

export default getPageFonts;
