/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { synchronizeBlocksWithTemplate } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import getColumnTemplate from './getColumnTemplate';
import uniqueIDGenerator from '../attributes/uniqueIDGenerator';

/**
 * External dependencies
 */
import { cloneDeep, flatten, compact } from 'lodash';

const loadTemplate = (template, clientId) => {
	template.content.forEach(column => {
		column[1].uniqueID = uniqueIDGenerator('column-maxi-');
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

const updateTemplate = (template, columnsBlockObjects, clientId) => {
	const templateLength = template.content.length;
	const newAttributes = template.attributes;
	const leftoverContent = compact(
		columnsBlockObjects.map((column, i) => {
			if (i < templateLength) return null;

			return column.innerBlocks;
		})
	);

	// Insert leftover content on the last column
	if (columnsBlockObjects.length > templateLength)
		columnsBlockObjects[templateLength - 1].innerBlocks.push(
			...flatten(leftoverContent)
		);

	const newTemplate = synchronizeBlocksWithTemplate(
		columnsBlockObjects,
		template.content
	);

	// Ensure column size attributes are update
	template.content.forEach((column, i) => {
		newTemplate[i].attributes = {
			...newTemplate[i].attributes,
			...column[1],
		};
	});

	const rowBlock = select('core/block-editor').getBlock(clientId);
	dispatch('core/block-editor').replaceBlock(clientId, {
		...rowBlock,
		attributes: {
			...rowBlock.attributes,
			...newAttributes,
		},
		innerBlocks: newTemplate,
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
		: updateTemplate(template, columnsBlockObjects, clientId);
};

export default loadColumnsTemplate;
