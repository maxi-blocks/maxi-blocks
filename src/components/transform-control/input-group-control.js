/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';

/**
 * Component
 */
const InputGroupControl = ({ label, fields, values = {}, onChange }) => (
	<div className='maxi-transform-control__input-group'>
		{label && (
			<span className='maxi-transform-control__input-group__label'>
				{label}
			</span>
		)}
		{fields.map(
			({
				key,
				unitKey,
				label,
				defaultUnit = 'px',
				allowedUnits,
				min,
				max,
				step = 1,
				placeholder = '',
			}) => (
				<AdvancedNumberControl
					key={key}
					className='maxi-transform-control__input-group__item'
					label={label}
					value={values[key]}
					placeholder={placeholder}
					min={min}
					max={max}
					step={step}
					disableRange
					enableUnit={!!unitKey}
					unit={values[unitKey] ?? defaultUnit}
					allowedUnits={allowedUnits}
					onChangeUnit={unit =>
						onChange({
							...values,
							[unitKey]: unit,
						})
					}
					onChangeValue={value =>
						onChange({
							...values,
							[key]: value,
						})
					}
					onReset={() =>
						onChange({
							...values,
							[key]: undefined,
							...(unitKey && { [unitKey]: undefined }),
						})
					}
				/>
			)
		)}
	</div>
);

export default InputGroupControl;
