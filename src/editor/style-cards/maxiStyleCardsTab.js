/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import getStyleCardAttr from '../../extensions/styles/defaults/style-card';
import { processSCAttribute } from './utils';
import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
	FancyRadioControl,
} from '../../components';
import { getTypographyFromSC } from '../../extensions/style-cards';

/**
 * Component
 */
const SCTab = props => {
	const {
		type,
		firstLabel,
		firstColor = 'color',
		firstColorDefault,
		secondColor = false,
		secondLabel,
		secondColorDefault,
		disableTypography = false,
		breakpoint,
		SC,
		SCStyle,
		onChangeValue,
	} = props;

	const firstColorGlobal = `${firstColor}-global`;
	const secondColorGlobal = `${secondColor}-global`;

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

	return (
		<>
			{breakpoint === 'general' && (
				<FancyRadioControl
					label={__(`Use Global ${firstLabel} Colour`, 'maxi-blocks')}
					selected={processSCAttribute(SC, firstColorGlobal, type)}
					options={options}
					onChange={val => {
						onChangeValue(
							{
								[firstColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(
										SC,
										firstColorGlobal,
										type
									)
								) && {
									[firstColor]: processSCAttribute(
										SC,
										firstColorDefault,
										'color'
									),
								}),
							},
							type
						);
					}}
				/>
			)}
			{breakpoint === 'general' &&
				processSCAttribute(SC, firstColorGlobal, type) && (
					<ColorControl
						label={__(`${firstLabel} Text`, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__color--${SCStyle}`}
						color={
							processSCAttribute(SC, firstColor, type) ||
							getStyleCardAttr(firstColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							firstColorDefault,
							SCStyle,
							true
						)}
						onChange={val => {
							onChangeValue({ [firstColor]: val }, type);
						}}
						disableGradient
						disablePalette
					/>
				)}
			{!disableTypography && (
				<TypographyControl
					typography={getTypographyFromSC(SC, type)}
					disableFormats
					disableCustomFormats
					className={`maxi-style-cards-control__sc__${type}-typography`}
					textLevel={type}
					hideAlignment
					hideTextShadow
					breakpoint={breakpoint}
					disablePalette
					styleCards
					onChange={obj => {
						// const parsedTypography = getSCFromTypography(SC, obj);
						onChangeValue({ typography: obj }, type);
					}}
					blockStyle={SCStyle}
					disableFontFamily={breakpoint !== 'general'}
				/>
			)}
			{!!secondColor && breakpoint === 'general' && (
				<FancyRadioControl
					label={__(
						`Use Global ${secondLabel} Colour`,
						'maxi-blocks'
					)}
					selected={processSCAttribute(SC, secondColorGlobal, type)}
					options={options}
					onChange={val => {
						onChangeValue(
							{
								[secondColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(SC, secondColor, type)
								) && {
									[secondColor]: processSCAttribute(
										SC,
										secondColorDefault,
										'color'
									),
								}),
							},
							type
						);
					}}
				/>
			)}
			{!!secondColor &&
				breakpoint === 'general' &&
				processSCAttribute(SC, secondColorGlobal, type) && (
					<ColorControl
						label={__(secondLabel, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__${secondColor}--${SCStyle}`}
						color={
							processSCAttribute(SC, secondColor, type) ||
							getStyleCardAttr(secondColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							secondColorDefault,
							SCStyle,
							true
						)}
						onChange={val => {
							onChangeValue({ [secondColor]: val }, type);
						}}
						disableGradient
						disablePalette
					/>
				)}
		</>
	);
};

const MaxiStyleCardsTab = ({ SC, SCStyle, breakpoint, onChangeValue }) => {
	const [quickColorPreset, setQuickColorPreset] = useState(1);

	const generateTab = props => {
		return {
			label: __(props.firstLabel, 'maxi-blocks'),
			content: (
				<SCTab
					breakpoint={breakpoint}
					SC={SC}
					SCStyle={SCStyle}
					onChangeValue={onChangeValue}
					{...props}
				/>
			),
		};
	};

	const headingItems = () =>
		[1, 2, 3, 4, 5, 6].map(item => {
			return {
				label: __(`H${item}`, 'maxi-blocks'),
				content: (
					<SCTab
						breakpoint={breakpoint}
						SC={SC}
						SCStyle={SCStyle}
						onChangeValue={onChangeValue}
						type={`h${item}`}
						firstLabel={`H${item}`}
						firstColorDefault={5}
					/>
				),
			};
		});

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
														processSCAttribute(
															SC,
															item,
															'color'
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
									color={processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}
									defaultColor={processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}
									onChange={val => {
										onChangeValue(
											{
												[`${quickColorPreset}`]: val,
											},
											'color'
										);
									}}
									disableGradient
									disablePalette
								/>
							</>
						),
					},
					generateTab({
						type: 'button',
						firstLabel: 'Button',
						firstColorDefault: 1,
						secondColor: 'background-color',
						secondLabel: 'Button Background',
						secondColorDefault: 4,
					}),
					generateTab({
						type: 'p',
						firstLabel: 'Paragraph',
						firstColorDefault: 3,
						secondColor: 'link',
						secondLabel: 'Link',
						secondColorDefault: 4,
					}),
					{
						label: __('Headings', 'maxi-blocks'),
						content: <SettingTabsControl items={headingItems()} />,
					},
					generateTab({
						type: 'hover',
						firstLabel: 'Hover',
						firstColorDefault: 6,
						disableTypography: true,
					}),
					generateTab({
						type: 'icon',
						firstLabel: 'SVG Icon',
						firstColor: 'line',
						firstColorDefault: 7,
						secondColor: 'fill',
						secondLabel: 'Fill',
						secondColorDefault: 4,
						disableTypography: true,
					}),
					generateTab({
						type: 'divider',
						firstLabel: 'Divider',
						firstColorDefault: 4,
						disableTypography: true,
					}),
				]}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
