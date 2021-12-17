/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Icon from '../icon';
import ButtonGroupControl from '../button-group-control';
import ScrollEffectUniqueControl from './scroll-effect-unique-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { scrollTypes } from '../../extensions/styles/defaults/scroll';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
import * as defaultShortcuts from './shortcuts';
import { applyEffect, removeEffect } from './scroll-effect-preview';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { capitalize, pickBy, cloneDeep } from 'lodash';

/**
 * Styles and icons
 */
import {
	motionHorizontal,
	motionVertical,
	motionFade,
	motionBlur,
	motionRotate,
	motionScale,
} from '../../icons';
import './editor.scss';

/**
 * Component
 */
const ScrollEffectsControl = props => {
	const { className, onChange, breakpoint = 'general', uniqueID } = props;

	const classes = classnames('maxi-scroll-effects-control', className);

	const getActiveEffects = () => {
		const response = [];
		scrollTypes.forEach(type => {
			if (props[`scroll-${type}-status-${breakpoint}`])
				response.push(type);
		});

		return response;
	};

	const firstActiveEffect = getActiveEffects()?.[0] || 'vertical';
	const [motionStatus, setMotionStatus] = useState(firstActiveEffect);

	const motionOptions = [
		{ label: <Icon icon={motionVertical} />, value: 'vertical' },
		{ label: <Icon icon={motionHorizontal} />, value: 'horizontal' },
		{ label: <Icon icon={motionRotate} />, value: 'rotate' },
		{ label: <Icon icon={motionScale} />, value: 'scale' },
		{ label: <Icon icon={motionFade} />, value: 'fade' },
		{ label: <Icon icon={motionBlur} />, value: 'blur' },
	];

	const easingOptions = [
		{
			label: __('Ease', 'maxi-blocks'),
			value: 'ease',
		},
		{
			label: __('Linear', 'maxi-blocks'),
			value: 'linear',
		},
		{
			label: __('Ease In', 'maxi-blocks'),
			value: 'ease-in',
		},
		{
			label: __('Ease Out', 'maxi-blocks'),
			value: 'ease-out',
		},
		{
			label: __('Ease In Out', 'maxi-blocks'),
			value: 'ease-in-out',
		},
	];

	const getShortcutEffect = type => {
		let response = {};
		switch (type) {
			case 'rotate':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Clockwise', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Counterclockwise', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('Test', 'maxi-blocks'),
						value: 0,
					},
				];
				break;

			default:
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Placeholder effect', 'maxi-blocks'),
						value: 'placeholder-effect',
					},
					{
						label: __('Another', 'maxi-blocks'),
						value: 'another',
					},
				];
				break;
		}

		return response;
	};

	const motionProps = pickBy(props, (val, key) => {
		return key.includes('scroll-');
	});

	const viewportOptions = [
		{
			label: __('Top of screen', 'maxi-blocks'),
			value: 'top',
		},
		{
			label: __('Middle of screen', 'maxi-blocks'),
			value: 'mid',
		},
		{
			label: __('Bottom of screen', 'maxi-blocks'),
			value: 'bottom',
		},
	];

	const globalShortcutsOptions = [
		{
			label: __('Choose', 'maxi-blocks'),
			value: 0,
		},
		{
			label: __('Rotate clockwise and Fade out', 'maxi-blocks'),
			value: 1,
		},
		{
			label: __('Disable all', 'maxi-blocks'),
			value: 2,
		},
		{
			label: __('Shortcut 3', 'maxi-blocks'),
			value: 3,
		},
		{
			label: __('Shortcut 4', 'maxi-blocks'),
			value: 4,
		},
	];

	const onChangeShortcut = (number, type) => {
		const newDefaultShortcuts = cloneDeep({ ...defaultShortcuts });

		if (type)
			onChange({
				...newDefaultShortcuts?.[type]?.[`shortcut${number}`],
			});
		else
			onChange({
				...newDefaultShortcuts?.[`shortcut${number}`],
			});
	};

	return (
		<div className={classes}>
			<SelectControl
				label={__('Shortcut effect', 'maxi-blocks')}
				onChange={val => onChange(onChangeShortcut(val))}
				options={globalShortcutsOptions}
			/>
			<ButtonGroupControl
				fullWidthMode
				selected={motionStatus}
				options={motionOptions}
				onChange={val => setMotionStatus(val)}
				activeTabs={getActiveEffects()}
			/>
			{scrollTypes.map(type => {
				const isPreviewEnabled = getLastBreakpointAttribute(
					`scroll-${type}-preview-status`,
					breakpoint,
					props
				);
				return (
					<div
						key={`maxi-scroll-effects-control-${type}-${breakpoint}`}
					>
						{motionStatus === type && (
							<ToggleSwitch
								// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
								label={__(
									`Use ${capitalize(type)} scroll effect`,
									'maxi-blocks'
								)}
								selected={getLastBreakpointAttribute(
									`scroll-${type}-status`,
									breakpoint,
									props
								)}
								onChange={val => {
									onChange({
										[`scroll-${type}-status-${breakpoint}`]:
											val,
									});
									val &&
										isPreviewEnabled &&
										applyEffect(type, uniqueID, 'Start');
									!val &&
										removeEffect(type, uniqueID) &&
										onChange({
											[`scroll-${type}-preview-status-general`]: false,
										});
								}}
							/>
						)}
						{motionStatus === type &&
							props[`scroll-${type}-status-${breakpoint}`] && (
								<>
									<SelectControl
										label={__(
											'Shortcut effect',
											'maxi-blocks'
										)}
										onChange={val =>
											onChange(
												onChangeShortcut(val, type)
											)
										}
										options={getShortcutEffect(type)}
									/>
									<SelectControl
										label={__(
											'Easing function',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`scroll-${type}-easing`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`scroll-${type}-easing-${breakpoint}`]:
													val,
											})
										}
										options={easingOptions}
									/>
									<AdvancedNumberControl
										label={__('Speed (ms)', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`scroll-${type}-speed`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`scroll-${type}-speed-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={10}
										max={1000}
										onReset={() =>
											onChange({
												[`scroll-${type}-speed-${breakpoint}`]:
													getDefaultAttribute(
														`scroll-${type}-speed-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`scroll-${type}-speed-general`
										)}
									/>
									<AdvancedNumberControl
										label={__('Delay (ms)', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`scroll-${type}-delay`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`scroll-${type}-delay-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={10}
										max={1000}
										onReset={() =>
											onChange({
												[`scroll-${type}-delay-${breakpoint}`]:
													getDefaultAttribute(
														`scroll-${type}-delay-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`scroll-${type}-delay-general`
										)}
									/>
									<SelectControl
										label={__(
											'Viewport entry',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`scroll-${type}-viewport-top`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`scroll-${type}-viewport-top-${breakpoint}`]:
													val,
											})
										}
										options={viewportOptions}
									/>
									<ToggleSwitch
										// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
										label={__(
											`Preview ${type} settings`,
											'maxi-block'
										)}
										selected={isPreviewEnabled}
										onChange={val => {
											onChange({
												[`scroll-${type}-preview-status-general`]:
													val,
											});
											val &&
												applyEffect(
													type,
													uniqueID,
													'Start'
												);
											!val &&
												removeEffect(type, uniqueID);
										}}
									/>
									<ScrollEffectUniqueControl
										label={__(
											`${capitalize(type)}`,
											'maxi-blocks'
										)}
										type={type}
										values={motionProps}
										onChange={value => onChange(value)}
										uniqueID={uniqueID}
										isPreviewEnabled={isPreviewEnabled}
									/>
									<ToggleSwitch
										label={__(
											'Reverse scroll playback',
											'maxi-blocks'
										)}
										selected={
											+getLastBreakpointAttribute(
												`scroll-${type}-status-reverse`,
												breakpoint,
												props
											)
										}
										onChange={val =>
											onChange({
												[`scroll-${type}-status-reverse-${breakpoint}`]:
													!!+val,
											})
										}
									/>
								</>
							)}
					</div>
				);
			})}
		</div>
	);
};

export default ScrollEffectsControl;
