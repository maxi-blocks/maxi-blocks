/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import CssCodeEditor from '@components/css-code-editor';
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import withRTC from '@extensions/maxi-block/withRTC';

const AdvancedCssControl = ({ breakpoint, onChange, testId, ...attributes }) => {
	const [isExampleShown, setIsExampleShown] = useState(false);

	const value = getLastBreakpointAttribute({
		target: 'advanced-css',
		breakpoint,
		attributes,
	});

	const transformCssCode = code => {
		if (!code) return '';

		// Check if the code starts with a selector.
		const selectorRegex =
			/([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/;
		const matches = code.match(selectorRegex);

		// If the code doesn't start with a selector, find the first selector and wrap everything before it with 'body'
		if (!matches) {
			const firstSelectorIndex = code.search(
				/([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/
			);
			if (firstSelectorIndex > 0) {
				return `body {${code.substring(
					0,
					firstSelectorIndex
				)}}${code.substring(firstSelectorIndex)}`;
			}
			return `body {${code}}`; // if there's no selector at all in the input
		}
		return code;
	};

	return (
		<CssCodeEditor
			label={__(
				'Affects only current block, you can add selectors for inner elements.',
				'maxi-blocks'
			)}
			value={value}
			onChange={onChange}
			transformCssCode={transformCssCode}
			testId={testId}
		>
			<div className='maxi-advanced-css-control__example-wrapper'>
				<Button
					className='maxi-advanced-css-control__example-button'
					onClick={() => setIsExampleShown(!isExampleShown)}
				>
					{__(
						`${isExampleShown ? 'Hide' : 'Show'} example`,
						'maxi-blocks'
					)}
				</Button>
				{isExampleShown && (
					<CssCodeEditor
						value={`width: 60px;
.wp-comment-form {
  margin-top: 20px;
}

.wp-comment-form .comment-form-author {
  font-size: 20px;
}`}
						disabled
					/>
				)}
			</div>
		</CssCodeEditor>
	);
};

export default withRTC(AdvancedCssControl);
