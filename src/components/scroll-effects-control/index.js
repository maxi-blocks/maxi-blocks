/* eslint-disable @wordpress/no-global-event-listener */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
// import { addMotion, removeMotion } from '../../extensions/motions/maxi-motions';
import * as defaultShortcuts from './shortcuts';

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
import { useState } from 'react';

/**
 * Component
 */
const ScrollEffectsControl = props => {
	const { className, onChange, breakpoint = 'general', uniqueID } = props;

	const classes = classnames('maxi-scroll-effects-control', className);

	const [motionStatus, setMotionStatus] = useState(
		getLastBreakpointAttribute('scroll-active', breakpoint, props) ||
			'vertical'
	);

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

	const getActiveEffects = () => {
		const response = [];
		scrollTypes.forEach(type => {
			if (props[`scroll-status-${type}-${breakpoint}`])
				response.push(type);
		});

		return response;
	};

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Enable live preview mode', 'maxi-block')}
				selected={props['scroll-preview-status']}
				onChange={val => {
					onChange({
						'scroll-preview-status': val,
					});
					if (val) {
						// removeMotion(uniqueID);
						// addMotion();
					} else {
						//	removeMotion(uniqueID);
					}
				}}
			/>
			<SelectControl
				label={__('Shortcut effect', 'maxi-blocks')}
				onChange={val => onChange(onChangeShortcut(val))}
				options={globalShortcutsOptions}
			/>
			<ButtonGroupControl
				fullWidthMode
				selected={motionStatus}
				options={motionOptions}
				onChange={val => {
					onChange({ [`scroll-active-${breakpoint}`]: val });
					setMotionStatus(val);
				}}
				active={getActiveEffects()}
			/>
			{scrollTypes.map(type => {
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
									`scroll-status-${type}`,
									breakpoint,
									props
								)}
								onChange={val =>
									onChange({
										[`scroll-status-${type}-${breakpoint}`]:
											val,
									})
								}
							/>
						)}
						{props[`scroll-active-${breakpoint}`] === type &&
							props[`scroll-status-${type}-${breakpoint}`] && (
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
											`scroll-easing-${type}`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`scroll-easing-${type}-${breakpoint}`]:
													val,
											})
										}
										options={easingOptions}
									/>
									<AdvancedNumberControl
										label={__('Speed', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`scroll-speed-${type}`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`scroll-speed-${type}-${breakpoint}`]:
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
												[`scroll-speed-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`scroll-speed-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`scroll-speed-${type}-general`
										)}
									/>
									<AdvancedNumberControl
										label={__('Delay', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`scroll-delay-${type}`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`scroll-delay-${type}-${breakpoint}`]:
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
												[`scroll-delay-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`scroll-delay-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`scroll-delay-${type}-general`
										)}
									/>
									<SelectControl
										label={__(
											'Viewport entry',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`scroll-viewport-top-${type}`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`scroll-viewport-top-${type}-${breakpoint}`]:
													val,
											})
										}
										options={viewportOptions}
									/>
									<ScrollEffectUniqueControl
										label={__(
											`${capitalize(type)}`,
											'maxi-blocks'
										)}
										type={type}
										values={motionProps}
										onChange={value => onChange(value)}
									/>
									<ToggleSwitch
										label={__(
											'Reverse scroll playback',
											'maxi-blocks'
										)}
										selected={
											+getLastBreakpointAttribute(
												`scroll-status-reverse-${type}`,
												breakpoint,
												props
											)
										}
										onChange={val =>
											onChange({
												[`scroll-status-reverse-${type}-${breakpoint}`]:
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
