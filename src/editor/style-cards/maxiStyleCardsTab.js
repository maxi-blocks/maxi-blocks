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
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TypographyControl from '@components/typography-control';
import ToggleSwitch from '@components/toggle-switch';
import AdvancedNumberControl from '@components/advanced-number-control';
import PaddingControl from '@components/padding-control';
import handleDeletedCustomColor from '@extensions/style-cards/customColorsUtils';
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
import getDefaultSCAttribute from './getDefaultSCAttribute';

/**
 * Icons
 */
import { reset } from '@maxi-icons';

// Generates a unique numeric ID for custom colors.
// Uses a portion of the timestamp and a random component to ensure high likelihood of uniqueness.
const generateCustomColorId = () => {
	const timestampPart = Date.now().toString().slice(-7); // Last 7 digits of timestamp
	const randomPart = Math.random().toString().slice(2, 7); // 5 random digits
	return Number(timestampPart + randomPart);
};

/**
 * Propagates custom colors to all style card variants and updates the editor
 *
 * @param {Object}   SC              Current style card object
 * @param {Array}    newCustomColors Updated custom colors array
 * @param {Function} onChangeValue   Callback to update style card value
 */
const propagateCustomColors = (SC, newCustomColors, onChangeValue) => {
	const tempSC = { ...SC };
	if (!tempSC.color) tempSC.color = {};
	tempSC.color.customColors = newCustomColors;

	// Ensure light style exists
	if (!tempSC.light) tempSC.light = { styleCard: { color: {} } };
	if (!tempSC.light.styleCard) tempSC.light.styleCard = { color: {} };
	if (!tempSC.light.styleCard.color) tempSC.light.styleCard.color = {};
	tempSC.light.styleCard.color.customColors = [...newCustomColors];

	// Ensure dark style exists
	if (!tempSC.dark) tempSC.dark = { styleCard: { color: {} } };
	if (!tempSC.dark.styleCard) tempSC.dark.styleCard = { color: {} };
	if (!tempSC.dark.styleCard.color) tempSC.dark.styleCard.color = {};
	tempSC.dark.styleCard.color.customColors = [...newCustomColors];

	const { updateSCOnEditor } =
		window.wp.data.select('maxiBlocks/style-cards') || {};
	if (typeof updateSCOnEditor === 'function') {
		updateSCOnEditor(tempSC, null, [document], true);
	}

	onChangeValue({ customColors: newCustomColors }, 'color');
};

/**
 * Component
 */
