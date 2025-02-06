/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';

/**
 * Component
 */
const responsiveInfoBox = ({ props }) => {
	const { deviceType } = props;

	return (
		deviceType !== 'general' && (
			<InfoBox
				message={__(
					'Responsive mode activated. Edits apply exclusively to selected break points. Return to "Your size" for global editing (recommended).',
					'maxi-blocks'
				)}
			/>
		)
	);
};

export default responsiveInfoBox;
