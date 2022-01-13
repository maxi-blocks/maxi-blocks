/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../../../select-control';
import ToolbarPopover from '../toolbar-popover';
import AdvancedNumberControl from '../../../advanced-number-control';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';
import { getColumnDefaultValue } from '../../../../extensions/column-templates';

/**
 * External dependencies
 */
// import { round } from 'lodash';

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
		onChange,
		// breakpoint,
		attributes,
		rowPattern,
		// columnSize,
		deviceType,
		setAttributes,
	} = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__column-size'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
			deviceType={deviceType}
		>
			<div className='toolbar-item__column-size__popover'>
				<AdvancedNumberControl
					label={__('Column Size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute(
						'column-size',
						deviceType,
						attributes
					)}
					onChangeValue={val => {
						setAttributes({
							[`column-size-${deviceType}`]:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0}
					max={100}
					step={0.1}
					onReset={() =>
						setAttributes({
							[`column-size-${deviceType}`]:
								getColumnDefaultValue(
									rowPattern,
									{
										...getGroupAttributes(
											attributes,
											'columnSize'
										),
									},
									clientId,
									deviceType
								),
						})
					}
					initialPosition={getDefaultAttribute(
						`column-size-${deviceType}`,
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
		</ToolbarPopover>
	);
};

export default ColumnSize;
