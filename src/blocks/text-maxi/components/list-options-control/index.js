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
} from '../../../../components';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getPaletteAttributes,
} from '../../../../extensions/attributes';
import { getColorRGBAString } from '../../../../extensions/styles';
import { setSVGColor, setSVGSize } from '../../../../extensions/svg';
import MaxiModal from '../../../../editor/library/modal';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const ListOptionsControl = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const {
		_bs: blockStyle,
		_lr: listReversed,
		_lst: listStart,
		_tol: typeOfList,
		_lsty: listStyle,
		_lsc: listStyleCustom,
	} = attributes;

	const [
		listIndent,
		listGap,
		listParagraphSpacing,
		listMarkerLineHeight,
		listMarkerIndent,
	] = getAttributesValue({
		target: ['_lin', '_lg', '_lps', '_lmlh', '_lmi'],
		props: attributes,
		breakpoint: deviceType,
	});

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

	const getSVGElement = (size, unit) => {
		let svgElement = null;

		if (typeOfList === 'ul' && listStyleSource === 'icon') {
			svgElement = setSVGSize({
				svg: listStyleCustom,
				size: size + unit,
			});
		}

		return svgElement;
	};

	return (
		<>
			<SelectControl
				label={__('List style position', 'maxi-blocks')}
				className='maxi-text-inspector__list-style-position'
				value={getLastBreakpointAttribute({
					target: '_lsp',
					breakpoint: deviceType,
					attributes,
				})}
				defaultValue={getDefaultAttribute(`_lsp-${deviceType}`)}
				onReset={() =>
					maxiSetAttributes({
						[`_lsp-${deviceType}`]: getDefaultAttribute(
							`_lsp-${deviceType}`
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
						[`_lsp-${deviceType}`]: val,
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Text indent', 'maxi-blocks')}
				className='maxi-text-inspector__list-indent'
				placeholder={getLastBreakpointAttribute({
					target: '_lin',
					breakpoint: deviceType,
					attributes,
				})}
				value={listIndent}
				onChangeValue={val =>
					maxiSetAttributes({
						[`_lin-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_lin.u',
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
						[`_lin.u-${deviceType}`]: val,
					})
				}
				onReset={() => {
					maxiSetAttributes({
						[`_lin-${deviceType}`]: getDefaultAttribute(
							`_lin-${deviceType}`
						),
						[`_lin.u-${deviceType}`]: getDefaultAttribute(
							`_lin.u-${deviceType}`
						),
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('List gap', 'maxi-blocks')}
				className='maxi-text-inspector__list-gap'
				placeholder={getLastBreakpointAttribute({
					target: '_lg',
					breakpoint: deviceType,
					attributes,
				})}
				value={listGap}
				onChangeValue={val =>
					maxiSetAttributes({
						[`_lg-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_lg.u',
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
						[`_lg.u-${deviceType}`]: val,
					})
				}
				onReset={() => {
					maxiSetAttributes({
						[`_lg-${deviceType}`]: getDefaultAttribute(
							`_lg-${deviceType}`
						),
						[`_lg.u-${deviceType}`]: getDefaultAttribute(
							`_lg.u-${deviceType}`
						),
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('Paragraph spacing', 'maxi-blocks')}
				className='maxi-text-inspector__list-paragraph-spacing'
				placeholder={getLastBreakpointAttribute({
					target: '_lps',
					breakpoint: deviceType,
					attributes,
				})}
				value={listParagraphSpacing}
				onChangeValue={val =>
					maxiSetAttributes({
						[`_lps-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_lps.u',
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
						[`_lps.u-${deviceType}`]: val,
					})
				}
				onReset={() => {
					maxiSetAttributes({
						[`_lps-${deviceType}`]: getDefaultAttribute(
							`_lps-${deviceType}`
						),
						[`_lps.u-${deviceType}`]: getDefaultAttribute(
							`_lps.u-${deviceType}`
						),
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('Marker size', 'maxi-blocks')}
				className='maxi-text-inspector__list-marker-size'
				value={getLastBreakpointAttribute({
					target: '_lms',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeValue={val => {
					const unit = getLastBreakpointAttribute({
						target: '_lms.u',
						breakpoint: deviceType,
						attributes,
					});
					const svgElement = getSVGElement(val, unit);

					maxiSetAttributes({
						[`_lms-${deviceType}`]:
							val !== undefined && val !== '' ? val : '',
						...(svgElement && {
							listStyleCustom: svgElement,
						}),
					});
				}}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_lms.u',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeUnit={val => {
					const size = getLastBreakpointAttribute({
						target: '_lms',
						breakpoint: deviceType,
						attributes,
					});
					const svgElement = getSVGElement(size, val);

					maxiSetAttributes({
						[`_lms.u-${deviceType}`]: val,
						...(svgElement && {
							_lsc: svgElement,
						}),
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
					const defaultSize = getDefaultAttribute(
						`_lms-${deviceType}`
					);
					const defaultUnit = getDefaultAttribute(
						`_lms.u-${deviceType}`
					);
					const svgElement = getSVGElement(defaultSize, defaultUnit);
					maxiSetAttributes({
						[`_lms-${deviceType}`]: getDefaultAttribute(
							`_lms-${deviceType}`
						),
						[`_lms.u-${deviceType}`]: getDefaultAttribute(
							`_lms.u-${deviceType}`
						),
						...(svgElement && {
							_lsc: svgElement,
						}),
						isReset: true,
					});
				}}
			/>
			<AdvancedNumberControl
				label={__('Marker line-height', 'maxi-blocks')}
				className='maxi-text-inspector__list-marker-line-height'
				placeholder={getLastBreakpointAttribute({
					target: '_lmlh',
					breakpoint: deviceType,
					attributes,
				})}
				value={listMarkerLineHeight}
				onChangeValue={val =>
					maxiSetAttributes({
						[`_lmlh-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_lmlh.u',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeUnit={val =>
					maxiSetAttributes({
						[`_lmlh.u-${deviceType}`]: val,
					})
				}
				onReset={() => {
					maxiSetAttributes({
						[`_lmlh-${deviceType}`]: getDefaultAttribute(
							`_lmlh-${deviceType}`
						),
						[`_lmlh.u-${deviceType}`]: getDefaultAttribute(
							`_lmlh.u-${deviceType}`
						),
						isReset: true,
					});
				}}
				allowedUnits={['px', 'em', 'vw', '%', '-']}
			/>
			<AdvancedNumberControl
				label={__('Marker indent', 'maxi-blocks')}
				className='maxi-text-inspector__list-marker-indent'
				placeholder={getLastBreakpointAttribute({
					target: '_lmi',
					breakpoint: deviceType,
					attributes,
				})}
				value={listMarkerIndent}
				onChangeValue={val =>
					maxiSetAttributes({
						[`_lmi-${deviceType}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_lmi.u',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeUnit={val =>
					maxiSetAttributes({
						[`_lmi.u-${deviceType}`]: val,
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
						[`_lmi-${deviceType}`]: getDefaultAttribute(
							`_lmi-${deviceType}`
						),
						[`_lmi.u-${deviceType}`]: getDefaultAttribute(
							`_lmi.u-${deviceType}`
						),
						isReset: true,
					});
				}}
			/>
			{deviceType === 'general' && (
				<ColorControl
					label={__('Marker', 'maxi-blocks')}
					color={getAttributesValue({
						target: 'l_cc',
						props: attributes,
					})}
					paletteStatus={getAttributesValue({
						target: 'l_ps',
						props: attributes,
					})}
					paletteColor={getAttributesValue({
						target: 'l_pc',
						props: attributes,
					})}
					paletteOpacity={getAttributesValue({
						target: 'l_po',
						props: attributes,
					})}
					prefix='l-'
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
							[getAttributeKey('l_ps')]: paletteStatus,
							[getAttributeKey('l_pc')]: paletteColor,
							[getAttributeKey('l_po')]: paletteOpacity,
							[getAttributeKey('l_cc')]: color,
							...(listStyleCustom?.includes('<svg ') && {
								_lsc: setSVGColor({
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
				label={__('Text position', 'maxi-blocks')}
				className='maxi-text-inspector__list-style'
				value={getLastBreakpointAttribute({
					target: '_ltp',
					breakpoint: deviceType,
					attributes,
				})}
				defaultValue={getDefaultAttribute(`_ltp-${deviceType}`)}
				onReset={() =>
					maxiSetAttributes({
						[`_ltp-${deviceType}`]: getDefaultAttribute(
							`_ltp-${deviceType}`
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
						[`_ltp-${deviceType}`]: val,
					})
				}
			/>
			{deviceType === 'general' && (
				<SelectControl
					label={__('Type of list', 'maxi-blocks')}
					className='maxi-text-inspector__list-type'
					value={typeOfList}
					defaultValue={getDefaultAttribute('_tol')}
					onReset={() =>
						maxiSetAttributes({
							_tol: getDefaultAttribute('_tol'),
							listStyle: getListStyleOptions(
								getDefaultAttribute('_tol')
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
							_tol: typeOfList,
							_lsty: getListStyleOptions(typeOfList)[0].value,
						})
					}
				/>
			)}
			{deviceType === 'general' && (
				<>
					<SelectControl
						label={__('Style', 'maxi-blocks')}
						className='maxi-text-inspector__list-style'
						value={listStyle || 'disc'}
						defaultValue={getDefaultAttribute('_lsty')}
						onReset={() =>
							maxiSetAttributes({
								_lsty: getDefaultAttribute('_lsty'),
								isReset: true,
							})
						}
						options={getListStyleOptions(typeOfList)}
						onChange={listStyle => {
							maxiSetAttributes({
								_lsty: listStyle,
							});
							if (
								!(
									['decimal', 'details'].includes(
										typeOfList
									) || !listStyle
								) &&
								listStart < 0
							) {
								maxiSetAttributes({ _lsty: 0 });
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
										_lst:
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
										_lst: '',
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
										_lr: val,
									});
								}}
							/>
						</>
					)}
					{typeOfList === 'ul' && listStyle === 'custom' && (
						<>
							<SelectControl
								label={__('Source', 'maxi-blocks')}
								className='maxi-text-inspector__list-source-selector'
								value={listStyleSource}
								defaultValue={defaultListStyleSource}
								onReset={() =>
									maxiSetAttributes({
										_lsc: defaultListStyleSource,
										isReset: true,
									})
								}
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
											_lsc: listStyleCustoms[
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
											_lsc: listStyleCustom,
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
											prefix: 'l-',
										});

										const colorStr = paletteStatus
											? getColorRGBAString({
													firstVar: `color-${paletteColor}`,
													opacity: paletteOpacity,
													blockStyle,
											  })
											: color;

										let SVGElement = setSVGColor({
											svg: obj.SVGElement,
											color: colorStr,
											type: 'fill',
										});

										const size =
											getLastBreakpointAttribute({
												target: '_lms',
												breakpoint: deviceType,
												attributes,
											}) +
											getLastBreakpointAttribute({
												target: '_lms.u',
												breakpoint: deviceType,
												attributes,
											});

										SVGElement = setSVGSize({
											svg: SVGElement,
											size,
										});

										maxiSetAttributes({
											_lsc: SVGElement,
										});
										setListStyleCustoms({
											...listStyleCustoms,
											[listStyleSource]: SVGElement,
										});
									}}
									onRemove={() => {
										maxiSetAttributes({
											_lsc: '',
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
