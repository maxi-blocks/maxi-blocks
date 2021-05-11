/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { SizeControl, ColorControl } from '../../components';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { uniqueId } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import * as mapMarkers from '../../icons/map-icons';

/**
 * Component
 */
const MapControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-map-control', className);

	return (
		<div className={classes}>
			<TextControl
				label={__('API Key', 'maxi-blocks')}
				value={props['map-api-key']}
				onChange={val => onChange({ ['map-api-key']: val })}
			/>
			<TextControl
				label={__('Latitude', 'maxi-blocks')}
				value={props['map-latitude']}
				onChange={val => onChange({ ['map-latitude']: val })}
			/>
			<TextControl
				label={__('Longitude', 'maxi-blocks')}
				value={props['map-longitude']}
				onChange={val => onChange({ ['map-longitude']: val })}
			/>
			<div className='maxi-map-control__markers'>
				{Object.keys(mapMarkers).map((item, index) => (
					<div
						key={`map-marker-${uniqueId()}`}
						data-item={index + 1}
						onClick={e =>
							onChange({
								['map-marker']: +e.currentTarget.dataset.item,
							})
						}
						className={`maxi-map-control__markers__item ${
							props['map-marker'] - 1 === index
								? 'maxi-map-control__markers__item--active'
								: null
						}`}
					>
						{mapMarkers[item]}
					</div>
				))}
			</div>
			<SizeControl
				label={__('Marker Opacity', 'maxi-blocks')}
				disableUnit
				min={0.1}
				max={1}
				initial={1}
				step={0.1}
				value={props['map-marker-opacity']}
				onChangeValue={val => onChange({ 'map-marker-opacity': val })}
				onReset={() =>
					onChange({
						'map-marker-opacity': getDefaultAttribute(
							'map-marker-opacity'
						),
					})
				}
			/>
			<SizeControl
				label={__('Marker Scale', 'maxi-blocks')}
				disableUnit
				min={1}
				max={10}
				initial={1}
				step={1}
				value={props['map-marker-scale']}
				onChangeValue={val => onChange({ 'map-marker-scale': val })}
				onReset={() =>
					onChange({
						'map-marker-scale': getDefaultAttribute(
							'map-marker-scale'
						),
					})
				}
			/>
			<ColorControl
				label={__('Marker Fill', 'maxi-blocks')}
				disableOpacity
				color={props['map-marker-fill-color']}
				defaultColor={getDefaultAttribute('map-marker-fill-color')}
				onChange={val => onChange({ 'map-marker-fill-color': val })}
			/>
			<ColorControl
				label={__('Marker Stroke', 'maxi-blocks')}
				disableOpacity
				color={props['map-marker-stroke-color']}
				defaultColor={getDefaultAttribute('map-marker-stroke-color')}
				onChange={val => onChange({ 'map-marker-stroke-color': val })}
			/>
		</div>
	);
};

export default MapControl;
