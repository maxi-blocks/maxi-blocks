/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

/**
 * Styles
 */
import './editor.scss';

export default function SelectControl({
	help,
	label,
	multiple = false,
	onChange,
	options = [],
	className,
	hideLabelFromVision,
	...props
}) {
	const instanceId = useInstanceId(SelectControl);
	const id = `inspector-select-control-${instanceId}`;
	const onChangeValue = event => {
		if (multiple) {
			const selectedOptions = [...event.target.options].filter(
				({ selected }) => selected
			);
			const newValues = selectedOptions.map(({ value }) => value);
			onChange(newValues);
			return;
		}
		onChange(event.target.value);
	};

	return (
		!isEmpty(options) && (
			<BaseControl
				label={label}
				hideLabelFromVision={hideLabelFromVision}
				id={id}
				help={help}
				className={className}
			>
				<select
					id={id}
					className='maxi-select-control__input'
					onChange={onChangeValue}
					aria-describedby={help ? `${id}__help` : undefined}
					multiple={multiple}
					{...props}
				>
					{options.map((option, index) => (
						<option
							// eslint-disable-next-line react/no-array-index-key
							key={`${option.label}-${option.value}-${index}`}
							value={option.value}
							disabled={option.disabled}
							className={option.className}
						>
							{option.label}
						</option>
					))}
				</select>
			</BaseControl>
		)
	);
}
