/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element;
const { Button, Dropdown, Spinner, Icon } = wp.components;
const { useSelect } = wp.data;

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
import { chevronDown } from '../../icons';

/**
 * Component
 */
const FontFamilySelector = props => {
	const { font, onChange, className, theme = 'light' } = props;

	const { options } = useSelect(select => {
		const { getFonts } = select('maxiBlocks/fonts');

		const fonts = getFonts();
		const options = Object.values(fonts).map(({ value }) => {
			return { label: value, value };
		});

		return {
			options,
		};
	});

	const selectFontFamilyStyles = {
		control: styles => ({
			...styles,
			minWidth: 240,
			margin: 8,
			backgroundColor: theme === 'dark' ? '#232433' : '#fff',
			border:
				theme === 'dark' ? '2px solid #80828a' : '2px solid #dddfe2',
			color: theme === 'dark' ? '#fff' : '#464a53',
		}),
		input: styles => ({
			...styles,
			color: theme === 'dark' ? '#fff' : '#464a53',
		}),
		option: (styles, { isFocused }) => ({
			...styles,
			backgroundColor:
				isFocused && (theme === 'dark' ? '#4f515c' : '#f2f2f2'),
		}),
		indicatorsContainer: () => ({
			display: 'none',
		}),
		menu: () => ({
			boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
		}),
		menuList: () => ({
			maxHeight: '300px',
			overflowY: 'auto',
			paddingBottom: '4px',
			paddingTop: '4px',
			position: 'relative',
			webkitOverflowScrolling: 'touch',
			boxSizing: 'border-box',
			overflowX: 'hidden',
		}),
	};

	const onFontChange = newFont => {
		onChange(newFont);

		loadFonts(newFont.value, newFont.files);
	};

	const classes = classnames('maxi-font-family-selector', className);

	const popoverClasses = classnames(
		'maxi-font-family-selector__popover',
		theme === 'dark' && 'maxi-font-family-selector__popover__dark'
	);

	return (
		<Dropdown
			className={classes}
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					className='maxi-font-family-selector__button'
					onClick={onToggle}
				>
					{font}
					<Icon
						className='maxi-font-family-selector__button__icon'
						icon={chevronDown}
					/>
				</Button>
			)}
			popoverProps={{
				className: popoverClasses,
				noArrow: true,
				position: 'middle center right',
			}}
			renderContent={() => (
				<Fragment>
					{!isNil(options) && (
						<Select
							value={font}
							options={options}
							placeholder={__('Search…', 'maxi-blocks')}
							onChange={value => onFontChange(value)}
							controlShouldRenderValue={false}
							hideSelectedOptions={false}
							styles={selectFontFamilyStyles}
							isClearable={false}
							backspaceRemovesValue={false}
							tabSelectsValue={false}
							menuIsOpen
							closeMenuOnSelect
							autoFocus
						/>
					)}
					{isNil(options) && <Spinner />}
				</Fragment>
			)}
		/>
	);
};

export default FontFamilySelector;
