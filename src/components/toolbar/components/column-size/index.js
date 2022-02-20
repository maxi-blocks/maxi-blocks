/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';

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
				<ColumnSizeControl
					{...getGroupAttributes(props, 'columnSize')}
					verticalAlign={verticalAlign}
					rowPattern={rowPattern}
					clientId={clientId}
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ColumnSize;
