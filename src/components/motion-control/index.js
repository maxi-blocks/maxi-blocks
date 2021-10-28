/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RadioControl from '../radio-control';
import Icon from '../icon';
import MotionUniqueControl from './motion-unique-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import RangeSliderControl from '../range-slider-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
// import { isEmpty, round } from 'lodash';
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
	const { className, onChange, breakpoint = 'general' } = props;

	const motionTypes = [
		'vertical',
		'horizontal',
		'rotate',
		'scale',
		'fade',
		'blur',
	];

	const classes = classnames('maxi-motion-control', className);
	// const [presetLoad, setPresetLoad] = useState('');

	const [motionStatus, setMotionStatus] = useState(
		getLastBreakpointAttribute('motion-active', breakpoint, props) || 'none'
	);

	// console.log(`motionStatus ${motionStatus}`);

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

	const getDirectionOptions = type => {
		const directionVerticalOptions = [
			{
				label: __('Scroll Up', 'maxi-blocks'),
				value: 'up',
			},
			{
				label: __('Scroll Down', 'maxi-blocks'),
				value: 'down',
			},
		];

		const directionHorizontalOptions = [
			{
				label: __('To Left', 'maxi-blocks'),
				value: 'left',
			},
			{
				label: __('To Right', 'maxi-blocks'),
				value: 'right',
			},
		];

		switch (type) {
			case 'vertical':
				return directionVerticalOptions;
			case 'horizontal':
				return directionHorizontalOptions;
			default:
				return null;
		}
	};
	// console.log(`breakpoint ${breakpoint}`);
	// console.log(getLastBreakpointAttribute('motion-active', breakpoint, props));
	// console.log('===================');

	return (
		<div className={classes}>
			<RadioControl
				fullWidthMode
				selected={motionStatus}
				options={motionOptions}
				onChange={val => {
					onChange({ [`motion-active-${breakpoint}`]: val });
					setMotionStatus(val);
				}}
			/>
			{/* <RadioControl
						 label={__('Preview', 'maxi-blocks')}
						 selected={props['motion-preview-status']}
						 options={[
							 { label: __('Yes', 'maxi-blocks'), value: 1 },
							 { label: __('No', 'maxi-blocks'), value: 0 },
						 ]}
						 onChange={val =>
							 onChange({ 'motion-preview-status': val })
						 }
					 /> */}
			{motionTypes.map(type => {
				{
					/* console.log(`type ${type}`);
				console.log(
					getLastBreakpointAttribute(
						`motion-offset-start-${type}`,
						breakpoint,
						props
					)
				);
				console.log('================================='); */
				}

				const typeCapitalize =
					type.charAt(0).toUpperCase() + type.slice(1);

				return (
					<div key={`maxi-motion-control-${type}-${breakpoint}`}>
						{motionStatus === type && (
							<RadioControl
								label={__(
									`Enable ${typeCapitalize}`,
									'maxi-blocks'
								)}
								selected={
									+getLastBreakpointAttribute(
										`motion-status-${type}`,
										breakpoint,
										props
									)
								}
								options={[
									{
										label: __('Yes', 'maxi-blocks'),
										value: 1,
									},
									{
										label: __('No', 'maxi-blocks'),
										value: 0,
									},
								]}
								onChange={val =>
									onChange({
										[`motion-status-${type}-${breakpoint}`]:
											!!+val,
									})
								}
							/>
						)}
						{props[`motion-active-${breakpoint}`] === type &&
							props[`motion-status-${type}-${breakpoint}`] && (
								<>
									<SelectControl
										label={__('Easing', 'maxi-blocks')}
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
									{(type === 'vertical' ||
										type === 'horizontal') && (
										<SelectControl
											label={__(
												'Direction',
												'maxi-blocks'
											)}
											value={getLastBreakpointAttribute(
												`motion-direction-${type}`,
												breakpoint,
												props
											)}
											options={getDirectionOptions(type)}
											onChange={val =>
												onChange({
													[`motion-direction-${type}-${breakpoint}`]:
														val,
												})
											}
										/>
									)}
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
										step={0.1}
										max={20}
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
									<RangeSliderControl
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
									/>
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
								</>
							)}
					</div>
				);
			})}
		</div>
	);
};

export default MotionControl;
