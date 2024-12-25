/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ToggleSwitch } from '@components';

const MapInteractionControl = ({ onChange, ...attributes }) => (
	<>
		<ToggleSwitch
			label={__('Map dragging', 'maxi-blocks')}
			selected={attributes['map-dragging']}
			onChange={() => {
				onChange({
					'map-dragging': !attributes['map-dragging'],
				});
			}}
		/>
		<ToggleSwitch
			label={__('Touch zoom', 'maxi-blocks')}
			selected={attributes['map-touch-zoom']}
			onChange={() => {
				onChange({
					'map-touch-zoom': !attributes['map-touch-zoom'],
				});
			}}
		/>
		<ToggleSwitch
			label={__('Double click zoom', 'maxi-blocks')}
			selected={attributes['map-double-click-zoom']}
			onChange={() => {
				onChange({
					'map-double-click-zoom':
						!attributes['map-double-click-zoom'],
				});
			}}
		/>
		<ToggleSwitch
			label={__('Scroll wheel zoom', 'maxi-blocks')}
			selected={attributes['map-scroll-wheel-zoom']}
			onChange={() => {
				onChange({
					'map-scroll-wheel-zoom':
						!attributes['map-scroll-wheel-zoom'],
				});
			}}
		/>
	</>
);

export default MapInteractionControl;
