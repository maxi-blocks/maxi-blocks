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
	const { font, onChange, className, theme = 'light', defaultValue } = props;

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

	const selectFontFamilyStyles = {
		control: styles => ({
			...styles,
			width: '100%',
			backgroundColor: theme === 'dark' ? '#232433' : '#fff',
			border:
				theme === 'dark' ? '2px solid #80828a' : '2px solid #dddfe2',
			outline: 'none',
			boxShadow: 'none',
			':hover': {
				cursor: 'pointer',
				border:
					theme === 'dark'
						? '2px solid #80828a'
						: '2px solid #dddfe2',
			},
		}),
		input: styles => ({
			...styles,
			color: theme === 'dark' ? '#fff' : '#464a53',
		}),
		placeholder: styles => ({
			...styles,
			color: '#bcbcbd',
		}),
		singleValue: styles => ({
			...styles,
			color: theme === 'dark' ? '#fff' : '#464a53',
		}),
		option: (styles, { isFocused }) => ({
			...styles,
			backgroundColor:
				isFocused && (theme === 'dark' ? '#4f515c' : '#f2f2f2'),
		}),
		indicatorsContainer: () => ({
			display: 'flex',
			border: 'none',
		}),
		loadingIndicator: () => ({
			position: 'absolute',
			top: '12px',
			right: '40px',
		}),
		menu: () => ({
			boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
		}),
		menuList: () => ({
			color: theme === 'dark' ? '#fff' : '#464a53',
			backgroundColor: theme === 'dark' ? '#464a53' : '#fff',
			maxHeight: '300px',
			overflowY: 'auto',
			paddingBottom: '4px',
			paddingTop: '4px',
			position: 'absolute',
			top: '45px',
			left: 0,
			webkitOverflowScrolling: 'touch',
			boxSizing: 'border-box',
			overflowX: 'hidden',
			borderRadius: '5px',
			width: '100%',
			boxShadow: '0 2px 7px 0 rgba(0, 0, 0, 0.2)',
		}),
	};

	const onFontChange = newFont => {
		onChange(newFont);

		loadFonts(newFont.value, newFont.files);

		setValue({ label: newFont.value, value: newFont.value });
	};

	const classes = classnames('maxi-font-family-selector', className);

	return (
		<Select
			theme={theme => ({
				...theme,
				colors: {
					...theme.colors,
					primary50: '#ff4a17',
				},
			})}
			styles={selectFontFamilyStyles}
			className={classes}
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
