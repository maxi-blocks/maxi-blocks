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
import { transformAdvancedCssCode } from './utils';

/**
 * Styles
 */
import './editor.scss';
import withRTC from '@extensions/maxi-block/withRTC';

const AdvancedCssControl = ({ breakpoint, onChange, ...attributes }) => {
	const [isExampleShown, setIsExampleShown] = useState(false);

	const value = getLastBreakpointAttribute({
		target: 'advanced-css',
		breakpoint,
		attributes,
	});

	return (
		<CssCodeEditor
			label={__(
				'Affects only current block, you can add selectors for inner elements.',
				'maxi-blocks'
			)}
			value={value}
			onChange={onChange}
			transformCssCode={transformAdvancedCssCode}
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
