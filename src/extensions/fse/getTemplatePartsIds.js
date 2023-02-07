/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import createTemplatePartId from './createTemplatePartId';

const getTemplatePartsIds = () => {
	const { getBlocks } = select('core/block-editor');

	const templatePartBlocks = getBlocks().filter(
		({ name }) => name === 'core/template-part'
	);

	return templatePartBlocks.map(({ attributes: { theme, slug } }) =>
		createTemplatePartId(theme, slug)
	);
};

export default getTemplatePartsIds;
