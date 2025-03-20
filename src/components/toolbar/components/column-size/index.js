/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '@extensions/styles';
import AdvancedNumberControl from '@components/advanced-number-control';
import { getColumnDefaultValue } from '@extensions/column-templates';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '@maxi-icons';

/**
 * ColumnSize
 */
const ColumnSize = props => {
	const { clientId, blockName, onChange, rowPattern, breakpoint } = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	const useBreakpoint =
		breakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: breakpoint;

	return (
		<ToolbarPopover
			className='toolbar-item__column-size'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
		>
			<div className='toolbar-item__column-size__popover'>
				<AdvancedNumberControl
					label={__('Column size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute({
						target: 'column-size',
						breakpoint: useBreakpoint,
						attributes: props,
					})}
					onChangeValue={val => {
						onChange({
							[`column-size-${useBreakpoint}`]:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0}
					max={100}
					step={0.1}
					onReset={() =>
						onChange({
							[`column-size-${useBreakpoint}`]:
								getColumnDefaultValue(
									rowPattern,
									{
										...getGroupAttributes(
											props,
											'columnSize'
										),
									},
									clientId,
									useBreakpoint
								),
							isReset: true,
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
