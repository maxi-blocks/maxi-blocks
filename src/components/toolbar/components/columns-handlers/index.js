/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import { handlers } from '../../../../icons';

const ColumnsHandlers = props => {
	const { blockName, className, toggleHandlers } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	const classes = classnames(
		'toolbar-item',
		'toolbar-item__button',
		className
	);

	return (
		<Tooltip
			text={__('Columns Handlers', 'maxi-blocks')}
			position='bottom center'
		>
			<div>
				<Button className={classes} onClick={toggleHandlers}>
					<Icon className='toolbar-item__icon' icon={handlers} />
				</Button>
			</div>
		</Tooltip>
	);
};

export default ColumnsHandlers;
