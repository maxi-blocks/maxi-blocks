/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, capitalize } from 'lodash';

/**
 * Internal dependencies
 */
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SelectControl from '@components/select-control';
/**
 * Styles
 */
import './editor.scss';
import CssCodeEditor from '@components/css-code-editor';

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

	const generateComponent = (label, index, category, cssClassIndex) => {
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

		const getValue = () => {
			const notValidValue = notValidCode?.[category]?.[index];
			const validValue = value?.[category]?.[index];

			return !isEmpty(notValidValue) ? notValidValue : validValue;
		};

		return (
			<CssCodeEditor
				key={label}
				label={`${__('Custom CSS for', 'maxi-blocks')} ${__(
					label,
					'maxi-blocks'
				)}`}
				value={getValue()}
				cssClassIndex={cssClassIndex}
				onChange={onChangeCssCode}
				transformCssCode={code => `body {${code}}`}
			/>
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
					__nextHasNoMarginBottom
					label={__('Add CSS for', 'maxi-blocks')}
					className='maxi-custom-css-control__category'
					id='maxi-custom-css-control__category'
					value={category || 'none'}
					options={getOptions()}
					onChange={val => onChange('custom-css-category', val)}
					newStyle
				/>
				{!isEmpty(selectors?.[category]) &&
					Object.entries(selectors?.[category])?.map(
						(element, cssClassIndex) => {
							const label = element?.[1]?.label;
							const index = element?.[0];

							return generateComponent(
								label,
								index,
								category,
								cssClassIndex + 1
							);
						}
					)}
			</>
		</ResponsiveTabsControl>
	);
};

export default CustomCssControl;
