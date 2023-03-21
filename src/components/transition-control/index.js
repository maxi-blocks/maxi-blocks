/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import {
	getAttributeKey,
	getAttributesValue,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import withRTC from '../../extensions/maxi-block/withRTC';

/**
 * External dependencies
 */
import { cloneDeep, omitBy } from 'lodash';
import classnames from 'classnames';

/**
 * Component
 */
const TransitionControl = props => {
	const { breakpoint, className, onChange, getDefaultTransitionAttribute } =
		props;
	const transitionRaw = getAttributesValue({
		target: 'transition',
		props,
	});

	const [splitMode, setSplitMode] = useState('in');

	const transition = splitMode === 'out' ? transitionRaw?.out : transitionRaw;

	const { split: transitionSplit, 'transition-status': transitionStatus } =
		getLastBreakpointAttribute({
			target: ['split', 'transition-status'],
			attributes: transitionRaw,
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
								[getAttributeKey(
									'transition-duration',
									false,
									false,
									breakpoint
								)]: val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0.3}
						onReset={() =>
							handleChange({
								[getAttributeKey(
									'transition-duration',
									false,
									false,
									breakpoint
								)]: getDefaultTransitionAttribute(
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
								[getAttributeKey(
									'transition-delay',
									false,
									false,
									breakpoint
								)]: val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0}
						onReset={() =>
							handleChange({
								[getAttributeKey(
									'transition-delay',
									false,
									false,
									breakpoint
								)]:
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
							handleChange({
								[getAttributeKey(
									'easing',
									false,
									false,
									breakpoint
								)]: val !== undefined && val !== '' ? val : '',
							});
						}}
						onReset={() =>
							handleChange({
								[getAttributeKey(
									'easing',
									false,
									false,
									breakpoint
								)]: getDefaultTransitionAttribute('easing'),
							})
						}
					/>
				</>
			)}
		</div>
	);
};

export default withRTC(TransitionControl);
