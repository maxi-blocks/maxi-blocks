import { useState } from '@wordpress/element';

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
import TEMPLATES from '../../extensions/defaults/column-templates';

import SizeControl from '../size-control';

/**
 * External dependencies
 */
import { uniqueId, isEmpty, isNil, cloneDeep } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Column patterns
 *
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPatternsInspector = props => {
	const { clientId, blockName, rowPattern, onChange } = props;

	const [numCol, setNumCol] = useState(1);
	const [FILTERED_TEMPLATES, setFilterdTemplates] = useState([TEMPLATES[0]]);

	const instanceId = useInstanceId(ColumnPatternsInspector);

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
	 * @param {integer} i Element of object FILTERED_TEMPLATES
	 * @param {Function} callback
	 */
	const loadTemplate = i => {
		const currentContent = getCurrentContent(innerBlocks);
		const currentAttributes = getCurrentAttributes(innerBlocks);

		const template = cloneDeep(FILTERED_TEMPLATES[i]);
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
		replaceInnerBlocks(clientId, newTemplate, false);
	};

	/**
	 * Filter TEMPLATE Array Accroding to the number of columns
	 *
	 * @param {integer} numCol Number of Columns
	 * @param {Function} callback
	 */
	const filterTemplate = numCol => {
		switch (numCol) {
			case 1:
				setFilterdTemplates(TEMPLATES.slice(0, 1));
				break;
			case 2:
				setFilterdTemplates(TEMPLATES.slice(1, 5));
				break;
			case 3:
				setFilterdTemplates(TEMPLATES.slice(5, 12));
				break;
			case 4:
				setFilterdTemplates(TEMPLATES.slice(12, 13));
				break;
			case 5:
				setFilterdTemplates(TEMPLATES.slice(13, 14));
				break;
			case 6:
				setFilterdTemplates(TEMPLATES.slice(14, 15));
				break;
			default:
				break;
		}
	};

	return (
		<div className=''>
			<div>
				<SizeControl
					label={__('Columns', 'maxi-blocks')}
					disableUnit
					value={numCol}
					defaultValue={numCol}
					onChangeValue={numCol => {
						setNumCol(numCol);
						filterTemplate(numCol);
					}}
					min={1}
					max={6}
				/>
			</div>
			<div className='components-column-pattern'>
				{FILTERED_TEMPLATES.map((template, i) => {
					return (
						<Button
							key={uniqueId(
								`components-column-pattern--${instanceId}--`
							)}
							className='components-column-pattern__template-button'
							aria-pressed={rowPattern === i}
							onClick={() => {
								loadTemplate(i);
								onChange(i);
							}}
						>
							<Icon
								className='components-column-pattern__icon'
								icon={template.icon}
							/>
						</Button>
					);
				})}
			</div>
		</div>
	);
};

export default ColumnPatternsInspector;
