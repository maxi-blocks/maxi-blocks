/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import Icon from '../icon';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
export const DefaultDividersControl = props => {
	const { onChange, breakpoint, dividerBorderStyle, isHover, prefix } = props;

	const onChangeStyle = newStyle => {
		onChange({
			[getAttributeKey('di-bo_s', isHover, prefix, breakpoint)]: newStyle,
		});
	};

	return (
		<DefaultStylesControl
			items={[
				{
					activeItem: dividerBorderStyle === 'none',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={styleNone}
						/>
					),
					onChange: () => onChangeStyle('none'),
				},
				{
					activeItem: dividerBorderStyle === 'solid',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={solid}
						/>
					),
					onChange: () => onChangeStyle('solid'),
				},
				{
					activeItem: dividerBorderStyle === 'dashed',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={dashed}
						/>
					),
					onChange: () => onChangeStyle('dashed'),
				},
				{
					activeItem: dividerBorderStyle === 'dotted',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={dotted}
						/>
					),
					onChange: () => onChangeStyle('dotted'),
				},
			]}
		/>
	);
};

const DividerControl = props => {
	const {
		onChangeInline,
		onChange,
		isHover = false,
		disableLineStyle = false,
		disableBorderRadius = false,
		clientId,
		breakpoint,
		prefix = '',
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const [lineOrientation, dividerBorderStyle, dividerBorderRadius] =
		getLastBreakpointAttribute({
			target: ['_lo', 'di-bo_s', 'di-bo.ra'],
			prefix,
			breakpoint,
			attributes: props,
			isHover,
		});

	return (
		<>
			<DefaultDividersControl
				lineOrientation={lineOrientation}
				onChange={onChange}
				breakpoint={breakpoint}
				dividerBorderStyle={dividerBorderStyle}
				isHover={isHover}
				prefix={prefix}
			/>
			{!disableLineStyle && (
				<SelectControl
					label={__('Add border line', 'maxi-blocks')}
					options={[
						{ label: __('None', 'maxi-blocks'), value: 'none' },
						{
							label: __('Dotted', 'maxi-blocks'),
							value: 'dotted',
						},
						{
							label: __('Dashed', 'maxi-blocks'),
							value: 'dashed',
						},
						{
							label: __('Solid', 'maxi-blocks'),
							value: 'solid',
						},
						{
							label: __('Double', 'maxi-blocks'),
							value: 'double',
						},
					]}
					value={
						getLastBreakpointAttribute({
							target: 'di-bo_s',
							prefix,
							breakpoint,
							attributes: props,
							isHover,
						}) || 'none'
					}
					defaultValue={getDefaultAttribute(
						getAttributeKey('di-bo_s', false, false, breakpoint)
					)}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'di-bo_s',
								false,
								false,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'di-bo_s',
									false,
									false,
									breakpoint
								)
							),
							isReset: true,
						})
					}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'di-bo_s',
								isHover,
								prefix,
								breakpoint
							)]: val,
						})
					}
				/>
			)}
			{dividerBorderStyle !== 'none' &&
				!disableBorderRadius &&
				dividerBorderStyle === 'solid' && (
					<ToggleSwitch
						label={__('Line radius', 'maxi-blocks')}
						selected={dividerBorderRadius}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'di-bo.ra',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
					/>
				)}
			{dividerBorderStyle !== 'none' && (
				<ColorControl
					label={__('Divider', 'maxi-blocks')}
					color={getLastBreakpointAttribute({
						target: 'di-bo_cc',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					deviceType={breakpoint}
					prefix='di-bo-'
					paletteColor={getLastBreakpointAttribute({
						target: 'di-bo_pc',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteOpacity={getLastBreakpointAttribute({
						target: 'di-bo_po',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteStatus={getLastBreakpointAttribute({
						target: 'di-bo_ps',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					onChangeInline={({ color }) =>
						!isHover && onChangeInline({ 'border-color': color })
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) =>
						onChange({
							[getAttributeKey(
								'di-bo_cc',
								isHover,
								prefix,
								breakpoint
							)]: color,
							[getAttributeKey(
								'di-bo_pc',
								isHover,
								prefix,
								breakpoint
							)]: paletteColor,
							[getAttributeKey(
								'di-bo_ps',
								isHover,
								prefix,
								breakpoint
							)]: paletteStatus,
							[getAttributeKey(
								'di-bo_po',
								isHover,
								prefix,
								breakpoint
							)]: paletteOpacity,
						})
					}
					disableGradient
					globalProps={{ target: '', type: 'divider' }}
					isHover={isHover}
					clientId={clientId}
				/>
			)}
			{dividerBorderStyle !== 'none' &&
				(lineOrientation === 'horizontal' ||
					lineOrientation === undefined) && (
					<>
						<AdvancedNumberControl
							label={__('Line size', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: 'di_w.u',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeUnit={val =>
								onChange({
									[getAttributeKey(
										'di_w.u',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'di_w',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val =>
								onChange({
									[getAttributeKey(
										'di_w',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'di_w',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`di_w-${breakpoint}`
									),
									[getAttributeKey(
										'di_w.u',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`di_w.u-${breakpoint}`
									),
									isReset: true,
								})
							}
							minMaxSettings={minMaxSettings}
						/>
						<AdvancedNumberControl
							label={__('Line weight', 'maxi-blocks')}
							enableUnit
							allowedUnits={['px', 'em', 'vw']}
							unit={getLastBreakpointAttribute({
								target: 'di-bo.t.u',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeUnit={val =>
								onChange({
									[getAttributeKey(
										'di-bo.t.u',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onChange={val =>
								onChange({
									[getAttributeKey(
										'di-bo.t',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'di-bo.t',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val =>
								onChange({
									[getAttributeKey(
										'di-bo.t',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'di-bo.t',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`di-bo.t-${breakpoint}`
									),
									[getAttributeKey(
										'di-bo.t.u',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`di-bo.t.u-${breakpoint}`
									),
									isReset: true,
								})
							}
							minMaxSettings={minMaxSettings}
						/>
					</>
				)}
			{dividerBorderStyle !== 'none' &&
				(lineOrientation === 'vertical' ||
					lineOrientation === undefined) && (
					<>
						<AdvancedNumberControl
							label={__('Size', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'di_h',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val => {
								onChange({
									[getAttributeKey(
										'di_h',
										isHover,
										prefix,
										breakpoint
									)]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'di_h',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'di_h',
											false,
											false,
											breakpoint
										)
									),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								getAttributeKey(
									'di_h',
									false,
									false,
									breakpoint
								)
							)}
						/>
						<AdvancedNumberControl
							label={__('Weight', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'di-bo.r',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val => {
								onChange({
									[getAttributeKey(
										'di-bo.r',
										isHover,
										prefix,
										breakpoint
									)]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'di-bo.r',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'di-bo.r',
											false,
											false,
											breakpoint
										)
									),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								getAttributeKey(
									'di-bo.r',
									false,
									false,
									breakpoint
								)
							)}
						/>
					</>
				)}
		</>
	);
};

export default withRTC(DividerControl);
