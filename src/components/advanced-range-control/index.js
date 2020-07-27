/**
 * External dependencies
 */
import {
	Slider,
	Rail,
	Handles,
	Tracks,
	Ticks
} from 'react-compound-slider';

/**
 * Styles and icons
 */
import './editor.scss';

function Track({ source, target, getTrackProps }) {
	return (
		<div
			style={{
				left: `${source.percent}%`,
				width: `${target.percent - source.percent}%`,
			}}
			className='maxi-advanced-range-control__track'
			{...getTrackProps()}
		/>
	);
}

function Handle({ handle: { id, value, percent }, getHandleProps }) {
	return (
		<div
			className='maxi-advanced-range-control__handle'
			style={{left: `${percent}%`}}
			{...getHandleProps(id)}
		>
			<div className='maxi-advanced-range-control__handle__label'>
				{value}
			</div>
		</div>
	);
}

/**
 * Component
 */
const AdvancedRangeControl = (props) => {

	const sliderStyle = {
		position: 'relative',
		width: '100%',
		height: 80,
		marginTop: 15,
		marginBottom: 15,
	};

	const { options, onChange } = props;

	return (
		<div className='maxi-advanced-range-control'>
			<Slider
				className='maxi-advanced-range-control__slider'
				rootStyle={sliderStyle}
				domain={[0, 100]}
				step={1}
				mode={3}
				values={options}
				onChange={(values) => {
					onChange(values);
				}}
			>
				<Rail>
					{
						({ getRailProps }) => (
							<div
								className='maxi-advanced-range-control__rail'
								{...getRailProps()}
							/>
						)
					}
				</Rail>
				<Handles>
					{({ handles, getHandleProps }) => (
						<div className='maxi-advanced-range-control__handles'>
							{handles.map((handle) => (
								<Handle
									key={handle.id}
									handle={handle}
									getHandleProps={getHandleProps}
								/>
							))}
						</div>
					)}
				</Handles>
				<Tracks left={false} right={false}>
					{({ tracks, getTrackProps }) => (
						<div className='maxi-advanced-range-control__tracks'>
							{tracks.map(({ id, source, target }) => (
								<Track
									key={id}
									source={source}
									target={target}
									getTrackProps={getTrackProps}
								/>
							))}
						</div>
					)}
				</Tracks>
				<Ticks values={[__('Viewport Bottom', 'maxi-blocks'), __('Viewport Top', 'maxi-blocks')]}>
					{({ ticks }) => (
						<div className='maxi-advanced-range-control__ticks'>
							{ticks.map((tick) => (
								<div className='maxi-advanced-range-control__ticks__tick'>{tick.value}</div>
							))}
						</div>
					)}
				</Ticks>
			</Slider>
		</div>
	);
};

export default AdvancedRangeControl;