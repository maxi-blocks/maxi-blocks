/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const DropMarkerAlert = ({ isAddingMarker }) => {
	return isAddingMarker ? (
		<div className='maxi-map-block__alert'>
			{__('Release to drop a marker here', 'maxi-blocks')}
		</div>
	) : null;
};

export default DropMarkerAlert;
