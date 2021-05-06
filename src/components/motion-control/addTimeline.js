/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

/**
 * External dependencies
 */
import { has, find, isNil } from 'lodash';

/**
 * Component
 */
const AddTimeline = props => {
	const { onChange } = props;

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

		if (!has(props['motion-time-line'], time)) {
			onChange({
				'motion-time-line': {
					...props['motion-time-line'],
					[time]: [
						{
							type,
							settings,
						},
					],
				},
			});
		} else if (isNil(find(props['motion-time-line'][time], { type }))) {
			const newTimeline = { ...props['motion-time-line'] };
			newTimeline[time].unshift({
				type,
				settings,
			});
			onChange({
				'motion-time-line': {
					...newTimeline,
				},
			});
		}

		onChange({
			'motion-active-time-line-time': time,
			'motion-active-time-line-index': 0,
		});
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
