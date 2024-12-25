/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import TextInput from '@components/text-input';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
export default function TextControl({
	label,
	hideLabelFromVision,
	value,
	help,
	className,
	onChange,
	type = 'text',
	validationText,
	isFullwidth,
	newStyle = false,
	showHelp,
	helpContent,
	autoComplete,
	...props
}) {
	const instanceId = useInstanceId(TextControl);
	const id = `inspector-text-control-${instanceId}`;

	const classes = classnames(
		'maxi-text-control',
		isFullwidth && ' maxi-text-control--fullwidth',
		newStyle && ' maxi-text-control__second-style',
		className
	);

	const [showHelpContent, setShowHelpContent] = useState(false);

	return (
		<BaseControl
			__nextHasNoMarginBottom
			label={label}
			hideLabelFromVision={hideLabelFromVision}
			id={id}
			help={help}
			className={classes}
		>
			{showHelp && (
				<div
					className='maxi-info__help-icon'
					onClick={() => setShowHelpContent(state => !state)}
				>
					<span className='maxi-info__help-icon-span'>i</span>
				</div>
			)}
			{showHelpContent && helpContent}
			<TextInput
				className='maxi-text-control__input'
				type={type}
				id={id}
				value={value || ''}
				onChange={onChange}
				aria-describedby={help ? `${id}__help` : undefined}
				autoComplete={autoComplete}
				{...props}
			/>
			{validationText && (
				<div className='maxi-text-control__validation-text'>
					{validationText}
				</div>
			)}
		</BaseControl>
	);
}
