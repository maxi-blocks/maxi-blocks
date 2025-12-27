/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Suspense, lazy } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Spinner from '@components/spinner';
const PromptControl = lazy(() => import(/* webpackChunkName: "maxi-ai-writer" */ '@components/prompt-control'));

/**
 * Component
 */
const prompt = ({ props }) => {
	const { clientId, attributes, maxiSetAttributes } = props;
	const { content, isList } = attributes;

	return (
		!isList && {
			label: __('Maxi AI writer', 'maxi-blocks'),
			content: (
				<Suspense fallback={<Spinner />}>
					<PromptControl
						clientId={clientId}
						content={content}
						onContentChange={newContent =>
							maxiSetAttributes({ content: newContent })
						}
					/>
				</Suspense>
			),
			indicatorProps: ['prompt'],
		}
	);
};

export default prompt;
