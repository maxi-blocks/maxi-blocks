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

/**
 * Text glyph constant for toolbar formatting buttons (big text)
 */
const TEXT_GLYPH = 'A₂'; // A₂ with subscript 2

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
	}, [getSuperscriptValue]);

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
				<span
					className='toolbar-item__text toolbar-item__text--big'
					aria-hidden='true'
				>
					{TEXT_GLYPH}
				</span>
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