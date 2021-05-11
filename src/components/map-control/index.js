/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

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
				value={props['map-Latitude']}
				onChange={val => onChange({ ['map-Latitude']: val })}
			/>
			<TextControl
				label={__('Longitude', 'maxi-blocks')}
				value={props['map-longitude']}
				onChange={val => onChange({ ['map-longitude']: val })}
			/>
		</div>
	);
};

export default MapControl;
