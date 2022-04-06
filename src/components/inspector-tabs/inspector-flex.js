/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
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

	const { getBlockParents, getBlockName } = select('core/block-editor');

	const getParentBlockName = getBlockName(
		getBlockParents(clientId)
			?.filter(id => id !== clientId)
			?.slice(-1)
	);

	const wrapperBlocks = [
		'maxi-blocks/container-maxi',
		'maxi-blocks/row-maxi',
		'maxi-blocks/column-maxi',
		'maxi-blocks/group-maxi',
	];

	if (
		!wrapperBlocks.includes(getParentBlockName) &&
		!wrapperBlocks.includes(name)
	)
		return null;

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
					getParentBlockName={getParentBlockName}
				/>
			</>
		),
	};
};

export default flex;
