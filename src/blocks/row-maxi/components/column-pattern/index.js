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
import { AdvancedNumberControl, Button, Icon } from '../../../../components';
import {
	getNumCol,
	getTemplates,
	loadColumnsTemplate,
} from '../../../../extensions/column-templates';
import { getLastBreakpointAttribute } from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { uniqueId, isEqual, isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { getAttributeValue } from 'domutils';

/**
 * Column patterns
 *
 */
const ColumnPattern = props => {
	const { clientId, onChange, breakpoint, toolbar = false } = props;

	const [numCol, setNumCol] = useState(
		!isNil(getAttributeValue({ target: 'row-pattern-general', props }))
			? getNumCol(
					getAttributeValue({ target: 'row-pattern-general', props })
			  )
			: 1
	);
	const [DISPLAYED_TEMPLATES, setDisplayedTemplates] = useState([]);

	const instanceId = useInstanceId(ColumnPattern);

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
		if (getAttributeValue({ target: 'row-pattern-general', props })) {
			setNumCol(
				getNumCol(
					getAttributeValue({ target: 'row-pattern-general', props })
				)
			);
		}
	}, [
		breakpoint,
		getAttributeValue({ target: 'row-pattern-general', props }),
	]);

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
		</div>
	);
};

export default ColumnPattern;
