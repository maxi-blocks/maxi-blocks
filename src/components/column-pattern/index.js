/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { useInstanceId } = wp.compose;
const { Icon, Button } = wp.components;
const { select, useSelect, useDispatch } = wp.data;
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	filterTemplates,
	getNumCol,
	RESPONSIVE_TEMPLATES,
} from '../../extensions/defaults/column-templates';

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
	const {
		clientId,
		blockName,
		rowPattern,
		onChange,
		breakpoint = 'general',
	} = props;
	const [numCol, setNumCol] = useState(1);
	const [DISPLAYED_TEMPLATES, setDisplayedTemplates] = useState([]);

	const instanceId = useInstanceId(ColumnPatternsInspector);
	const rowPatternObject = JSON.parse(rowPattern);

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

	// Change Number of columns state depending on the pattern
	useEffect(() => {
		if (rowPatternObject.general.rowPattern) {
			setNumCol(getNumCol(rowPatternObject.general.rowPattern));
		}
	}, [breakpoint, rowPatternObject.general.rowPattern]);

	// Change the patterns displayed based on the number of columns
	useEffect(() => {
		setDisplayedTemplates(filterTemplates(numCol, breakpoint));
	}, [breakpoint, setDisplayedTemplates, numCol]);

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
	 * @param {integer} i Element of object DISPLAYED_TEMPLATES
	 * @param {Function} callback
	 */
	const loadTemplate = i => {
		const currentContent = getCurrentContent(innerBlocks);
		const currentAttributes = getCurrentAttributes(innerBlocks);

		const template = cloneDeep(DISPLAYED_TEMPLATES[i]);

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

	// const patternButtonClassName = 'components-column-pattern__template-button';
	// if (breakpoint === 'Desktop') {
	// }

	const setRowPatternAttribute = (clientId, i) => {
		// const rowAttributes = getBlockAttributes(clientId);
		// const rowPattern = JSON.parse(rowAttributes.rowPattern);

		rowPatternObject[breakpoint].rowPattern = i;

		// rowAttributes.rowPattern = JSON.stringify(rowPattern);

		updateBlockAttributes(clientId, {
			rowPattern: JSON.stringify(rowPatternObject),
		});
	};

	/**
	 * Update Columns Sizes
	 *
	 * @param {integer} i Element of object DISPLAYED_TEMPLATES
	 * @param {Function} callback
	 */
	const updateTemplate = i => {
		const { getBlock } = select('core/block-editor');

		// Get Current Columns in the editor
		const columnsBlockObjects = getBlock(clientId).innerBlocks;
		// const totalColumns = columnsBlockObjects.length - 1;

		// New Column Sizes Array
		const { sizes } = DISPLAYED_TEMPLATES[i];

		// Update the columns Attributes with the new sizes
		columnsBlockObjects.forEach((column, j) => {
			const columnClientId = column.clientId;
			const columnAttributes = column.attributes;
			const columnUniqueID = columnAttributes.uniqueID;

			// Update Column Attribute
			const newColumnSize = JSON.parse(columnAttributes.columnSize);
			newColumnSize[breakpoint].size = sizes[j] * 100;

			columnAttributes.columnSize = JSON.stringify(newColumnSize);

			// Update the column attributes
			updateBlockAttributes(columnClientId, columnAttributes);

			document.querySelector(
				`.maxi-column-block__resizer__${columnUniqueID}`
			).style.width = `${sizes[j] * 100}%`;
		});

		setRowPatternAttribute(clientId, i);
	};

	console.log(rowPatternObject);

	return (
		<Fragment>
			<div>
				{breakpoint === 'Desktop' && (
					<SizeControl
						label={__('Columns', 'maxi-blocks')}
						disableUnit
						value={numCol}
						defaultValue={numCol}
						onChangeValue={numCol => setNumCol(numCol)}
						min={1}
						max={6}
					/>
				)}
			</div>
			<div className='components-column-pattern'>
				{DISPLAYED_TEMPLATES.map((template, i) => {
					console.log(
						rowPatternObject[breakpoint].rowPattern,
						i,
						rowPatternObject[breakpoint].rowPattern === i
					);
					return (
						<Button
							key={uniqueId(
								`components-column-pattern--${instanceId}--`
							)}
							className='components-column-pattern__template-button'
							aria-pressed={
								rowPatternObject[breakpoint].rowPattern === i
							}
							onClick={() => {
								if (breakpoint === 'Desktop') {
									loadTemplate(i);
								} else {
									updateTemplate(i);
								}

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
		</Fragment>
	);
};

export default ColumnPatternsInspector;
