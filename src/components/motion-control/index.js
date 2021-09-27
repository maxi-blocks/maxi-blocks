/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../toggle-switch';
import AddTimeline from './addTimeline';
import ShowTimeline from './showTimeline';
import TimelineSettings from './timelineSettings';
import TimelinePresets from './timelinePresets';
import { getGroupAttributes } from '../../extensions/styles';

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

	const classes = classnames('maxi-motion-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use Motion Effects', 'maxi-blocks')}
				selected={props['motion-status']}
				onChange={val => onChange({ 'motion-status': val })}
			/>
			{/* props['motion-status'] && (
				<>
					<ToggleSwitch
						label={__('Preview', 'maxi-blocks')}
						selected={props['motion-preview-status']}
						onChange={val =>
							onChange({ 'motion-preview-status': val })
						}
					/>
					<TimelinePresets
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => onChange(obj)}
					/>
					<AddTimeline
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => onChange(obj)}
					/>
					<ShowTimeline
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => onChange(obj)}
					/>
					<TimelineSettings
						{...getGroupAttributes(props, 'motion')}
						onChange={obj => {
							onChange(obj);
						}}
					/>
				</>
			) */}
		</div>
	);
};

export default MotionControl;
