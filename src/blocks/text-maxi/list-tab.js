/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ColorControl,
	SelectControl,
	TextControl,
	ToggleSwitch,
} from '../../components';
import {
	getColorRGBAString,
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getPaletteAttributes,
} from '../../extensions/styles';
import { setSVGColor } from '../../extensions/svg';
import MaxiModal from '../../editor/library/modal';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Inspector
 */
const listTab = props => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const {
		parentBlockStyle,
		listReversed,
		listStart,
		typeOfList,
		listStyle,
		listStyleCustom,
	} = attributes;

	const [listStyleSource, setListStyleSource] = useState(
		(isURL(listStyleCustom) && 'url') ||
			(listStyleCustom?.includes('<svg ') && 'icon') ||
			'text'
	);
	const [listStyleCustoms, setListStyleCustoms] = useState({
		[listStyleSource]: listStyleCustom,
	});

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
					<AdvancedNumberControl
						label={__('Text indent', 'maxi-blocks')}
						className='maxi-image-inspector__list-indent'
						placeholder={getLastBreakpointAttribute(
							'list-indent',
							deviceType,
							attributes
						)}
						value={attributes[`list-indent-${deviceType}`]}
						onChangeValue={val =>
							maxiSetAttributes({
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
							maxiSetAttributes({
								[`list-indent-unit-${deviceType}`]: val,
							})
						}
						onReset={() => {
							maxiSetAttributes({
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
							maxiSetAttributes({
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
								step: 1,
							},
							em: {
								min: 0,
								max: 99,
								step: 1,
							},
							vw: {
								min: 0,
								max: 99,
								step: 1,
							},
							'%': {
								min: 0,
								max: 100,
								step: 1,
							},
						}}
						onChangeUnit={val =>
							maxiSetAttributes({
								[`list-gap-unit-${deviceType}`]: val,
							})
						}
						onReset={() => {
							maxiSetAttributes({
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
						label={__('Paragraph spacing', 'maxi-blocks')}
						className='maxi-image-inspector__list-paragraph-spacing'
						placeholder={getLastBreakpointAttribute(
							'list-paragraph-spacing',
							deviceType,
							attributes
						)}
						value={
							attributes[`list-paragraph-spacing-${deviceType}`]
						}
						onChangeValue={val =>
							maxiSetAttributes({
								[`list-paragraph-spacing-${deviceType}`]: val,
							})
						}
						enableUnit
						unit={getLastBreakpointAttribute(
							'list-paragraph-spacing-unit',
							deviceType,
							attributes
						)}
						minMaxSettings={{
							px: {
								min: 0,
								max: 999,
								step: 1,
							},
							em: {
								min: 0,
								max: 99,
								step: 1,
							},
							vw: {
								min: 0,
								max: 99,
								step: 1,
							},
							'%': {
								min: 0,
								max: 100,
								step: 1,
							},
						}}
						onChangeUnit={val =>
							maxiSetAttributes({
								[`list-paragraph-spacing-unit-${deviceType}`]:
									val,
							})
						}
						onReset={() => {
							maxiSetAttributes({
								[`list-paragraph-spacing-${deviceType}`]:
									getDefaultAttribute(
										`list-paragraph-spacing-${deviceType}`
									),
								[`list-paragraph-spacing-unit-${deviceType}`]:
									getDefaultAttribute(
										`list-paragraph-spacing-unit-${deviceType}`
									),
							});
						}}
					/>
					<AdvancedNumberControl
						label={__('Marker size', 'maxi-blocks')}
						className='maxi-image-inspector__list-size'
						value={getLastBreakpointAttribute(
							'list-size',
							deviceType,
							attributes
						)}
						onChangeValue={val => {
							maxiSetAttributes({
								[`list-size-${deviceType}`]:
									val !== undefined && val !== '' ? val : '',
							});
						}}
						enableUnit
						unit={getLastBreakpointAttribute(
							'list-size-unit',
							deviceType,
							attributes
						)}
						onChangeUnit={val =>
							maxiSetAttributes({
								[`list-size-unit-${deviceType}`]: val,
							})
						}
						breakpoint={deviceType}
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
							maxiSetAttributes({
								[`list-size-${deviceType}`]:
									getDefaultAttribute(
										`list-size-${deviceType}`
									),
								[`list-size-unit-${deviceType}`]:
									getDefaultAttribute(
										`list-size-unit-${deviceType}`
									),
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Marker line-height', 'maxi-blocks')}
						className='maxi-image-inspector__list-marker-line-height'
						placeholder={getLastBreakpointAttribute(
							'list-marker-line-height',
							deviceType,
							attributes
						)}
						value={
							attributes[`list-marker-line-height-${deviceType}`]
						}
						onChangeValue={val =>
							maxiSetAttributes({
								[`list-marker-line-height-${deviceType}`]: val,
							})
						}
						enableUnit
						unit={getLastBreakpointAttribute(
							'list-marker-line-height-unit',
							deviceType,
							attributes
						)}
						onChangeUnit={val =>
							maxiSetAttributes({
								[`list-marker-line-height-unit-${deviceType}`]:
									val,
							})
						}
						onReset={() => {
							maxiSetAttributes({
								[`list-marker-line-height-${deviceType}`]:
									getDefaultAttribute(
										`list-marker-line-height-${deviceType}`
									),
								[`list-marker-line-height-unit-${deviceType}`]:
									getDefaultAttribute(
										`list-marker-line-height-unit-${deviceType}`
									),
							});
						}}
						allowedUnits={['px', 'em', 'vw', '%', '-']}
					/>
					<AdvancedNumberControl
						label={__('Marker indent', 'maxi-blocks')}
						className='maxi-image-inspector__list-marker-indent'
						placeholder={getLastBreakpointAttribute(
							'list-marker-indent',
							deviceType,
							attributes
						)}
						value={attributes[`list-marker-indent-${deviceType}`]}
						onChangeValue={val =>
							maxiSetAttributes({
								[`list-marker-indent-${deviceType}`]: val,
							})
						}
						enableUnit
						unit={getLastBreakpointAttribute(
							'list-marker-indent-unit',
							deviceType,
							attributes
						)}
						onChangeUnit={val =>
							maxiSetAttributes({
								[`list-marker-indent-unit-${deviceType}`]: val,
							})
						}
						breakpoint={deviceType}
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
						onReset={() => {
							maxiSetAttributes({
								[`list-marker-indent-${deviceType}`]:
									getDefaultAttribute(
										`list-marker-indent-${deviceType}`
									),
								[`list-marker-indent-unit-${deviceType}`]:
									getDefaultAttribute(
										`list-marker-indent-unit-${deviceType}`
									),
							});
						}}
					/>
					{deviceType === 'general' && (
						<ColorControl
							label={__('Marker colour', 'maxi-blocks')}
							color={attributes['list-color']}
							defaultColor={getDefaultAttribute('list-color')}
							paletteStatus={attributes['list-palette-status']}
							paletteColor={attributes['list-palette-color']}
							paletteOpacity={attributes['list-palette-opacity']}
							onChange={({
								paletteStatus,
								paletteColor,
								paletteOpacity,
								color,
							}) => {
								const colorStr = paletteStatus
									? getColorRGBAString({
											firstVar: `color-${paletteColor}`,
											opacity: paletteOpacity,
											blockStyle: parentBlockStyle,
									  })
									: color;

								maxiSetAttributes({
									'list-palette-status': paletteStatus,
									'list-palette-color': paletteColor,
									'list-palette-opacity': paletteOpacity,
									'list-color': color,
									...(listStyleCustom?.includes('<svg ') && {
										listStyleCustom: setSVGColor({
											svg: listStyleCustom,
											color: colorStr,
											type: 'fill',
										}),
									}),
								});
							}}
						/>
					)}
					<SelectControl
						label={__('Text position', 'maxi-blocks')}
						className='maxi-image-inspector__list-style'
						value={getLastBreakpointAttribute(
							'list-text-position',
							deviceType,
							attributes
						)}
						options={[
							{
								label: __('Baseline', 'maxi-blocks'),
								value: 'baseline',
							},
							{ label: __('Sub', 'maxi-blocks'), value: 'sub' },
							{
								label: __('Super', 'maxi-blocks'),
								value: 'super',
							},
							{ label: __('Top', 'maxi-blocks'), value: 'top' },
							{
								label: __('Text-top', 'maxi-blocks'),
								value: 'text-top',
							},
							{
								label: __('Middle', 'maxi-blocks'),
								value: 'middle',
							},
							{
								label: __('Bottom', 'maxi-blocks'),
								value: 'bottom',
							},
							{
								label: __('Text-bottom', 'maxi-blocks'),
								value: 'text-bottom',
							},
						]}
						onChange={val =>
							maxiSetAttributes({
								[`list-text-position-${deviceType}`]: val,
							})
						}
					/>
					{deviceType === 'general' && (
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
								maxiSetAttributes({
									typeOfList,
									listStyle:
										getListStyleOptions(typeOfList)[0]
											.value,
								})
							}
						/>
					)}
					{deviceType === 'general' && (
						<>
							<SelectControl
								label={__('Style', 'maxi-blocks')}
								className='maxi-image-inspector__list-style'
								value={listStyle || 'disc'}
								options={getListStyleOptions(typeOfList)}
								onChange={listStyle =>
									maxiSetAttributes({
										listStyle,
									})
								}
							/>
							{typeOfList === 'ol' && (
								<>
									<AdvancedNumberControl
										label={__('Start From', 'maxi-blocks')}
										className='maxi-image-inspector__list-start'
										value={
											!(
												['decimal', 'details'].includes(
													listStyle
												) || !listStyle
											) && listStart < 0
												? 0
												: listStart
										}
										onChangeValue={val => {
											maxiSetAttributes({
												listStart:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={
											['decimal', 'details'].includes(
												listStyle
											) || !listStyle
												? -99
												: 0
										}
										max={99}
										onReset={() =>
											maxiSetAttributes({
												listStart: '',
											})
										}
									/>
									<ToggleSwitch
										label={__(
											'Reverse order',
											'maxi-blocks'
										)}
										className='maxi-image-inspector__list-reverse'
										selected={listReversed}
										onChange={val => {
											maxiSetAttributes({
												listReversed: val,
											});
										}}
									/>
								</>
							)}
							{typeOfList === 'ul' && listStyle === 'custom' && (
								<>
									<SelectControl
										label={__('Source', 'maxi-blocks')}
										className='maxi-image-inspector__list-source-selector'
										value={listStyleSource}
										options={[
											{
												label: __(
													'Text',
													'maxi-blocks'
												),
												value: 'text',
											},
											{
												label: __('URL', 'maxi-blocks'),
												value: 'url',
											},
											{
												label: __(
													'Icon',
													'maxi-blocks'
												),
												value: 'icon',
											},
										]}
										onChange={listStyleSource => {
											setListStyleSource(listStyleSource);

											if (
												listStyleCustoms[
													listStyleSource
												]
											)
												maxiSetAttributes({
													listStyleCustom:
														listStyleCustoms[
															listStyleSource
														],
												});
										}}
									/>
									{listStyleSource !== 'icon' && (
										<TextControl
											className='maxi-image-inspector__list-source-text'
											value={
												listStyleCustoms[
													listStyleSource
												] ?? ''
											}
											onChange={listStyleCustom => {
												maxiSetAttributes({
													listStyleCustom,
												});

												setListStyleCustoms({
													...listStyleCustoms,
													[listStyleSource]:
														listStyleCustom,
												});
											}}
										/>
									)}
									{listStyleSource === 'icon' && (
										<>
											<MaxiModal
												type='image-shape'
												style={
													parentBlockStyle || 'light'
												}
												onSelect={obj => {
													const {
														paletteStatus,
														paletteColor,
														paletteOpacity,
														color,
													} = getPaletteAttributes({
														obj: attributes,
														prefix: 'list-',
													});

													const colorStr =
														paletteStatus
															? getColorRGBAString(
																	{
																		firstVar: `color-${paletteColor}`,
																		opacity:
																			paletteOpacity,
																		blockStyle:
																			parentBlockStyle,
																	}
															  )
															: color;

													const SVGElement =
														setSVGColor({
															svg: obj.SVGElement,
															color: colorStr,
															type: 'fill',
														});

													maxiSetAttributes({
														listStyleCustom:
															SVGElement,
													});
													setListStyleCustoms({
														...listStyleCustoms,
														[listStyleSource]:
															SVGElement,
													});
												}}
												onRemove={() => {
													maxiSetAttributes({
														listStyleCustom: '',
													});
													setListStyleCustoms({
														...listStyleCustoms,
														[listStyleSource]: '',
													});
												}}
												icon={
													listStyleCustom?.includes(
														'<svg '
													)
														? listStyleCustom
														: false
												}
											/>
										</>
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

export default listTab;
