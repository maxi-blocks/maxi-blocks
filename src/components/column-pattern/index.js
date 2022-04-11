/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { select } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import ToggleSwitch from '../toggle-switch';
import Icon from '../icon';
import AdvancedNumberControl from '../advanced-number-control';
import {
	getNumCol,
	getTemplates,
	loadColumnsTemplate,
} from '../../extensions/column-templates';

/**
 * External dependencies
 */
import { uniqueId, isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * Column patterns
 *
 */
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
				<AdvancedNumberControl
					label={__('Columns', 'maxi-blocks')}
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
									[`row-pattern-${breakpoint}`]:
										template.name,
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
						<ToggleSwitch
							label={__('Remove Gap', 'maxi-blocks')}
							selected={removeColumnGap}
							onChange={val => {
								onChange({ removeColumnGap: val });
								loadColumnsTemplate(
									props['row-pattern-general'],
									val,
									clientId,
									breakpoint
								);
							}}
						/>
					)}
					{!removeColumnGap && (
						<AdvancedNumberControl
							className='maxi__size'
							label={__('Gap', 'maxi-blocks')}
							enableUnit
							unit={props['gap-unit']}
							onChangeUnit={val => {
								console.log(val);
								onChange({
									[`gap-unit`]: val,
								});
							}}
							value={props['gap']}
							onChangeValue={val => {
								onChange({
									[`gap`]: val,
								});
							}}
							minMaxSettings={{
								px: {
									min: 0,
									max: 999,
								},
								em: {
									min: 0,
									max: 999,
								},
								vw: {
									min: 0,
									max: 999,
								},
								'%': {
									min: 0,
									max: 100,
								},
							}}
							allowedUnits={['px', 'em', 'vw', '%']}
							onReset={() =>
								onChange({
									[`gap`]: null,
								})
							}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default ColumnPatternsInspector;
