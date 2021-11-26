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
import MotionUniqueControl from './motion-unique-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { motionTypes } from '../../extensions/styles/defaults/motion';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
import { addMotion, removeMotion } from '../../extensions/motions/maxi-motions';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { capitalize, pickBy } from 'lodash';

/**
 * Styles and icons
 */
import {
	styleNone,
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
const MotionControl = props => {
	const { className, onChange, breakpoint = 'general', uniqueID } = props;

	const classes = classnames('maxi-motion-control', className);

	const [motionStatus, setMotionStatus] = useState(
		getLastBreakpointAttribute('motion-active', breakpoint, props) || 'none'
	);

	const motionOptions = [
		{ label: <Icon icon={styleNone} />, value: 'none' },
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
						label: __('Sun effect', 'maxi-blocks'),
						value: 'sun-effect',
					},
					{
						label: __('Clockwise', 'maxi-blocks'),
						value: 'clockwise',
					},
					{
						label: __('Counterclockwise', 'maxi-blocks'),
						value: 'counterclockwise',
					},
				];
				break;

			default:
				response = [
					{
						label: __('Placeholder effect', 'maxi-blocks'),
						value: 'placeholder-effect',
					},
					{
						label: __('another', 'maxi-blocks'),
						value: 'another',
					},
				];
				break;
		}

		return response;
	};

	const motionProps = pickBy(props, (val, key) => {
		return key.includes('motion-');
	});

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Enable live preview mode', 'maxi-block')}
				selected={props['motion-preview-status']}
				onChange={val => {
					onChange({
						'motion-preview-status': val,
					});
					// console.log(`val: ${val}`);
					// console.log(`currentMotion on change: ${currentMotion}`);
					// setCurrentMotion(val);
					// console.log(`currentMotion after change: ${currentMotion}`);
					if (val) {
						removeMotion(uniqueID);
						addMotion();
					} else {
						removeMotion(uniqueID);
					}
				}}
			/>
			<ButtonGroupControl
				fullWidthMode
				selected={motionStatus}
				options={motionOptions}
				onChange={val => {
					onChange({ [`motion-active-${breakpoint}`]: val });
					setMotionStatus(val);
				}}
			/>
			{motionTypes.map(type => {
				const typeCapitalize =
					type.charAt(0).toUpperCase() + type.slice(1);

				return (
					<div key={`maxi-motion-control-${type}-${breakpoint}`}>
						{motionStatus === type && (
							<ToggleSwitch
								// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
								label={__(
									`Use ${typeCapitalize} scroll effect`,
									'maxi-blocks'
								)}
								selected={getLastBreakpointAttribute(
									`motion-status-${type}`,
									breakpoint,
									props
								)}
								onChange={val =>
									onChange({
										[`motion-status-${type}-${breakpoint}`]:
											val,
									})
								}
							/>
						)}
						{props[`motion-active-${breakpoint}`] === type &&
							props[`motion-status-${type}-${breakpoint}`] && (
								<>
									<SelectControl
										label={__(
											'Shortcut effect',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`motion-shortcut-${type}`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`motion-shortcut-${type}-${breakpoint}`]:
													val,
											})
										}
										options={getShortcutEffect(type)}
									/>
									<SelectControl
										label={__(
											'Easing function',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`motion-easing-${type}`,
											breakpoint,
											props
										)}
										onChange={val =>
											onChange({
												[`motion-easing-${type}-${breakpoint}`]:
													val,
											})
										}
										options={easingOptions}
									/>
									<AdvancedNumberControl
										label={__('Speed', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`motion-speed-${type}`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`motion-speed-${type}-${breakpoint}`]:
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
												[`motion-speed-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`motion-speed-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`motion-speed-${type}-general`
										)}
									/>
									<AdvancedNumberControl
										label={__('Delay', 'maxi-blocks')}
										value={getLastBreakpointAttribute(
											`motion-delay-${type}`,
											breakpoint,
											props
										)}
										onChangeValue={val => {
											onChange({
												[`motion-delay-${type}-${breakpoint}`]:
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
												[`motion-delay-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`motion-delay-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`motion-delay-${type}-general`
										)}
									/>
									<MotionUniqueControl
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
												`motion-status-reverse-${type}`,
												breakpoint,
												props
											)
										}
										onChange={val =>
											onChange({
												[`motion-status-reverse-${type}-${breakpoint}`]:
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

export default MotionControl;
