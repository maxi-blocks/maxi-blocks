/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { loadFonts } from '../../extensions/text/fonts';

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
	const { font, onChange, className, defaultValue } = props;

	const { options } = useSelect(select => {
		const { getFonts } = select('maxiBlocks/text');

		const fonts = getFonts();
		const options = Object.values(fonts).map(({ value }) => {
			return { label: value, value };
		});

		return {
			options,
		};
	});

	const [value, setValue] = useState({ label: font, value: font });

	useEffect(() => {
		if (value.label !== font) setValue({ label: font, value: font });
	}, [font]);

	const onFontChange = newFont => {
		onChange(newFont);

		loadFonts(newFont.value, newFont.files);

		setValue({ label: newFont.value, value: newFont.value });
	};

	const classes = classnames('maxi-font-family-selector', className);

	return (
		<Select
			className={classes}
			classNamePrefix='maxi__control'
			options={options}
			value={value}
			placeholder={__('Search…', 'maxi-blocks')}
			onChange={(value, clear) =>
				clear.action === 'select-option'
					? onFontChange(value)
					: onFontChange({ label: defaultValue, value: defaultValue })
			}
			isLoading={isNil(options)}
			isClearable
			onMenuOpen={() => setValue({})}
			onMenuClose={e => setValue({ label: font, value: font })}
		/>
	);
};

export default FontFamilySelector;
