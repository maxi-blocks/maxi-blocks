/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { processSCAttribute, getDefaultSCAttribute } from './utils';
import {
	AccordionControl,
	Button,
	ColorControl,
	Icon,
	SettingTabsControl,
	TypographyControl,
	ToggleSwitch,
} from '../../components';
import {
	getDefaultSCValue,
	getTypographyFromSC,
} from '../../extensions/style-cards';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Icons
 */
import { reset } from '../../icons';

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
	} = props;

	return (
		<>
			<ToggleSwitch
				// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
				label={__(`Use Global ${label} Colour`, 'maxi-blocks')}
				className={`maxi-style-cards-control__toggle-${globalAttr}`}
				selected={processSCAttribute(SC, globalAttr, groupAttr)}
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
						defaultColor={getDefaultSCValue({
							target: color,
							SC,
							SCStyle,
							groupAttr,
						})}
						onChange={({
							paletteStatus: newPaletteStatus,
							paletteColor: newPaletteColor,
							paletteOpacity: newPaletteOpacity,
							color: newColor,
						}) =>
							onChangeValue(
								{
									[paletteStatus]: newPaletteStatus,
									[paletteColor]: newPaletteColor,
									[paletteOpacity]: newPaletteOpacity,
									[color]: newColor,
								},
								groupAttr
							)
						}
						blockStyle={SCStyle}
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
	} = props;

	return (
		<>
			{!disableTypography && (
				<TypographyControl
					typography={getTypographyFromSC(SC, groupAttr)}
					className={`maxi-style-cards-control__sc__${groupAttr}-typography`}
					textLevel={groupAttr}
					breakpoint={breakpoint}
					styleCards
					onChange={obj =>
						onChangeValue({ typography: obj }, groupAttr)
					}
					hideTextShadow
					hideAlignment
					blockStyle={SCStyle}
					disablePalette
					disableFormats
					disableCustomFormats
					disableFontFamily={breakpoint !== 'general'}
				/>
			)}
			{colorContent.map(
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
					/>
				)
			)}
		</>
	);
};

const MaxiStyleCardsTab = ({ SC, SCStyle, breakpoint, onChangeValue }) => {
	const [quickColorPreset, setQuickColorPreset] = useState(1);

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
		label: __('Button', 'maxi-blocks'),
		groupAttr: 'button',
		colorContent: [
			{
				label: __('Button Text', 'maxi-blocks'),
				globalAttr: 'color-global',
				paletteStatus: 'palette-status',
				paletteColor: 'palette-color',
				paletteOpacity: 'palette-opacity',
				color: 'color',
			},
			{
				label: __('Button Background', 'maxi-blocks'),
				globalAttr: 'background-color-global',
				paletteStatus: 'background-palette-status',
				paletteColor: 'background-palette-color',
				paletteOpacity: 'background-palette-opacity',
				color: 'background-color',
			},
			{
				label: __('Button Background Hover', 'maxi-blocks'),
				globalAttr: 'hover-background-color-global',
				globalAllAttr: 'hover-background-color-all',
				paletteStatus: 'hover-background-palette-status',
				paletteColor: 'hover-background-palette-color',
				paletteOpacity: 'hover-background-palette-opacity',
				color: 'hover-background-color',
			},
			{
				label: __('Button Text Hover', 'maxi-blocks'),
				globalAttr: 'hover-color-global',
				globalAllAttr: 'hover-color-all',
				paletteStatus: 'hover-palette-status',
				paletteColor: 'hover-palette-color',
				paletteOpacity: 'hover-palette-opacity',
				color: 'hover-color',
			},
			{
				label: __('Button Border', 'maxi-blocks'),
				globalAttr: 'border-color-global',
				paletteStatus: 'border-palette-status',
				paletteColor: 'border-palette-color',
				paletteOpacity: 'border-palette-opacity',
				color: 'border-color',
			},
			{
				label: __('Button Border Hover', 'maxi-blocks'),
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
		label: __('Paragraph', 'maxi-blocks'),
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
		label: __('Link', 'maxi-blocks'),
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
		label: __('SVG Icons', 'maxi-blocks'),
		groupAttr: 'icon',
		colorContent: [
			{
				label: __('Line', 'maxi-blocks'),
				globalAttr: 'line-global',
				paletteStatus: 'line-palette-status',
				paletteColor: 'line-palette-color',
				paletteOpacity: 'line-palette-opacity',
				color: 'line',
			},
			{
				label: __('Fill', 'maxi-blocks'),
				globalAttr: 'fill-global',
				paletteStatus: 'fill-palette-status',
				paletteColor: 'fill-palette-color',
				paletteOpacity: 'fill-palette-opacity',
				color: 'fill',
			},
		],
	};
	const dividerTabs = {
		label: __('Divider', 'maxi-blocks'),
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

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				key='sc-accordion__quick-color-presets'
				isSecondary
				items={[
					{
						label: __('Quick Pick Colour Presets', 'maxi-blocks'),
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
									defaultColor={`rgba(${processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}, 1)`}
									onChange={({ color }) =>
										onChangeValue(
											{
												[`${quickColorPreset}`]: color
													.replace('rgb(', '')
													.replace(')', ''),
											},
											'color'
										)
									}
									blockStyle={SCStyle}
									disableColorDisplay
									disableOpacity
									disableGradient
									disablePalette
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
													SC.defaultStyleCard.color[
														quickColorPreset
													],
											},
											'color'
										)
									}
								>
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
									<Icon icon={reset} />
									{__('Reset Preset', 'maxi-blocks')}
								</Button>
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
					{
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
						label: __('Headings', 'maxi-blocks'),
						content: <SettingTabsControl items={headingItems()} />,
						classNameItem: 'maxi-blocks-sc__type--heading',
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
				]}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
