/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
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

const updateTemplate = (template, columnsBlockObjects, clientId) => {
	columnsBlockObjects.forEach((column, i) => {
		column.attributes = {
			...column.attributes,
			...(template.content[i] && template.content[i][1]),
		};
	});

	const newAttributes = template.attributes;
	dispatch('core/block-editor').updateBlockAttributes(
		clientId,
		newAttributes
	);

	const newTemplate = synchronizeBlocksWithTemplate(
		columnsBlockObjects,
		template.content
	);
	dispatch('core/block-editor').replaceInnerBlocks(
		clientId,
		newTemplate,
		false
	);
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
