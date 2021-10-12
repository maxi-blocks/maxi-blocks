/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';
// import AddTimeline from './addTimeline';
// import ShowTimeline from './showTimeline';
// import TimelineSettings from './timelineSettings';
// import TimelinePresets from './timelinePresets';
// import { getGroupAttributes } from '../../extensions/styles';
import {
	getDefaultAttribute,
	// getGroupAttributes,
} from '../../extensions/styles';
import SelectControl from '../select-control';

// import { useState } from '@wordpress/element';
// import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
// import { isEmpty, round } from 'lodash';
/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const MotionControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-motion-control', className);
	// const [presetLoad, setPresetLoad] = useState('');

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
					<SelectControl
						label={__('Easing', 'maxi-blocks')}
						value={props['motion-transition-easing']}
						onChange={val =>
							onChange({ 'motion-transition-easing': val })
						}
						options={[
							{
								label: __('ease', 'maxi-blocks'),
								value: 'ease',
							},
							{
								label: __('linear', 'maxi-blocks'),
								value: 'linear',
							},
							{
								label: __('ease-in', 'maxi-blocks'),
								value: 'ease-in',
							},
							{
								label: __('ease-out', 'maxi-blocks'),
								value: 'ease-out',
							},
							{
								label: __('ease-in-out', 'maxi-blocks'),
								value: 'ease-in-out',
							},
							{
								label: __('cubic-bezier', 'maxi-blocks'),
								value: 'cubic-bezier',
							},
						]}
					/>
					<AdvancedNumberControl
						label={__('Speed', 'maxi-blocks')}
						value={props['motion-transition-duration-general']}
						onChangeValue={val => {
							onChange({
								'motion-transition-duration-general':
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0}
						step={0.1}
						max={10}
						onReset={() =>
							onChange({
								'motion-transition-duration-general':
									getDefaultAttribute(
										'motion-transition-duration-general'
									),
							})
						}
						initialPosition={getDefaultAttribute(
							'motion-transition-duration-general'
						)}
					/>
					{/* <SelectControl
						 value='Scroll Up'
						 options='Scroll Up'
						 onChange={val => setPresetLoad(val)}
					 /> */}
					{/* <TimelinePresets
						 {...getGroupAttributes(props, 'motion')}
						 onChange={obj => onChange(obj)}
					 /> */}
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
