/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { isURL } from '@wordpress/url';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ColorControl from '@components/color-control';
import SelectControl from '@components/select-control';
import TextControl from '@components/text-control';
import ToggleSwitch from '@components/toggle-switch';
import MaxiModal from '@editor/library/modal';

import {
	getColorRGBAString,
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getPaletteAttributes,
} from '@extensions/styles';
import { setSVGColor } from '@extensions/svg';

const ListOptionsControl = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;
	const {
		blockStyle,
		listReversed,
		listStart,
		typeOfList,
		listStyle,
		listStyleCustom,
	} = attributes;

	const isSVGMarker =
		typeOfList === 'ul' &&
		listStyle === 'custom' &&
		listStyleCustom &&
		listStyleCustom.includes('</svg>');
	const defaultListStyleSource =
		(isURL(listStyleCustom) && 'url') ||
		(listStyleCustom?.includes('<svg ') && 'icon') ||
		'text';
	const [listStyleSource, setListStyleSource] = useState(
		defaultListStyleSource
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

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('List style position', 'maxi-blocks')}
				className='maxi-text-inspector__list-style-position'
				value={getLastBreakpointAttribute({
					target: 'list-style-position',
					breakpoint: deviceType,
					attributes,
				})}
				defaultValue={getDefaultAttribute(
					`list-style-position-${deviceType}`
				)}
				onReset={() =>
					maxiSetAttributes({
						[`list-style-position-${deviceType}`]:
							getDefaultAttribute(
								`list-style-position-${deviceType}`
							),
						isReset: true,
					})
				}
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
				onChange={val =>
					maxiSetAttributes({
						[`list-style-position-${deviceType}`]: val,
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Text indent', 'maxi-blocks')}
				className='maxi-text-inspector__list-indent'
				placeholder={getLastBreakpointAttribute({
					target: 'list-indent',
					breakpoint: deviceType,
					attributes,
				})}
				value={attributes[`list-indent-${deviceType}`]}
				onChangeValue={val =>
					maxiSetAttributes({
						[`list-indent-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-indent-unit',
					breakpoint: deviceType,
					attributes,
				})}
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
						[`list-indent-${deviceType}`]: getDefaultAttribute(
							`list-indent-${deviceType}`
						),
						[`list-indent-unit-${deviceType}`]: getDefaultAttribute(
							`list-indent-unit-${deviceType}`
						),
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('List gap', 'maxi-blocks')}
				className='maxi-text-inspector__list-gap'
				placeholder={getLastBreakpointAttribute({
					target: 'list-gap',
					breakpoint: deviceType,
					attributes,
				})}
				value={attributes[`list-gap-${deviceType}`]}
				onChangeValue={val =>
					maxiSetAttributes({
						[`list-gap-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-gap-unit',
					breakpoint: deviceType,
					attributes,
				})}
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
						[`list-gap-unit-${deviceType}`]: getDefaultAttribute(
							`list-gap-unit-${deviceType}`
						),
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('Paragraph spacing', 'maxi-blocks')}
				className='maxi-text-inspector__list-paragraph-spacing'
				placeholder={getLastBreakpointAttribute({
					target: 'list-paragraph-spacing',
					breakpoint: deviceType,
					attributes,
				})}
				value={attributes[`list-paragraph-spacing-${deviceType}`]}
				onChangeValue={val =>
					maxiSetAttributes({
						[`list-paragraph-spacing-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-paragraph-spacing-unit',
					breakpoint: deviceType,
					attributes,
				})}
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
						[`list-paragraph-spacing-unit-${deviceType}`]: val,
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
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={
					isSVGMarker
						? __('Marker width', 'maxi-blocks')
						: __('Marker size', 'maxi-blocks')
				}
				className='maxi-text-inspector__list-marker-size'
				value={getLastBreakpointAttribute({
					target: 'list-marker-size',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeValue={val => {
					maxiSetAttributes({
						[`list-marker-size-${deviceType}`]:
							val !== undefined && val !== '' ? val : '',
					});
				}}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-marker-size-unit',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeUnit={val => {
					maxiSetAttributes({
						[`list-marker-size-unit-${deviceType}`]: val,
					});
				}}
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
				onReset={() => {
					maxiSetAttributes({
						[`list-marker-size-${deviceType}`]: getDefaultAttribute(
							`list-marker-size-${deviceType}`
						),
						[`list-marker-size-unit-${deviceType}`]:
							getDefaultAttribute(
								`list-marker-size-unit-${deviceType}`
							),
						isReset: true,
					});
				}}
			/>
			{isSVGMarker && (
				<AdvancedNumberControl
					label={__('Marker height', 'maxi-blocks')}
					className='maxi-text-inspector__list-marker-height'
					placeholder={getLastBreakpointAttribute({
						target: 'list-marker-height',
						breakpoint: deviceType,
						attributes,
					})}
					value={attributes[`list-marker-height-${deviceType}`]}
					onChangeValue={val =>
						maxiSetAttributes({
							[`list-marker-height-${deviceType}`]: val,
						})
					}
					enableUnit
					unit={getLastBreakpointAttribute({
						target: 'list-marker-height-unit',
						breakpoint: deviceType,
						attributes,
					})}
					onChangeUnit={val =>
						maxiSetAttributes({
							[`list-marker-height-unit-${deviceType}`]: val,
						})
					}
					onReset={() => {
						maxiSetAttributes({
							[`list-marker-height-${deviceType}`]:
								getDefaultAttribute(
									`list-marker-height-${deviceType}`
								),
							[`list-marker-height-unit-${deviceType}`]:
								getDefaultAttribute(
									`list-marker-height-unit-${deviceType}`
								),
							isReset: true,
						});
					}}
					allowedUnits={['px', 'em', 'vw', '%']}
				/>
			)}
			<AdvancedNumberControl
				label={__('Marker line-height', 'maxi-blocks')}
				className='maxi-text-inspector__list-marker-line-height'
				placeholder={getLastBreakpointAttribute({
					target: 'list-marker-line-height',
					breakpoint: deviceType,
					attributes,
				})}
				value={attributes[`list-marker-line-height-${deviceType}`]}
				onChangeValue={val =>
					maxiSetAttributes({
						[`list-marker-line-height-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-marker-line-height-unit',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeUnit={val =>
					maxiSetAttributes({
						[`list-marker-line-height-unit-${deviceType}`]: val,
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
						isReset: true,
					});
				}}
				allowedUnits={['px', 'em', 'vw', '%', '-']}
			/>
			<AdvancedNumberControl
				label={__('Marker vertical offset', 'maxi-blocks')}
				className='maxi-text-inspector__list-marker-offset'
				placeholder={getLastBreakpointAttribute({
					target: 'list-marker-vertical-offset',
					breakpoint: deviceType,
					attributes,
				})}
				value={attributes[`list-marker-vertical-offset-${deviceType}`]}
				onChangeValue={val =>
					maxiSetAttributes({
						[`list-marker-vertical-offset-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-marker-vertical-offset-unit',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeUnit={val =>
					maxiSetAttributes({
						[`list-marker-vertical-offset-unit-${deviceType}`]: val,
					})
				}
				onReset={() => {
					maxiSetAttributes({
						[`list-marker-vertical-offset-${deviceType}`]:
							getDefaultAttribute(
								`list-marker-vertical-offset-${deviceType}`
							),
						[`list-marker-vertical-offset-unit-${deviceType}`]:
							getDefaultAttribute(
								`list-marker-vertical-offset-unit-${deviceType}`
							),
						isReset: true,
					});
				}}
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
			/>
			<AdvancedNumberControl
				label={__('Marker indent', 'maxi-blocks')}
				className='maxi-text-inspector__list-marker-indent'
				placeholder={getLastBreakpointAttribute({
					target: 'list-marker-indent',
					breakpoint: deviceType,
					attributes,
				})}
				value={attributes[`list-marker-indent-${deviceType}`]}
				onChangeValue={val =>
					maxiSetAttributes({
						[`list-marker-indent-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: 'list-marker-indent-unit',
					breakpoint: deviceType,
					attributes,
				})}
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
						isReset: true,
					});
				}}
			/>
			{deviceType === 'general' && (
				<ColorControl
					label={__('Marker', 'maxi-blocks')}
					color={attributes['list-color']}
					paletteStatus={attributes['list-palette-status']}
					paletteSCStatus={attributes['list-palette-sc-status']}
					paletteColor={attributes['list-palette-color']}
					paletteOpacity={attributes['list-palette-opacity']}
					prefix='list-'
					avoidBreakpointForDefault
					onChangeInline={({ color }) =>
						insertInlineStyles({
							obj: { color },
							target: 'li',
							isMultiplySelector: false,
							pseudoElement: '::before',
						})
					}
					onChange={({
						paletteStatus,
						paletteSCStatus,
						paletteColor,
						paletteOpacity,
						color,
					}) => {
						const colorStr = paletteStatus
							? getColorRGBAString({
									firstVar: `color-${paletteColor}`,
									opacity: paletteOpacity,
									blockStyle,
							  })
							: color;

						maxiSetAttributes({
							'list-palette-status': paletteStatus,
							'list-palette-sc-status': paletteSCStatus,
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
						cleanInlineStyles('li', '::before');
					}}
				/>
			)}
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Text position', 'maxi-blocks')}
				className='maxi-text-inspector__list-style'
				value={getLastBreakpointAttribute({
					target: 'list-text-position',
					breakpoint: deviceType,
					attributes,
				})}
				defaultValue={getDefaultAttribute(
					`list-text-position-${deviceType}`
				)}
				onReset={() =>
					maxiSetAttributes({
						[`list-text-position-${deviceType}`]:
							getDefaultAttribute(
								`list-text-position-${deviceType}`
							),
						isReset: true,
					})
				}
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
					__nextHasNoMarginBottom
					label={__('Type of list', 'maxi-blocks')}
					className='maxi-text-inspector__list-type'
					value={typeOfList}
					defaultValue={getDefaultAttribute('typeOfList')}
					onReset={() =>
						maxiSetAttributes({
							typeOfList: getDefaultAttribute('typeOfList'),
							listStyle: getListStyleOptions(
								getDefaultAttribute('typeOfList')
							)[0].value,
							isReset: true,
						})
					}
					options={[
						{
							label: __('Unordered', 'maxi-blocks'),
							value: 'ul',
						},
						{
							label: __('Ordered', 'maxi-blocks'),
							value: 'ol',
						},
					]}
					onChange={typeOfList =>
						maxiSetAttributes({
							typeOfList,
							listStyle: getListStyleOptions(typeOfList)[0].value,
						})
					}
				/>
			)}
			{deviceType === 'general' && (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Style', 'maxi-blocks')}
						className='maxi-text-inspector__list-style'
						value={listStyle || 'disc'}
						defaultValue={getDefaultAttribute('listStyle')}
						onReset={() =>
							maxiSetAttributes({
								listStyle: getDefaultAttribute('listStyle'),
								isReset: true,
							})
						}
						options={getListStyleOptions(typeOfList)}
						onChange={listStyle => {
							maxiSetAttributes({
								listStyle,
							});
							if (
								!(
									['decimal', 'details'].includes(
										typeOfList
									) || !listStyle
								) &&
								listStart < 0
							) {
								maxiSetAttributes({ listStart: 0 });
							}
						}}
					/>
					{typeOfList === 'ol' && (
						<>
							<AdvancedNumberControl
								label={__('Start from', 'maxi-blocks')}
								className='maxi-text-inspector__list-start'
								value={listStart}
								onChangeValue={val => {
									maxiSetAttributes({
										listStart:
											val !== undefined && val !== ''
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
										isReset: true,
									})
								}
							/>
							<ToggleSwitch
								label={__('Reverse order', 'maxi-blocks')}
								className='maxi-text-inspector__list-reverse'
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
								__nextHasNoMarginBottom
								label={__('Source', 'maxi-blocks')}
								className='maxi-text-inspector__list-source-selector'
								value={listStyleSource}
								defaultValue={defaultListStyleSource}
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
								onChange={listStyleSource => {
									setListStyleSource(listStyleSource);

									if (listStyleCustoms[listStyleSource])
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
									className='maxi-text-inspector__list-source-text'
									value={
										listStyleCustoms[listStyleSource] ?? ''
									}
									onChange={listStyleCustom => {
										maxiSetAttributes({
											listStyleCustom,
										});

										setListStyleCustoms({
											...listStyleCustoms,
											[listStyleSource]: listStyleCustom,
										});
									}}
								/>
							)}
							{listStyleSource === 'icon' && (
								<MaxiModal
									type='image-shape'
									style={blockStyle || 'light'}
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

										const colorStr = paletteStatus
											? getColorRGBAString({
													firstVar: `color-${paletteColor}`,
													opacity: paletteOpacity,
													blockStyle,
											  })
											: color;

										const SVGElement = setSVGColor({
											svg: obj.SVGElement,
											color: colorStr,
											type: 'fill',
										});

										maxiSetAttributes({
											listStyleCustom: SVGElement,
										});
										setListStyleCustoms({
											...listStyleCustoms,
											[listStyleSource]: SVGElement,
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
										listStyleCustom?.includes('<svg ')
											? listStyleCustom
											: false
									}
								/>
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default ListOptionsControl;
