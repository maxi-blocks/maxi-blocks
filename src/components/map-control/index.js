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
				onChange={value => onChange(value)}
			/>
			<TextControl
				label={__('Latitude', 'maxi-blocks')}
				value={props['map-Latitude']}
				onChange={value => onChange(value)}
			/>
			<TextControl
				label={__('Longitude', 'maxi-blocks')}
				value={props['map-longitude']}
				onChange={value => onChange(value)}
			/>
		</div>
	);
};

export default MapControl;
