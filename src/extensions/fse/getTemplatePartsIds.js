/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getTemplatePartsIds = () => {
	const { getBlocks } = select('core/block-editor');

	const templatePartBlocks = getBlocks().filter(
		({ name }) => name === 'core/template-part'
	);

	return templatePartBlocks.map(
		({ attributes: { slug, theme } }) => `${theme}//${slug}`
	);
};

export default getTemplatePartsIds;
