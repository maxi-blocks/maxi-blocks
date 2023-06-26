/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '../../info-box';

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
					'Repeater is turned on for row, in which this block is placed. Changes made to this block will be applied to all repeated blocks.',
					'maxi-blocks'
				)}
				links={[
					{
						title: __('You can disable it here', 'maxi-blocks'),
						panel: 'repeater',
						clientId: repeaterRowClientId,
					},
				]}
			/>
		)
	);
};

export default repeaterInfoBox;
