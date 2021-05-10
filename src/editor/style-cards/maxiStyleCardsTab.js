/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

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

/**
 * Utils
 */

export const styleCardDefaultsTypography = (level, SCstyle) => {
	const response = {};
	const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

	Object.entries(SCstyle).forEach(([key, val]) => {
		if (key.includes(`${level}-`)) {
			if (key.includes('general')) {
				breakpoints.forEach(breakpoint => {
					if (response[key.replace('general', breakpoint)]) return;

					const checkKey = key.replace('general', breakpoint);
					if (isNil(SCstyle.checkKey)) {
						if (checkKey.includes('font-size')) {
							const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
							response[checkKey] = num;
							const newUnitKey = checkKey.replace(
								'font-size',
								'font-size-unit'
							);
							response[newUnitKey] = unit;
							return;
						}
						if (checkKey.includes('letter-spacing')) {
							let newVal;
							if (typeof val === 'number') newVal = `${val}px`;
							else newVal = val;

							const [num, unit] = newVal.match(
								/[a-zA-Z]+|[0-9\.]+/g
							);
							response[checkKey] = num;
							const newUnitKey = checkKey.replace(
								'letter-spacing',
								'letter-spacing-unit'
							);

							response[newUnitKey] = unit;
							return;
						}
						response[checkKey] = val;
					}
				});
			}
			if (key.includes('font-size')) {
				const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
				response[key] = num;
				const newUnitKey = key.replace('font-size', 'font-size-unit');
				response[newUnitKey] = unit;
				return;
			}
			if (key.includes('letter-spacing')) {
				let newVal;
				if (typeof val === 'number') newVal = `${val}px`;
				else newVal = val;

				const [num, unit] = newVal.match(/[a-zA-Z]+|[0-9\.]+/g);
				response[key] = num;
				const newUnitKey = key.replace(
					'letter-spacing',
					'letter-spacing-unit'
				);

				response[newUnitKey] = unit;
				return;
			}
			response[key] = val;
		}
	});

	return response;
};

/**
 * Component
 */
const MaxiStyleCardsTab = ({
	SC,
	SCStyle,
	deviceType,
	onChange,
	onChangeValue,
	onChangeDelete,
	addActiveSCclass,
	currentKey,
}) => {
	const processAttribute = attr => {
		if (!isEmpty(SC)) {
			const value = SC.styleCard[SCStyle][attr];
			if (!isNil(value)) return value;

			const defaultValue = SC.styleCardDefaults[SCStyle][attr];
			if (!isNil(defaultValue)) {
				if (defaultValue.includes('var')) {
					const colorNumber = defaultValue.match(/color-\d/);
					const colorValue =
						SC.styleCardDefaults[SCStyle][colorNumber];
					if (!isNil(colorValue)) return colorValue;
				} else return defaultValue;
			}
			return false;
		}
		return false;
	};

	const parseTypography = newSC => {
		const parsedTypography = {};
		Object.entries(newSC).forEach(([key, val]) => {
			if (isEmpty(val)) {
				if (!key.includes('-unit'))
					parsedTypography[key] = SC.styleCardDefaults[SCStyle][key];

				return;
			}

			if (
				key.includes('font-size') ||
				key.includes('line-height') ||
				key.includes('letter-spacing')
			) {
				const isUnit = key.includes('-unit');
				if (isUnit) {
					const newKey = key.replaceAll('-unit', '');
					if (!isNil(newSC[newKey]) && !isEmpty(val))
						parsedTypography[newKey] = newSC[newKey] + val;
				}
			}
			if (!key.includes('-unit')) parsedTypography[key] = val;
		});
		return parsedTypography;
	};

	const getTypography = level => {
		const defaultTypography = styleCardDefaultsTypography(
			level,
			SC.styleCardDefaults[SCStyle]
		);

		if (!isEmpty(SC.styleCard[SCStyle])) {
			const typography = styleCardDefaultsTypography(
				level,
				SC.styleCard[SCStyle]
			);
			return { ...defaultTypography, ...typography };
		}
		return defaultTypography;
	};

	const onChangeColor = (val, attr, defaultColor) => {
		if (!val) onChangeDelete(attr, SCStyle);
		if (val)
			onChangeValue(
				attr,
				processAttribute(attr) ||
					getStyleCardAttr(defaultColor, SCStyle, true),
				SCStyle
			);

		onChangeValue(`${attr}-global`, val, SCStyle);
	};

	if (document.querySelectorAll('.maxi-style-cards__sc-select option'))
		setTimeout(function scSelect() {
			addActiveSCclass(currentKey);
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
	 * @param {string} firstColor First color attribute, example: p-color-general
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
								onChangeColor(
									val,
									firstColor,
									firstColorDefault
								);
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
							typography={getTypography(`${typographyPrefix}`)}
							prefix={`${typographyPrefix}-`}
							disableFormats
							disableCustomFormats
							className={`maxi-style-cards-control__sc__${typographyPrefix}-typography`}
							textLevel={`${typographyPrefix}`}
							hideAlignment
							hideTextShadow
							breakpoint={deviceType}
							disablePalette
							styleCards
							onChange={obj => {
								const parsedTypography = parseTypography(obj);
								onChangeValue(
									'typography',
									parsedTypography,
									SCStyle
								);
							}}
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
								onChangeColor(
									val,
									secondColor,
									secondColorDefault
								);
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
									`h${item}-color-general-global`
								)}
								options={options}
								onChange={val => {
									onChangeColor(
										val,
										`h${item}-color-general`,
										'color-5'
									);
								}}
							/>
						)}
						{deviceType === 'general' &&
							processAttribute(
								`h${item}-color-general-global`
							) && (
								<ColorControl
									label={__(`H${item} Text`, 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__h${item}-text-color--${SCStyle}`}
									color={
										processAttribute(
											`h${item}-color-general`
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
											`h${item}-color-general`,
											val,
											SCStyle
										);
									}}
									disableGradient
									disablePalette
								/>
							)}
						<TypographyControl
							typography={getTypography(`h${item}`)}
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
								const parsedTypography = parseTypography(obj);
								onChangeValue(
									'typography',
									parsedTypography,
									SCStyle
								);
							}}
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
					deviceType === 'general' && {
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
													background: processAttribute(
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
						'button-text-color',
						'Button',
						'color-1',
						'button',
						'button-background-color',
						'Button Background',
						'color-4'
					),
					generateTab(
						'p-color-general',
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
					deviceType === 'general' &&
						generateTab('hover', 'Hover', 'color-6', false, false),
					deviceType === 'general' &&
						generateTab(
							'icon-line',
							'SVG Icon',
							'color-7',
							false,
							'icon-fill',
							'Fill',
							'color-4'
						),
					deviceType === 'general' &&
						generateTab(
							'font-icon-color',
							'Font Icon',
							'color-7',
							false,
							false
						),
					deviceType === 'general' &&
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
