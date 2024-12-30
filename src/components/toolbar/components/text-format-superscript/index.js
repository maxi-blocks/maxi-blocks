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
import { toolbarSuperScript } from '@maxi-icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const { onChangeFormat, getValue, tooltipsHide } = props;

	const getSuperscriptValue = () => getValue('vertical-align') || '';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		(getSuperscriptValue() === 'super' && true) || false
	);

	useEffect(() => {
		setIsActive((getSuperscriptValue() === 'super' && true) || false);
	});

	const superscriptContent = () => {
		return (
			<Button
				className='toolbar-item toolbar-item__superscript'
				onClick={() =>
					onChangeFormat({
						'vertical-align': isActive ? 'unset' : 'super',
					})
				}
				aria-pressed={isActive}
			>
				<Icon
					className='toolbar-item__icon'
					icon={toolbarSuperScript}
				/>
			</Button>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Superscript', 'maxi-blocks')} placement='top'>
				{superscriptContent()}
			</Tooltip>
		);
	return superscriptContent();
};

export default TextFormatSuperscript;
