/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl, Button, SelectControl } = wp.components;
const { Fragment, useState } = wp.element;

/**
 * Internal dependencies
 */
import { __experimentalFancyRadioControl } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	isObject,
	has,
	find,
	isNil,
	isEmpty,
	filter,
	uniqueId,
	forIn,
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarDelete } from '../../icons';

/**
 * Component
 */
const MotionControl = props => {
	const { className, motion, onChange } = props;

	const motionValue = !isObject(motion) ? JSON.parse(motion) : motion;

	let { interaction } = motionValue;

	const [timelineType, setTimelineType] = useState('move');
	const [timelineTime, setTimelineTime] = useState(0);
	const [presetName, setPresetName] = useState('');
	const [presetLoad, setPresetLoad] = useState('');

	const classes = classnames('maxi-motion-control', className);

	const addTimeline = (type = 'move', time = 0) => {
		let settings = {};
		switch (type) {
			case 'move':
			case 'rotate':
				settings = {
					effectPosition: time,
					x: 0,
					y: 0,
					z: 0,
				};
				break;
			case 'skew':
				settings = {
					effectPosition: time,
					x: 0,
					y: 0,
				};
				break;
			case 'scale':
				settings = {
					effectPosition: time,
					x: 1,
					y: 1,
					z: 1,
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
					blur: 0,
				};
				break;
		}

		if (!has(interaction.timeline, time)) {
			interaction.timeline = {
				...interaction.timeline,
				[time]: [
					{
						type,
						settings,
					},
				],
			};
		} else {
			if (isNil(find(interaction.timeline[time], { type }))) {
				let newTimeline = { ...interaction.timeline };
				newTimeline[time].unshift({
					type,
					settings,
				});
				interaction.timeline = {
					...newTimeline,
				};
			}
		}

		interaction.activeTimeline = {
			time,
			index: 0,
		};

		onChange(JSON.stringify(motionValue));
	};

	const removeTimeline = (type, time) => {
		if (has(interaction.timeline, time)) {
			const result = filter(interaction.timeline[time], function (o) {
				return o.type !== type;
			});

			interaction.timeline = {
				...interaction.timeline,
				[time]: [...result],
			};

			if (isEmpty(result)) {
				let newTimeline = { ...interaction.timeline };
				delete newTimeline[time];

				interaction.timeline = {
					...newTimeline,
				};
			}
		}

		onChange(JSON.stringify(motionValue));
	};

	const getCurrentTimelineItem = () => {
		if (!isEmpty(interaction.timeline[interaction.activeTimeline.time])) {
			return interaction.timeline[interaction.activeTimeline.time][
				interaction.activeTimeline.index
			];
		}
	};

	const updateTimelineItemPosition = (prevTime, newTime) => {
		let newTimeline = { ...interaction.timeline };
		let prevItem = newTimeline[prevTime][interaction.activeTimeline.index];
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

		interaction.timeline = {
			...addResult,
		};

		interaction.activeTimeline = {
			time: newTime,
			index: 0,
		};

		onChange(JSON.stringify(motionValue));
	};

	const updateTimelineItemSettings = (value, name) => {
		if (!isEmpty(interaction.timeline[interaction.activeTimeline.time])) {
			let newTimeline = { ...interaction.timeline };
			newTimeline[interaction.activeTimeline.time][
				interaction.activeTimeline.index
			].settings[name] = value;

			interaction.timeline = {
				...newTimeline,
			};

			onChange(JSON.stringify(motionValue));
		}
	};

	const getTimelineItemSettingValue = name => {
		if (!isEmpty(interaction.timeline[interaction.activeTimeline.time])) {
			return interaction.timeline[interaction.activeTimeline.time][
				interaction.activeTimeline.index
			].settings[name];
		}
	};

	const getPresets = () => {
		let presetArr = [
			{ label: __('Select your preset', 'maxi-blocks'), value: '' },
		];
		forIn(interaction.presets, (value, key) =>
			presetArr.push({ label: value.name, value: key })
		);
		return presetArr;
	};

	function showPresetSettings() {
		return (
			<Fragment>
				<__experimentalFancyRadioControl
					label={__('Preset', 'maxi-blocks')}
					selected={interaction.presetStatus}
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
					onChange={val => {
						interaction.presetStatus = Number(val);
						onChange(JSON.stringify(motionValue));
					}}
				/>
				{!!interaction.presetStatus && (
					<Fragment>
						<div className='maxi-motion-control__preset__load'>
							<SelectControl
								value={presetLoad}
								options={getPresets()}
								onChange={val => setPresetLoad(val)}
							></SelectControl>
							<Button
								disabled={isEmpty(presetLoad)}
								onClick={() => {
									{
										interaction.timeline = {
											...interaction.presets[presetLoad]
												.preset,
										};

										onChange(JSON.stringify(motionValue));

										setPresetLoad('');
									}
								}}
							>
								{__('Load Preset', 'maxi-blocks')}
							</Button>
						</div>
						<div className='maxi-motion-control__preset__save'>
							<input
								type='text'
								placeholder={__(
									'Add your Preset Name here',
									'maxi-blocks'
								)}
								value={presetName}
								onChange={e => setPresetName(e.target.value)}
							/>
							<Button
								disabled={isEmpty(presetName)}
								onClick={() => {
									interaction.presets = {
										...interaction.presets,
										[uniqueId('preset_')]: {
											name: presetName,
											preset: {
												...interaction.timeline,
											},
										},
									};

									onChange(JSON.stringify(motionValue));
									setPresetName('');
								}}
							>
								{__('Save Preset', 'maxi-blocks')}
							</Button>
						</div>
					</Fragment>
				)}
				<hr />
			</Fragment>
		);
	}

	function showAddTimelineSettings() {
		return (
			<Fragment>
				<SelectControl
					onChange={val => {
						setTimelineType(val);
					}}
					options={[
						{ label: __('Move', 'maxi-blocks'), value: 'move' },
						{ label: __('Scale', 'maxi-blocks'), value: 'scale' },
						{ label: __('Rotate', 'maxi-blocks'), value: 'rotate' },
						{ label: __('Skew', 'maxi-blocks'), value: 'skew' },
						{ label: __('Blur', 'maxi-blocks'), value: 'blur' },
						{
							label: __('Opacity', 'maxi-blocks'),
							value: 'opacity',
						},
					]}
				></SelectControl>
				<input
					type='number'
					placeholder={__('Position', 'maxi-blocks')}
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
				{isEmpty(interaction.timeline) && (
					<div className='maxi-motion-control__timeline__no-effects'>
						<p>
							{__(
								'Please enter your first interaction effect',
								'maxi-blocks'
							)}
						</p>
					</div>
				)}
				{Object.entries(interaction.timeline).map((time, i, arr) => {
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
											interaction.activeTimeline.time ===
												Number(time[0]) &&
											interaction.activeTimeline.index ===
												i
												? 'maxi-motion-control__timeline__group__item--active-item'
												: ''
										}`}
										onClick={() => {
											interaction.activeTimeline = {
												time: Number(time[0]),
												index: i,
											};
											onChange(
												JSON.stringify(motionValue)
											);
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
			<div className='maxi-motion-control__preset'>
				{showPresetSettings()}
			</div>

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
						getCurrentTimelineItem().type === 'rotate') && (
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
					getCurrentTimelineItem().type === 'skew' && (
						<Fragment>
							<RangeControl
								label={__('X', 'maxi-blocks')}
								value={getTimelineItemSettingValue('x')}
								onChange={value =>
									updateTimelineItemSettings(value, 'x')
								}
								min={-80}
								max={80}
							/>
							<RangeControl
								label={__('Y', 'maxi-blocks')}
								value={getTimelineItemSettingValue('y')}
								onChange={value =>
									updateTimelineItemSettings(value, 'y')
								}
								min={-80}
								max={80}
							/>
						</Fragment>
					)}
				{!isNil(getCurrentTimelineItem()) &&
					getCurrentTimelineItem().type === 'scale' && (
						<Fragment>
							<RangeControl
								label={__('X', 'maxi-blocks')}
								value={getTimelineItemSettingValue('x')}
								onChange={value =>
									updateTimelineItemSettings(value, 'x')
								}
								min={-3}
								max={3}
								step={0.1}
							/>
							<RangeControl
								label={__('Y', 'maxi-blocks')}
								value={getTimelineItemSettingValue('y')}
								onChange={value =>
									updateTimelineItemSettings(value, 'y')
								}
								min={-3}
								max={3}
								step={0.1}
							/>
							<RangeControl
								label={__('Z', 'maxi-blocks')}
								value={getTimelineItemSettingValue('z')}
								onChange={value =>
									updateTimelineItemSettings(value, 'z')
								}
								min={-3}
								max={3}
								step={0.1}
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
								max={100}
								step={1}
							/>
						</Fragment>
					)}
				{!isNil(getCurrentTimelineItem()) && (
					<Fragment>
						<hr />
						<__experimentalFancyRadioControl
							label={__('X-Axis', 'maxi-blocks')}
							selected={interaction.transformOrigin.xAxis}
							options={[
								{
									label: __('Left', 'maxi-blocks'),
									value: 'left',
								},
								{
									label: __('Center', 'maxi-blocks'),
									value: 'center',
								},
								{
									label: __('Right', 'maxi-blocks'),
									value: 'right',
								},
							]}
							onChange={value => {
								interaction.transformOrigin = {
									...interaction.transformOrigin,
									xAxis: value,
								};

								onChange(JSON.stringify(motionValue));
							}}
						/>
						<__experimentalFancyRadioControl
							label={__('Y-Axis', 'maxi-blocks')}
							selected={interaction.transformOrigin.yAxis}
							options={[
								{
									label: __('Top', 'maxi-blocks'),
									value: 'top',
								},
								{
									label: __('Center', 'maxi-blocks'),
									value: 'center',
								},
								{
									label: __('Bottom', 'maxi-blocks'),
									value: 'bottom',
								},
							]}
							onChange={value => {
								interaction.transformOrigin = {
									...interaction.transformOrigin,
									yAxis: value,
								};

								onChange(JSON.stringify(motionValue));
							}}
						/>
					</Fragment>
				)}
			</div>
		</div>
	);
};

export default MotionControl;
