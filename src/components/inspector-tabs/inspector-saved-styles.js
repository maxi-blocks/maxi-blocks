/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SavedStyles from '@components/saved-styles';

const SavedStylesTab = props => {
	const { clientId, name } = props;

	// Get the block name from props directly or from the selected block if not provided
	const blockName = useSelect(
		select => {
			const { getBlockName, getSelectedBlockClientId } =
				select('core/block-editor');

			// First try using the name from props (most direct)
			if (name) {
				return name;
			}

			// Then try using the provided clientId
			if (clientId) {
				const nameFromClientId = getBlockName(clientId);
				return nameFromClientId;
			}

			// Fallback: Get the currently selected block's clientId
			const selectedClientId = getSelectedBlockClientId();

			if (selectedClientId) {
				const nameFromSelectedClientId = getBlockName(selectedClientId);
				return nameFromSelectedClientId;
			}

			return null;
		},
		[clientId, name]
	);

	return {
		label: __('Copy and paste styles', 'maxi-blocks'),
		content: <SavedStyles {...props} blockName={blockName} />,
	};
};

export default SavedStylesTab;
