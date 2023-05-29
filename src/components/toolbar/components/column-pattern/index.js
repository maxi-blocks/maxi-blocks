/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { ColumnPattern } from '../../../../blocks/row-maxi/components';
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../../../extensions/attributes';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '../../../../icons';

const ToolbarColumnPattern = props => {
	const { clientId, blockName, onChange, breakpoint } = props;

	if (
		blockName !== 'maxi-blocks/row-maxi' ||
		!getAttributesValue({ target: '_rp-g', props })
	)
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
					toolbar
					breakpoint={breakpoint}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ToolbarColumnPattern;
