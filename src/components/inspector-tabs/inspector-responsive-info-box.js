/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';
import { select } from '@wordpress/data';

/**
 * Component
 */
const responsiveInfoBox = ({ props }) => {
	const { deviceType } = props;
	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	return (
		deviceType !== 'general' &&
		deviceType !== baseBreakpoint && (
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
