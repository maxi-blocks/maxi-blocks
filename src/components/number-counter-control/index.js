/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FancyRadioControl, SizeControl } from '../';
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
		</div>
	);
};

export default NumberCounterControl;
