/**
 * WordPress dependencies
 */
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
	newStyle = false,
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

	return (
		<BaseControl
			label={label}
			hideLabelFromVision={hideLabelFromVision}
			id={id}
			help={help}
			className={classes}
		>
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
