/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

export default function TextareaControl({
	label,
	hideLabelFromVision,
	value,
	help,
	onChange,
	rows = 4,
	disableResize = false,
	className,
	...props
}) {
	const instanceId = useInstanceId(TextareaControl);
	const id = `inspector-textarea-control-${instanceId}`;
	const onChangeValue = event => onChange(event.target.value);

	return (
		<BaseControl
					__nextHasNoMarginBottom
			label={label}
			hideLabelFromVision={hideLabelFromVision}
			id={id}
			help={help}
			className={className}
		>
			<textarea
				className={classnames(
					'maxi-textarea-control__input',
					disableResize &&
						'maxi-textarea-control__input--disable-resize'
				)}
				id={id}
				rows={rows}
				onChange={onChangeValue}
				aria-describedby={help ? `${id}__help` : undefined}
				value={value}
				{...props}
			/>
		</BaseControl>
	);
}
