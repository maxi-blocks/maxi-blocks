/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button, Icon, Tooltip } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import { handlers } from '../../../../icons';

/**
 * Column patterns
 *
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPattern = props => {
	const { blockName, className, toggleHandlers } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	const classes = classnames(
		'toolbar-item',
		'toolbar-item__button',
		className
	);

	return (
		<Fragment>
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
