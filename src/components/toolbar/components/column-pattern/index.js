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

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '../../../../icons';

const ToolbarColumnPattern = props => {
	const { clientId, blockName, rowPattern, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	const rowPatternObject = !isObject(rowPattern)
		? JSON.parse(rowPattern)
		: rowPattern;

	return (
		<Fragment>
			{rowPatternObject.general.rowPattern && (
				<ToolbarPopover
					className='toolbar-item__column-pattern'
					icon={toolbarColumnPattern}
					tooltip={__('Column pattern', 'maxi-blocks')}
					content={
						<div className='toolbar-item__column-pattern__popover'>
							<ColumnPattern
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
						</div>
					}
				/>
			)}
		</Fragment>
	);
};

export default ToolbarColumnPattern;
