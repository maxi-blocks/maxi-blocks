/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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

	const validateCSS = async code => {
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
			console.error(__(`Error validating css: ${err}`, 'maxi-blocks'));
		}
		return responseFinal;
	};

	const generateComponent = (label, index, category) => {
		const labelForCss = label.replaceAll(' ', '_');
		const id = `maxi-additional__css-error-text__${labelForCss}`;

		const onChangeCssCode = code => {
			const newCustomCss = !isEmpty(value) ? cloneDeep(value) : {};
			if (!isEmpty(code)) {
				if (isEmpty(newCustomCss[category]))
					newCustomCss[category] = {};

				newCustomCss[category][index] = code;
			} else {
				delete newCustomCss[category][index];
				if (isEmpty(newCustomCss[category]))
					delete newCustomCss[category];
			}

			onChange(`custom-css-${breakpoint}`, newCustomCss);
		};

		async function validateCss(code) {
			const messageDiv = document.getElementById(id);
			console.log(`category: ${category}`);
			console.log(`index: ${index}`);
			console.log(`value: ${JSON.stringify(value)}`);
			if (!isEmpty(code)) {
				const validMessage = await validateCSS(code);
				if (typeof validMessage === 'string' && messageDiv) {
					messageDiv.innerHTML = validMessage;
					messageDiv.classList.remove('valid');
					messageDiv.classList.add('not-valid');
					onChangeCssCode('');
				} else if (messageDiv) {
					messageDiv.innerHTML = __('Valid', 'maxi-blocks');
					messageDiv.classList.remove('not-valid');
					messageDiv.classList.add('valid');
				}
			} else if (messageDiv) {
				messageDiv.innerHTML = '';
				messageDiv.classList.remove('not-valid');
				messageDiv.classList.remove('valid');
			}
		}

		return (
			<BaseControl
				key={`${label}`}
				label={`${__('Custom CSS for', 'maxi-blocks')} ${__(
					label,
					'maxi-blocks'
				)}`}
				className={`maxi-additional__css maxi-additional__css-${labelForCss}`}
			>
				{!isEmpty(value?.[category]?.[index]) && (
					<Button
						aria-label={__('Validate', 'maxi-blocks')}
						className='maxi-default-styles-control__button'
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
					value={value?.[category]?.[index]}
					onChange={textarea =>
						onChangeCssCode(textarea?.target?.value)
					}
					onBlur={textarea => {
						validateCss(textarea?.target?.value);
					}}
				/>
				<div className='maxi-additional__css-error' id={id} />
			</BaseControl>
		);
	};

	return (
		<ResponsiveTabsControl
			className='maxi-typography-control__text-options-tabs'
			breakpoint={breakpoint}
		>
			<>
				<SelectControl
					label={__('Add CSS for', 'maxi-blocks')}
					className='maxi-custom-css-control__category'
					id='maxi-custom-css-control__category'
					value={category || 'none'}
					options={getOptions()}
					onChange={val => onChange('custom-css-category', val)}
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
