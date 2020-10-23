/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl, Icon, RangeControl, Button } = wp.components;
const { Fragment, useState } = wp.element;

/**
 * Internal dependencies
 */
import __experimentalAdvancedRangeControl from '../advanced-range-control';
import __experimentalGroupInputControl from '../group-input-control';
import { __experimentalFancyRadioControl } from '../../components';
import {
	verticalPresets,
	horizontalPresets,
	scalePresets,
	rotatePresets,
	fadePresets,
	blurPresets,
} from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, has, find, isNil, isEmpty, filter, concat } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	motionVertical,
	motionHorizontal,
	motionRotate,
	motionScale,
	motionFade,
	motionBlur,
	toolbarDelete,
} from '../../icons';

/**
 * Component
 */
const MotionControl = props => {
	const { className, motion, onChange } = props;

	const value = !isObject(motion) ? JSON.parse(motion) : motion;

	const {
		vertical: verticalOptions,
		horizontal: horizontalOptions,
		rotate: rotateOptions,
		scale: scaleOptions,
		fade: fadeOptions,
		blur: blurOptions,
	} = value;

	const [motionStatus, setMotionStatus] = useState('vertical');
	const [timeline, setTimeline] = useState({
		5: [
			{
				type: 'rotate',
				settings: {
					effectPosition: 5,
					x: 0,
					y: 0,
					z: 0,
				},
			},
			{
				type: 'move',
				settings: {
					effectPosition: 5,
					x: 0,
					y: 0,
					z: 0,
				},
			},
		],
		24: [
			{
				type: 'blur',
				settings: {
					effectPosition: 24,
					blur: 0,
				},
			},
		],
		25: [
			{
				type: 'opacity',
				settings: {
					effectPosition: 25,
					opacity: 0,
				},
			},
		],
	});
	const [timelineType, setTimelineType] = useState('move');
	const [timelineTime, setTimelineTime] = useState(0);
	const [activeTimeline, setActiveTimeline] = useState({
		time: 0,
		index: 0,
	});

	const classes = classnames('maxi-motion-control', className);

	const addTimeline = (type = 'move', time = 0) => {
		let settings = {};
		switch (type) {
			case 'move':
			case 'rotate':
			case 'skew':
			case 'scale':
				settings = {
					effectPosition: time,
					x: 0,
					y: 0,
					z: 0,
				};
				break;
			case 'opacity':
				settings = {
					effectPosition: time,
					opacity: 1,
				};
				break;
			case 'blur':
				settings = {
					effectPosition: time,
					blur: 1,
				};
				break;
		}

		if (!has(timeline, time)) {
			setTimeline({
				...timeline,
				[time]: [
					{
						type,
						settings,
					},
				],
			});
		} else {
			if (isNil(find(timeline[time], { type }))) {
				let newTimeline = { ...timeline };
				newTimeline[time].unshift({
					type,
					settings,
				});
				setTimeline({
					...newTimeline,
				});
			}
		}

		setActiveTimeline({
			time,
			index: 0,
		});
	};

	const removeTimeline = (type, time) => {
		if (has(timeline, time)) {
			const result = filter(timeline[time], function (o) {
				return o.type !== type;
			});

			setTimeline({
				...timeline,
				[time]: [...result],
			});

			if (isEmpty(result)) {
				let newTimeline = { ...timeline };
				delete newTimeline[time];

				setTimeline({
					...newTimeline,
				});
			}
		}
	};

	const getCurrentTimelineItem = () => {
		if (!isEmpty(timeline[activeTimeline.time])) {
			return timeline[activeTimeline.time][activeTimeline.index];
		}
	};

	const updateTimelineItemPosition = (prevTime, newTime) => {
		let newTimeline = { ...timeline };
		let prevItem = newTimeline[prevTime][activeTimeline.index];
		prevItem.settings.effectPosition = newTime;

		const result = filter(newTimeline[prevTime], function (o) {
			return o.type !== prevItem.type;
		});

		const removeResult = isEmpty(result)
			? delete newTimeline[prevTime] && newTimeline
			: {
					...newTimeline,
					[prevTime]: [...result],
			  };

		let addResult = {};
		if (!has(removeResult, newTime)) {
			addResult = {
				...removeResult,
				[newTime]: [prevItem],
			};
		} else {
			removeResult[newTime].unshift(prevItem);
			addResult = {
				...removeResult,
			};
		}

		setTimeline({
			...addResult,
		});

		setActiveTimeline({
			time: newTime,
			index: 0,
		});
	};

	const updateTimelineItemSettings = (value, name) => {
		if (!isEmpty(timeline[activeTimeline.time])) {
			let newTimeline = { ...timeline };
			newTimeline[activeTimeline.time][activeTimeline.index].settings[
				name
			] = value;

			setTimeline({
				...newTimeline,
			});
		}
	};

	const getTimelineItemSettingValue = name => {
		if (!isEmpty(timeline[activeTimeline.time])) {
			return timeline[activeTimeline.time][activeTimeline.index].settings[
				name
			];
		}
	};

	function showAddTimelineSettings() {
		return (
			<Fragment>
				<select
					onChange={e => {
						setTimelineType(e.target.value);
					}}
				>
					<option value='move'>{__('Move', 'maxi-blocks')}</option>
					<option value='scale'>{__('Scale', 'maxi-blocks')}</option>
					<option value='rotate'>
						{__('Rotate', 'maxi-blocks')}
					</option>
					<option value='skew'>{__('Skew', 'maxi-blocks')}</option>
					<option value='opacity'>
						{__('Opacity', 'maxi-blocks')}
					</option>
					<option value='blur'>{__('Blur', 'maxi-blocks')}</option>
				</select>
				<input
					type='number'
					placeholder='Position'
					min={0}
					max={100}
					step={1}
					onChange={e => {
						setTimelineTime(e.target.value);
					}}
				/>
				<Button
					onClick={() => {
						addTimeline(timelineType, Number(timelineTime));
					}}
				>
					{__('Add', 'maxi-blocks')}
				</Button>
				<hr />
			</Fragment>
		);
	}

	function showTimeline() {
		return (
			<Fragment>
				{isEmpty(timeline) && (
					<div className='maxi-motion-control__timeline__no-effects'>
						<p>
							{__(
								'Please enter your first interaction effect',
								'maxi-blocks'
							)}
						</p>
					</div>
				)}
				{Object.entries(timeline).map((time, i, arr) => {
					let prevValue = !isNil(arr[i - 1]) ? arr[i - 1][0] : 0;

					return (
						<Fragment>
							<div
								className='maxi-motion-control__timeline__space'
								style={{
									flexGrow: `${parseFloat(
										(Number(time[0]) - Number(prevValue)) /
											100
									)}`,
								}}
							></div>
							<div className='maxi-motion-control__timeline__group'>
								{time[1].map((item, i) => (
									<div
										className={`maxi-motion-control__timeline__group__item ${
											activeTimeline.time ===
												Number(time[0]) &&
											activeTimeline.index === i
												? 'maxi-motion-control__timeline__group__item--active-item'
												: ''
										}`}
										onClick={() => {
											setActiveTimeline({
												time: Number(time[0]),
												index: i,
											});
										}}
									>
										<span>{item.type}</span>
										<div className='maxi-motion-control__timeline__group__item__actions'>
											<i
												onClick={() =>
													removeTimeline(
														item.type,
														time[0]
													)
												}
											>
												{toolbarDelete}
											</i>
										</div>
									</div>
								))}
								<div className='maxi-motion-control__timeline__group__position'>
									{time[0]}%
								</div>
							</div>
						</Fragment>
					);
				})}
			</Fragment>
		);
	}

	return (
		<div className={classes}>
			<div className='maxi-motion-control__add-timeline'>
				{showAddTimelineSettings()}
			</div>

			<div className='maxi-motion-control__timeline'>
				{showTimeline()}
			</div>

			<div className='maxi-motion-control__timeline-item-settings'>
				{!isNil(getCurrentTimelineItem()) && (
					<Fragment>
						<hr />
						<RangeControl
							label={__('Position', 'maxi-blocks')}
							value={getTimelineItemSettingValue(
								'effectPosition'
							)}
							onChange={value =>
								updateTimelineItemPosition(
									getTimelineItemSettingValue(
										'effectPosition'
									),
									value
								)
							}
							min={0}
							max={100}
						/>
						<hr />
					</Fragment>
				)}
				{!isNil(getCurrentTimelineItem()) &&
					(getCurrentTimelineItem().type === 'move' ||
						getCurrentTimelineItem().type === 'scale' ||
						getCurrentTimelineItem().type === 'rotate' ||
						getCurrentTimelineItem().type === 'skew') && (
						<Fragment>
							<RangeControl
								label={__('X', 'maxi-blocks')}
								value={getTimelineItemSettingValue('x')}
								onChange={value =>
									updateTimelineItemSettings(value, 'x')
								}
								min={-1000}
								max={1000}
							/>
							<RangeControl
								label={__('Y', 'maxi-blocks')}
								value={getTimelineItemSettingValue('y')}
								onChange={value =>
									updateTimelineItemSettings(value, 'y')
								}
								min={-1000}
								max={1000}
							/>
							<RangeControl
								label={__('Z', 'maxi-blocks')}
								value={getTimelineItemSettingValue('z')}
								onChange={value =>
									updateTimelineItemSettings(value, 'z')
								}
								min={-1000}
								max={1000}
							/>
						</Fragment>
					)}
				{!isNil(getCurrentTimelineItem()) &&
					getCurrentTimelineItem().type === 'opacity' && (
						<Fragment>
							<RangeControl
								label={__('Opacity', 'maxi-blocks')}
								value={getTimelineItemSettingValue('opacity')}
								onChange={value =>
									updateTimelineItemSettings(value, 'opacity')
								}
								initialPosition={1}
								min={0}
								max={1}
								step={0.1}
							/>
						</Fragment>
					)}
				{!isNil(getCurrentTimelineItem()) &&
					getCurrentTimelineItem().type === 'blur' && (
						<Fragment>
							<RangeControl
								label={__('Blur', 'maxi-blocks')}
								value={getTimelineItemSettingValue('blur')}
								onChange={value =>
									updateTimelineItemSettings(value, 'blur')
								}
								initialPosition={1}
								min={0}
								max={1}
								step={0.1}
							/>
						</Fragment>
					)}
			</div>

			{/* <__experimentalFancyRadioControl
				selected={motionStatus}
				options={[
					{
						label: <Icon icon={motionVertical} />,
						value: 'vertical',
					},
					{
						label: <Icon icon={motionHorizontal} />,
						value: 'horizontal',
					},
					{
						label: <Icon icon={motionRotate} />,
						value: 'rotate',
					},
					{ label: <Icon icon={motionScale} />, value: 'scale' },
					{ label: <Icon icon={motionFade()} />, value: 'fade' },
					{ label: <Icon icon={motionBlur()} />, value: 'blur' },
				]}
				onChange={value => setMotionStatus(value)}
			/>
			{motionStatus === 'vertical' && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Enable Vertical', 'maxi-blocks')}
						selected={verticalOptions.status}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							verticalOptions.status = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!verticalOptions.status && (
						<Fragment>
							<SelectControl
								label={__('Direction', 'maxi-blocks')}
								value={verticalOptions.direction}
								options={[
									{ label: 'Up', value: 'up' },
									{ label: 'Down', value: 'down' },
								]}
								onChange={val => {
									verticalOptions.direction = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalFancyRadioControl
								label=''
								type='classic'
								selected={verticalOptions.preset}
								options={verticalPresets(verticalOptions)}
								onChange={val => {
									verticalOptions.preset = val;
									verticalOptions.viewport =
										verticalOptions.presets[
											verticalOptions.preset
										].viewport;
									verticalOptions.amounts =
										verticalOptions.presets[
											verticalOptions.preset
										].amounts;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalAdvancedRangeControl
								options={verticalOptions.viewport}
								onChange={val => {
									verticalOptions.viewport = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalGroupInputControl
								label={__('Vertical', 'maxi-blocks')}
								options={verticalOptions.amounts}
								onChange={val => {
									verticalOptions.amounts = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
			{motionStatus === 'horizontal' && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Enable Horizontal', 'maxi-blocks')}
						selected={horizontalOptions.status}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							horizontalOptions.status = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!horizontalOptions.status && (
						<Fragment>
							<SelectControl
								label={__('Direction', 'maxi-blocks')}
								value={horizontalOptions.direction}
								options={[
									{ label: 'To left', value: 'left' },
									{ label: 'To Right', value: 'right' },
								]}
								onChange={val => {
									horizontalOptions.direction = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalFancyRadioControl
								label=''
								type='classic'
								selected={horizontalOptions.preset}
								options={horizontalPresets(horizontalOptions)}
								onChange={val => {
									horizontalOptions.preset = val;
									horizontalOptions.viewport =
										horizontalOptions.presets[
											horizontalOptions.preset
										].viewport;
									horizontalOptions.amounts =
										horizontalOptions.presets[
											horizontalOptions.preset
										].amounts;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalAdvancedRangeControl
								options={horizontalOptions.viewport}
								onChange={val => {
									horizontalOptions.viewport = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalGroupInputControl
								label={__('Horizontal', 'maxi-blocks')}
								options={horizontalOptions.amounts}
								onChange={val => {
									horizontalOptions.amounts = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
			{motionStatus === 'rotate' && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Enable Rotate', 'maxi-blocks')}
						selected={rotateOptions.status}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							rotateOptions.status = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!rotateOptions.status && (
						<Fragment>
							<SelectControl
								label={__('Direction', 'maxi-blocks')}
								value={rotateOptions.direction}
								options={[
									{ label: 'To left', value: 'left' },
									{ label: 'To Right', value: 'right' },
								]}
								onChange={val => {
									rotateOptions.direction = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalFancyRadioControl
								label=''
								type='classic'
								selected={rotateOptions.preset}
								options={rotatePresets(rotateOptions)}
								onChange={val => {
									rotateOptions.preset = val;
									rotateOptions.viewport =
										rotateOptions.presets[
											rotateOptions.preset
										].viewport;
									rotateOptions.amounts =
										rotateOptions.presets[
											rotateOptions.preset
										].amounts;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalAdvancedRangeControl
								options={rotateOptions.viewport}
								onChange={val => {
									rotateOptions.viewport = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalGroupInputControl
								label={__('Rotation', 'maxi-blocks')}
								options={rotateOptions.amounts}
								onChange={val => {
									rotateOptions.amounts = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
			{motionStatus === 'scale' && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Enable Scale', 'maxi-blocks')}
						selected={scaleOptions.status}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							scaleOptions.status = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!scaleOptions.status && (
						<Fragment>
							<SelectControl
								label={__('Direction', 'maxi-blocks')}
								value={scaleOptions.direction}
								options={[
									{ label: 'Scale Up', value: 'up' },
									{ label: 'Scale Down', value: 'down' },
								]}
								onChange={val => {
									scaleOptions.direction = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalFancyRadioControl
								label=''
								type='classic'
								selected={scaleOptions.preset}
								options={scalePresets(scaleOptions)}
								onChange={val => {
									scaleOptions.preset = val;
									scaleOptions.viewport =
										scaleOptions.presets[
											scaleOptions.preset
										].viewport;
									scaleOptions.amounts =
										scaleOptions.presets[
											scaleOptions.preset
										].amounts;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalAdvancedRangeControl
								options={scaleOptions.viewport}
								onChange={val => {
									scaleOptions.viewport = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalGroupInputControl
								label={__('Scale', 'maxi-blocks')}
								max={10}
								options={scaleOptions.amounts}
								onChange={val => {
									scaleOptions.amounts = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
			{motionStatus === 'fade' && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Enable Fade', 'maxi-blocks')}
						selected={fadeOptions.status}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							fadeOptions.status = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!fadeOptions.status && (
						<Fragment>
							<SelectControl
								label={__('Direction', 'maxi-blocks')}
								value={fadeOptions.direction}
								options={[
									{ label: 'Fade In', value: 'in' },
									{ label: 'Fade Out', value: 'out' },
								]}
								onChange={val => {
									fadeOptions.direction = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalFancyRadioControl
								label=''
								type='classic'
								selected={fadeOptions.preset}
								options={fadePresets(fadeOptions)}
								onChange={val => {
									fadeOptions.preset = val;
									fadeOptions.viewport =
										fadeOptions.presets[
											fadeOptions.preset
										].viewport;
									fadeOptions.amounts =
										fadeOptions.presets[
											fadeOptions.preset
										].amounts;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalAdvancedRangeControl
								options={fadeOptions.viewport}
								onChange={val => {
									fadeOptions.viewport = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalGroupInputControl
								label={__('Fade', 'maxi-blocks')}
								options={fadeOptions.amounts}
								max={10}
								onChange={val => {
									fadeOptions.amounts = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}
			{motionStatus === 'blur' && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Enable Blur', 'maxi-blocks')}
						selected={blurOptions.status}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							blurOptions.status = parseInt(val);
							onChange(JSON.stringify(value));
						}}
					/>
					{!!blurOptions.status && (
						<Fragment>
							<SelectControl
								label={__('Direction', 'maxi-blocks')}
								value={blurOptions.direction}
								options={[
									{ label: 'Blur In', value: 'in' },
									{ label: 'Blur Out', value: 'out' },
								]}
								onChange={val => {
									blurOptions.direction = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalFancyRadioControl
								label=''
								type='classic'
								selected={blurOptions.preset}
								options={blurPresets(blurOptions)}
								onChange={val => {
									blurOptions.preset = val;
									blurOptions.viewport =
										blurOptions.presets[
											blurOptions.preset
										].viewport;
									blurOptions.amounts =
										blurOptions.presets[
											blurOptions.preset
										].amounts;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalAdvancedRangeControl
								options={blurOptions.viewport}
								onChange={val => {
									blurOptions.viewport = val;
									onChange(JSON.stringify(value));
								}}
							/>
							<__experimentalGroupInputControl
								label={__('Blur', 'maxi-blocks')}
								options={blurOptions.amounts}
								onChange={val => {
									blurOptions.amounts = val;
									onChange(JSON.stringify(value));
								}}
							/>
						</Fragment>
					)}
				</Fragment>
			)}*/}
		</div>
	);
};

export default MotionControl;
