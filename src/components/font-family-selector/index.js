/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect, Suspense, lazy } from '@wordpress/element';

/**
 * Internal dependencies
 */

import { loadFontsInEditor } from '@extensions/text/fonts';
import BaseControl from '@components/base-control';
import ResetButton from '@components/reset-control';
import Spinner from '@components/spinner';

/**
 * External dependencies
 */
const Select = lazy(() => import('react-select').then(m => ({ default: m.default })));
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const FontFamilySelector = props => {
	const {
		font,
		onChange,
		className,
		defaultValue,
		fontWeight,
		fontStyle,
		disableFontFamilyReset = false,
		setShowLoader,
	} = props;

	const { options } = useSelect(select => {
		const store = select('maxiBlocks/text');
		const fonts = store?.getFonts?.() ?? {};
		const customFonts = store?.getCustomFonts?.() ?? {};

		const customOptions = [];
		const standardOptions = [];

		Object.values(fonts).forEach(fontData => {
			const value = fontData?.value;

			if (!value) {
				return;
			}

			const option = { label: value, value };

			if (customFonts?.[value]) {
				customOptions.push(option);
				return;
			}

			standardOptions.push(option);
		});

		const groupedOptions = [];

		if (customOptions.length) {
			groupedOptions.push({
				label: __('Custom fonts', 'maxi-blocks'),
				options: customOptions,
			});
		}

		if (standardOptions.length) {
			groupedOptions.push({
				label: __('Maxi fonts', 'maxi-blocks'),
				options: standardOptions,
			});
		}

		return {
			options: groupedOptions.length ? groupedOptions : standardOptions,
		};
	}, []);

	const [value, setValue] = useState({ label: font, value: font });

	useEffect(() => {
		if (value.label !== font) setValue({ label: font, value: font });
	}, [font]);

	const onFontChange = newFont => {
		onChange(newFont);

		const objFont = { [newFont.value]: {} };

		if (fontWeight) objFont[newFont.value].weight = fontWeight.toString();
		if (fontStyle) objFont[newFont.value].style = fontStyle;
		loadFontsInEditor(objFont, setShowLoader);

		setValue({ label: newFont.value, value: newFont.value });
	};

	const classes = classnames('maxi-font-family-selector', className);

	return (
		<BaseControl
			__nextHasNoMarginBottom
			className='maxi-font-family-selector-control'
		>
			<div className='maxi-font-family-selector__container'>
				<Suspense fallback={<Spinner />}>
					<Select
						className={classes}
						classNamePrefix='maxi-font-family-selector__control'
						options={options}
						value={value}
						placeholder={__('Search…', 'maxi-blocks')}
						onChange={(value, clear) =>
							clear.action === 'select-option'
								? onFontChange(value)
								: onFontChange({
										label: defaultValue,
										value: defaultValue,
								  })
						}
						isLoading={isNil(options)}
						isClearable
						onMenuOpen={() => setValue({})}
						onMenuClose={e => setValue({ label: font, value: font })}
					/>
				</Suspense>

				{!disableFontFamilyReset && (
					<ResetButton
						isInline
						onReset={e => {
							onFontChange({
								label: defaultValue,
								value: defaultValue,
							});
						}}
					/>
				)}
			</div>
		</BaseControl>
	);
};

export default FontFamilySelector;
