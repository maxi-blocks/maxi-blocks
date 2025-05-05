/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import Button from '@components/button';
import ColorControl from '@components/color-control';
import Icon from '@components/icon';
import SettingTabsControl from '@components/setting-tabs-control';
import TypographyControl from '@components/typography-control';
import ToggleSwitch from '@components/toggle-switch';
import AdvancedNumberControl from '@components/advanced-number-control';
import PaddingControl from '@components/padding-control';
import TextControl from '@components/text-control';
import {
	processSCAttribute,
	showHideHamburgerNavigation,
	processSCAttributes,
	removeNavigationHoverUnderline,
} from './utils';
import {
	getDefaultSCValue,
	getTypographyFromSC,
} from '@extensions/style-cards';
import { updateCustomColorVariables } from '@extensions/style-cards/updateSCOnEditor';
import getDefaultSCAttribute from './getDefaultSCAttribute';

/**
 * Icons
 */
import { reset } from '@maxi-icons';

/**
 * Component
 */
const GlobalColor = props => {
	const {
		label,
		globalAttr,
		globalAllAttr = false,
		paletteStatus,
		paletteColor,
		paletteOpacity,
		color,
		groupAttr,
		SC,
		onChangeValue,
		SCStyle,
		disableOpacity = false,
		isHover = false,
	} = props;

	return (
		<>
			<ToggleSwitch
				// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
				label={__(`${label} colour`, 'maxi-blocks')}
				className={`maxi-style-cards-control__toggle-${globalAttr}`}
				selected={
					processSCAttribute(SC, globalAttr, groupAttr) || false
				}
				onChange={val =>
					onChangeValue(
						{
							[globalAttr]: val,
						},
						groupAttr
					)
				}
			/>
			{processSCAttribute(SC, globalAttr, groupAttr) && (
				<>
					{globalAllAttr && (
						<ToggleSwitch
							// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
							label={__(`Apply to all ${label}`, 'maxi-blocks')}
							selected={processSCAttribute(
								SC,
								globalAllAttr,
								groupAttr
							)}
							onChange={val =>
								onChangeValue(
									{
										[globalAllAttr]: val,
									},
									groupAttr
								)
							}
						/>
					)}
					<ColorControl
						label={label}
						className={`maxi-style-cards-control__sc__link--${SCStyle}`}
						paletteStatus={processSCAttribute(
							SC,
							paletteStatus,
							groupAttr
						)}
						paletteColor={processSCAttribute(
							SC,
							paletteColor,
							groupAttr
						)}
						paletteOpacity={
							processSCAttribute(SC, paletteOpacity, groupAttr) ||
							1
						}
						color={processSCAttribute(SC, color, groupAttr)}
						defaultColorAttributes={{
							defaultColor: getDefaultSCValue({
								target: color,
								SC,
								SCStyle,
								groupAttr,
							}),
						}}
						onChange={({
							paletteStatus: newPaletteStatus,
							paletteColor: newPaletteColor,
							paletteOpacity: newPaletteOpacity,
							color: newColor,
						}) => {
							onChangeValue(
								{
									[paletteStatus]: newPaletteStatus,
									[paletteColor]: newPaletteColor,
									[paletteOpacity]: newPaletteOpacity,
									[color]: newColor,
								},
								groupAttr
							);
						}}
						blockStyle={SCStyle}
						disableOpacity={disableOpacity}
						isHover={isHover}
						disableGradient
					/>
				</>
			)}
		</>
	);
};

