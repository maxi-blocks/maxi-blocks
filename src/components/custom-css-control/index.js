/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, capitalize } from 'lodash';
import CodeEditor from '@uiw/react-textarea-code-editor';
import cssValidator from 'w3c-css-validator';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const CustomCssControl = props => {
	const { breakpoint, categories, category, selectors, value, onChange } =
		props;

	const [notValidCode, setNotValidCode] = useState({});

	const getOptions = () => {
		const options = [
			{
				label: 'Choose',
				value: 'none',
			},
		];

		const isEmptyObject = obj => {
			if (obj)
				return Object.keys(obj).every(key => {
					return obj[key] === '' || obj[key] === null;
				});
			return true;
		};

		categories?.forEach(category => {
			const optionClass = !isEmptyObject(value?.[category])
				? 'maxi-option__in-use'
				: 'maxi-option__not-in-use';

			options.push({
				label: capitalize(category),
				value: category,
				className: optionClass,
			});
		});
		return options;
	};

	const validateCSSCode = async code => {
		let responseFinal = '';
		try {
			const codeToCheck = `body {${code}}`;
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

	const generateComponent = (label, index, category) => {
		const labelForCss = label
			.replaceAll(':', '')
			.replaceAll("'", '')
			.replaceAll('>', '')
			.replaceAll('*', '')
			.replaceAll('(', '')
			.replaceAll(')', '')
			.trim()
			.replaceAll(' ', '_');
		const id = `maxi-custom-css-control__error-text--${labelForCss}`;

		const onChangeCssCode = (code, valid = true) => {
			const newCustomCss = !isEmpty(value) ? cloneDeep(value) : {};

			if (!valid) setNotValidCode(cloneDeep(newCustomCss));
			else {
				delete notValidCode?.[category]?.[index];
				if (isEmpty(notValidCode[category]))
					delete notValidCode[category];

				setNotValidCode(notValidCode);
			}

			if (!isEmpty(code)) {
				if (isEmpty(newCustomCss[category]))
					newCustomCss[category] = {};

				newCustomCss[category][index] = code;
			} else {
				delete newCustomCss?.[category]?.[index];
				if (isEmpty(newCustomCss[category]))
					delete newCustomCss[category];
			}

			onChange(`custom-css-${breakpoint}`, newCustomCss);
		};

		async function validateCss(code) {
			const messageDiv = document.getElementById(id);
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

		const getValue = () => {
			const notValidValue = notValidCode?.[category]?.[index];
			const validValue = value?.[category]?.[index];

			return !isEmpty(notValidValue) ? notValidValue : validValue;
		};

		let typingTimeout = null;

		return (
			<BaseControl
				key={`${label}`}
				label={`${__('Custom CSS for', 'maxi-blocks')} ${__(
					label,
					'maxi-blocks'
				)}`}
				className={`maxi-custom-css-control__group maxi-custom-css-control__group--${labelForCss}`}
			>
				{!isEmpty(value?.[category]?.[index]) && (
					<Button
						aria-label={__('Validate', 'maxi-blocks')}
						className={`maxi-custom-css-control__validate-button maxi-custom-css-control__validate-button--${labelForCss}`}
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
					className={`maxi-custom-css-control__code-editor maxi-custom-css-control__code-editor--${labelForCss}`}
					value={getValue()}
					onChange={textarea => {
						if (typingTimeout) clearTimeout(typingTimeout);
						typingTimeout = setTimeout(
							() => onChangeCssCode(textarea?.target?.value),
							200
						);
					}}
					onBlur={textarea => {
						validateCss(textarea?.target?.value);
					}}
				/>
				<div className='maxi-custom-css-control__error' id={id} />
			</BaseControl>
		);
	};

	return (
		<ResponsiveTabsControl
			className='maxi-custom-css-control'
			breakpoint={breakpoint}
			target='custom-css'
		>
			<>
				<SelectControl
					label={__('Add CSS for', 'maxi-blocks')}
					className='maxi-custom-css-control__category'
					id='maxi-custom-css-control__category'
					value={category || 'none'}
					options={getOptions()}
					onChange={val => onChange('custom-css-category', val)}
					newStyle
				/>
				{!isEmpty(selectors?.[category]) &&
					Object.entries(selectors?.[category])?.map(element => {
						const label = element?.[1]?.label;
						const index = element?.[0];
						return generateComponent(label, index, category);
					})}
			</>
		</ResponsiveTabsControl>
	);
};

export default CustomCssControl;
