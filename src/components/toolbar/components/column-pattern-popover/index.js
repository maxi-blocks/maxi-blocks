/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { __experimentalColumnPattern } from '../../../';

/**
 * External dependencies
 */

/**
 * Styles and icons
 */
import { toolbarColumnPattern } from '../../../../icons';

/**
 * Column patterns
 *
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPatterns = props => {
	const { clientId, blockName, rowPattern, onChange, breakpoint } = props;

	return (
		<ToolbarPopover
			className='toolbar-item__column-pattern'
			icon={toolbarColumnPattern}
			tooltip={__('Column pattern', 'maxi-blocks')}
			content={
				<__experimentalColumnPattern
					clientId={clientId}
					blockName={blockName}
					rowPattern={rowPattern}
					onChange={rowPattern => {
						onChange(rowPattern);
					}}
					toolbar
					breakpoint={breakpoint}
				/>
			}
		/>
	);
};

export default ColumnPatterns;
