/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import { __experimentalFancyRadioControl } from '../../components';
import AddTimeline from './addTimeline';
import ShowTimeline from './showTimeline';
import TimelineSettings from './timelineSettings';
import TimelinePresets from './timelinePresets';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { Fragment } from 'react';

/**
 * Component
 */
const MotionControl = props => {
	const { className, motion, onChange } = props;

	const motionValue = !isObject(motion) ? JSON.parse(motion) : motion;

	const { interaction } = motionValue;

	const classes = classnames('maxi-motion-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Use Motion Effects', 'maxi-blocks')}
				selected={interaction.interactionStatus}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					interaction.interactionStatus = Number(val);
					onChange(JSON.stringify(motionValue));
				}}
			/>
			{!!interaction.interactionStatus && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Preview', 'maxi-blocks')}
						selected={interaction.previewStatus}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							interaction.previewStatus = Number(val);
							onChange(JSON.stringify(motionValue));
						}}
					/>
					<TimelinePresets
						interaction={interaction}
						onChange={interaction => {
							motionValue.interaction = interaction;

							onChange(JSON.stringify(motionValue));
						}}
					/>

					<AddTimeline
						interaction={interaction}
						onChange={interaction => {
							motionValue.interaction = interaction;

							onChange(JSON.stringify(motionValue));
						}}
					/>

					<ShowTimeline
						interaction={interaction}
						onChange={interaction => {
							motionValue.interaction = interaction;

							onChange(JSON.stringify(motionValue));
						}}
					/>

					<TimelineSettings
						interaction={interaction}
						onChange={interaction => {
							motionValue.interaction = interaction;

							onChange(JSON.stringify(motionValue));
						}}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default MotionControl;
