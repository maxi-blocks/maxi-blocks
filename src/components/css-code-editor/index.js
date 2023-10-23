/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';

/**
 * External dependencies
 */
import CodeEditor from '@uiw/react-textarea-code-editor';
import cssValidator from 'w3c-css-validator';
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const CssCodeEditor = ({
	label,
	value,
	children,
	onChange,
	transformCssCode,
	disabled,
}) => {
	const errorRef = useRef(null);

	const labelForCss =
		label
			?.replaceAll(':', '')
			.replaceAll("'", '')
			.replaceAll('>', '')
			.replaceAll('*', '')
			.replaceAll('(', '')
			.replaceAll(')', '')
			.trim()
			.replaceAll(' ', '_') || 'empty';

	const validateCSSCode = async code => {
		let responseFinal = '';
		try {
			const codeToCheck = transformCssCode(code);
			const response = await cssValidator.validateText(codeToCheck, {
				lang: 'en',
				warningLevel: 0,
			});

			if (!response.valid) {
				response.errors.forEach(error => {
					responseFinal = `${responseFinal} ${__(
						'line',
						'maxi-blocks'
					)} ${error?.line} - ${error?.message}<br>`;
				});
				return responseFinal;
			}
			return true;
		} catch (err) {
			responseFinal = 0;
			console.error(__(`Error validating css: ${err}`, 'maxi-blocks'));
		}
		return responseFinal;
	};

	async function validateCss(code) {
		const messageDiv = errorRef.current;
		if (!isEmpty(code)) {
			const validMessage = await validateCSSCode(code);
			if (typeof validMessage === 'string' && messageDiv) {
				messageDiv.innerHTML = validMessage;
				messageDiv.classList.remove('valid');
				messageDiv.classList.add('not-valid');
			} else if (validMessage !== 0 && messageDiv) {
				messageDiv.innerHTML = __('Valid', 'maxi-blocks');
				messageDiv.classList.remove('not-valid');
				messageDiv.classList.add('valid');
			} else {
				messageDiv.innerHTML = __(
					'Failed to check, please try again',
					'maxi-blocks'
				);
				messageDiv.classList.add('not-valid');
				messageDiv.classList.remove('valid');
			}
		} else if (messageDiv) {
			messageDiv.innerHTML = '';
			messageDiv.classList.remove('not-valid');
			messageDiv.classList.remove('valid');
		}
	}

	let typingTimeout = null;

	const id = `maxi-css-code-editor__error-text--${labelForCss}`;

	return (
		<BaseControl
			label={label}
			className={`maxi-css-code-editor maxi-css-code-editor--${labelForCss}`}
		>
			{!disabled && !isEmpty(value) && (
				<Button
					aria-label={__('Validate', 'maxi-blocks')}
					className={`maxi-css-code-editor__validate-button maxi-css-code-editor__validate-button--${labelForCss}`}
					onClick={el => {
						validateCss(
							el?.target?.nextSibling?.getElementsByTagName(
								'textarea'
							)?.[0]?.value
						);
					}}
				>
					{__('Validate', 'maxi-blocks')}
				</Button>
			)}
			<CodeEditor
				language='css'
				className={`maxi-css-code-editor__code-editor maxi-css-code-editor__code-editor--${labelForCss}`}
				value={value}
				onChange={textarea => {
					if (typingTimeout) clearTimeout(typingTimeout);
					typingTimeout = setTimeout(
						() => onChange(textarea?.target?.value),
						200
					);
				}}
				onBlur={textarea => {
					validateCss(textarea?.target?.value);
				}}
				disabled={disabled}
			/>
			{!disabled && (
				<div
					ref={errorRef}
					className='maxi-css-code-editor__error'
					id={id}
				/>
			)}
			{children}
		</BaseControl>
	);
};

export default CssCodeEditor;
