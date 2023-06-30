/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { synchronizeBlocksWithTemplate } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import getColumnTemplate from './getColumnTemplate';

/**
 * External dependencies
 */
import { cloneDeep, flatten, compact } from 'lodash';

const loadTemplate = (template, clientId) => {
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

const updateTemplate = (
	template,
	columnsBlockObjects,
	clientId,
	noLeftoverInsertion = false,
	isMarkNextChangeAsNotPersistent = false
) => {
	const templateLength = template.content.length;
	const newAttributes = template.attributes;

	if (!noLeftoverInsertion) {
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
	}

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
	if (isMarkNextChangeAsNotPersistent) {
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');
		markNextChangeAsNotPersistent();
	}
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
	clientId,
	breakpoint,
	numCol,
	noLeftoverInsertion,
	isMarkNextChangeAsNotPersistent,
	avoidRowAttributesChange
) => {
	const columnsBlockObjects = wp.data
		.select('core/block-editor')
		.getBlock(clientId).innerBlocks;
	const isRowEmpty = !columnsBlockObjects.length;
	// When inserting column, template should be loaded for general
	const template = cloneDeep(
		getColumnTemplate(
			templateName,
			isRowEmpty ? 'general' : breakpoint,
			numCol,
			avoidRowAttributesChange
		)
	);

	isRowEmpty
		? loadTemplate(template, clientId)
		: updateTemplate(
				template,
				columnsBlockObjects,
				clientId,
				noLeftoverInsertion,
				isMarkNextChangeAsNotPersistent
		  );
};

export default loadColumnsTemplate;
