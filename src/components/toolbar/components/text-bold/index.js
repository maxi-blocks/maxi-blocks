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
const TEXT_GLYPH = 'B';

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
				<span
					className='toolbar-item__text toolbar-item__text--bold'
					aria-hidden='true'
				>
					{TEXT_GLYPH}
				</span>
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
