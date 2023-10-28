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
const prompt = ({ props }) => {
	const { clientId, attributes, maxiSetAttributes } = props;
	const { content, isList } = attributes;

	return (
		!isList && {
			label: __('Prompt', 'maxi-blocks'),
			content: (
				<PromptControl
					clientId={clientId}
					content={content}
					onContentChange={newContent =>
						maxiSetAttributes({ content: newContent })
					}
				/>
			),
			indicatorProps: ['prompt'],
		}
	);
};

export default prompt;
