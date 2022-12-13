/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const TransitionControl = props => {
	const {
		onChange,
		className,
		breakpoint,
		getDefaultTransitionAttribute,
		transition,
	} = props;

	const classes = classnames('maxi-transition-control', className);

	const transitionStatus = getLastBreakpointAttribute({
		target: 'transition-status',
		attributes: transition,
		breakpoint,
	});

	const onChangeSwitch = value =>
		onChange({
			[`transition-status-${breakpoint}`]: !value,
		});

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Disable transition', 'maxi-blocks')}
				className='maxi-transition-control__toggle'
				selected={!transitionStatus}
				onChange={onChangeSwitch}
			/>
			{transitionStatus && (
				<>
					<AdvancedNumberControl
						label={__('Transition duration', 'maxi-blocks')}
						className='maxi-transition-control__duration'
						defaultValue={getDefaultTransitionAttribute(
							'transition-duration'
						)}
						value={getLastBreakpointAttribute({
							target: 'transition-duration',
							breakpoint,
							attributes: transition,
						})}
						onChangeValue={val => {
							onChange({
								[`transition-duration-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0.3}
						onReset={() =>
							onChange({
								[`transition-duration-${breakpoint}`]:
									getDefaultTransitionAttribute(
										'transition-duration'
									),
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Transition delay', 'maxi-blocks')}
						className='maxi-transition-control__delay'
						defaultValue={getDefaultTransitionAttribute(
							'transition-delay'
						)}
						value={getLastBreakpointAttribute({
							target: 'transition-delay',
							breakpoint,
							attributes: transition,
						})}
						onChangeValue={val => {
							onChange({
								[`transition-delay-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0}
						onReset={() =>
							onChange({
								[`transition-delay-${breakpoint}`]:
									getDefaultTransitionAttribute(
										'transition-delay'
									),
							})
						}
					/>
					<SelectControl
						label={__('Easing', 'maxi-blocks')}
						className='maxi-transition-control__easing'
						value={getLastBreakpointAttribute({
							target: 'easing',
							breakpoint,
							attributes: transition,
						})}
						defaultValue={getDefaultTransitionAttribute('easing')}
						options={[
							{ label: __('Ease', 'maxi-blocks'), value: 'ease' },
							{
								label: __('Ease-in', 'maxi-blocks'),
								value: 'ease-in',
							},
							{
								label: __('Ease-out', 'maxi-blocks'),
								value: 'ease-out',
							},
							{
								label: __('Ease-in-out', 'maxi-blocks'),
								value: 'ease-in-out',
							},
							{
								label: __('Linear', 'maxi-blocks'),
								value: 'linear',
							},
						]}
						onChange={val => {
							onChange({
								[`easing-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
					/>
				</>
			)}
		</div>
	);
};

export default TransitionControl;
