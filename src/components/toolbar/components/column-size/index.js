/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../../../extensions/styles';
import AdvancedNumberControl from '../../../advanced-number-control';
import { getColumnDefaultValue } from '../../../../extensions/column-templates';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';
import { ColumnSizeControl } from '../../..';

/**
 * ColumnSize
 */
const ColumnSize = props => {
	const {
		clientId,
		blockName,
		verticalAlign,
		onChange,
		rowPattern,
		breakpoint,
	} = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__column-size'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
		>
			<div className='toolbar-item__column-size__popover'>
				<AdvancedNumberControl
					label={__('Column Size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute(
						'column-size',
						breakpoint,
						props
					)}
					onChangeValue={val => {
						onChange({
							[`column-size-${breakpoint}`]:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0}
					max={100}
					step={0.1}
					onReset={() =>
						onChange({
							[`column-size-${breakpoint}`]:
								getColumnDefaultValue(
									rowPattern,
									{
										...getGroupAttributes(
											props,
											'columnSize'
										),
									},
									clientId,
									breakpoint
								),
						})
					}
					initialPosition={getDefaultAttribute(
						`column-size-${breakpoint}`,
						clientId
					)}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ColumnSize;
