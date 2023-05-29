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
					hideAlignment
					blockStyle={SCStyle}
					disablePalette
					disableFormats
					disableCustomFormats
					disableFontFamily={breakpoint !== 'g'}
				/>
			)}
			{breakpoint === 'g' &&
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
								globalAttr: '_col.g',
								paletteStatus: '_ps',
								paletteColor: '_pc',
								paletteOpacity: '_po',
								color: '_cc',
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
				globalAttr: '_col.g',
				paletteStatus: '_ps',
				paletteColor: '_pc',
				paletteOpacity: '_po',
				color: '_cc',
			},
			{
				label: __('Text hover', 'maxi-blocks'),
				globalAttr: 'h_col.g',
				globalAllAttr: 'h_col.a',
				paletteStatus: 'h_ps',
				paletteColor: 'h_pc',
				paletteOpacity: 'h_po',
				color: 'h_cc',
			},
			{
				label: __('Background', 'maxi-blocks'),
				globalAttr: 'bc.g',
				paletteStatus: 'b_ps',
				paletteColor: 'b_pc',
				paletteOpacity: 'b_po',
				color: 'b_cc',
			},
			{
				label: __('Background hover', 'maxi-blocks'),
				globalAttr: 'h-bc.g',
				globalAllAttr: 'h-bc.a',
				paletteStatus: 'h-b_ps',
				paletteColor: 'h-b_pc',
				paletteOpacity: 'h-b_po',
				color: 'h-b_cc',
			},
			{
				label: __('Border', 'maxi-blocks'),
				globalAttr: 'bo_col.g',
				paletteStatus: 'bo_ps',
				paletteColor: 'bo_pc',
				paletteOpacity: 'bo_po',
				color: 'bo_cc',
			},
			{
				label: __('Border hover', 'maxi-blocks'),
				globalAttr: 'h-bo_col.g',
				globalAllAttr: 'h-bo_col.a',
				paletteStatus: 'h-bo_ps',
				paletteColor: 'h-bo_pc',
				paletteOpacity: 'h-bo_po',
				color: 'h-bo_cc',
			},
		],
	};
	const pTabs = {
		label: __('Paragraph globals', 'maxi-blocks'),
		groupAttr: 'p',
		colorContent: [
			{
				label: __('Paragraph', 'maxi-blocks'),
				globalAttr: '_col.g',
				paletteStatus: '_ps',
				paletteColor: '_pc',
				paletteOpacity: '_po',
				color: '_cc',
			},
		],
	};
	const linkTabs = {
		label: __('Link globals', 'maxi-blocks'),
		groupAttr: 'link',
		colorContent: [
			{
				label: 'Link',
				globalAttr: '_l_col.g',
				paletteStatus: '_l_ps',
				paletteColor: '_l_pc',
				paletteOpacity: '_l_po',
				color: '_l_cc',
			},
			{
				label: 'Hover',
				globalAttr: 'h_col.g',
				globalAllAttr: 'h_col.a',
				paletteStatus: 'h_ps',
				paletteColor: 'h_pc',
				paletteOpacity: 'h_po',
				color: 'h_cc',
			},
			{
				label: 'Active',
				globalAttr: 'a_col.g',
				paletteStatus: 'a_ps',
				paletteColor: 'a_pc',
				paletteOpacity: 'a_po',
				color: 'a_cc',
			},
			{
				label: 'Visited',
				globalAttr: 'vi_col.g',
				paletteStatus: 'vi_ps',
				paletteColor: 'vi_pc',
				paletteOpacity: 'vi_po',
				color: 'vi_cc',
			},
		],
	};
	const iconTabs = {
		label: __('Icon globals', 'maxi-blocks'),
		groupAttr: 'icon',
		colorContent: [
			{
				label: __('Line', 'maxi-blocks'),
				globalAttr: 'li_col.g',
				paletteStatus: 'li_ps',
				paletteColor: 'li_pc',
				paletteOpacity: 'li_po',
				color: 'li_cc',
			},
			{
				label: __('Line hover', 'maxi-blocks'),
				globalAttr: 'h-li_col.g',
				globalAllAttr: 'h-li_col.a',
				paletteStatus: 'h-li_ps',
				paletteColor: 'h-li_pc',
				paletteOpacity: 'h-li_po',
				color: 'h-li_cc',
			},
			{
				label: __('Fill', 'maxi-blocks'),
				globalAttr: 'f_col.g',
				paletteStatus: 'f_ps',
				paletteColor: 'f_pc',
				paletteOpacity: 'f_po',
				color: 'f_cc',
			},
			{
				label: __('Fill hover', 'maxi-blocks'),
				globalAttr: 'h-f_col.g',
				globalAllAttr: 'h-f_col.a',
				paletteStatus: 'h-f_ps',
				paletteColor: 'h-f_pc',
				paletteOpacity: 'h-f_po',
				color: 'h-f_cc',
			},
		],
	};
	const dividerTabs = {
		label: __('Divider globals', 'maxi-blocks'),
		groupAttr: 'divider',
		colorContent: [
			{
				label: __('Divider', 'maxi-blocks'),
				globalAttr: '_col.g',
				paletteStatus: '_ps',
				paletteColor: '_pc',
				paletteOpacity: '_po',
				color: '_cc',
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
												[`${quickColorPreset}`]: color
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
					breakpoint === 'g' && {
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
						label: __('Typography globals', 'maxi-blocks'),
						classNameItem: 'maxi-blocks-sc__type--heading',
						content: (
							<SettingTabsControl
								hasBorder
								items={headingItems()}
							/>
						),
					},
					breakpoint === 'g' && {
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
					breakpoint === 'g' && {
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
