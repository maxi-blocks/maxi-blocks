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

	const classes = classnames('maxi-number-counter-control', className);

	return (
		<div className={classes}>
			<p>Settings goes here :)</p>
		</div>
	);
};

export default MapControl;
