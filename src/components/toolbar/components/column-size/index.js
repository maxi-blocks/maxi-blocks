/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl, SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { getLastBreakpointValue, getDefaultProp } from '../../../../utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons
 */
import { toolbarSizing } from '../../../../icons';

/**
 * ColumnSize
 */
const ColumnSize = props => {
	const {
		clientId,
		blockName,
		columnSize,
		verticalAlign,
		uniqueID,
		onChange,
		breakpoint,
	} = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	const value = !isObject(columnSize) ? JSON.parse(columnSize) : columnSize;

	return (
		<ToolbarPopover
			className='toolbar-item__size'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
			content={
				<Fragment>
					<RangeControl
						label={__('Column Size', 'maxi-blocks')}
						value={getLastBreakpointValue(
							value,
							'size',
							breakpoint
						)}
						onChange={val => {
							value[breakpoint].size = val;
							document.querySelector(
								`.maxi-column-block__resizer__${uniqueID}`
							).style.width = `${val}%`;

							onChange({
								columnSize: JSON.stringify(value),
								verticalAlign,
							});
						}}
						min='0'
						max='100'
						step={0.1}
						allowReset
						initialPosition={
							JSON.parse(getDefaultProp(clientId, 'columnSize'))[
								breakpoint
							].size
						}
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
								columnSize: JSON.stringify(value),
								verticalAlign,
							})
						}
					/>
				</Fragment>
			}
		/>
	);
};

export default ColumnSize;
