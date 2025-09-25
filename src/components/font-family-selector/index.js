/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */

import { loadFontsInEditor } from '@extensions/text/fonts';
import BaseControl from '@components/base-control';
import ResetButton from '@components/reset-control';

/**
 * External dependencies
 */
import Select from 'react-select';
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
		const { getFonts } = select('maxiBlocks/text');

		const fonts = getFonts();
		const options = Object.values(fonts).map(({ value }) => {
			return { label: value, value };
		});

		return {
			options,
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
		<BaseControl __nextHasNoMarginBottom>
			<div className='maxi-font-family-selector__container'>
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

				{!disableFontFamilyReset && (
					<ResetButton
						isAbsolute
						isTopRight
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
