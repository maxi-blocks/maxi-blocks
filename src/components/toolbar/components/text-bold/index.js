/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '../../../../icons';

/**
 * TextBold
 */
const TextBold = props => {
	const { onChangeFormat, getValue } = props;

	const getBoldValue = () => getValue('font-weight');

	const [isActive, setIsActive] = useState(
		(getBoldValue() > 400 && true) || false
	);

	useEffect(() => {
		setIsActive(getBoldValue() > 400 || false);
	});

	return (
		<Tooltip text={__('Bold', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__bold'
				onClick={() =>
					onChangeFormat({
						'font-weight': (isActive && 400) || 700,
					})
				}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarBold} />
			</Button>
		</Tooltip>
	);
};

export default TextBold;
