/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { ColumnPattern } from '../../..';
import getGroupAttributes from '../../../../extensions/styles/getGroupAttributes';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '../../../../icons';

const ToolbarColumnPattern = props => {
	const { clientId, blockName, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	return (
		<Fragment>
			{props['row-pattern-general'] && (
				<ToolbarPopover
					className='toolbar-item__column-pattern'
					icon={toolbarColumnPattern}
					tooltip={__('Column pattern', 'maxi-blocks')}
					content={
						<div className='toolbar-item__column-pattern__popover'>
							<ColumnPattern
								clientId={clientId}
								blockName={blockName}
								{...getGroupAttributes(props, 'rowPattern')}
								onChange={rowPattern => {
									onChange(rowPattern);
								}}
								toolbar
								breakpoint={breakpoint}
								{...props}
							/>
						</div>
					}
				/>
			)}
		</Fragment>
	);
};

export default ToolbarColumnPattern;
