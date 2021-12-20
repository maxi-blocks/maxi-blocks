/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { memo, useState } from '@wordpress/element';
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AdvancedNumberControl,
	ColorControl,
	FontLevelControl,
	SelectControl,
	SettingTabsControl,
	TextControl,
	ToggleSwitch,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsText, categoriesText } from './custom-css';
import { setSVGColor } from '../../extensions/svg';
import MaxiModal from '../../editor/library/modal';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep, capitalize } from 'lodash';

/**
 * Inspector
 */
const listTab = props => {
	const { attributes, deviceType, setAttributes } = props;
	const {
		parentBlockStyle,
		listReversed,
		listStart,
		typeOfList,
		listPosition,
		listStyle,
		listStyleCustom,
		listSVGColor,
		listSize,
		listSizeUnit,
	} = attributes;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [listStyleSource, setListStyleSource] = useState(
		(isURL(listStyleCustom) && 'url') ||
			(listStyleCustom?.includes('<svg ') && 'icon') ||
			'text'
	);

	const getListStyleOptions = type => {
		return {
			ul: [
				'disc',
				'none',
				'custom',
				'circle',
				'square',
				'disclosure-open',
				'disclosure-closed',
			],
			ol: [
				'details',
				'none',
				'decimal',
				'cjk-decimal',
				'decimal-leading-zero',
				'lower-roman',
				'upper-roman',
				'lower-greek',
				'lower-alpha',
				'lower-latin',
				'upper-alpha',
				'upper-latin',
				'arabic-indic',
				'armenian',
				'bengali',
				'cambodian',
				'khmer',
				'cjk-earthly-branch',
				'cjk-heavenly-stem',
				'cjk-ideographic',
				'trad-chinese-informal',
				'devanagari',
				'ethiopic-numeric',
				'georgian',
				'gujarati',
				'gurmukhi',
				'hebrew',
				'hiragana',
				'hiragana-iroha',
				'japanese-formal',
				'japanese-informal',
				'kannada',
				'katakana',
				'katakana-iroha',
				'korean-hangul-formal',
				'korean-hanja-formal',
				'korean-hanja-informal',
				'lao',
				'lower-armenian',
				'malayalam',
				'mongolian',
				'myanmar',
				'oriya',
				'persian',
				'simp-chinese-formal',
				'simp-chinese-informal',
				'tamil',
				'telugu',
				'thai',
				'tibetan',
				'trad-chinese-formal',
				'trad-chinese-informal',
				'upper-armenian',
			],
		}?.[type].map(style => {
			return {
				label: __(`${capitalize(style)}`, 'maxi-blocks'),
				value: style,
			};
		});
	};

	return {
		...{
			label: __('List options', 'maxi-blocks'),
			content: (
				<>
					<SelectControl
						label={__('List position', 'maxi-blocks')}
						className='maxi-image-inspector__list-position'
						value={listPosition}
						options={[
							{
								label: __('Inside', 'maxi-blocks'),
								value: 'inside',
							},
							{
								label: __('Outside', 'maxi-blocks'),
								value: 'outside',
							},
						]}
						onChange={listPosition =>
							setAttributes({
								listPosition,
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Indent', 'maxi-blocks')}
						className='maxi-image-inspector__list-indent'
						placeholder={getLastBreakpointAttribute(
							'list-indent',
							deviceType,
							attributes
						)}
						value={attributes[`list-indent-${deviceType}`]}
						onChangeValue={val =>
							setAttributes({
								[`list-indent-${deviceType}`]: val,
							})
						}
						enableUnit
						unit={getLastBreakpointAttribute(
							'list-indent-unit',
							deviceType,
							attributes
						)}
						minMaxSettings={{
							px: {
								min: -999,
								max: 999,
							},
							em: {
								min: -99,
								max: 99,
							},
							vw: {
								min: -99,
								max: 99,
							},
							'%': {
								min: -100,
								max: 100,
							},
						}}
						onChangeUnit={val =>
							setAttributes({
								[`list-indent-unit-${deviceType}`]: val,
							})
						}
						onReset={() => {
							setAttributes({
								[`list-indent-${deviceType}`]:
									getDefaultAttribute(
										`list-indent-${deviceType}`
									),
								[`list-indent-unit-${deviceType}`]:
									getDefaultAttribute(
										`list-indent-unit-${deviceType}`
									),
							});
						}}
					/>
					<AdvancedNumberControl
						label={__('List gap', 'maxi-blocks')}
						className='maxi-image-inspector__list-gap'
						placeholder={getLastBreakpointAttribute(
							'list-gap',
							deviceType,
							attributes
						)}
						value={attributes[`list-gap-${deviceType}`]}
						onChangeValue={val =>
							setAttributes({
								[`list-gap-${deviceType}`]: val,
							})
						}
						enableUnit
						unit={getLastBreakpointAttribute(
							'list-gap-unit',
							deviceType,
							attributes
						)}
						minMaxSettings={{
							px: {
								min: 0,
								max: 999,
							},
							em: {
								min: 0,
								max: 99,
							},
							vw: {
								min: 0,
								max: 99,
							},
							'%': {
								min: 0,
								max: 100,
							},
						}}
						onChangeUnit={val =>
							setAttributes({
								[`list-gap-unit-${deviceType}`]: val,
							})
						}
						onReset={() => {
							setAttributes({
								[`list-gap-${deviceType}`]: getDefaultAttribute(
									`list-gap-${deviceType}`
								),
								[`list-gap-unit-${deviceType}`]:
									getDefaultAttribute(
										`list-gap-unit-${deviceType}`
									),
							});
						}}
					/>
					<AdvancedNumberControl
						label={__('Marker size', 'maxi-blocks')}
						className='maxi-image-inspector__list-size'
						value={listSize}
						onChangeValue={val => {
							setAttributes({
								listSize:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						enableUnit
						unit={listSizeUnit}
						onChangeUnit={listSizeUnit =>
							setAttributes({
								listSizeUnit,
							})
						}
						minMaxSettings={{
							px: {
								min: 0,
								max: 999,
							},
							em: {
								min: 0,
								max: 99,
							},
							vw: {
								min: 0,
								max: 99,
							},
							'%': {
								min: 0,
								max: 999,
							},
						}}
						onReset={() =>
							setAttributes({
								listSize: getDefaultAttribute('listSize'),
								listSizeUnit:
									getDefaultAttribute('listSizeUnit'),
							})
						}
					/>
					<SelectControl
						label={__('Type of list', 'maxi-blocks')}
						className='maxi-image-inspector__list-type'
						value={typeOfList}
						options={[
							{
								label: __('Unorganized', 'maxi-blocks'),
								value: 'ul',
							},
							{
								label: __('Organized', 'maxi-blocks'),
								value: 'ol',
							},
						]}
						onChange={typeOfList =>
							setAttributes({
								typeOfList,
							})
						}
					/>
					{typeOfList === 'ol' && (
						<>
							<AdvancedNumberControl
								label={__('Start From', 'maxi-blocks')}
								className='maxi-image-inspector__list-start'
								value={listStart}
								onChangeValue={val => {
									setAttributes({
										listStart:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={-99}
								max={99}
								onReset={() =>
									setAttributes({
										listStart: '',
									})
								}
							/>
							<ToggleSwitch
								label={__('Reverse order', 'maxi-blocks')}
								className='maxi-image-inspector__list-reverse'
								value={listReversed}
								onChange={value => {
									setAttributes({
										listReversed: value,
									});
								}}
							/>
						</>
					)}
					<SelectControl
						label={__('Style', 'maxi-blocks')}
						className='maxi-image-inspector__list-style'
						value={listStyle || 'disc'}
						options={getListStyleOptions(typeOfList)}
						onChange={listStyle =>
							setAttributes({
								listStyle,
							})
						}
					/>
					{typeOfList === 'ul' && listStyle === 'custom' && (
						<>
							<SelectControl
								label={__('Source', 'maxi-blocks')}
								className='maxi-image-inspector__list-source-selector'
								value={listStyleSource}
								options={[
									{
										label: __('Text', 'maxi-blocks'),
										value: 'text',
									},
									{
										label: __('URL', 'maxi-blocks'),
										value: 'url',
									},
									{
										label: __('Icon', 'maxi-blocks'),
										value: 'icon',
									},
								]}
								onChange={listStyleSource =>
									setListStyleSource(listStyleSource)
								}
							/>
							{listStyleSource !== 'icon' && (
								<TextControl
									className='maxi-image-inspector__list-source-text'
									value={listStyleCustom}
									onChange={listStyleCustom =>
										setAttributes({
											listStyleCustom,
										})
									}
								/>
							)}
							{listStyleSource === 'icon' && (
								<>
									<MaxiModal
										type='image-shape'
										style={parentBlockStyle || 'light'}
										onSelect={obj =>
											setAttributes({
												listStyleCustom: obj.SVGElement,
											})
										}
										onRemove={() =>
											setAttributes({
												listStyleCustom: '',
											})
										}
										icon={listStyleCustom}
									/>
									{listStyleCustom?.includes('<svg ') && (
										<ColorControl
											disablePalette
											color={listSVGColor}
											onChange={({ color }) => {
												setAttributes({
													listSVGColor: color,
													listStyleCustom:
														setSVGColor({
															svg: listStyleCustom,
															color,
															type: 'fill',
														}),
												});
											}}
										/>
									)}
								</>
							)}
						</>
					)}
				</>
			),
		},
	};
};

const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes } = props;
		const { isList, textLevel } = attributes;

		return (
			<InspectorControls>
				{inspectorTabs.responsiveInfoBox({ props })}
				<SettingTabsControl
					target='sidebar-settings-tabs'
					disablePadding
					deviceType={deviceType}
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
							content: (
								<>
									{inspectorTabs.blockSettings({
										props,
									})}
									<AccordionControl
										isSecondary
										items={[
											deviceType === 'general' &&
												!isList && {
													label: __(
														'Heading / Paragraph tag',
														'maxi-blocks'
													),
													content: (
														<FontLevelControl
															{...getGroupAttributes(
																attributes,
																'typography',
																true
															)}
															value={textLevel}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
														/>
													),
												},
											...(deviceType === 'general' &&
												isList &&
												listTab(props)),
											...inspectorTabs.alignment({
												props,
												isTextAlignment: true,
											}),
											...inspectorTabs.typography({
												props,
												styleCardPrefix: '',
												hideAlignment: true,
												allowLink: true,
												globalProps: {
													target: '',
													type: textLevel,
												},
												hoverGlobalProps: {
													target: 'hover',
													type: textLevel,
												},
											}),
											...inspectorTabs.blockBackground({
												props,
											}),
											...inspectorTabs.border({
												props,
											}),
											...inspectorTabs.boxShadow({
												props,
											}),
											...inspectorTabs.size({
												props,
												block: true,
											}),
											...inspectorTabs.marginPadding({
												props,
											}),
										]}
									/>
								</>
							),
						},
						{
							label: __('Advanced', 'maxi-blocks'),
							content: (
								<>
									<AccordionControl
										isPrimary
										items={[
											deviceType === 'general' && {
												...inspectorTabs.customClasses({
													props,
												}),
											},
											deviceType === 'general' && {
												...inspectorTabs.anchor({
													props,
												}),
											},
											...inspectorTabs.customCss({
												props,
												breakpoint: deviceType,
												selectors: selectorsText,
												categories: categoriesText,
											}),
											...inspectorTabs.scrollEffects({
												props,
											}),
											...inspectorTabs.transform({
												props,
											}),
											...inspectorTabs.transition({
												props,
												label: __(
													'Hyperlink hover transition',
													'maxi-blocks'
												),
											}),
											...inspectorTabs.display({
												props,
											}),
											...inspectorTabs.opacity({
												props,
											}),
											...inspectorTabs.position({
												props,
											}),
											deviceType !== 'general' && {
												...inspectorTabs.responsive({
													props,
												}),
											},
											...inspectorTabs.overflow({
												props,
											}),
											...inspectorTabs.zindex({
												props,
											}),
										]}
									/>
								</>
							),
						},
					]}
				/>
			</InspectorControls>
		);
	},
	// Avoids non-necessary renderings
	(
		{
			attributes: oldAttr,
			propsToAvoid,
			isSelected: wasSelected,
			deviceType: oldBreakpoint,
		},
		{ attributes: newAttr, isSelected, deviceType: breakpoint }
	) => {
		if (
			!wasSelected ||
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint
		)
			return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default Inspector;
