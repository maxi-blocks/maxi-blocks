/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ToggleSwitch from '@components/toggle-switch';
import { getLastBreakpointAttribute } from '@extensions/styles';
import withRTC from '@extensions/maxi-block/withRTC';

/**
 * External dependencies
 */
import { cloneDeep, omitBy } from 'lodash';
import classnames from 'classnames';

/**
 * Component
 */
const TransitionControl = props => {
	const {
		transition: transitionRaw,
		breakpoint,
		className,
		onChange,
		getDefaultTransitionAttribute,
	} = props;

	const [splitMode, setSplitMode] = useState('in');

	const transition = splitMode === 'out' ? transitionRaw?.out : transitionRaw;

	const transitionSplit = getLastBreakpointAttribute({
		target: 'split',
		attributes: transitionRaw,
		breakpoint,
	});

	const transitionStatus = getLastBreakpointAttribute({
		target: 'transition-status',
		attributes: transition,
		breakpoint,
	});

	const classes = classnames('maxi-transition-control', className);

	const handleChange = obj => onChange(obj, splitMode);

	const handleChangeSplit = value => {
		setSplitMode('in');
		onChange({
			[`split-${breakpoint}`]: value,
			...(!transition?.out
				? {
						out: omitBy(
							cloneDeep(transition),
							(_value, key) =>
								key.includes('split-') ||
								[
									'hoverStatus',
									'transitionTarget',
									'transitionTrigger',
								].some(item => item === key)
						),
				  }
				: {}),
		});
	};

	const handleChangeSwitch = value =>
		handleChange({
			[`transition-status-${breakpoint}`]: !value,
		});

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Split in/out transitions', 'maxi-blocks')}
				selected={transitionSplit}
				onChange={handleChangeSplit}
			/>
			{transitionSplit && (
				<SettingTabsControl
					type='buttons'
					selected={splitMode}
					items={[
						{
							label: __('In', 'maxi-blocks'),
							value: 'in',
						},
						{
							label: __('Out', 'maxi-blocks'),
							value: 'out',
						},
					]}
					fullWidthMode
					className='maxi-default-styles-control'
					onChange={val => setSplitMode(val)}
				/>
			)}
			<ToggleSwitch
				label={__('Disable transition', 'maxi-blocks')}
				className='maxi-transition-control__toggle'
				selected={!transitionStatus}
				onChange={handleChangeSwitch}
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
							handleChange({
								[`transition-duration-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0.3}
						onReset={() =>
							handleChange({
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
							handleChange({
								[`transition-delay-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0}
						onReset={() =>
							handleChange({
								[`transition-delay-${breakpoint}`]:
									getDefaultTransitionAttribute(
										'transition-delay'
									),
							})
						}
					/>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Easing', 'maxi-blocks')}
						className='maxi-transition-control__easing'
						value={getLastBreakpointAttribute({
							target: 'easing',
							breakpoint,
							attributes: transition,
						})}
						defaultValue={getDefaultTransitionAttribute('easing')}
						newStyle
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
							handleChange({
								[`easing-${breakpoint}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						onReset={() =>
							handleChange({
								[`easing-${breakpoint}`]:
									getDefaultTransitionAttribute('easing'),
							})
						}
					/>
				</>
			)}
		</div>
	);
};

export default withRTC(TransitionControl);
