/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { Icon, Button } from '@wordpress/components';
import { select } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getNumCol,
	getTemplates,
} from '../../extensions/defaults/column-templates';

import SizeControl from '../size-control';
import FancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import { uniqueId, isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import loadColumnsTemplate from '../../extensions/column-templates/loadColumnsTemplate';

/**
 * Column patterns
 *
 * */
const ColumnPatternsInspector = props => {
	const {
		clientId,
		onChange,
		breakpoint,
		toolbar = false,
		removeColumnGap = false,
	} = props;

	const [numCol, setNumCol] = useState(1);
	const [DISPLAYED_TEMPLATES, setDisplayedTemplates] = useState([]);

	const instanceId = useInstanceId(ColumnPatternsInspector);

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
				columnObject.attributes[`column-size-${breakpoint}`]
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

		const gap = removeColumnGap ? 0 : 2.5;

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
					max={8}
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
							aria-pressed={isEqual(
								getCurrentColumnsSizes(),
								applyGap(template.sizes)
							)}
							onClick={() => {
								loadColumnsTemplate(
									template.name,
									removeColumnGap,
									clientId,
									breakpoint
								);

								onChange({
									[`row-pattern-${breakpoint}`]: template.name,
								});
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
			{!toolbar && (
				<div className='components-column-pattern__gap'>
					{numCol !== 1 && breakpoint === 'general' && (
						<FancyRadioControl
							label={__('Remove Gap', 'maxi-blocks')}
							selected={removeColumnGap}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={removeColumnGap => {
								onChange({ removeColumnGap });
								loadColumnsTemplate(
									props['row-pattern-general'],
									!!+removeColumnGap,
									clientId,
									breakpoint
								);
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default ColumnPatternsInspector;
