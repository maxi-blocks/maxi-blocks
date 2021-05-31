/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, isNil, isString } from 'lodash';

/**
 * Internal dependencies
 */
import getStyleCardAttr from '../../extensions/styles/defaults/style-card';
import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
	FancyRadioControl,
} from '../../components';
import {
	getSCFromTypography,
	getTypographyFromSC,
} from '../../extensions/style-cards';

/**
 * Component
 */
const MaxiStyleCardsTab = ({
	SC,
	SCStyle,
	deviceType,
	onChangeValue,
	addActiveSCClass,
	currentKey,
}) => {
	const processAttribute = attr => {
		if (!isEmpty(SC)) {
			const value = SC.styleCard[SCStyle][attr];
			if (!isNil(value)) return value;

			const defaultValue = SC.styleCardDefaults[SCStyle][attr];
			if (!isNil(defaultValue)) {
				if (
					defaultValue &&
					isString(defaultValue) &&
					defaultValue.includes('var')
				) {
					const colorNumber = defaultValue.match(/color-\d/);
					const colorValue =
						SC.styleCardDefaults[SCStyle][colorNumber];
					if (!isNil(colorValue)) return colorValue;
				} else return defaultValue;
			}
			return null;
		}
		return null;
	};

	if (document.querySelectorAll('.maxi-style-cards__sc-select option'))
		setTimeout(function scSelect() {
			addActiveSCClass(currentKey);
		}, 300);

	const options = [
		{
			label: __('Yes', 'maxi-blocks'),
			value: 1,
		},
		{
			label: __('No', 'maxi-blocks'),
			value: 0,
		},
	];

	/*
	 * Generates main tabs.
	 *
	 * @param {string} firstColor First color attribute, example: p-color
	 * @param {string} firstLabel First color label, examples: Hover, Button
	 * @param {string} firstColorDefault Default for the first color, example: color-3
	 * @param {bool or string} typographyPrefix Disable typography or set a prefix for it, examples: p, button
	 * @param {bool or string} typographyPrefix Disable secondColor or set an attribute for it, example: button-background-color
	 * @param {string} secondLabel Second color label, examples: Link, Button Background, Icon Fill
	 * @param {string} secondColorDefault Default for the second color, example: color-4
	 *
	 * @return {object} An AccordionControl tab to render.
	 */

	const generateTab = (
		firstColor,
		firstLabel,
		firstColorDefault,
		typographyPrefix = false,
		secondColor = false,
		secondLabel,
		secondColorDefault
	) => {
		const firstColorGlobal = `${firstColor}-global`;
		const secondColorGlobal = `${secondColor}-global`;

		return {
			label: __(firstLabel, 'maxi-blocks'),
			content: (
				<>
					{deviceType === 'general' && (
						<FancyRadioControl
							label={__(
								`Use Global ${firstLabel} Colour`,
								'maxi-blocks'
							)}
							selected={processAttribute(firstColorGlobal)}
							options={options}
							onChange={val => {
								onChangeValue(firstColorGlobal, val, SCStyle);
							}}
						/>
					)}
					{deviceType === 'general' &&
						processAttribute(firstColorGlobal) && (
							<ColorControl
								label={__(`${firstLabel} Text`, 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__${firstColor}--${SCStyle}`}
								color={
									processAttribute(firstColor) ||
									processAttribute(`${firstColor}-old`) ||
									getStyleCardAttr(
										firstColorDefault,
										SCStyle,
										true
									)
								}
								defaultColor={getStyleCardAttr(
									firstColorDefault,
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue(firstColor, val, SCStyle);
								}}
								disableGradient
								disablePalette
							/>
						)}
					{!!typographyPrefix && (
						<TypographyControl
							typography={getTypographyFromSC(
								typographyPrefix,
								SCStyle,
								SC
							)}
							prefix={`${typographyPrefix}-`}
							disableFormats
							disableCustomFormats
							className={`maxi-style-cards-control__sc__${typographyPrefix}-typography`}
							textLevel={typographyPrefix}
							hideAlignment
							hideTextShadow
							breakpoint={deviceType}
							disablePalette
							styleCards
							onChange={obj => {
								const parsedTypography = getSCFromTypography(
									SC,
									SCStyle,
									obj
								);
								onChangeValue(
									'typography',
									parsedTypography,
									SCStyle
								);
							}}
							blockStyle={SCStyle}
							disableFontFamily={deviceType !== 'general'}
						/>
					)}
					{!!secondColor && deviceType === 'general' && (
						<FancyRadioControl
							label={__(
								`Use Global ${secondLabel} Colour`,
								'maxi-blocks'
							)}
							selected={processAttribute(secondColorGlobal)}
							options={options}
							onChange={val => {
								onChangeValue(secondColorGlobal, val, SCStyle);
							}}
						/>
					)}
					{!!secondColor &&
						deviceType === 'general' &&
						processAttribute(secondColorGlobal) && (
							<ColorControl
								label={__(secondLabel, 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__${secondColor}--${SCStyle}`}
								color={
									processAttribute(secondColor) ||
									processAttribute(`${secondColor}-old`) ||
									getStyleCardAttr(
										secondColorDefault,
										SCStyle,
										true
									)
								}
								defaultColor={getStyleCardAttr(
									secondColorDefault,
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue(secondColor, val, SCStyle);
								}}
								disableGradient
								disablePalette
							/>
						)}
				</>
			),
		};
	};

	const headingItems = () => {
		const resultItems = [];

		[1, 2, 3, 4, 5, 6].forEach(item => {
			resultItems.push({
				label: __(`H${item}`, 'maxi-blocks'),
				content: (
					<>
						{deviceType === 'general' && (
							<FancyRadioControl
								label={__(
									`Use Global H${item} Colour`,
									'maxi-blocks'
								)}
								selected={processAttribute(
									`h${item}-color-global`
								)}
								options={options}
								onChange={val => {
									onChangeValue(
										`h${item}-color-global`,
										val,
										SCStyle
									);
								}}
							/>
						)}
						{deviceType === 'general' &&
							processAttribute(`h${item}-color-global`) && (
								<ColorControl
									label={__(`H${item} Text`, 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__h${item}-color--${SCStyle}`}
									color={
										processAttribute(`h${item}-color`) ||
										processAttribute(
											`h${item}-color-old`
										) ||
										getStyleCardAttr(
											'color-5',
											SCStyle,
											true
										)
									}
									defaultColor={getStyleCardAttr(
										'color-5',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											`h${item}-color`,
											val,
											SCStyle
										);
									}}
									disableGradient
									disablePalette
								/>
							)}
						<TypographyControl
							typography={getTypographyFromSC(
								`h${item}`,
								SCStyle,
								SC
							)}
							prefix={`h${item}-`}
							disableFormats
							disableCustomFormats
							className={`maxi-style-cards-control__sc__h${item}-typography`}
							textLevel={`h${item}`}
							hideAlignment
							hideTextShadow
							breakpoint={deviceType}
							disablePalette
							styleCards
							onChange={obj => {
								const parsedTypography = getSCFromTypography(
									SC,
									SCStyle,
									obj
								);
								onChangeValue(
									'typography',
									parsedTypography,
									SCStyle
								);
							}}
							blockStyle={SCStyle}
						/>
					</>
				),
			});
		});

		return resultItems;
	};

	const [quickColorPreset, setQuickColorPreset] = useState(1);

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				isSecondary
				items={[
					{
						label: __('Quick Pick Colour Presets', 'maxi-blocks'),
						content: (
							<>
								<div className='maxi-style-cards__quick-color-presets'>
									{[1, 2, 3, 4, 5, 6, 7].map(item => (
										<div
											key={`maxi-style-cards__quick-color-presets__box__${item}`}
											className={`maxi-style-cards__quick-color-presets__box ${
												quickColorPreset === item
													? 'maxi-style-cards__quick-color-presets__box--active'
													: ''
											}`}
											data-item={item}
											onClick={e =>
												setQuickColorPreset(
													+e.currentTarget.dataset
														.item
												)
											}
										>
											<span
												className={`maxi-style-cards__quick-color-presets__box__item maxi-style-cards__quick-color-presets__box__item__${item}`}
												style={{
													background:
														processAttribute(
															`color-${item}`
														),
												}}
											/>
										</div>
									))}
								</div>
								<ColorControl
									disableColorDisplay
									disableOpacity
									className={`maxi-style-cards-control__sc__color-${quickColorPreset}-${SCStyle}`}
									color={processAttribute(
										`color-${quickColorPreset}`
									)}
									defaultColor={processAttribute(
										`color-${quickColorPreset}`
									)}
									onChange={val => {
										onChangeValue(
											`color-${quickColorPreset}`,
											val,
											SCStyle
										);
									}}
									disableGradient
									disablePalette
								/>
							</>
						),
					},
					generateTab(
						'button-color',
						'Button',
						'color-1',
						'button',
						'button-background-color',
						'Button Background',
						'color-4'
					),
					generateTab(
						'p-color',
						'Paragraph',
						'color-3',
						'p',
						'link',
						'Link',
						'color-4'
					),
					{
						label: __('Headings', 'maxi-blocks'),
						content: <SettingTabsControl items={headingItems()} />,
					},
					generateTab('hover', 'Hover', 'color-6', false, false),
					generateTab(
						'icon-line',
						'SVG Icon',
						'color-7',
						false,
						'icon-fill',
						'Fill',
						'color-4'
					),
					generateTab(
						'divider-color',
						'Divider',
						'color-4',
						false,
						false
					),
				]}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
