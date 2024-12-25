/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const repeaterInfoBox = ({ props }) => {
	const { clientId, repeaterStatus, repeaterRowClientId } = props;

	return (
		repeaterStatus &&
		clientId !== repeaterRowClientId && (
			<InfoBox
				className='maxi-repeater-info-box'
				message={__(
					'Repeater enabled. Style and block edits are synchronized to all blocks inside the same row.',
					'maxi-blocks'
				)}
				links={[
					{
						title: __('Change setting', 'maxi-blocks'),
						panel: 'repeater',
						clientId: repeaterRowClientId,
					},
				]}
			/>
		)
	);
};

export default repeaterInfoBox;
