/**
 * WordPress dependencies
 */
const { dispatch } = wp.data;
const { synchronizeBlocksWithTemplate } = wp.blocks;

/**
 * Internal dependencies
 */
import getColumnTemplate from './getColumnTemplate';
import uniqueIDGenerator from '../attributes/uniqueIDGenerator';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const loadTemplate = (template, clientId) => {
	template.content.forEach(column => {
		column[1].uniqueID = uniqueIDGenerator('maxi-column-maxi-');
	});

	const newAttributes = template.attributes;
	dispatch('core/block-editor').updateBlockAttributes(
		clientId,
		newAttributes
	);

	const newTemplate = synchronizeBlocksWithTemplate([], template.content);
	dispatch('core/block-editor').replaceInnerBlocks(
		clientId,
		newTemplate,
		false
	);
};

const updateTemplate = (template, columnsBlockObjects, breakpoint) => {
	columnsBlockObjects.forEach((column, j) => {
		const columnAttributes = { ...template.content[j][1] };

		const { resizableObject } = column.attributes;

		wp.data
			.dispatch('core/block-editor')
			.updateBlockAttributes(column.clientId, columnAttributes)
			.then(() => {
				const newWidth = columnAttributes[`column-size-${breakpoint}`];
				const newMargin = columnAttributes[`margin-top-${breakpoint}`];

				if (resizableObject) {
					if (newWidth) {
						resizableObject.updateSize({
							width: `${newWidth}%`,
						});
						resizableObject.resizable.style.width = `${newWidth}%`;
					}
					if (newMargin) {
						// resizableObject.resizable.style.marginTop = `${newMargin}em`;
					}
				} else {
					document.querySelector(
						`.maxi-column-block__resizer__${column.attributes.uniqueID}`
					).style.width = `${newWidth}%`;
				}
			});
	});
};

const loadColumnsTemplate = (
	templateName,
	removeColumnGap,
	clientId,
	breakpoint
) => {
	const template = cloneDeep(
		getColumnTemplate(templateName, removeColumnGap, breakpoint)
	);
	const columnsBlockObjects = wp.data
		.select('core/block-editor')
		.getBlock(clientId).innerBlocks;
	const isRowEmpty = !columnsBlockObjects.length;

	isRowEmpty
		? loadTemplate(template, clientId)
		: updateTemplate(template, columnsBlockObjects, breakpoint);
};

export default loadColumnsTemplate;
