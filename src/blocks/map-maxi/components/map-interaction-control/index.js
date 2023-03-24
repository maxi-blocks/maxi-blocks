/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ToggleSwitch } from '../../../../components';
import { getAttributesValue } from '../../../../extensions/attributes';

const MapInteractionControl = ({ onChange, ...attributes }) => {
	const {
		'map-dragging': mapDragging,
		'map-touch-zoom': mapTouchZoom,
		'map-double-click-zoom': mapDoubleClickZoom,
		'map-scroll-wheel-zoom': mapScrollWheelZoom,
	} = getAttributesValue({
		target: [
			'map-dragging',
			'map-touch-zoom',
			'map-double-click-zoom',
			'map-scroll-wheel-zoom',
		],
		props: attributes,
	});

	return (
		<>
			<ToggleSwitch
				label={__('Map dragging', 'maxi-blocks')}
				selected={mapDragging}
				onChange={val => {
					onChange({
						'map-dragging': val,
					});
				}}
			/>
			<ToggleSwitch
				label={__('Touch zoom', 'maxi-blocks')}
				selected={mapTouchZoom}
				onChange={val => {
					onChange({
						'map-touch-zoom': val,
					});
				}}
			/>
			<ToggleSwitch
				label={__('Double click zoom', 'maxi-blocks')}
				selected={mapDoubleClickZoom}
				onChange={val => {
					onChange({
						'map-double-click-zoom': val,
					});
				}}
			/>
			<ToggleSwitch
				label={__('Scroll wheel zoom', 'maxi-blocks')}
				selected={mapScrollWheelZoom}
				onChange={val => {
					onChange({
						'map-scroll-wheel-zoom': val,
					});
				}}
			/>
		</>
	);
};

export default MapInteractionControl;
