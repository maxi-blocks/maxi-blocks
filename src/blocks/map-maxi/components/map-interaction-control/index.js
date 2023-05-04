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
	const [mapDragging, mapTouchZoom, mapDoubleClickZoom, mapScrollWheelZoom] =
		getAttributesValue({
			target: ['m_dr', 'm_tzo', 'm_dcz', 'm_swz'],
			props: attributes,
		});

	return (
		<>
			<ToggleSwitch
				label={__('Map dragging', 'maxi-blocks')}
				selected={mapDragging}
				onChange={val => {
					onChange({
						m_dr: val,
					});
				}}
			/>
			<ToggleSwitch
				label={__('Touch zoom', 'maxi-blocks')}
				selected={mapTouchZoom}
				onChange={val => {
					onChange({
						m_tzo: val,
					});
				}}
			/>
			<ToggleSwitch
				label={__('Double click zoom', 'maxi-blocks')}
				selected={mapDoubleClickZoom}
				onChange={val => {
					onChange({
						m_dcz: val,
					});
				}}
			/>
			<ToggleSwitch
				label={__('Scroll wheel zoom', 'maxi-blocks')}
				selected={mapScrollWheelZoom}
				onChange={val => {
					onChange({
						m_swz: val,
					});
				}}
			/>
		</>
	);
};

export default MapInteractionControl;
