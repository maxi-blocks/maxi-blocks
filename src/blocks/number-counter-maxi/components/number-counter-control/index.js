/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ColorControl,
	FontFamilySelector,
	FontWeightControl,
	SelectControl,
	ToggleSwitch,
} from '../../../../components';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const NumberCounterControl = props => {
	const { className, breakpoint, onChangeInline, onChange } = props;

	const classes = classnames('maxi-number-counter-control', className);

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const autoWidth = getLastBreakpointAttribute({
		target: 'nc_wa',
		breakpoint,
		attributes: props,
	});

	return (
		<div className={classes}>
			{!getAttributesValue({
				target: 'nc_ci.s',
				props,
			}) && (
				<>
					<ToggleSwitch
						label={__('Auto width', 'maxi-blocks')}
						selected={autoWidth}
						onChange={val =>
							onChange({
								[`nc_wa-${breakpoint}`]: val,
							})
						}
					/>
					{!autoWidth && (
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							className='maxi-number-counter-control__width'
							enableUnit
							unit={getLastBreakpointAttribute({
								target: 'nc_w.u',
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[`nc_w.u-${breakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'nc_w',
								breakpoint,
								attributes: props,
							})}
							onChangeValue={val =>
								onChange({
									[`nc_w-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`nc_w-${breakpoint}`]: getDefaultAttribute(
										`nc_w-${breakpoint}`
									),
									[`nc_w.u-${breakpoint}`]:
										getDefaultAttribute(
											`nc_w.u-${breakpoint}`
										),
									isReset: true,
								})
							}
							minMaxSettings={minMaxSettings}
							optionType='string'
						/>
					)}
				</>
			)}
			<ToggleSwitch
				label={__('Preview', 'maxi-block')}
				selected={getAttributesValue({
					target: 'nc_pr',
					props,
				})}
				onChange={val =>
					onChange({
						nc_pr: val,
					})
				}
			/>
			<SelectControl
				label={__('Start animation', 'maxi-blocks')}
				className='maxi-number-counter-control__start-animation'
				value={getAttributesValue({
					target: 'nc_san',
					props,
				})}
				options={[
					{
						label: __('Page Load', 'maxi-blocks'),
						value: 'page-load',
					},
					{
						label: __('View On Scroll', 'maxi-blocks'),
						value: 'view-scroll',
					},
				]}
				onChange={val => onChange({ nc_san: val })}
			/>
			{getAttributesValue({
				target: 'nc_san',
				props,
			}) === 'view-scroll' && (
				<AdvancedNumberControl
					label={__('Offset', 'maxi-blocks')}
					min={50}
					max={100}
					initial={100}
					step={1}
					value={getAttributesValue({
						target: 'nc_saof',
						props,
					})}
					onChangeValue={val =>
						onChange({
							nc_saof: val,
						})
					}
					onReset={() =>
						onChange({
							nc_saof: getDefaultAttribute('nc_saof'),
							isReset: true,
						})
					}
				/>
			)}
			{getAttributesValue({
				target: 'nc_sta',
				props,
			}) >=
				getAttributesValue({
					target: 'nc_e',
					props,
				}) && (
				<div className='maxi-number-counter-control__alert-warning'>
					<i>{__('Start Number ', 'maxi-blocks')}</i>
					{__('can not be grater than ', 'maxi-blocks')}
					<i>{__('End Number ', 'maxi-blocks')}</i>
				</div>
			)}
			<AdvancedNumberControl
				label={__('Start number', 'maxi-blocks')}
				min={0}
				max={getAttributesValue({
					target: 'nc_e',
					props,
				})}
				initial={0}
				step={1}
				value={getAttributesValue({
					target: 'nc_sta',
					props,
				})}
				onChangeValue={val => onChange({ nc_sta: val })}
				onReset={() =>
					onChange({
						nc_sta: getDefaultAttribute('nc_sta'),
						isReset: true,
					})
				}
			/>
			<AdvancedNumberControl
				label={__('End number', 'maxi-blocks')}
				min={1}
				max={
					getAttributesValue({
						target: 'nc_ci.s',
						props,
					})
						? 9999999999
						: 100
				}
				initial={100}
				step={1}
				value={getAttributesValue({
					target: 'nc_e',
					props,
				})}
				onChangeValue={val => onChange({ nc_e: val })}
				onReset={() =>
					onChange({
						nc_e: getDefaultAttribute('nc_e'),
						isReset: true,
					})
				}
			/>
			{!getAttributesValue({
				target: 'nc_ci.s',
				props,
			}) &&
				getAttributesValue({
					target: 'nc_e',
					props,
				}) >= 100 && (
					<div className='maxi-number-counter-control__alert-warning'>
						<i>
							{__(
								"End Number can't be grater than 100 when circle is enabled",
								'maxi-blocks'
							)}
						</i>
					</div>
				)}
			<AdvancedNumberControl
				label={__('Duration', 'maxi-blocks')}
				min={1}
				max={10}
				initial={1}
				step={1}
				value={getAttributesValue({
					target: 'nc_du',
					props,
				})}
				onChangeValue={val => onChange({ nc_du: val })}
				onReset={() =>
					onChange({
						nc_du: getDefaultAttribute('nc_du'),
						isReset: true,
					})
				}
			/>
			{!getAttributesValue({
				target: 'nc_ci.s',
				props,
			}) && (
				<AdvancedNumberControl
					label={__('Stroke', 'maxi-blocks')}
					min={1}
					max={99}
					initial={8}
					step={1}
					value={getAttributesValue({
						target: 'nc_str',
						props,
					})}
					onChangeValue={val => onChange({ nc_str: val })}
					onReset={() =>
						onChange({
							nc_str: getDefaultAttribute('nc_str'),
							isReset: true,
						})
					}
				/>
			)}
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				defaultValue={getDefaultAttribute(`_ff-${breakpoint}`)}
				font={getLastBreakpointAttribute({
					target: '_ff',
					breakpoint,
					attributes: props,
				})}
				onChange={font =>
					onChange({
						[`_ff-${breakpoint}`]: font.value,
					})
				}
				breakpoint={breakpoint}
			/>
			<FontWeightControl
				onChange={val => {
					onChange({ [`_fwe-${breakpoint}`]: val });
				}}
				onReset={() => {
					onChange({
						[`_fwe-${breakpoint}`]: getDefaultAttribute(
							`_fwe-${breakpoint}`
						),
						isReset: true,
					});
				}}
				fontWeight={
					getLastBreakpointAttribute({
						target: '_fwe',
						breakpoint,
						attributes: props,
					}) || '400'
				}
				fontName={getLastBreakpointAttribute({
					target: '_ff',
					breakpoint,
					attributes: props,
				})}
				breakpoint={breakpoint}
			/>
			<AdvancedNumberControl
				className='maxi-number-counter-control__font-size'
				label={__('Title font size', 'maxi-blocks')}
				min={0}
				max={99}
				initial={32}
				step={1}
				value={getLastBreakpointAttribute({
					target: 'nc-ti_fs',
					breakpoint,
					attributes: props,
				})}
				onChangeValue={val =>
					onChange({
						[`nc-ti_fs-${breakpoint}`]: val,
					})
				}
				onReset={() =>
					onChange({
						[`nc-ti_fs-${breakpoint}`]: getDefaultAttribute(
							`nc-ti_fs-${breakpoint}`
						),
						isReset: true,
					})
				}
			/>
			<ToggleSwitch
				className='number-counter-percentage-sign-status'
				label={__('Show percentage sign', 'maxi-block')}
				selected={getAttributesValue({
					target: 'nc_psi.s',
					props,
				})}
				onChange={val =>
					onChange({
						'nc_psi.s': val,
					})
				}
			/>
			<ToggleSwitch
				className='number-counter-circle-status'
				label={__('Hide circle', 'maxi-block')}
				selected={getAttributesValue({
					target: 'nc_ci.s',
					props,
				})}
				onChange={val => {
					onChange({
						'nc_ci.s': val,
						...(!val && {
							...(getAttributesValue({
								target: 'nc_e',
								props,
							}) > 100 && {
								nc_e: 100,
							}),
							...(getAttributesValue({
								target: 'nc_sta',
								props,
							}) > 100 && {
								nc_sta: 100,
							}),
						}),
					});
				}}
			/>
			{!getAttributesValue({
				target: 'nc_ci.s',
				props,
			}) && (
				<ToggleSwitch
					className='number-counter-rounded-status'
					label={__('Rounded bar', 'maxi-block')}
					selected={getAttributesValue({
						target: 'nc_rou.s',
						props,
					})}
					onChange={val =>
						onChange({
							'nc_rou.s': val,
						})
					}
				/>
			)}
			<hr />
			<ColorControl
				label={__('Text', 'maxi-blocks')}
				paletteStatus={getLastBreakpointAttribute({
					target: 'nct_ps',
					breakpoint,
					attributes: props,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'nct_pc',
					breakpoint,
					attributes: props,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'nct_po',
					breakpoint,
					attributes: props,
				})}
				color={getLastBreakpointAttribute({
					target: 'nct_cc',
					breakpoint,
					attributes: props,
				})}
				prefix='nct-'
				deviceType={breakpoint}
				onChangeInline={({ color }) =>
					onChangeInline(
						{ fill: color },
						'.maxi-number-counter__box__text'
					)
				}
				onChange={({
					paletteStatus,
					paletteColor,
					paletteOpacity,
					color,
				}) =>
					onChange(
						{
							[getAttributeKey('_ps', false, 'nct-', breakpoint)]:
								paletteStatus,
							[getAttributeKey('_pc', false, 'nct-', breakpoint)]:
								paletteColor,
							[getAttributeKey('_po', false, 'nct-', breakpoint)]:
								paletteOpacity,
							[getAttributeKey('_cc', false, 'nct-', breakpoint)]:
								color,
						},
						'.maxi-number-counter__box__text'
					)
				}
			/>
			<hr />
			{!getAttributesValue({
				target: 'nc_ci.s',
				props,
			}) && (
				<>
					<ColorControl
						label={__('Circle background', 'maxi-blocks')}
						paletteStatus={getAttributesValue({
							target: 'nccb_ps',
							props,
						})}
						paletteColor={getAttributesValue({
							target: 'nccb_pc',
							props,
						})}
						paletteOpacity={getAttributesValue({
							target: 'nccb_po',
							props,
						})}
						color={getAttributesValue({
							target: 'nccb_cc',
							props,
						})}
						prefix='nccb-'
						onChangeInline={({ color }) =>
							onChangeInline(
								{ fill: color },
								'.maxi-number-counter__box__background'
							)
						}
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange(
								{
									[getAttributeKey('_ps', false, 'nccb-')]:
										paletteStatus,
									[getAttributeKey('_pc', false, 'nccb-')]:
										paletteColor,
									[getAttributeKey('_po', false, 'nccb-')]:
										paletteOpacity,
									[getAttributeKey('_cc', false, 'nccb-')]:
										color,
								},
								'.maxi-number-counter__box__background'
							)
						}
					/>
					<hr />
					<ColorControl
						label={__('Circle bar', 'maxi-blocks')}
						paletteStatus={getLastBreakpointAttribute({
							target: 'nccba_ps',
							breakpoint,
							attributes: props,
						})}
						paletteColor={getLastBreakpointAttribute({
							target: 'nccba_pc',
							breakpoint,
							attributes: props,
						})}
						paletteOpacity={getLastBreakpointAttribute({
							target: 'nccba_po',
							breakpoint,
							attributes: props,
						})}
						color={getLastBreakpointAttribute({
							target: 'nccba_cc',
							breakpoint,
							attributes: props,
						})}
						prefix='nccba-'
						onChangeInline={({ color }) =>
							onChangeInline(
								{ stroke: color },
								'.maxi-number-counter__box__circle'
							)
						}
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange(
								{
									[getAttributeKey('_ps', false, 'nccba-')]:
										paletteStatus,
									[getAttributeKey('_pc', false, 'nccba-')]:
										paletteColor,
									[getAttributeKey('_po', false, 'nccba-')]:
										paletteOpacity,
									[getAttributeKey('_cc', false, 'nccba-')]:
										color,
								},
								'.maxi-number-counter__box__circle'
							)
						}
					/>
				</>
			)}
		</div>
	);
};

export default NumberCounterControl;
