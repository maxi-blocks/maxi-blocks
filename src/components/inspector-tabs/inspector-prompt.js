/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PromptControl from '../prompt-control';

/**
 * Component
 */
const position = ({ props }) => {
	// const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Prompt', 'maxi-blocks'),
		content: <PromptControl />,
	};
};

export default position;
