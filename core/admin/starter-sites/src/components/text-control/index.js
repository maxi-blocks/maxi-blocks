/**
 * External dependencies
 */
import classnames from 'classnames';
import React, { useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import TextInput from '../text-input';

/**
 * Styles
 */
import './editor.scss';

// Create our own useInstanceId hook
const useInstanceId = (component, prefix = '') => {
	const instanceRef = useRef(0);
	return `${prefix}${++instanceRef.current}`;
};

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
	autocomplete,
	...props
}) {
	const instanceId = useInstanceId(TextControl, 'inspector-text-control-');
	const id = instanceId;

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
				autocomplete={autocomplete}
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
