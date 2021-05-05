/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FancyRadioControl, SizeControl, ColorControl } from '../';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const NumberCounterControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-number-counter-control', className);

	return (
		<div className={classes}>
			<SizeControl
				label={__('Start Number', 'maxi-blocks')}
				disableUnit
				min={0}
				max={100}
				initial={0}
				step={1}
				value={props['number-counter-start']}
				onChangeValue={val => onChange({ 'number-counter-start': val })}
				onReset={() =>
					onChange({
						'number-counter-start': getDefaultAttribute(
							'number-counter-start'
						),
					})
				}
			/>
			<SizeControl
				label={__('End Number', 'maxi-blocks')}
				disableUnit
				min={1}
				max={100}
				initial={100}
				step={1}
				value={props['number-counter-end']}
				onChangeValue={val => onChange({ 'number-counter-end': val })}
				onReset={() =>
					onChange({
						'number-counter-end': getDefaultAttribute(
							'number-counter-end'
						),
					})
				}
			/>
			<SizeControl
				label={__('Duration (ms)', 'maxi-blocks')}
				disableUnit
				min={1}
				max={10000}
				initial={1}
				step={1}
				value={props['number-counter-duration']}
				onChangeValue={val =>
					onChange({ 'number-counter-duration': val })
				}
				onReset={() =>
					onChange({
						'number-counter-duration': getDefaultAttribute(
							'number-counter-duration'
						),
					})
				}
			/>
			<SizeControl
				label={__('Radius', 'maxi-blocks')}
				disableUnit
				min={1}
				max={999}
				initial={85}
				step={1}
				value={props['number-counter-radius']}
				onChangeValue={val =>
					onChange({ 'number-counter-radius': val })
				}
				onReset={() =>
					onChange({
						'number-counter-radius': getDefaultAttribute(
							'number-counter-radius'
						),
					})
				}
			/>
			<SizeControl
				label={__('Stroke', 'maxi-blocks')}
				disableUnit
				min={1}
				max={99}
				initial={8}
				step={1}
				value={props['number-counter-stroke']}
				onChangeValue={val =>
					onChange({ 'number-counter-stroke': val })
				}
				onReset={() =>
					onChange({
						'number-counter-stroke': getDefaultAttribute(
							'number-counter-stroke'
						),
					})
				}
			/>
			<FancyRadioControl
				label={__('Show Percentage Sign', 'maxi-block')}
				selected={props['number-counter-percentage-sign-status']}
				options={[
					{ label: __('No', 'maxi-block'), value: 0 },
					{ label: __('Yes', 'maxi-block'), value: 1 },
				]}
				onChange={val =>
					onChange({ 'number-counter-percentage-sign-status': val })
				}
			/>
			<FancyRadioControl
				label={__('Rounded Bar', 'maxi-block')}
				selected={props['number-counter-rounded-status']}
				options={[
					{ label: __('No', 'maxi-block'), value: 0 },
					{ label: __('Yes', 'maxi-block'), value: 1 },
				]}
				onChange={val =>
					onChange({ 'number-counter-rounded-status': val })
				}
			/>
			<FancyRadioControl
				label={__('Hide Circle', 'maxi-block')}
				selected={props['number-counter-circle-status']}
				options={[
					{ label: __('No', 'maxi-block'), value: 0 },
					{ label: __('Yes', 'maxi-block'), value: 1 },
				]}
				onChange={val =>
					onChange({ 'number-counter-circle-status': val })
				}
			/>
			<hr />
			<ColorControl
				label={__('Text', 'maxi-blocks')}
				color={props['number-counter-text-color']}
				defaultColor={getDefaultAttribute('number-counter-text-color')}
				onChange={val => onChange({ 'number-counter-text-color': val })}
			/>
			<ColorControl
				label={__('Circle Background', 'maxi-blocks')}
				color={props['number-counter-circle-background-color']}
				defaultColor={getDefaultAttribute(
					'number-counter-circle-background-color'
				)}
				onChange={val =>
					onChange({ 'number-counter-circle-background-color': val })
				}
			/>
			<ColorControl
				label={__('Circle Bar', 'maxi-blocks')}
				color={props['number-counter-circle-bar-color']}
				defaultColor={getDefaultAttribute(
					'number-counter-circle-bar-color'
				)}
				onChange={val =>
					onChange({ 'number-counter-circle-bar-color': val })
				}
			/>
		</div>
	);
};

export default NumberCounterControl;
