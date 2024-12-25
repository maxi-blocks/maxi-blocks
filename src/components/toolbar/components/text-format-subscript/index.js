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
import { toolbarSubScript } from '@maxi-icons';

/**
 * TextFormatSubscript
 */
const TextFormatSubscript = props => {
	const { onChangeFormat, getValue, tooltipsHide } = props;

	const getSuperscriptValue = () => getValue('vertical-align') || '';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		(getSuperscriptValue() === 'sub' && true) || false
	);

	useEffect(() => {
		setIsActive((getSuperscriptValue() === 'sub' && true) || false);
	});

	const subscriptContent = () => {
		return (
			<Button
				className='toolbar-item toolbar-item__subscript'
				onClick={() =>
					onChangeFormat({
						'vertical-align': isActive ? 'unset' : 'sub',
					})
				}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarSubScript} />
			</Button>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Subscript', 'maxi-blocks')} placement='top'>
				{subscriptContent()}
			</Tooltip>
		);
	return subscriptContent();
};

export default TextFormatSubscript;
