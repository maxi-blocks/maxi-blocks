/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';
import AddTimeline from './addTimeline';
import ShowTimeline from './showTimeline';
import TimelineSettings from './timelineSettings';
import TimelinePresets from './timelinePresets';
import { getGroupAttributes } from '../../extensions/styles';

import { useState } from '@wordpress/element';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, round } from 'lodash';
/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const MotionControl = props => {
	const { className, onChange, speed, label } = props;

	const classes = classnames('maxi-motion-control', className);
	const [presetLoad, setPresetLoad] = useState('');

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Enable Vertical', 'maxi-blocks')}
				selected={props['motion-status']}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => onChange({ 'motion-status': val })}
			/>
			{props['motion-status'] && (
				<>
					{/* <FancyRadioControl
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
					<label>Direction</label>
					<select>
						<option>Scroll Up</option>
						<option>Scroll Down</option>
					</select>
					<AdvancedNumberControl
						className={classes}
						label={`${
							!isEmpty(label) ? label : __('Speed', 'maxi-blocks')
						}`}
						value={
							speed !== undefined && speed !== '' && speed !== -1
								? round(speed * 100, 2)
								: speed === -1
								? ''
								: 100
						}
						onChangeValue={val => {
							onChange(
								val !== undefined && val !== ''
									? round(val / 100, 2)
									: -1
							);
						}}
						min={0}
						max={100}
						onReset={() => onChange('')}
					/>
					{/* <SelectControl
						value='Scroll Up'
						options='Scroll Up'
						onChange={val => setPresetLoad(val)}
					/> */}
					<TimelinePresets
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => onChange(obj)}
					/>
					{/* <AddTimeline
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => onChange(obj)}
					/> */}
					{/* <ShowTimeline
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => onChange(obj)}
					/>
					<TimelineSettings
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => {
							onChange(obj);
						}}
					/> */}
				</>
			)}
		</div>
	);
};

export default MotionControl;
