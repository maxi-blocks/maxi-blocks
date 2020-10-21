/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl, Icon } = wp.components;
const { Fragment, useState } = wp.element;

/**
 * Internal dependencies
 */
import __experimentalAdvancedRangeControl from '../advanced-range-control';
import __experimentalGroupInputControl from '../group-input-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';
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
import { isObject, has, find, isNil, isEmpty } from 'lodash';

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
	const [timeline, setTimeline] = useState({});
	const [timelineType, setTimelineType] = useState('move');
	const [timelineTime, setTimelineTime] = useState(0);

	const classes = classnames('maxi-motion-control', className);

	const addTimeline = (type, time, settings = {}) => {
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
				timeline[time].push({
					type,
					settings,
				});
				setTimeline({
					...timeline,
				});
			}
		}
	};

	return (
		<div className={classes}>
			<select
				onChange={e => {
					setTimelineType(e.target.value);
				}}
			>
				<option value='move'>Move</option>
				<option value='rotate'>Rotate</option>
				<option value='skew'>Skew</option>
				<option value='fade'>Fade</option>
			</select>
			<input
				type='number'
				placeholder='Time'
				min={0}
				max={100}
				step={1}
				onChange={e => {
					setTimelineTime(e.target.value);
				}}
			/>
			<button
				onClick={() => {
					addTimeline(timelineType, Number(timelineTime));
				}}
			>
				Add +
			</button>
			<div className='box'>
				{isEmpty(timeline) && (
					<div>
						Apply various actions on one or multiple elements to
						create a sequenced animation.
					</div>
				)}
				{Object.entries(timeline).map((item, i, arr) => {
					let prevValue = !isNil(arr[i - 1]) ? arr[i - 1][0] : 0;

					return (
						<Fragment>
							<div
								className='space'
								style={{
									flexGrow: `${parseFloat(
										(Number(item[0]) - Number(prevValue)) /
											100
									)}`,
								}}
							></div>
							<div className='group'>
								<div className='pos'>{item[0]}%</div>
								{item[1].map(item => (
									<div className='item'>{item.type}</div>
								))}
							</div>
						</Fragment>
					);
				})}
			</div>
			<__experimentalFancyRadioControl
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
			)}
		</div>
	);
};

export default MotionControl;
