/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import InfoBox from '../info-box';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const MapControl = props => {
	const { onChange, hasApiKey = false } = props;

	return (
		<div className='maxi-map-control'>
			{!hasApiKey && (
				<InfoBox
					message={__(
						'You have not set your Google map API key, please navigate to the Maxi Block Options and set it',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Maxi Block Options', 'maxi-blocks'),
							href: '/wp-admin/admin.php?page=maxi-blocks.php',
						},
					]}
				/>
			)}
			<SelectControl
				label={__('Map service provider', 'maxi-blocks')}
				value={props['map-provider']}
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
				onChange={val => onChange({ 'map-provider': val })}
			/>
			<AdvancedNumberControl
				label={__('Minimum zoom', 'maxi-blocks')}
				min={1}
				max={21}
				initial={1}
				step={1}
				value={props['map-min-zoom']}
				onChangeValue={val => onChange({ 'map-min-zoom': val })}
				onReset={() =>
					onChange({
						'map-min-zoom': getDefaultAttribute('map-min-zoom'),
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Maximum zoom', 'maxi-blocks')}
				min={2}
				max={22}
				initial={1}
				step={1}
				value={props['map-max-zoom']}
				onChangeValue={val => onChange({ 'map-max-zoom': val })}
				onReset={() =>
					onChange({
						'map-max-zoom': getDefaultAttribute('map-max-zoom'),
					})
				}
			/>
		</div>
	);
};

export default MapControl;
