/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import CssCodeEditor from '@components/css-code-editor';
import { getLastBreakpointAttribute } from '@extensions/styles';
import { getAdvancedCssChange } from './utils';

/**
 * Styles
 */
import './editor.scss';
import withRTC from '@extensions/maxi-block/withRTC';

const AdvancedCssControl = ({ breakpoint, onChange, ...attributes }) => {
	const [isExampleShown, setIsExampleShown] = useState(false);
	const [notValidCode, setNotValidCode] = useState();

	const value = getLastBreakpointAttribute({
		target: 'advanced-css',
		breakpoint,
		attributes,
	});
	const currentAdvancedCss = attributes[`advanced-css-${breakpoint}`];

	const transformCssCode = useCallback(code => {
		if (!code) return '';

		// Check if the code starts with a selector.
		const selectorRegex =
			/([@a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/;
		const matches = code.match(selectorRegex);

		// If the code doesn't start with a selector, find the first selector and wrap everything before it with 'body'
		if (matches?.index > 0) {
			return `body {${code.substring(
				0,
				matches.index
			)}}${code.substring(matches.index)}`;
		}

		if (!matches) {
			return `body {${code}}`; // if there's no selector at all in the input
		}
		return code;
	}, []);

	useEffect(() => {
		if (currentAdvancedCss === undefined) return;

		const { isValid, valueToPersist, shouldUpdateAttribute } =
			getAdvancedCssChange({
				code: currentAdvancedCss,
				currentValue: currentAdvancedCss,
				transformCssCode,
			});

		if ((!isValid || valueToPersist === undefined) && shouldUpdateAttribute)
			onChange(valueToPersist);
	}, [currentAdvancedCss, onChange, transformCssCode]);

	const onChangeCssCode = code => {
		const {
			isValid,
			notValidCode: nextNotValidCode,
			valueToPersist,
			shouldUpdateAttribute,
		} = getAdvancedCssChange({
			code,
			currentValue: currentAdvancedCss,
			transformCssCode,
		});

		if (isValid) {
			setNotValidCode();
		} else {
			setNotValidCode(nextNotValidCode);
		}

		if (shouldUpdateAttribute) onChange(valueToPersist);
	};

	return (
		<CssCodeEditor
			label={__(
				'Affects only current block, you can add selectors for inner elements.',
				'maxi-blocks'
			)}
			value={notValidCode ?? value}
			onChange={onChangeCssCode}
			transformCssCode={transformCssCode}
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
