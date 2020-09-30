/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { __experimentalColumnPattern } from '../../..';

/**
 * Styles and icons
 */
import { toolbarColumnPattern } from '../../../../icons';

/**
 * Column patterns
 *
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPattern = props => {
	const { clientId, blockName, rowPattern, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	return (
		<Fragment>
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
						{...props}
					/>
				}
			/>
		</Fragment>
	);
};

export default ColumnPattern;
