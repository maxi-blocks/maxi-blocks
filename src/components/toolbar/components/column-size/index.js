/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import RangeSliderControl from '../../../range-slider-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { round } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';

/**
 * ColumnSize
 */
const ColumnSize = props => {
	const {
		clientId,
		blockName,
		verticalAlign,
		uniqueID,
		onChange,
		breakpoint,
		attributes,
	} = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__column-size'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
			content={
				<div className='toolbar-item__column-size__popover'>
					<RangeSliderControl
						label={__('Column Size', 'maxi-blocks')}
						defaultValue={getDefaultAttribute(
							`column-size-${breakpoint}`,
							clientId
						)}
						value={round(
							getLastBreakpointAttribute(
								'column-size',
								breakpoint,
								attributes
							),
							2
						)}
						onChange={val => {
							document.querySelector(
								`.maxi-column-block__resizer__${uniqueID}`
							).style.width = `${val}%`;

							onChange({
								[`column-size-${breakpoint}`]: val,
								verticalAlign,
							});
						}}
						min={0}
						max={100}
						step={0.1}
						allowReset
						initialPosition={getDefaultAttribute(
							`column-size-${breakpoint}`,
							clientId
						)}
					/>
					<SelectControl
						label={__('Vertical align', 'maxi-blocks')}
						value={verticalAlign}
						options={[
							{
								label: __('Top', 'maxi-blocks'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'maxi-blocks'),
								value: 'center',
							},
							{
								label: __('Bottom', 'maxi-blocks'),
								value: 'flex-end',
							},
							{
								label: __('Space between', 'maxi-blocks'),
								value: 'space-between',
							},
							{
								label: __('Space around', 'maxi-blocks'),
								value: 'space-around',
							},
						]}
						onChange={verticalAlign =>
							onChange({
								verticalAlign,
							})
						}
					/>
				</div>
			}
		/>
	);
};

export default ColumnSize;