const SCAccordion = props => {
	const {
		groupAttr,
		colorContent,
		breakpoint,
		SC,
		SCStyle,
		onChangeValue,
		disableTypography = false,
		disableOpacity = false,
	} = props;

	const ifParagraphOrHeading = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].some(
		tag => groupAttr === tag
	);

	const ifNavigationTab = ['navigation'].some(tag => groupAttr === tag);

	const overwriteMobile = ifNavigationTab
		? processSCAttribute(SC, 'overwrite-mobile', groupAttr)
		: false;

	const alwaysShowMobile = ifNavigationTab
		? processSCAttribute(SC, 'always-show-mobile', groupAttr)
		: false;

	const removeHoverUnderline = ifNavigationTab
		? processSCAttribute(SC, 'remove-hover-underline', groupAttr)
		: false;

	const showMobileFrom = ifNavigationTab
		? processSCAttribute(SC, 'show-mobile-down-from', groupAttr)
		: false;

	return (
		<>
			{!disableTypography && (
				<TypographyControl
					typography={getTypographyFromSC(SC, groupAttr)}
					className={`maxi-style-cards-control__sc__${groupAttr}-typography`}
					textLevel={groupAttr}
					breakpoint={breakpoint}
					isStyleCards
					onChange={obj => {
						onChangeValue({ typography: obj }, groupAttr);
					}}
					hideTextShadow
					showBottomGap={ifParagraphOrHeading}
					hideAlignment
					blockStyle={SCStyle}
					disablePalette
					disableFormats
					disableCustomFormats
					disableFontFamily={breakpoint !== 'general'}
				/>
			)}
			{breakpoint === 'general' &&
				colorContent.map(
					({
						label,
						globalAttr,
						globalAllAttr,
						paletteStatus,
						paletteColor,
						paletteOpacity,
						color,
					}) => (
						<GlobalColor
							key={`sc-accordion__h${label}`}
							label={label}
							globalAttr={globalAttr}
							globalAllAttr={globalAllAttr}
							paletteStatus={paletteStatus}
							paletteColor={paletteColor}
							paletteOpacity={paletteOpacity}
							color={color}
							groupAttr={groupAttr}
							SC={SC}
							onChangeValue={onChangeValue}
							SCStyle={SCStyle}
							disableOpacity={disableOpacity}
							isHover={label.includes('hover')}
						/>
					)
				)}
			{ifNavigationTab && (
				<>
					<PaddingControl
						{...processSCAttributes(SC, 'padding', groupAttr)}
						label={__('Item padding', 'maxi-blocks')}
						onChange={obj => onChangeValue(obj, groupAttr)}
						breakpoint={breakpoint}
						disableAuto
					/>
					<ToggleSwitch
						// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
						label={__(
							'Remove item underline on hover',
							'maxi-blocks'
						)}
						className='maxi-style-cards-control__toggle-remove-hover-underline'
						selected={removeHoverUnderline}
						onChange={val => {
							onChangeValue(
								{
									'remove-hover-underline': val,
								},
								groupAttr
							);
							removeNavigationHoverUnderline(val);
						}}
					/>
					<ToggleSwitch
						// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
						label={__(
							'Overwrite mobile navigation breakpoint',
							'maxi-blocks'
						)}
						className='maxi-style-cards-control__toggle-overwrite-mobile'
						selected={overwriteMobile || false}
						onChange={val => {
							onChangeValue(
								{
									'overwrite-mobile': val,
								},
								groupAttr
							);
							if (val)
								showHideHamburgerNavigation(showMobileFrom);
						}}
					/>
					{overwriteMobile && (
						<>
							<ToggleSwitch
								// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
								label={__(
									'Show mobile menu for all screen sizes',
									'maxi-blocks'
								)}
								className='maxi-style-cards-control__toggle-always-show-mobile'
								selected={alwaysShowMobile}
								onChange={val => {
									onChangeValue(
										{
											'always-show-mobile': val,
										},
										groupAttr
									);
									showHideHamburgerNavigation(
										val ? 'show' : 'hide'
									);
								}}
							/>
							{!alwaysShowMobile && (
								<AdvancedNumberControl
									label={__(
										'Show mobile menu for screen sizes down from (px)',
										'maxi-blocks'
									)}
									value={showMobileFrom}
									onChangeValue={val => {
										onChangeValue(
											{
												'show-mobile-down-from': val,
											},
											groupAttr
										);

										showHideHamburgerNavigation(val);
									}}
									onReset={() =>
										onChangeValue(
											{
												'show-mobile-down-from': 767,
											},
											groupAttr
										)
									}
									disableRange
									max={5000}
								/>
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

const MaxiStyleCardsTab = ({ SC, SCStyle, breakpoint, onChangeValue }) => {
	const [quickColorPreset, setQuickColorPreset] = useState(1);
	const [customColorName, setCustomColorName] = useState('');
	const [isAddingCustomColor, setIsAddingCustomColor] = useState(false);
	const [tempColorValue, setTempColorValue] = useState('rgba(255, 0, 0, 1)');
	const [activeCustomColor, setActiveCustomColor] = useState(null);
	const [customColors, setCustomColors] = useState(
		processSCAttribute(SC, 'customColors', 'color') || []
	);

	// Add this useEffect to keep custom colors in sync with the SC
	useEffect(() => {
		const scCustomColors =
			processSCAttribute(SC, 'customColors', 'color') || [];
		setCustomColors(scCustomColors);
	}, [SC]);

	// Function to add a custom color
	const addCustomColor = (colorValue, name = '', shouldClose = true) => {
		// Get RGB value from color
		let colorVal = colorValue;
		// Clean up RGB format if needed
		if (colorValue.startsWith('rgb')) {
			colorVal = colorValue
				.replace(/^rgba?\(|\)$/g, '')
				.split(',')
				.slice(0, 3)
				.join(',');
		}

		// If editing an existing color, update it
		if (activeCustomColor) {
			const newCustomColors = customColors.map(color =>
				color.id === activeCustomColor.id
					? {
							...color,
							name: customColorName || color.name,
							value: colorVal,
					  }
					: color
			);

			// Update the SC object
			onChangeValue({ customColors: newCustomColors }, 'color');

			// Directly update CSS variables for immediate effect
			updateCustomColorVariables(newCustomColors);

			// Dispatch events to update all UI components
			document.dispatchEvent(
				new CustomEvent('maxi-blocks-sc-custom-colors-updated', {
					detail: { customColors: newCustomColors },
				})
			);
			document.dispatchEvent(new CustomEvent('maxi-blocks-sc-updated'));
			document.dispatchEvent(
				new CustomEvent('maxi-blocks-inspector-palette-updated')
			);

			// Reset state only if explicitly requested
			if (shouldClose) {
				setActiveCustomColor(null);
				setCustomColorName('');
				setIsAddingCustomColor(false);
			}
		}
		// Adding a new color
		else {
			// Create new custom color with a unique timestamp-based ID
			const newCustomColor = {
				id: `custom-${Date.now()}`,
				name:
					customColorName ||
					name ||
					__('Custom color', 'maxi-blocks'),
				value: colorVal,
			};

			// Create new array with the added color
			const newCustomColors = [...customColors, newCustomColor];

			// Update the SC object
			onChangeValue({ customColors: newCustomColors }, 'color');

			// Force update the customColors state variable to ensure UI refresh
			setCustomColors(newCustomColors);

			// Directly update CSS variables for immediate effect
			updateCustomColorVariables(newCustomColors);

			// Dispatch events to update all UI components
			document.dispatchEvent(
				new CustomEvent('maxi-blocks-sc-custom-colors-updated', {
					detail: { customColors: newCustomColors },
				})
			);
			document.dispatchEvent(new CustomEvent('maxi-blocks-sc-updated'));
			document.dispatchEvent(
				new CustomEvent('maxi-blocks-inspector-palette-updated')
			);

			// For adding new colors, always close the picker to show the result
			if (shouldClose) {
				setCustomColorName('');
				setIsAddingCustomColor(false);
			}
		}
	};

	// Update the removeCustomColor function to also update the local state
	const removeCustomColor = colorId => {
		const newCustomColors = customColors.filter(
			color => color.id !== colorId
		);

		onChangeValue(
			{
				customColors: newCustomColors,
			},
			'color'
		);

		// Update local state
		setCustomColors(newCustomColors);

		// Dispatch custom event to update all color pickers
		document.dispatchEvent(
			new CustomEvent('maxi-blocks-sc-custom-colors-updated', {
				detail: { customColors: newCustomColors },
			})
		);

		// Force SC update
		document.dispatchEvent(new CustomEvent('maxi-blocks-sc-updated'));

		// Broadcast to inspector palette controls
		document.dispatchEvent(
			new CustomEvent('maxi-blocks-inspector-palette-updated')
		);
	};

	// Add this function to handle editing an existing custom color
	const editCustomColor = customColor => {
		setActiveCustomColor(customColor);
		setCustomColorName(customColor.name);
		setIsAddingCustomColor(true);
	};

	const headingItems = () =>
		[1, 2, 3, 4, 5, 6].map(item => {
			return {
				label: __(`H${item}`, 'maxi-blocks'),
				content: (
					<SCAccordion
						key={`sc-accordion__h${item}`}
						colorContent={[
							{
								label: __(`H${item}`, 'maxi-blocks'),
								globalAttr: 'color-global',
								paletteStatus: 'palette-status',
								paletteColor: 'palette-color',
								paletteOpacity: 'palette-opacity',
								color: 'color',
							},
						]}
						groupAttr={`h${item}`}
						breakpoint={breakpoint}
						SC={SC}
						SCStyle={SCStyle}
						onChangeValue={onChangeValue}
					/>
				),
				classNameItem: `maxi-blocks-sc__type--h${item}`,
			};
		});

	const buttonTabs = {
		label: __('Button globals', 'maxi-blocks'),
		groupAttr: 'button',
		colorContent: [
			{
				label: __('Text', 'maxi-blocks'),
				globalAttr: 'color-global',
				paletteStatus: 'palette-status',
				paletteColor: 'palette-color',
				paletteOpacity: 'palette-opacity',
				color: 'color',
			},
			{
				label: __('Text hover', 'maxi-blocks'),
				globalAttr: 'hover-color-global',
				globalAllAttr: 'hover-color-all',
				paletteStatus: 'hover-palette-status',
				paletteColor: 'hover-palette-color',
				paletteOpacity: 'hover-palette-opacity',
				color: 'hover-color',
			},
			{
				label: __('Background', 'maxi-blocks'),
				globalAttr: 'background-color-global',
				paletteStatus: 'background-palette-status',
				paletteColor: 'background-palette-color',
				paletteOpacity: 'background-palette-opacity',
				color: 'background-color',
			},
			{
				label: __('Background hover', 'maxi-blocks'),
				globalAttr: 'hover-background-color-global',
				globalAllAttr: 'hover-background-color-all',
				paletteStatus: 'hover-background-palette-status',
				paletteColor: 'hover-background-palette-color',
				paletteOpacity: 'hover-background-palette-opacity',
				color: 'hover-background-color',
			},
			{
				label: __('Border', 'maxi-blocks'),
				globalAttr: 'border-color-global',
				paletteStatus: 'border-palette-status',
				paletteColor: 'border-palette-color',
				paletteOpacity: 'border-palette-opacity',
				color: 'border-color',
			},
			{
				label: __('Border hover', 'maxi-blocks'),
				globalAttr: 'hover-border-color-global',
				globalAllAttr: 'hover-border-color-all',
				paletteStatus: 'hover-border-palette-status',
				paletteColor: 'hover-border-palette-color',
				paletteOpacity: 'hover-border-palette-opacity',
				color: 'hover-border-color',
			},
		],
	};
	const pTabs = {
		label: __('Paragraph globals', 'maxi-blocks'),
		groupAttr: 'p',
		colorContent: [
			{
				label: __('Paragraph', 'maxi-blocks'),
				globalAttr: 'color-global',
				paletteStatus: 'palette-status',
				paletteColor: 'palette-color',
				paletteOpacity: 'palette-opacity',
				color: 'color',
			},
		],
	};
	const linkTabs = {
		label: __('Link globals', 'maxi-blocks'),
		groupAttr: 'link',
		colorContent: [
			{
				label: 'Link',
				globalAttr: 'link-color-global',
				paletteStatus: 'link-palette-status',
				paletteColor: 'link-palette-color',
				paletteOpacity: 'link-palette-opacity',
				color: 'link-color',
			},
			{
				label: 'Hover',
				globalAttr: 'hover-color-global',
				globalAllAttr: 'hover-color-all',
				paletteStatus: 'hover-palette-status',
				paletteColor: 'hover-palette-color',
				paletteOpacity: 'hover-palette-opacity',
				color: 'hover-color',
			},
			{
				label: 'Active',
				globalAttr: 'active-color-global',
				paletteStatus: 'active-palette-status',
				paletteColor: 'active-palette-color',
				paletteOpacity: 'active-palette-opacity',
				color: 'active-color',
			},
			{
				label: 'Visited',
				globalAttr: 'visited-color-global',
				paletteStatus: 'visited-palette-status',
				paletteColor: 'visited-palette-color',
				paletteOpacity: 'visited-palette-opacity',
				color: 'visited-color',
			},
		],
	};
	const iconTabs = {
		label: __('Icon globals', 'maxi-blocks'),
		groupAttr: 'icon',
		colorContent: [
			{
				label: __('Line', 'maxi-blocks'),
				globalAttr: 'line-color-global',
				paletteStatus: 'line-palette-status',
				paletteColor: 'line-palette-color',
				paletteOpacity: 'line-palette-opacity',
				color: 'line-color',
			},
			{
				label: __('Line hover', 'maxi-blocks'),
				globalAttr: 'hover-line-color-global',
				globalAllAttr: 'hover-line-color-all',
				paletteStatus: 'hover-line-palette-status',
				paletteColor: 'hover-line-palette-color',
				paletteOpacity: 'hover-line-palette-opacity',
				color: 'hover-line-color',
			},
			{
				label: __('Fill', 'maxi-blocks'),
				globalAttr: 'fill-color-global',
				paletteStatus: 'fill-palette-status',
				paletteColor: 'fill-palette-color',
				paletteOpacity: 'fill-palette-opacity',
				color: 'fill-color',
			},
			{
				label: __('Fill hover', 'maxi-blocks'),
				globalAttr: 'hover-fill-color-global',
				globalAllAttr: 'hover-fill-color-all',
				paletteStatus: 'hover-fill-palette-status',
				paletteColor: 'hover-fill-palette-color',
				paletteOpacity: 'hover-fill-palette-opacity',
				color: 'hover-fill-color',
			},
		],
	};
	const dividerTabs = {
		label: __('Divider globals', 'maxi-blocks'),
		groupAttr: 'divider',
		colorContent: [
			{
				label: __('Divider', 'maxi-blocks'),
				globalAttr: 'color-global',
				paletteStatus: 'palette-status',
				paletteColor: 'palette-color',
				paletteOpacity: 'palette-opacity',
				color: 'color',
			},
		],
	};
	const navigationTabs = {
		label: __('Navigation menu globals', 'maxi-blocks'),
		groupAttr: 'navigation',
		colorContent: [
			{
				label: 'Item links',
				globalAttr: 'menu-item-color-global',
				paletteStatus: 'menu-item-palette-status',
				paletteColor: 'menu-item-palette-color',
				paletteOpacity: 'menu-item-palette-opacity',
				color: 'menu-item-color',
			},
			{
				label: 'Item hover',
				globalAttr: 'menu-item-hover-color-global',
				paletteStatus: 'menu-item-hover-palette-status',
				paletteColor: 'menu-item-hover-palette-color',
				paletteOpacity: 'menu-item-hover-palette-opacity',
				color: 'menu-item-hover-color',
			},
			{
				label: 'Item current',
				globalAttr: 'menu-item-current-color-global',
				paletteStatus: 'menu-item-current-palette-status',
				paletteColor: 'menu-item-current-palette-color',
				paletteOpacity: 'menu-item-current-palette-opacity',
				color: 'menu-item-current-color',
			},
			{
				label: 'Item visited',
				globalAttr: 'menu-item-visited-color-global',
				paletteStatus: 'menu-item-visited-palette-status',
				paletteColor: 'menu-item-visited-palette-color',
				paletteOpacity: 'menu-item-visited-palette-opacity',
				color: 'menu-item-visited-color',
			},
			{
				label: 'Sub-item background',
				globalAttr: 'menu-item-sub-bg-color-global',
				paletteStatus: 'menu-item-sub-bg-palette-status',
				paletteColor: 'menu-item-sub-bg-palette-color',
				paletteOpacity: 'menu-item-sub-bg-palette-opacity',
				color: 'menu-item-sub-bg-color',
			},
			{
				label: 'Sub-item background hover',
				globalAttr: 'menu-item-sub-bg-hover-color-global',
				paletteStatus: 'menu-item-sub-bg-hover-palette-status',
				paletteColor: 'menu-item-sub-bg-hover-palette-color',
				paletteOpacity: 'menu-item-sub-bg-hover-palette-opacity',
				color: 'menu-item-sub-bg-hover-color',
			},
			{
				label: 'Sub-item background current',
				globalAttr: 'menu-item-sub-bg-current-color-global',
				paletteStatus: 'menu-item-sub-bg-current-palette-status',
				paletteColor: 'menu-item-sub-bg-current-palette-color',
				paletteOpacity: 'menu-item-sub-bg-current-palette-opacity',
				color: 'menu-item-sub-bg-current-color',
			},
			{
				label: 'Mobile menu icon / text',
				globalAttr: 'menu-burger-color-global',
				paletteStatus: 'menu-burger-palette-status',
				paletteColor: 'menu-burger-palette-color',
				paletteOpacity: 'menu-burger-palette-opacity',
				color: 'menu-burger-color',
			},
			{
				label: 'Mobile menu background',
				globalAttr: 'menu-mobile-bg-color-global',
				paletteStatus: 'menu-mobile-bg-palette-status',
				paletteColor: 'menu-mobile-bg-palette-color',
				paletteOpacity: 'menu-mobile-bg-palette-opacity',
				color: 'menu-mobile-bg-color',
			},
		],
	};

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				key='sc-accordion__quick-color-presets'
				isSecondary
				isStyleCard
				items={[
					{
						label: __('Colour palette', 'maxi-blocks'),
						classNameItem:
							'maxi-blocks-sc__type--quick-color-presets maxi-blocks-sc__type--color',
						content: (
							<>
								<div className='maxi-style-cards__quick-color-presets'>
									{[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
										<div
											key={`maxi-style-cards__quick-color-presets__box__${item}`}
											className={classnames(
												'maxi-style-cards__quick-color-presets__box',
												quickColorPreset === item &&
													'maxi-style-cards__quick-color-presets__box--active'
											)}
											data-item={item}
											onClick={e =>
												setQuickColorPreset(
													+e.currentTarget.dataset
														.item
												)
											}
										>
											<span
												className={classnames(
													'maxi-style-cards__quick-color-presets__box__item',
													`maxi-style-cards__quick-color-presets__box__item__${item}`
												)}
												style={{
													background: `rgba(${processSCAttribute(
														SC,
														item,
														'color'
													)}, 1)`,
												}}
											/>
										</div>
									))}

									{/* Custom colors in the palette */}
									{customColors.map(customColor => (
										<div
											key={`maxi-style-cards__quick-color-presets__box__${customColor.id}`}
											className={classnames(
												'maxi-style-cards__quick-color-presets__box',
												'maxi-style-cards__quick-color-presets__box--custom',
												activeCustomColor?.id ===
													customColor.id &&
													'maxi-style-cards__quick-color-presets__box--editing'
											)}
											title={customColor.name}
											onClick={() =>
												editCustomColor(customColor)
											}
										>
											<span
												className='maxi-style-cards__quick-color-presets__box__item'
												style={{
													background: `rgba(${customColor.value}, 1)`,
												}}
											/>
											<span className='maxi-style-cards__quick-color-presets__box__name-tooltip'>
												{customColor.name}
											</span>
											<button
												className='maxi-style-cards__quick-color-presets__box__remove'
												onClick={e => {
													e.stopPropagation(); // Prevent triggering the parent onClick
													removeCustomColor(
														customColor.id
													);
												}}
												aria-label={__(
													'Remove custom color',
													'maxi-blocks'
												)}
												type='button'
											>
												-
											</button>
										</div>
									))}

									{/* Add custom color button */}
									{!isAddingCustomColor ? (
										// Show add button when not adding a color
										<div
											className='maxi-style-cards__quick-color-presets__box maxi-style-cards__quick-color-presets__box--add'
											onClick={() =>
												setIsAddingCustomColor(true)
											}
											title={__(
												'Add custom color',
												'maxi-blocks'
											)}
										>
											<span className='maxi-style-cards__quick-color-presets__box__add-icon'>
												+
											</span>
										</div>
									) : (
										// Show inline color picker when adding a color
										<div className='maxi-style-cards__quick-color-presets__inline-picker maxi-style-cards__quick-color-presets__box--active'>
											<TextControl
												label={__(
													activeCustomColor
														? 'Edit name'
														: 'Color name',
													'maxi-blocks'
												)}
												value={customColorName}
												onChange={value =>
													setCustomColorName(value)
												}
												placeholder={__(
													'Enter color name',
													'maxi-blocks'
												)}
												className='maxi-style-cards__quick-color-presets__name-input'
											/>
											<ColorControl
												className='maxi-style-cards__inline-color-picker'
												label={__(
													'Select color',
													'maxi-blocks'
												)}
												color={
													activeCustomColor
														? `rgba(${activeCustomColor.value}, 1)`
														: tempColorValue ||
														  'rgba(255, 0, 0, 1)'
												}
												onChange={({ color }) => {
													// Update the preview immediately
													setTempColorValue(color);
												}}
												blockStyle={SCStyle}
												disableOpacity={false}
												disableGradient
												disablePalette
												disableColorDisplay={false}
											/>
											<div className='maxi-style-cards__add-custom-color-actions'>
												<Button
													className='maxi-style-cards__quick-color-presets__cancel'
													onClick={() => {
														setTempColorValue('');
														setActiveCustomColor(
															null
														);
														setCustomColorName('');
														setIsAddingCustomColor(
															false
														);
													}}
													isSmall
													isSecondary
												>
													{__(
														'Cancel',
														'maxi-blocks'
													)}
												</Button>
												<Button
													className='maxi-style-cards__quick-color-presets__add'
													onClick={() => {
														// Add the color with current values
														addCustomColor(
															tempColorValue ||
																'rgba(255, 0, 0, 1)',
															customColorName,
															true
														);
													}}
													isSmall
													isPrimary
													disabled={!tempColorValue}
												>
													{activeCustomColor
														? __(
																'Update',
																'maxi-blocks'
														  )
														: __(
																'Add',
																'maxi-blocks'
														  )}
												</Button>
											</div>
										</div>
									)}
								</div>

								{/* Standard palette color editing */}
								{!isAddingCustomColor && (
									<>
										<ColorControl
											className={`maxi-style-cards-control__sc__color-${quickColorPreset}-${SCStyle}`}
											color={`rgba(${processSCAttribute(
												SC,
												quickColorPreset,
												'color'
											)}, 1)`}
											defaultColorAttributes={{
												defaultColor: `rgba(${processSCAttribute(
													SC,
													quickColorPreset,
													'color'
												)}, 1)`,
											}}
											onChange={({ color }) =>
												onChangeValue(
													{
														[`${quickColorPreset}`]:
															color
																.replace(
																	'rgb(',
																	''
																)
																.replace(
																	')',
																	''
																),
													},
													'color'
												)
											}
											avoidBreakpointForDefault
											blockStyle={SCStyle}
											disableColorDisplay
											disableOpacity
											disableGradient
											disablePalette
										/>
										<div className='maxi-style-cards__quick-color-presets__reset'>
											<span
												className='maxi-style-cards__quick-color-presets__reset-button__preview'
												style={{
													background: `rgba(${getDefaultSCAttribute(
														SC,
														quickColorPreset,
														'color'
													)}, 1)`,
												}}
											/>
											<Button
												disabled={
													processSCAttribute(
														SC,
														quickColorPreset,
														'color'
													) ===
													SC.defaultStyleCard.color[
														quickColorPreset
													]
												}
												className='maxi-style-cards__quick-color-presets__reset-button'
												onClick={() =>
													onChangeValue(
														{
															[`${quickColorPreset}`]:
																SC
																	.defaultStyleCard
																	.color[
																	quickColorPreset
																],
														},
														'color'
													)
												}
											>
												<Icon icon={reset} />
											</Button>
										</div>
									</>
								)}
							</>
						),
					},
					{
						label: buttonTabs.label,
						classNameItem: 'maxi-blocks-sc__type--button',
						content: (
							<SCAccordion
								key={`sc-accordion__${buttonTabs.label}`}
								{...buttonTabs}
								breakpoint={breakpoint}
								SC={SC}
								SCStyle={SCStyle}
								onChangeValue={onChangeValue}
							/>
						),
					},
					{
						label: pTabs.label,
						classNameItem: 'maxi-blocks-sc__type--paragraph',
						content: (
							<SCAccordion
								key={`sc-accordion__${pTabs.label}`}
								{...pTabs}
								breakpoint={breakpoint}
								SC={SC}
								SCStyle={SCStyle}
								onChangeValue={onChangeValue}
							/>
						),
					},
					breakpoint === 'general' && {
						label: linkTabs.label,
						classNameItem: 'maxi-blocks-sc__type--link',
						content: (
							<SCAccordion
								key={`sc-accordion__${linkTabs.label}`}
								{...linkTabs}
								breakpoint={breakpoint}
								SC={SC}
								SCStyle={SCStyle}
								onChangeValue={onChangeValue}
								disableTypography
							/>
						),
					},
					{
						label: __('Headings globals', 'maxi-blocks'),
						classNameItem: 'maxi-blocks-sc__type--heading',
						content: (
							<SettingTabsControl
								hasBorder
								items={headingItems()}
							/>
						),
					},
					breakpoint === 'general' && {
						label: iconTabs.label,
						classNameItem: 'maxi-blocks-sc__type--SVG',
						content: (
							<SCAccordion
								key={`sc-accordion__${iconTabs.label}`}
								{...iconTabs}
								breakpoint={breakpoint}
								SC={SC}
								SCStyle={SCStyle}
								onChangeValue={onChangeValue}
								disableTypography
								disableOpacity
							/>
						),
					},
					breakpoint === 'general' && {
						label: dividerTabs.label,
						classNameItem: 'maxi-blocks-sc__type--divider',
						content: (
							<SCAccordion
								key={`sc-accordion__${dividerTabs.label}`}
								{...dividerTabs}
								breakpoint={breakpoint}
								SC={SC}
								SCStyle={SCStyle}
								onChangeValue={onChangeValue}
								disableTypography
							/>
						),
					},
					{
						label: navigationTabs.label,
						classNameItem: 'maxi-blocks-sc__type--navigation',
						content: (
							<SCAccordion
								key={`sc-accordion__${navigationTabs.label}`}
								{...navigationTabs}
								breakpoint={breakpoint}
								SC={SC}
								SCStyle={SCStyle}
								onChangeValue={onChangeValue}
							/>
						),
					},
				]}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
