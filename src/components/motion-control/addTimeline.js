/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button, SelectControl } = wp.components;
const { useState } = wp.element;

/**
 * External dependencies
 */
import { has, find, isNil } from 'lodash';

/**
 * Component
 */
const AddTimeline = props => {
	const { interaction, onChange } = props;

	const [timelineType, setTimelineType] = useState('move');
	const [timelineTime, setTimelineTime] = useState(0);

	const insertTimeline = (type = 'move', time = 0) => {
		let settings = {};
		switch (type) {
			case 'move':
			case 'rotate':
				settings = {
					effectPosition: time,
					x: 0,
					y: 0,
					z: 0,
					unitX: '',
					unitY: '',
					unitZ: '',
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
			default:
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
		} else if (isNil(find(interaction.timeline[time], { type }))) {
			const newTimeline = { ...interaction.timeline };
			newTimeline[time].unshift({
				type,
				settings,
			});
			interaction.timeline = {
				...newTimeline,
			};
		}

		interaction.activeTimeline = {
			time,
			index: 0,
		};

		onChange(interaction);
	};

	return (
		<div className='maxi-motion-control__add-timeline'>
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
			/>
			<input
				type='number'
				placeholder={__('Position', 'maxi-blocks')}
				min={0}
				max={100}
				step={1}
				onChange={e => {
					const re = /^(100|[1-9]?[0-9])$/;
					if (re.test(e.target.value)) {
						setTimelineTime(e.target.value);
					} else {
						setTimelineTime(0);
					}
				}}
			/>
			<Button
				onClick={() => {
					insertTimeline(timelineType, Number(timelineTime));
				}}
			>
				{__('Add', 'maxi-blocks')}
			</Button>
			<hr />
		</div>
	);
};
export default AddTimeline;
