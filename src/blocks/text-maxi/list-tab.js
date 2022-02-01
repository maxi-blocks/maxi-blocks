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
	const { attributes, deviceType, handleSetAttributes } = props;
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
					<SelectControl
						label={__('List position', 'maxi-blocks')}
						className='maxi-image-inspector__list-position'
						value={getLastBreakpointAttribute(
							'list-position',
							deviceType,
							attributes
						)}
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
							handleSetAttributes({
								[`list-position-${deviceType}`]: val,
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
							handleSetAttributes({
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
							handleSetAttributes({
								[`list-indent-unit-${deviceType}`]: val,
							})
						}
						onReset={() => {
							handleSetAttributes({
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
							handleSetAttributes({
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
							handleSetAttributes({
								[`list-gap-unit-${deviceType}`]: val,
							})
						}
						onReset={() => {
							handleSetAttributes({
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
						value={getLastBreakpointAttribute(
							'list-size',
							deviceType,
							attributes
						)}
						onChangeValue={val => {
							handleSetAttributes({
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
							handleSetAttributes({
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
							handleSetAttributes({
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
							handleSetAttributes({
								[`list-text-position-${deviceType}`]: val,
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
							handleSetAttributes({
								typeOfList,
								listStyle:
									getListStyleOptions(typeOfList)[0].value,
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
									handleSetAttributes({
										listStart:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={-99}
								max={99}
								onReset={() =>
									handleSetAttributes({
										listStart: '',
									})
								}
							/>
							<ToggleSwitch
								label={__('Reverse order', 'maxi-blocks')}
								className='maxi-image-inspector__list-reverse'
								selected={listReversed}
								onChange={val => {
									handleSetAttributes({
										listReversed: val,
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
							handleSetAttributes({
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
								onChange={listStyleSource => {
									setListStyleSource(listStyleSource);

									if (listStyleCustoms[listStyleSource])
										handleSetAttributes({
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
										listStyleCustoms[listStyleSource] ?? ''
									}
									onChange={listStyleCustom => {
										handleSetAttributes({
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
								<>
									<MaxiModal
										type='image-shape'
										style={parentBlockStyle || 'light'}
										onSelect={obj => {
											handleSetAttributes({
												listStyleCustom: obj.SVGElement,
											});
											setListStyleCustoms({
												...listStyleCustoms,
												[listStyleSource]:
													obj.SVGElement,
											});
										}}
										onRemove={() => {
											handleSetAttributes({
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
									{listStyleCustom?.includes('<svg ') && (
										<ColorControl
											label={__(
												'Background',
												'maxi-blocks'
											)}
											color={attributes['list-svg-color']}
											defaultColor={getDefaultAttribute(
												'list-svg-color'
											)}
											paletteStatus={
												attributes[
													'list-svg-palette-status'
												]
											}
											paletteColor={
												attributes[
													'list-svg-palette-color'
												]
											}
											paletteOpacity={
												attributes[
													'list-svg-palette-opacity'
												]
											}
											onChange={({
												paletteStatus,
												paletteColor,
												paletteOpacity,
												color,
											}) => {
												const colorStr = paletteStatus
													? getColorRGBAString({
															firstVar: `color-${paletteColor}`,
															opacity:
																paletteOpacity,
															blockStyle:
																parentBlockStyle,
													  })
													: color;

												handleSetAttributes({
													'list-svg-palette-status':
														paletteStatus,
													'list-svg-palette-color':
														paletteColor,
													'list-svg-palette-opacity':
														paletteOpacity,
													'list-svg-color': color,
													listStyleCustom:
														setSVGColor({
															svg: listStyleCustom,
															color: colorStr,
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

export default listTab;
