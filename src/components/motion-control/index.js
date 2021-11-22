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
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
// import RangeSliderControl from '../range-slider-control';
import ToggleSwitch from '../toggle-switch';
import { addMotion, removeMotion } from '../../extensions/motions/maxi-motions';

/**
 * External dependencies
 */
import classnames from 'classnames';

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

	const motionTypes = [
		'vertical',
		'horizontal',
		'rotate',
		'scale',
		'fade',
		'blur',
	];

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
									{/* <RangeSliderControl
										label={__('Viewport', 'maxi-blocks')}
										type='viewport'
										step={1}
										min={0}
										max={100}
										values={[
											getLastBreakpointAttribute(
												`motion-viewport-bottom-${type}`,
												breakpoint,
												props
											),
											getLastBreakpointAttribute(
												`motion-viewport-middle-${type}`,
												breakpoint,
												props
											),
											getLastBreakpointAttribute(
												`motion-viewport-top-${type}`,
												breakpoint,
												props
											),
										]}
										onChange={values =>
											onChange({
												[`motion-viewport-bottom-${type}-${breakpoint}`]:
													values[0],
												[`motion-viewport-middle-${type}-${breakpoint}`]:
													values[1],
												[`motion-viewport-top-${type}-${breakpoint}`]:
													values[2],
											})
										}
									/> */}
									{(type === 'vertical' ||
										type === 'horizontal') && (
										<MotionUniqueControl
											label={__('Offset', 'maxi-blocks')}
											type='offset'
											step={1}
											values={[
												getLastBreakpointAttribute(
													`motion-offset-start-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-offset-middle-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-offset-end-${type}`,
													breakpoint,
													props
												),
											]}
											defaultValues={[
												getDefaultAttribute(
													`motion-offset-start-${type}-general`
												),
												getDefaultAttribute(
													`motion-offset-middle-${type}-general`
												),
												getDefaultAttribute(
													`motion-offset-end-${type}-general`
												),
											]}
											onChange={values =>
												onChange({
													[`motion-offset-start-${type}-${breakpoint}`]:
														values[0],
													[`motion-offset-middle-${type}-${breakpoint}`]:
														values[1],
													[`motion-offset-end-${type}-${breakpoint}`]:
														values[2],
												})
											}
										/>
									)}
									{type === 'rotate' && (
										<MotionUniqueControl
											label={__('Rotate', 'maxi-blocks')}
											type='rotate'
											step={1}
											values={[
												getLastBreakpointAttribute(
													`motion-rotate-start-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-rotate-middle-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-rotate-end-${type}`,
													breakpoint,
													props
												),
											]}
											defaultValues={[
												getDefaultAttribute(
													`motion-rotate-start-${type}-general`
												),
												getDefaultAttribute(
													`motion-rotate-middle-${type}-general`
												),
												getDefaultAttribute(
													`motion-rotate-end-${type}-general`
												),
											]}
											onChange={values =>
												onChange({
													[`motion-rotate-start-${type}-${breakpoint}`]:
														values[0],
													[`motion-rotate-middle-${type}-${breakpoint}`]:
														values[1],
													[`motion-rotate-end-${type}-${breakpoint}`]:
														values[2],
												})
											}
										/>
									)}
									{type === 'scale' && (
										<MotionUniqueControl
											label={__('Scale', 'maxi-blocks')}
											type='scale'
											step={1}
											values={[
												getLastBreakpointAttribute(
													`motion-scale-start-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-scale-middle-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-scale-end-${type}`,
													breakpoint,
													props
												),
											]}
											defaultValues={[
												getDefaultAttribute(
													`motion-scale-start-${type}-general`
												),
												getDefaultAttribute(
													`motion-scale-middle-${type}-general`
												),
												getDefaultAttribute(
													`motion-scale-end-${type}-general`
												),
											]}
											onChange={values =>
												onChange({
													[`motion-scale-start-${type}-${breakpoint}`]:
														values[0],
													[`motion-scale-middle-${type}-${breakpoint}`]:
														values[1],
													[`motion-scale-end-${type}-${breakpoint}`]:
														values[2],
												})
											}
										/>
									)}
									{type === 'fade' && (
										<MotionUniqueControl
											label={__('Fade', 'maxi-blocks')}
											type='fade'
											step={1}
											values={[
												getLastBreakpointAttribute(
													`motion-opacity-start-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-opacity-middle-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-opacity-end-${type}`,
													breakpoint,
													props
												),
											]}
											defaultValues={[
												getDefaultAttribute(
													`motion-opacity-start-${type}-general`
												),
												getDefaultAttribute(
													`motion-opacity-middle-${type}-general`
												),
												getDefaultAttribute(
													`motion-opacity-end-${type}-general`
												),
											]}
											onChange={values =>
												onChange({
													[`motion-opacity-start-${type}-${breakpoint}`]:
														values[0],
													[`motion-opacity-middle-${type}-${breakpoint}`]:
														values[1],
													[`motion-opacity-end-${type}-${breakpoint}`]:
														values[2],
												})
											}
										/>
									)}
									{type === 'blur' && (
										<MotionUniqueControl
											label={__('Blur', 'maxi-blocks')}
											type='blur'
											step={1}
											values={[
												getLastBreakpointAttribute(
													`motion-blur-start-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-blur-middle-${type}`,
													breakpoint,
													props
												),
												getLastBreakpointAttribute(
													`motion-blur-end-${type}`,
													breakpoint,
													props
												),
											]}
											defaultValues={[
												getDefaultAttribute(
													`motion-blur-start-${type}-general`
												),
												getDefaultAttribute(
													`motion-blur-middle-${type}-general`
												),
												getDefaultAttribute(
													`motion-blur-end-${type}-general`
												),
											]}
											onChange={values =>
												onChange({
													[`motion-blur-start-${type}-${breakpoint}`]:
														values[0],
													[`motion-blur-middle-${type}-${breakpoint}`]:
														values[1],
													[`motion-blur-end-${type}-${breakpoint}`]:
														values[2],
												})
											}
										/>
									)}
									<ToggleSwitch
										label={__(
											'Enable reverse animation',
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
