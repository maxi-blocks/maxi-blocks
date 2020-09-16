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
	TEMPLATES,
	getNumCol,
} from '../../extensions/defaults/column-templates';
import { getLastBreakpointValue } from '../../utils';

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
 * @todo Shows just row patterns with DisplayedTemplates existing number of columns
 */
const ColumnPatternsInspector = props => {
	const {
		clientId,
		blockName,
		rowPattern,
		onChange,
		breakpoint,
		toolbar = false,
	} = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	const [numCol, setNumCol] = useState(1);
	const [FILTERED_TEMPLATES, setFilteredTemplates] = useState([]);
	const [DISPLAYED_TEMPLATES, setDisplayedTemplates] = useState(
		TEMPLATES.slice(0, 15)
	);

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

	useEffect(() => {
		if (toolbar) {
			if (breakpoint === 'general') {
				setDisplayedTemplates(TEMPLATES.slice(0, 15));
			} else {
				setDisplayedTemplates(FILTERED_TEMPLATES);
			}
		} else {
			setDisplayedTemplates(FILTERED_TEMPLATES);
		}
	}, [FILTERED_TEMPLATES, breakpoint]);

	useEffect(() => {
		if (rowPatternObject.general.rowPattern) {
			setNumCol(getNumCol(rowPatternObject.general.rowPattern));
		}
	}, [breakpoint, rowPatternObject[breakpoint].rowPattern]);

	useEffect(() => {
		setFilteredTemplates(filterTemplates(numCol, breakpoint));
	}, [breakpoint, setFilteredTemplates, numCol]);

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
	 * @param {integer} templateName Element of object FILTERED_TEMPLATES
	 * @param {Function} callback
	 */
	const loadTemplate = templateName => {
		const currentContent = getCurrentContent(innerBlocks);
		const currentAttributes = getCurrentAttributes(innerBlocks);

		const template = cloneDeep(
			TEMPLATES.filter(template => template.name === templateName)[0]
		);

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

	const setRowPatternAttribute = (clientId, templateName) => {
		rowPatternObject[breakpoint].rowPattern = templateName;

		updateBlockAttributes(clientId, {
			rowPattern: JSON.stringify(rowPatternObject),
		});
	};

	/**
	 * Update Columns Sizes
	 *
	 * @param {integer} i Element of object FILTERED_TEMPLATES
	 * @param {Function} callback
	 */
	const updateTemplate = templateName => {
		const { getBlock } = select('core/block-editor');

		const columnsBlockObjects = getBlock(clientId).innerBlocks;

		const { sizes } = TEMPLATES.filter(
			template => template.name === templateName
		)[0];

		columnsBlockObjects.forEach((column, j) => {
			const columnClientId = column.clientId;
			const columnAttributes = column.attributes;
			const columnUniqueID = columnAttributes.uniqueID;

			const newColumnSize = JSON.parse(columnAttributes.columnSize);
			newColumnSize[breakpoint].size = sizes[j] * 100;

			columnAttributes.columnSize = JSON.stringify(newColumnSize);

			updateBlockAttributes(columnClientId, columnAttributes);

			document.querySelector(
				`.maxi-column-block__resizer__${columnUniqueID}`
			).style.width = `${sizes[j] * 100}%`;
		});

		setRowPatternAttribute(clientId, templateName);
	};

	let patternButtonClassName = 'components-column-pattern__template-button';
	if (toolbar) {
		patternButtonClassName +=
			' components-column-pattern__template-button--toolbar';
	}
	/* IMPORTANT!!! 
		Problem
		Currently the active pattern for [xxl, xl, l, m, s, xs] is not working when the user doesn't 
		choose a pattern for those 	after inserting the block and choosed a pattern for Desktop 

		Solution: 
		 - set the same pattern choosed for Desktop for screens: xxl, xl, l, m 
		 - set the corresponding stacked pattern for s and xs 

	
	*/
	return (
		<Fragment>
			{!toolbar && (
				<div>
					{breakpoint === 'general' && (
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
			)}
			<div className='components-column-pattern'>
				{DISPLAYED_TEMPLATES.map(template => {
					// Find the index of the template on TEMPLATES Array
					// const i = TEMPLATES.findIndex(
					//	newTemplate => template.name === newTemplate.name
					// );
					return (
						<Button
							key={uniqueId(
								`components-column-pattern--${instanceId}--`
							)}
							className={patternButtonClassName}
							aria-pressed={
								getLastBreakpointValue(
									rowPatternObject,
									'rowPattern',
									breakpoint
								) === template.name
							}
							onClick={() => {
								if (breakpoint === 'general') {
									loadTemplate(template.name);
								} else {
									updateTemplate(template.name);
								}

								rowPatternObject[breakpoint].rowPattern =
									template.name;

								onChange(JSON.stringify(rowPatternObject));
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
