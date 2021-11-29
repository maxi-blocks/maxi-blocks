/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

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
	...props
}) {
	const instanceId = useInstanceId(TextControl);
	const id = `inspector-text-control-${instanceId}`;
	const onChangeValue = event => onChange(event.target.value);

	const classes = classnames(
		'maxi-text-control',
		isFullwidth && ' maxi-text-control--fullwidth',
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
			<input
				className='maxi-text-control__input'
				type={type}
				id={id}
				value={value}
				onChange={onChangeValue}
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
