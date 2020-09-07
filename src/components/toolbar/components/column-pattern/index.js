/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { useInstanceId } = wp.compose;
const { Icon, Button } = wp.components;
const { select, useSelect, useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import { TEMPLATES } from '../../../../extensions/defaults/column-templates';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { uniqueId, isEmpty, isNil, cloneDeep } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '../../../../icons';

/**
 * Column patterns
 *
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPatterns = props => {
	const { clientId, blockName, rowPattern, onChange } = props;

	const instanceId = useInstanceId(ColumnPatterns);

	const { getBlockName, getBlockAttributes, getBlockOrder } = select(
		'core/block-editor'
	);

	const { innerBlocks } = useSelect(
		select => {
			const { getBlockOrder } = select('core/block-editor');
			return {
				innerBlocks: getBlockOrder(clientId),
			};
		},
		[clientId]
	);

	const { updateBlockAttributes, replaceInnerBlocks } = useDispatch(
		'core/block-editor'
	);

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	/**
	 * Creates a new array with columns content before loading template for saving
	 * current content and be ready to load in new columns
	 *
	 * @param {Object} blockIds Inner blocks ids of parent block
	 * @param {Array} newTemplate Parent array for nesting children
	 *
	 * @returns {Array} Array with saved content
	 */
	const getCurrentContent = (blockIds, newTemplate = []) => {
		if (isNil(blockIds) || isEmpty(blockIds)) return null;

		blockIds.forEach(id => {
			const blockName = getBlockName(id);
			const blockAttributes = getBlockAttributes(id);
			const innerBlocks = getBlockOrder(id);

			let response;
			if (blockName === 'maxi-blocks/column-maxi')
				newTemplate.push(getCurrentContent(innerBlocks, response));
			else
				newTemplate.push([
					blockName,
					blockAttributes,
					getCurrentContent(innerBlocks, response),
				]);
		});

		return newTemplate;
	};

	/**
	 * Merges an array with new template and current content
	 *
	 * @param {Array} template Columns template for load
	 * @param {Array} currentContent Content inside current template
	 *
	 * @returns {Array} Merged array with column template and current content
	 */
	const expandWithNewContent = (template, currentContent) => {
		currentContent.forEach((content, i) => {
			if (!isNil(template[i])) template[i].push(content);
		});

		return template;
	};

	/**
	 * Creates uniqueID for columns on loading templates
	 */
	const uniqueIdCreator = () => {
		const newID = uniqueId('maxi-column-maxi-');
		if (
			!isEmpty(document.getElementsByClassName(newID)) ||
			!isNil(document.getElementById(newID))
		)
			uniqueIdCreator();

		return newID;
	};

	const getCurrentAttributes = blockIds => {
		return blockIds.map(id => {
			return getBlockAttributes(id);
		});
	};

	/**
	 * Loads template into InnerBlocks
	 *
	 * @param {integer} i Element of object TEMPLATES
	 * @param {Function} callback
	 */
	const loadTemplate = i => {
		const currentContent = getCurrentContent(innerBlocks);
		const currentAttributes = getCurrentAttributes(innerBlocks);

		const template = cloneDeep(TEMPLATES[i]);
		template.content.forEach((column, i) => {
			column[1].uniqueID = uniqueIdCreator();
			if (currentAttributes.length > i)
				column[1] = Object.assign(currentAttributes[i], column[1]);
		});

		const newAttributes = Object.assign(
			getBlockAttributes(clientId),
			template.attributes
		);
		updateBlockAttributes(clientId, newAttributes);

		const newTemplateContent = expandWithNewContent(
			template.content,
			currentContent
		);

		const newTemplate = synchronizeBlocksWithTemplate(
			[],
			newTemplateContent
		);
		replaceInnerBlocks(clientId, newTemplate);
	};

	return (
		<ToolbarPopover
			className='toolbar-item__column-pattern'
			icon={toolbarColumnPattern}
			tooltip={__('Column pattern', 'maxi-blocks')}
			content={
				<div className='toolbar-item__popover__wrapper toolbar-item__popover__column-pattern'>
					{TEMPLATES.map((template, i) => (
						<Button
							key={uniqueId(
								`toolbar-item__column-pattern--${instanceId}--`
							)}
							className='toolbar-item__popover__column-pattern__template-button'
							aria-pressed={rowPattern === i}
							onClick={() => {
								loadTemplate(i);
								onChange(i);
							}}
						>
							<Icon
								className='toolbar-item__popover__column-pattern__template-button__icon'
								icon={template.icon}
							/>
						</Button>
					))}
				</div>
			}
		/>
	);
};

export default ColumnPatterns;
