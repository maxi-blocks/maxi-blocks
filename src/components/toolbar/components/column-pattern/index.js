/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button, Icon, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { __experimentalColumnPattern } from '../../..';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import { handlers, toolbarColumnPattern } from '../../../../icons';

/**
 * Column patterns
 *
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPattern = props => {
	const {
		clientId,
		blockName,
		rowPattern,
		onChange,
		breakpoint,
		className,
		toggleHandlers,
	} = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	const classes = classnames(
		'toolbar-item',
		'toolbar-item__button',
		className
	);

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
			<Tooltip text={__('Columns Handlers', 'maxi-blocks')}>
				<div>
					<Button className={classes} onClick={toggleHandlers}>
						<Icon className='toolbar-item__icon' icon={handlers} />
					</Button>
				</div>
			</Tooltip>
		</Fragment>
	);
};

export default ColumnPattern;
