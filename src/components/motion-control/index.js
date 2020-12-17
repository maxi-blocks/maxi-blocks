/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';
import AddTimeline from './addTimeline';
import ShowTimeline from './showTimeline';
import TimelineSettings from './timelineSettings';
import TimelinePresets from './timelinePresets';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const MotionControl = props => {
	const { className, onChange } = props;

	const motion = { ...props.motion };

	const { interaction } = motion;

	const classes = classnames('maxi-motion-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Use Motion Effects', 'maxi-blocks')}
				selected={interaction.interactionStatus}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					interaction.interactionStatus = Number(val);
					onChange(motion);
				}}
			/>
			{!!interaction.interactionStatus && (
				<Fragment>
					<FancyRadioControl
						label={__('Preview', 'maxi-blocks')}
						selected={interaction.previewStatus}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							interaction.previewStatus = Number(val);
							onChange(motion);
						}}
					/>
					<TimelinePresets
						interaction={interaction}
						onChange={interaction => {
							motion.interaction = interaction;

							onChange(motion);
						}}
					/>

					<AddTimeline
						interaction={interaction}
						onChange={interaction => {
							motion.interaction = interaction;

							onChange(motion);
						}}
					/>

					<ShowTimeline
						interaction={interaction}
						onChange={interaction => {
							motion.interaction = interaction;

							onChange(motion);
						}}
					/>

					<TimelineSettings
						interaction={interaction}
						onChange={interaction => {
							motion.interaction = interaction;

							onChange(motion);
						}}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default MotionControl;
