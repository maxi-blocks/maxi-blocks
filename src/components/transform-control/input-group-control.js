/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';

/**
 * Maps a {min, max} pair onto the per-unit shape AdvancedNumberControl expects.
 * minRange/maxRange are mirrored from min/max so the range slider spans the full
 * configured range instead of the component's narrower defaults.
 */
const toLimits = ({ min, max }) => ({
	...(min !== undefined && { min, minRange: min }),
	...(max !== undefined && { max, maxRange: max }),
});

/**
 * Builds a minMaxSettings object so unit-enabled fields honour the provided
 * limits. AdvancedNumberControl ignores the min/max props while enableUnit is
 * true and relies on its per-unit minMaxSettings instead, so we map limits onto
 * every allowed unit (plus the unitless '-' key).
 *
 * A field may pass `unitRanges` to give each unit its own min/max — e.g.
 * translate may allow ±5000px but only ±100% — and any unit missing from that
 * map falls back to the flat min/max.
 */
const getMinMaxSettings = ({ min, max, allowedUnits, unitRanges }) => {
	if (min === undefined && max === undefined && !unitRanges) return undefined;

	const fallback = toLimits({ min, max });

	return [...(allowedUnits ?? []), '-'].reduce((acc, unit) => {
		acc[unit] = unitRanges?.[unit]
			? toLimits(unitRanges[unit])
			: fallback;
		return acc;
	}, {});
};

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
				unitRanges,
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
					enableUnit={!!unitKey}
					unit={values[unitKey] ?? defaultUnit}
					allowedUnits={allowedUnits}
					minMaxSettings={
						unitKey
							? getMinMaxSettings({
									min,
									max,
									allowedUnits,
									unitRanges,
							  })
							: undefined
					}
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
