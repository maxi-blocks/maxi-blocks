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
	const { attributes, maxiSetAttributes } = props;
	const { content } = attributes;

	return {
		label: __('Prompt', 'maxi-blocks'),
		content: (
			<PromptControl
				content={content}
				onContentChange={newContent =>
					maxiSetAttributes({ content: newContent })
				}
			/>
		),
	};
};

export default position;
