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
 * Text glyph constant for toolbar formatting buttons (small text)
 */
const TEXT_GLYPH = 'Aa'; // small text indicator

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
	}, [getSuperscriptValue]);

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
				<span
					className='toolbar-item__text toolbar-item__text--small'
					aria-hidden='true'
				>
					{TEXT_GLYPH}
				</span>
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
