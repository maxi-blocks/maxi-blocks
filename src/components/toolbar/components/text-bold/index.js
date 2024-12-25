/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '@maxi-icons';

/**
 * TextBold
 */
const TextBold = props => {
	const { onChangeFormat, getValue, tooltipsHide } = props;

	const getBoldValue = () => getValue('font-weight');

	const [isActive, setIsActive] = useState(
		(getBoldValue() > 400 && true) || false
	);

	useEffect(() => {
		setIsActive(getBoldValue() > 400 || false);
	});

	const boldContent = () => {
		return (
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
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Bold', 'maxi-blocks')} placement='top'>
				{boldContent()}
			</Tooltip>
		);

	return boldContent();
};

export default TextBold;
