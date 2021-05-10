/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColumnPattern from '../../../column-pattern';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '../../../../icons';

const ToolbarColumnPattern = props => {
	const { clientId, blockName, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	return (
		<>
			{props['row-pattern-general'] && (
				<ToolbarPopover
					className='toolbar-item__column-pattern'
					icon={toolbarColumnPattern}
					tooltip={__('Column pattern', 'maxi-blocks')}
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
			)}
		</>
	);
};

export default ToolbarColumnPattern;
