/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import InfoBox from '@components/info-box';
import SelectControl from '@components/select-control';
import { getDefaultAttribute } from '@extensions/styles';
import { getMaxiAdminSettingsUrl } from '@blocks/map-maxi/utils';

/**
 * Component
 */
const MapControl = props => {
	const { onChange, hasApiKey = false, ...attributes } = props;
	const {
		'map-provider': mapProvider,
		'map-min-zoom': mapMinZoom,
		'map-max-zoom': mapMaxZoom,
		'map-type': mapType,
	} = attributes;

	const defaultMapType =
		mapProvider === 'googlemaps' ? 'roadmap' : 'standard';
	const currentMapType =
		typeof mapType !== 'undefined' ? mapType : defaultMapType;

	const getMapTypeOptions = () => {
		if (mapProvider === 'googlemaps') {
			return [
				{
					label: __('Roadmap', 'maxi-blocks'),
					value: 'roadmap',
				},
				{
					label: __('Satellite', 'maxi-blocks'),
					value: 'satellite',
				},
				{
					label: __('Hybrid', 'maxi-blocks'),
					value: 'hybrid',
				},
				{
					label: __('Terrain', 'maxi-blocks'),
					value: 'terrain',
				},
			];
		}

		return [
			{
				label: __('Standard', 'maxi-blocks'),
				value: 'standard',
			},
			{
				label: __('Humanitarian', 'maxi-blocks'),
				value: 'humanitarian',
			},
			{
				label: __('Cycle Map', 'maxi-blocks'),
				value: 'cycle',
			},
			{
				label: __('Transport', 'maxi-blocks'),
				value: 'transport',
			},
		];
	};

	const handleMapTypeChange = val => {
		onChange({ 'map-type': val });
	};

	return (
		<div className='maxi-map-control'>
			{!hasApiKey && mapProvider === 'googlemaps' && (
				<InfoBox
					message={__(
						'You have not set your Google map API key, please navigate to the Maxi Block Options and set it',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Maxi Block Settings', 'maxi-blocks'),
							href: getMaxiAdminSettingsUrl(),
						},
					]}
				/>
			)}
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-map-control__provider'
				label={__('Map service provider', 'maxi-blocks')}
				value={mapProvider}
				options={[
					{
						label: __('Open Street Map', 'maxi-blocks'),
						value: 'openstreetmap',
					},
					{
						label: __('Google Maps Api', 'maxi-blocks'),
						value: 'googlemaps',
					},
				]}
				onChange={val => {
					// Reset map type when changing provider
					const newMapType =
						val === 'googlemaps' ? 'roadmap' : 'standard';
					onChange({
						'map-provider': val,
						'map-type': newMapType,
					});
				}}
			/>
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-map-control__type'
				label={__('Map type', 'maxi-blocks')}
				value={currentMapType}
				options={getMapTypeOptions()}
				onChange={handleMapTypeChange}
				key={`map-type-${mapProvider}-${currentMapType}`}
			/>
			<AdvancedNumberControl
				className='maxi-map-control__min-zoom'
				label={__('Minimum zoom', 'maxi-blocks')}
				min={1}
				max={mapMaxZoom - 1 || 21}
				initial={1}
				step={1}
				value={mapMinZoom}
				onChangeValue={val => onChange({ 'map-min-zoom': val })}
				onReset={() =>
					onChange({
						'map-min-zoom': getDefaultAttribute('map-min-zoom'),
						isReset: true,
					})
				}
			/>
			<AdvancedNumberControl
				className='maxi-map-control__max-zoom'
				label={__('Maximum zoom', 'maxi-blocks')}
				min={mapMinZoom + 1 || 2}
				max={22}
				initial={1}
				step={1}
				value={mapMaxZoom}
				onChangeValue={val => onChange({ 'map-max-zoom': val })}
				onReset={() =>
					onChange({
						'map-max-zoom': getDefaultAttribute('map-max-zoom'),
						isReset: true,
					})
				}
			/>
		</div>
	);
};

export default MapControl;
