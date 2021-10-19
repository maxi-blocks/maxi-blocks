/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '../info-box';

/**
 * Component
 */
const infoBox = ({ props }) => {
	const { deviceType } = props;

	return (
		deviceType !== 'general' && (
			<InfoBox
				message={__(
					'You are currently in responsive editing mode. Select Base to continue editing general settings.',
					'maxi-blocks'
				)}
			/>
		)
	);
};

export default infoBox;