const GlobalColor = props => {
	const {
		label,
		globalAttr,
		globalAllAttr = false,
		paletteStatus,
		paletteColor, // This can be 1-8 (standard) or a large numeric ID (custom)
		paletteOpacity,
		color,
		groupAttr,
		SC,
		onChangeValue,
		SCStyle,
		disableOpacity = false,
		isHover = false,
	} = props;

	const currentPaletteStatus = processSCAttribute(
		SC,
		paletteStatus,
		groupAttr
	);

	// Process paletteColor: it's either a standard palette number (1-8) or a custom color ID (large number)
	// No conversion from "custom-X" needed anymore as per new strategy.
	let processedPaletteColor = processSCAttribute(SC, paletteColor, groupAttr);
	if (
		typeof processedPaletteColor === 'string' &&
		!Number.isNaN(parseInt(processedPaletteColor, 10))
	) {
		processedPaletteColor = parseInt(processedPaletteColor, 10);
	}
	const currentPaletteColor = processedPaletteColor;

	const currentPaletteOpacity =
		processSCAttribute(SC, paletteOpacity, groupAttr) || 1;
	const rawColor = processSCAttribute(SC, color, groupAttr);
	// Format raw RGB (like "255,0,0") as rgba for ColorControl display
	const currentColor = (rawColor && typeof rawColor === 'string' && rawColor.includes(',') && !rawColor.includes('rgba'))
		? `rgba(${rawColor},${currentPaletteOpacity})`
		: rawColor;

	let processedDefaultPaletteColorValue = getDefaultSCValue({
		target: paletteColor,
		SC,
		SCStyle,
		groupAttr,
	});
	if (
		typeof processedDefaultPaletteColorValue === 'string' &&
		!Number.isNaN(parseInt(processedDefaultPaletteColorValue, 10))
	) {
		processedDefaultPaletteColorValue = parseInt(
			processedDefaultPaletteColorValue,
			10
		);
	}
	const defaultPaletteColorValue = processedDefaultPaletteColorValue;

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
						paletteStatus={currentPaletteStatus}
						paletteColor={currentPaletteColor} // numeric ID or 1-8
						paletteOpacity={currentPaletteOpacity}
						color={currentColor}
						defaultColorAttributes={{
							defaultPaletteColor: defaultPaletteColorValue,
							defaultColor: getDefaultSCValue({
								target: color,
								SC,
								SCStyle,
								groupAttr,
							}),
						}}
						onChange={({
							// paletteColorFromControl will be numeric ID or 1-8
							paletteStatus: newPaletteStatus,
							paletteColor: newPaletteColorFromControl,
							paletteOpacity: newPaletteOpacity,
							color: newColor,
						}) => {
							onChangeValue(
								{
									[paletteStatus]: newPaletteStatus,
									[paletteColor]: newPaletteColorFromControl,
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
		disableResponsiveTabs = false,
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
					disableResponsiveTabs={disableResponsiveTabs}
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
									onChangeValue={(val, meta) => {
										onChangeValue(
											{
												'show-mobile-down-from': val,
												meta,
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

	const getAvailableCustomColors = (styleCard, style) => {
		if (!styleCard) {
			return [];
		}

		const { receiveMaxiSelectedStyleCardValue } =
			window.wp.data.select('maxiBlocks/style-cards') || {};
		let rawColorsData = [];

		if (typeof receiveMaxiSelectedStyleCardValue === 'function') {
			const storeColorsResult =
				receiveMaxiSelectedStyleCardValue('customColors');
			if (
				storeColorsResult &&
				Array.isArray(storeColorsResult) &&
				storeColorsResult.length > 0
			) {
				rawColorsData = storeColorsResult;
			}
		}

		if (rawColorsData.length === 0) {
			const sources = [
				styleCard[style]?.styleCard?.color?.customColors,
				styleCard.color?.customColors,
				styleCard[style]?.defaultStyleCard?.color?.customColors,
				styleCard[style === 'light' ? 'dark' : 'light']?.styleCard
					?.color?.customColors,
			];
			for (const source of sources) {
				if (source && Array.isArray(source) && source.length > 0) {
					rawColorsData = source;
					break;
				}
			}
		}

		if (!Array.isArray(rawColorsData)) {
			rawColorsData = [];
		}

		const existingIds = new Set();
		return rawColorsData
			.map(item => {
				let id;
				let value;
				let name;
				if (typeof item === 'object' && item !== null) {
					value =
						typeof item.value === 'string' &&
						item.value.trim() !== ''
							? item.value
							: 'transparent';
					name = typeof item.name === 'string' ? item.name : '';
					id =
						typeof item.id === 'number' && item.id > 8
							? item.id
							: generateCustomColorId(); // Keep valid ID or generate new
				} else if (typeof item === 'string' && item.trim() !== '') {
					value = item;
					name = '';
					id = generateCustomColorId();
				} else {
					value = 'transparent';
					name = '';
					id = generateCustomColorId();
				}

				// Ensure ID is unique within this batch
				const originalId = id;
				let counter = 1;
				while (existingIds.has(id)) {
					console.warn(`Duplicate ID detected: ${id}. Regenerating.`);
					// Try to make it unique by appending counter and parts of timestamp/randomness
					const newTimestampPart = Date.now().toString().slice(-3);
					const newRandomPart = Math.random().toString().slice(2, 5);
					const counterString = String(counter).padStart(3, '0');
					counter += 1; // Increment counter after getting its string value
					const potentialNewIdBase = String(originalId).slice(0, -6); // Keep most of original to vary less if it was long
					id = Number(
						potentialNewIdBase +
							newTimestampPart +
							newRandomPart +
							counterString
					);

					if (counter > 100) {
						// Safety break for extreme collision cases
						console.error(
							'High collision rate for custom color ID generation. Using fallback.'
						);
						id = Number(
							Date.now().toString().slice(-5) +
								Math.random().toString().slice(2, 7) +
								counter
						);
						if (existingIds.has(id))
							id = Number(
								Date.now().toString() +
									Math.random().toString().slice(2, 10)
							); // Final fallback
					}
				}
				existingIds.add(id);

				return { id, value, name };
			})
			.filter(item => item.id !== undefined); // Filter out any potentially malformed items without ID
	};

	const [customColors, setCustomColors] = useState(() =>
		getAvailableCustomColors(SC, SCStyle)
	);

	useEffect(() => {
		const newAvailableColors = getAvailableCustomColors(SC, SCStyle);
		// Simple stringify check for array of objects might be heavy.
		// A more performant check might be needed if SC/SCStyle update very frequently.
		if (
			JSON.stringify(customColors) !== JSON.stringify(newAvailableColors)
		) {
			setCustomColors(newAvailableColors);
		}
	}, [SC, SCStyle, customColors]); // Added customColors to dep array as per linter suggestion often seen

	const [selectedCustomColorId, setSelectedCustomColorId] = useState(null);

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
						disableResponsiveTabs
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
				items={
					[
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
									</div>
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
															.replace('rgb(', '')
															.replace(')', ''),
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
															SC.defaultStyleCard
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
							),
						},
						{
							label: __(
								'Custom colours (both tones)',
								'maxi-blocks'
							),
							classNameItem:
								'maxi-blocks-sc__type--custom-color-presets maxi-blocks-sc__type--color',
							content: (
								<>
									<div className='maxi-style-cards__custom-color-presets'>
										{customColors.map(colorObj => (
											<div
												key={`maxi-style-cards__custom-color-presets__box-${colorObj.id}`}
												data-color-id={colorObj.id}
												className={classnames(
													'maxi-style-cards__custom-color-presets__box',
													selectedCustomColorId ===
														colorObj.id &&
														'maxi-style-cards__custom-color-presets__box--active'
												)}
												onClick={() => {
													setSelectedCustomColorId(
														colorObj.id
													);
												}}
												title={
													colorObj.name ||
													`${__(
														'Custom Colour',
														'maxi-blocks'
													)} ${
														customColors.findIndex(
															c =>
																c.id ===
																colorObj.id
														) + 1
													}`
												}
											>
												<span
													className='maxi-style-cards__custom-color-presets__box__item'
													style={{
														background:
															colorObj.value,
													}}
												/>
												<Button
													className='maxi-style-cards__custom-color-presets__remove-button'
													title={`${__(
														'Remove',
														'maxi-blocks'
													)} ${
														colorObj.name ||
														`${__(
															'Custom Colour',
															'maxi-blocks'
														)} ${
															customColors.findIndex(
																c =>
																	c.id ===
																	colorObj.id
															) + 1
														}`
													}`}
													onClick={e => {
														e.stopPropagation();
														const newCustomColors =
															customColors.filter(
																c =>
																	c.id !==
																	colorObj.id
															);
														setCustomColors(
															newCustomColors
														);

														// Call the handler for updating blocks
														handleDeletedCustomColor(
															colorObj.id
														);

														propagateCustomColors(
															SC,
															newCustomColors,
															onChangeValue
														);

														if (
															selectedCustomColorId ===
															colorObj.id
														) {
															setSelectedCustomColorId(
																null
															);
														}
													}}
												>
													-
												</Button>
											</div>
										))}
										<Button
											className='maxi-style-cards__custom-color-presets__add-button'
											onClick={() => {
												const r = Math.floor(
													Math.random() * 256
												);
												const g = Math.floor(
													Math.random() * 256
												);
												const b = Math.floor(
													Math.random() * 256
												);
												const newColorId =
													generateCustomColorId();
												const newColor = {
													id: newColorId,
													value: `rgba(${r}, ${g}, ${b}, 1)`,
													name: '',
												};
												const newCustomColors = [
													...customColors,
													newColor,
												];
												setCustomColors(
													newCustomColors
												);
												setSelectedCustomColorId(
													newColorId
												);

												propagateCustomColors(
													SC,
													newCustomColors,
													onChangeValue
												);
											}}
										>
											+
										</Button>
									</div>
									{selectedCustomColorId &&
										customColors.find(
											c => c.id === selectedCustomColorId
										) && (
											<>
												<ColorControl
													label={__(
														'Custom',
														'maxi-blocks'
													)}
													className='maxi-style-cards-control__sc__custom-color'
													color={
														customColors.find(
															c =>
																c.id ===
																selectedCustomColorId
														).value
													}
													onChange={({ color }) => {
														const newCustomColors =
															customColors.map(
																c =>
																	c.id ===
																	selectedCustomColorId
																		? {
																				...c,
																				value: color,
																		  }
																		: c
															);
														setCustomColors(
															newCustomColors
														);

														propagateCustomColors(
															SC,
															newCustomColors,
															onChangeValue
														);
													}}
													blockStyle={SCStyle}
													disableOpacity
													disableGradient
													disablePalette
												/>
												<input
													type='text'
													className='maxi-style-cards__custom-color-presets__name-input'
													value={
														customColors.find(
															c =>
																c.id ===
																selectedCustomColorId
														).name
													}
													placeholder={__(
														'Enter colour name',
														'maxi-blocks'
													)}
													onChange={e => {
														const newCustomColors =
															customColors.map(
																c =>
																	c.id ===
																	selectedCustomColorId
																		? {
																				...c,
																				name: e
																					.target
																					.value,
																		  }
																		: c
															);
														setCustomColors(
															newCustomColors
														);

														propagateCustomColors(
															SC,
															newCustomColors,
															onChangeValue
														);
													}}
												/>
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
								<ResponsiveTabsControl breakpoint={breakpoint}>
									<SettingTabsControl
										className="maxi-style-cards-headings-tabs"
										hasBorder
										items={headingItems()}
									/>
								</ResponsiveTabsControl>
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
					].filter(Boolean) // Filter out any false items from conditional rendering
				}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
