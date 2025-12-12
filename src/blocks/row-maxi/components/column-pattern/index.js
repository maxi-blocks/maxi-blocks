/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { dispatch, select } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { floor, isEqual, isNil, uniqueId } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import Button from '@components/button';
import Icon from '@components/icon';

import {
	getNumCol,
	getTemplateObject,
	getTemplates,
	loadColumnsTemplate,
} from '@extensions/column-templates';
import {
	getAttributeKey,
	getAttributeValue,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { validateRowColumnsStructure } from '@extensions/repeater';
import { getBlockPosition } from '@extensions/repeater/utils';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Column patterns
 *
 */
const ColumnPattern = props => {
	const {
		clientId,
		onChange,
		breakpoint,
		repeaterStatus,
		repeaterRowClientId,
		getInnerBlocksPositions,
		toolbar = false,
	} = props;

	const [numCol, setNumCol] = useState(
		!isNil(props['row-pattern-general'])
			? getNumCol(props['row-pattern-general'])
			: 1
	);
	const [DISPLAYED_TEMPLATES, setDisplayedTemplates] = useState([]);

	const instanceId = useInstanceId(ColumnPattern);

	useEffect(() => {
		const onlyEqualColumns =
			repeaterStatus && clientId === repeaterRowClientId;

		if (toolbar) {
			setDisplayedTemplates(getTemplates(onlyEqualColumns));
		} else {
			setDisplayedTemplates(
				getTemplates(onlyEqualColumns, breakpoint, numCol)
			);
		}
	}, [breakpoint, numCol]);

	useEffect(() => {
		if (props['row-pattern-general']) {
			setNumCol(getNumCol(props['row-pattern-general']));
		}
	}, [breakpoint, props['row-pattern-general']]);

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
			columnsSizes.push(
				getLastBreakpointAttribute({
					target: 'column-size',
					breakpoint,
					attributes: columnObject.attributes,
				})
			);
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

		sizes.forEach((column, i) => {
			if (columnsPositions[i].columnsNumber > 1) {
				newColumnsSizes.push(sizes[i] * 100);
			}

			if (columnsPositions[i].columnsNumber === 1) {
				newColumnsSizes.push(100);
			}
		});

		return newColumnsSizes;
	};

	const patternButtonClassName = classnames(
		'components-column-pattern__template-button',
		toolbar && 'components-column-pattern__template-button--toolbar'
	);

	return (
		<div className='components-column-pattern'>
			{!toolbar && breakpoint === 'general' && (
				<AdvancedNumberControl
					label={__('Number of columns', 'maxi-blocks')}
					value={numCol}
					defaultValue={numCol}
					onChangeValue={numCol => setNumCol(numCol)}
					min={1}
					maxRange={8}
					disableReset
				/>
			)}
			<div className='components-column-pattern__templates'>
				{DISPLAYED_TEMPLATES.map(template => {
					if (
						template.isMoreThanEightColumns &&
						breakpoint !== 'general'
					)
						return null;
					return (
						<Button
							key={uniqueId(
								`components-column-pattern--${instanceId}--`
							)}
							className={
								patternButtonClassName +
								(template.isMoreThanEightColumns
									? ' components-column-pattern-apply_settings'
									: '')
							}
							aria-pressed={isEqual(
								getCurrentColumnsSizes(),
								(template.isMoreThanEightColumns
									? Array(numCol).fill(100 / numCol)
									: applyGap(template.sizes)
								).map(value => floor(value, 2))
							)}
							onClick={() => {
								loadColumnsTemplate(
									template.name,
									clientId,
									breakpoint,
									numCol,
									repeaterStatus
								);

								const oldRowPattern = getAttributeValue({
									target: 'row-pattern',
									props,
									breakpoint,
								});
								const newRowPattern =
									template.isMoreThanEightColumns
										? numCol.toString()
										: template.name;

								if (repeaterStatus) {
									const innerBlockPositions =
										getInnerBlocksPositions();

									if (
										(getTemplateObject(oldRowPattern)?.sizes
											.length ?? Number(oldRowPattern)) <
											(getTemplateObject(newRowPattern)
												?.sizes.length ??
												Number(newRowPattern)) &&
										clientId === repeaterRowClientId
									) {
										validateRowColumnsStructure(
											repeaterRowClientId,
											innerBlockPositions
										);
									} else if (
										clientId !== repeaterRowClientId
									) {
										const blockPosition = getBlockPosition(
											clientId,
											innerBlockPositions
										);

										innerBlockPositions[
											blockPosition
										].forEach(rowClientId => {
											if (rowClientId === clientId)
												return;

											loadColumnsTemplate(
												newRowPattern,
												rowClientId,
												breakpoint,
												numCol,
												repeaterStatus,
												repeaterStatus
											);
										});

										// Undo/redo fix
										const {
											__unstableMarkNextChangeAsNotPersistent:
												markNextChangeAsNotPersistent,
										} = dispatch('core/block-editor');
										markNextChangeAsNotPersistent();
									}
								}

								onChange({
									[getAttributeKey(
										'row-pattern',
										false,
										null,
										breakpoint
									)]: newRowPattern,
								});
							}}
						>
							{template.isMoreThanEightColumns ? (
								__('Apply Setting', 'maxi-blocks')
							) : (
								<Icon
									className='components-column-pattern__icon'
									icon={template.icon}
								/>
							)}
						</Button>
					);
				})}
			</div>
		</div>
	);
};

export default ColumnPattern;
