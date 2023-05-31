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
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
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
	const {
		breakpoint,
		className,
		onChange,
		getDefaultTransitionAttribute,
		transition: transitionRaw,
	} = props;

	const [splitMode, setSplitMode] = useState('in');

	const transition = splitMode === 'out' ? transitionRaw?.out : transitionRaw;

	const transitionSplit = getLastBreakpointAttribute({
		target: '_spl',
		attributes: transitionRaw,
		breakpoint,
	});
	const transitionStatus = getLastBreakpointAttribute({
		target: '_ts',
		attributes: transition,
		breakpoint,
	});

	const classes = classnames('maxi-transition-control', className);

	const handleChange = obj => onChange(obj, splitMode);

	const handleChangeSplit = value => {
		setSplitMode('in');
		onChange({
			[`_spl-${breakpoint}`]: value,
			...(!transition?.out
				? {
						out: omitBy(
							cloneDeep(transition),
							(_value, key) =>
								key.includes('_spl-') ||
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
			[`_ts-${breakpoint}`]: !value,
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
						defaultValue={getDefaultTransitionAttribute('_tdu')}
						value={getLastBreakpointAttribute({
							target: '_tdu',
							breakpoint,
							attributes: transition,
						})}
						onChangeValue={val => {
							handleChange({
								[getAttributeKey({
									key: '_tdu',
									breakpoint,
								})]: val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0.3}
						onReset={() =>
							handleChange({
								[getAttributeKey({
									key: '_tdu',
									breakpoint,
								})]: getDefaultTransitionAttribute('_tdu'),
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Transition delay', 'maxi-blocks')}
						className='maxi-transition-control__delay'
						defaultValue={getDefaultTransitionAttribute('_tde')}
						value={getLastBreakpointAttribute({
							target: '_tde',
							breakpoint,
							attributes: transition,
						})}
						onChangeValue={val => {
							handleChange({
								[getAttributeKey({
									key: '_tde',
									breakpoint,
								})]: val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						max={5}
						step={0.1}
						initial={0}
						onReset={() =>
							handleChange({
								[getAttributeKey({
									key: '_tde',
									breakpoint,
								})]: getDefaultTransitionAttribute('_tde'),
							})
						}
					/>
					<SelectControl
						label={__('Easing', 'maxi-blocks')}
						className='maxi-transition-control__easing'
						value={getLastBreakpointAttribute({
							target: '_ea',
							breakpoint,
							attributes: transition,
						})}
						defaultValue={getDefaultTransitionAttribute('_ea')}
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
								[getAttributeKey({
									key: '_ea',
									breakpoint,
								})]: val !== undefined && val !== '' ? val : '',
							});
						}}
						onReset={() =>
							handleChange({
								[getAttributeKey({
									key: '_ea',
									breakpoint,
								})]: getDefaultTransitionAttribute('_ea'),
							})
						}
					/>
				</>
			)}
		</div>
	);
};

export default withRTC(TransitionControl);
