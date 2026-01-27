/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContentLoader from '@components/content-loader';

const PromptControl = lazy(() =>
	import(
		/* webpackChunkName: "maxi-ai" */ '@components/prompt-control'
	)
);

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
				<Suspense fallback={<ContentLoader />}>
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
