/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * External dependencies
 */
import { isEmpty, isPlainObject } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import ResetButton from '../reset-control';

/**
 * Styles
 */
import './editor.scss';

export default function SelectControl({
	help,
	label,
	multiple = false,
	onChange,
	onReset,
	options = [],
	className,
	hideLabelFromVision,
	defaultValue,
	value,
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

	const getOptions = options =>
		options.map((option, index) => (
			<option
				// eslint-disable-next-line react/no-array-index-key
				key={`${option.label}-${option.value}-${index}`}
				value={option.value}
				disabled={option.disabled}
				className={option.className}
			>
				{option.label}
			</option>
		));

	const classes = classnames('maxi-select-control', className);

	return (
		!isEmpty(options) && (
			<BaseControl
				label={label}
				hideLabelFromVision={hideLabelFromVision}
				id={id}
				help={help}
				className={classes}
			>
				<select
					id={id}
					className='maxi-select-control__input'
					value={value ?? defaultValue ?? options[0].value}
					onChange={onChangeValue}
					aria-describedby={help ? `${id}__help` : undefined}
					multiple={multiple}
					{...props}
				>
					{isPlainObject(options)
						? Object.entries(options).map(
								([groupLabel, groupOptions]) =>
									groupLabel !== '' ? (
										<optgroup
											key={groupLabel}
											label={groupLabel}
											className='maxi-select-control__optgroup'
										>
											{getOptions(groupOptions)}
										</optgroup>
									) : (
										getOptions(groupOptions)
									)
						  )
						: getOptions(options)}
				</select>
				{onReset && <ResetButton onReset={() => onReset()} />}
			</BaseControl>
		)
	);
}
