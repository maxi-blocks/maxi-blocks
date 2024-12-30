/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { ColumnPattern } from '@blocks/row-maxi/components';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '@maxi-icons';

const ToolbarColumnPattern = props => {
	const {
		clientId,
		blockName,
		onChange,
		breakpoint,
		repeaterStatus,
		repeaterRowClientId,
		getInnerBlocksPositions,
	} = props;

	if (blockName !== 'maxi-blocks/row-maxi' || !props['row-pattern-general'])
		return null;

	return (
		<ToolbarPopover
			className='toolbar-item__column-pattern'
			icon={toolbarColumnPattern}
			tooltip={__('Column picker', 'maxi-blocks')}
		>
			<div className='toolbar-item__column-pattern__popover'>
				<ColumnPattern
					clientId={clientId}
					{...getGroupAttributes(props, 'rowPattern')}
					onChange={rowPattern => {
						onChange(rowPattern);
					}}
					breakpoint={breakpoint}
					repeaterStatus={repeaterStatus}
					repeaterRowClientId={repeaterRowClientId}
					getInnerBlocksPositions={getInnerBlocksPositions}
					toolbar
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ToolbarColumnPattern;
