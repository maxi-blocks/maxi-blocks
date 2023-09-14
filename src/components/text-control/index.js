/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import TextInput from '../text-input';

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
	showHelp,
	helpContent,
	...props
}) {
	const instanceId = useInstanceId(TextControl);
	const id = `inspector-text-control-${instanceId}`;

	const classes = classnames(
		'maxi-text-control',
		isFullwidth && ' maxi-text-control--fullwidth',
		className
	);

	const [showHelpContent, setShowHelpContent] = useState(false);

	return (
		<BaseControl
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
