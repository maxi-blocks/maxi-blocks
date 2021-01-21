/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { useInstanceId } = wp.compose;
const { Icon, Button } = wp.components;
const { select, useSelect, useDispatch } = wp.data;
const { useState, useEffect } = wp.element;

/**
 * Internal dependencies
 */
import {
	getNumCol,
	getTemplates,
	getTemplateObject,
} from '../../extensions/defaults/column-templates';

import SizeControl from '../size-control';
import FancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import { uniqueId, isEmpty, isNil, cloneDeep } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Column patterns
 *
 * */
const ColumnPatternsInspector = props => {
	const { clientId, onChange, breakpoint, toolbar = false } = props;

	const [numCol, setNumCol] = useState(1);
	const [DISPLAYED_TEMPLATES, setDisplayedTemplates] = useState([]);

	const instanceId = useInstanceId(ColumnPatternsInspector);
	const rowPattern = { ...props.rowPattern };

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
				setDisplayedTemplates(getTemplates());
			} else {
				setDisplayedTemplates(getTemplates(breakpoint, numCol));
			}
		} else {
			setDisplayedTemplates(getTemplates(breakpoint, numCol));
		}
	}, [breakpoint, numCol]);

	useEffect(() => {
		if (rowPattern.general.rowPattern) {
			setNumCol(getNumCol(rowPattern.general.rowPattern));
		}
	}, [breakpoint, rowPattern.general.rowPattern]);

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
		if (isNil(blockIds) || isEmpty(blockIds)) return [];

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
	 * @param {integer} templateName the name of template
	 * @param {Function} callback
	 */
	const loadTemplate = templateName => {
		const currentContent = getCurrentContent(innerBlocks);
		const currentAttributes = getCurrentAttributes(innerBlocks);

		const template = cloneDeep(getTemplateObject(templateName));
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
	 * Get current columns sizes
	 *
	 * @return {Array} Array of columns sizes
	 */
	const getCurrentColumnsSizes = () => {
		const columnsSizes = [];
		const { getBlock } = select('core/block-editor');

		const columnsBlockObjects = getBlock(clientId).innerBlocks;

		columnsBlockObjects.forEach(columnObject => {
			const columnSizeObject = columnObject.attributes.columnSize;
			columnsSizes.push(columnSizeObject[breakpoint].size);
		});

		return columnsSizes;
	};

	/**
	 * Get columns positions (Row number and the number of columns in the row)
	 *
	 * @param {Array} sizes array of columns widths
	 * @return {Array} Array of objects
	 */

	const getColumnsPositions = sizes => {
		const columnsPositions = [];

		let columnsSizeSum = 0;
		let columnsNumberInOneRow = 0;
		let rowsCount = 1;

		sizes.forEach(size => {
			columnsSizeSum += size;
			columnsNumberInOneRow += 1;

			columnsPositions.push({
				rowNumber: rowsCount,
			});

			if (Math.round(columnsSizeSum * 100 + Number.EPSILON) / 100 === 1) {
				columnsPositions.forEach(column => {
					if (!column.columnsNumber) {
						column.columnsNumber = columnsNumberInOneRow;
					}
				});

				rowsCount += 1;
				columnsSizeSum = 0;
				columnsNumberInOneRow = 0;
			}
		});

		return columnsPositions;
	};

	/**
	 * Apply gap on columns sizes array
	 *
	 * @param {Array} sizes array of columns widths
	 * @return {Array} columns sizes after applying the gap
	 */
	const applyGap = sizes => {
		const newColumnsSizes = [];
		const columnsPositions = getColumnsPositions(sizes);

		const gap = rowPattern.general.removeColumnGap ? 0 : 2.5;

		sizes.forEach((column, i) => {
			if (columnsPositions[i].columnsNumber > 1) {
				const numberOfGaps = columnsPositions[i].columnsNumber - 1;
				const total = 100 - gap * numberOfGaps;

				newColumnsSizes.push(sizes[i] * total);
			}

			if (columnsPositions[i].columnsNumber === 1) {
				newColumnsSizes.push(100);
			}
		});

		return newColumnsSizes;
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

		const template = getTemplateObject(templateName);

		const { sizes } = template;

		const sizesWithGaps = applyGap(sizes);

		const columnsPositions = getColumnsPositions(sizes);

		columnsBlockObjects.forEach((column, j) => {
			const columnClientId = column.clientId;
			const columnAttributes = column.attributes;
			const columnUniqueID = columnAttributes.uniqueID;

			const newColumnSize = columnAttributes.columnSize;
			const newColumnMargin = columnAttributes.margin;

			newColumnSize[breakpoint].size = sizesWithGaps[j];

			document.querySelector(
				`.maxi-column-block__resizer__${columnUniqueID}`
			).style.width = sizesWithGaps[j];

			if (columnsPositions[j].rowNumber > 1) {
				newColumnMargin[breakpoint]['margin-top'] = 2;
				newColumnMargin[breakpoint].unit = 'em';
			}

			if (columnsPositions[j].rowNumber === 1) {
				newColumnMargin[breakpoint]['margin-top'] = 0;
				newColumnMargin[breakpoint].unit = '';
			}

			columnAttributes.columnSize = newColumnSize;
			columnAttributes.margin = newColumnMargin;

			updateBlockAttributes(columnClientId, columnAttributes);
		});
	};

	/**
	 * Update Gaps
	 *
	 * @param {integer} i Element of object FILTERED_TEMPLATES
	 * @param {Function} callback
	 */
	const updateGaps = templateName => {
		const { getBlock } = select('core/block-editor');

		const columnsBlockObjects = getBlock(clientId).innerBlocks;

		const template = getTemplateObject(templateName);

		const { sizes } = template;

		const sizesWithGaps = applyGap(sizes);

		columnsBlockObjects.forEach((column, k) => {
			const columnClientId = column.clientId;
			const columnAttributes = column.attributes;

			const newColumnSize = columnAttributes.columnSize;

			newColumnSize[breakpoint].size = sizesWithGaps[k];
			columnAttributes.columnSize = newColumnSize;

			updateBlockAttributes(columnClientId, columnAttributes);
		});
	};

	const patternButtonClassName = classnames(
		'components-column-pattern__template-button',
		toolbar && 'components-column-pattern__template-button--toolbar'
	);

	return (
		<div className='components-column-pattern'>
			{!toolbar && breakpoint === 'general' && (
				<SizeControl
					label={__('Columns', 'maxi-blocks')}
					disableUnit
					value={numCol}
					defaultValue={numCol}
					onChangeValue={numCol => setNumCol(numCol)}
					min={1}
					max={6}
					disableReset
				/>
			)}
			<div className='components-column-pattern__templates'>
				{DISPLAYED_TEMPLATES.map(template => {
					return (
						<Button
							key={uniqueId(
								`components-column-pattern--${instanceId}--`
							)}
							className={patternButtonClassName}
							aria-pressed={
								getCurrentColumnsSizes() ===
								applyGap(template.sizes)
							}
							onClick={() => {
								if (breakpoint === 'general') {
									loadTemplate(template.name);
									updateGaps(template.name);
								} else {
									updateTemplate(template.name);
								}

								rowPattern[breakpoint].rowPattern =
									template.name;

								onChange(rowPattern);
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
			<div className='components-column-pattern__gap'>
				{numCol !== 1 && breakpoint === 'general' && (
					<FancyRadioControl
						label={__('Remove Gap', 'maxi-blocks')}
						selected={
							rowPattern.general.removeColumnGap
								? rowPattern.general.removeColumnGap
								: 0
						}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={value => {
							rowPattern.general.removeColumnGap = Number(value);
							onChange(rowPattern);
							updateGaps(rowPattern.general.rowPattern);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default ColumnPatternsInspector;
