/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FLexSettingsControl from '../flex-settings-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const flex = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes, name, clientId } = props;

	return {
		label: __('Flex', 'maxi-blocks'),
		content: (
			<>
				<FLexSettingsControl
					{...getGroupAttributes(attributes, 'flex')}
					onChange={maxiSetAttributes}
					breakpoint={deviceType}
					clientId={clientId}
					name={name}
				/>
			</>
		),
	};
};

export default flex;
