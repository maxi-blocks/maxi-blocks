/* eslint-disable no-unreachable */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */

import './editor.scss';
import { handlers } from '../../../../icons';

const ColumnsHandlers = props => {
	return null;

	const { blockName, className, toggleHandlers, tooltipsHide } = props;

	const [isActive, setActive] = useState(false);

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	const classes = classnames(
		'toolbar-item',
		'toolbar-item__button',
		'toolbar-item__columns-handler',
		className
	);

	const handlersContent = () => {
		return (
			<div>
				<Button
					className={classes}
					onClick={() => {
						toggleHandlers();
						setActive(!isActive);
					}}
					aria-pressed={isActive}
				>
					<Icon className='toolbar-item__icon' icon={handlers} />
				</Button>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip
				text={__('Columns Handlers', 'maxi-blocks')}
				position='top center'
			>
				{handlersContent()}
			</Tooltip>
		);
	return handlersContent();
};

export default ColumnsHandlers;
