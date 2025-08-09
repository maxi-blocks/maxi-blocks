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
 * Styles
 */
import './editor.scss';

/**
 * Text glyph constant for toolbar formatting buttons
 */
const TEXT_GLYPH = 'I';

/**
 * TextItalic
 */
const TextItalic = props => {
	const { onChangeFormat, getValue, tooltipsHide } = props;

	const getItalicValue = () => getValue('font-style');

	const [isActive, setIsActive] = useState(
		(getItalicValue() > 400 && true) || false
	);

	useEffect(() => {
		setIsActive((getItalicValue() === 'italic' && true) || false);
	});

	const italicContent = () => {
		return (
			<Button
				className='toolbar-item toolbar-item__italic'
				onClick={() =>
					onChangeFormat({
						'font-style': isActive ? 'normal' : 'italic',
					})
				}
				aria-pressed={isActive}
			>
				<span
					className='toolbar-item__text toolbar-item__text--italic'
					aria-hidden='true'
				>
					{TEXT_GLYPH}
				</span>
			</Button>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Italic', 'maxi-blocks')} placement='top'>
				{italicContent()}
			</Tooltip>
		);
	return italicContent();
};

export default TextItalic;
