/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import ToggleSwitch from '../toggle-switch';
import Icon from '../icon';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import {
	dividerDashedHorizontal,
	dividerDashedVertical,
	dividerDottedHorizontal,
	dividerDottedVertical,
	dividerNone,
	dividerSolidHorizontal,
	dividerSolidVertical,
} from './defaults';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
export const DefaultDividersControl = props => {
	const { lineOrientation, onChange, breakpoint, dividerBorderStyle } = props;

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
					onChange: () => onChange(dividerNone(breakpoint)),
				},
				{
					activeItem: dividerBorderStyle === 'solid',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={solid}
						/>
					),
					onChange: () => {
						if (lineOrientation === 'horizontal')
							onChange(dividerSolidHorizontal(breakpoint));
						else onChange(dividerSolidVertical(breakpoint));
					},
				},
				{
					activeItem: dividerBorderStyle === 'dashed',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={dashed}
						/>
					),
					onChange: () => {
						if (lineOrientation === 'horizontal')
							onChange(dividerDashedHorizontal(breakpoint));
						else onChange(dividerDashedVertical(breakpoint));
					},
				},
				{
					activeItem: dividerBorderStyle === 'dotted',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={dotted}
						/>
					),
					onChange: () => {
						if (lineOrientation === 'horizontal')
							onChange(dividerDottedHorizontal(breakpoint));
						else onChange(dividerDottedVertical(breakpoint));
					},
				},
			]}
		/>
	);
};

const DividerControl = props => {
	const { onChange, isHover = false, clientId, breakpoint } = props;

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

	const lineOrientation = getLastBreakpointAttribute(
		'line-orientation',
		breakpoint,
		props
	);

	const dividerBorderStyle = getLastBreakpointAttribute(
		'divider-border-style',
		breakpoint,
		props
	);

	return (
		<>
			<DefaultDividersControl
				lineOrientation={lineOrientation}
				onChange={onChange}
				breakpoint={breakpoint}
				dividerBorderStyle={dividerBorderStyle}
			/>
			<SelectControl
				label={__('Add border line', 'maxi-blocks')}
				options={[
					{ label: __('None', 'maxi-blocks'), value: 'none' },
					{ label: __('Dotted', 'maxi-blocks'), value: 'dotted' },
					{ label: __('Dashed', 'maxi-blocks'), value: 'dashed' },
					{ label: __('Solid', 'maxi-blocks'), value: 'solid' },
					{ label: __('Double', 'maxi-blocks'), value: 'double' },
				]}
				value={
					getLastBreakpointAttribute(
						'divider-border-style',
						breakpoint,
						props
					) || 'none'
				}
				onChange={val =>
					onChange({
						[`divider-border-style-${breakpoint}`]: val,
					})
				}
			/>
			{props['divider-border-style'] !== 'none' &&
				props['divider-border-style'] === 'solid' && (
					<ToggleSwitch
						label={__('Line radius', 'maxi-blocks')}
						selected={dividerBorderStyle}
						onChange={val =>
							onChange({
								[`divider-border-style-${breakpoint}`]: val,
							})
						}
					/>
				)}
			{dividerBorderStyle !== 'none' && (
				<ColorControl
					label={__('Divider', 'maxi-blocks')}
					color={getLastBreakpointAttribute(
						'divider-border-color',
						breakpoint,
						props
					)}
					prefix='divider-border-'
					paletteColor={getLastBreakpointAttribute(
						'divider-border-palette-color',
						breakpoint,
						props
					)}
					paletteOpacity={getLastBreakpointAttribute(
						'divider-border-palette-opacity',
						breakpoint,
						props
					)}
					paletteStatus={getLastBreakpointAttribute(
						'divider-border-palette-status',
						breakpoint,
						props
					)}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) =>
						onChange({
							[`divider-border-color-${breakpoint}`]: color,
							[`divider-border-palette-color-${breakpoint}`]:
								paletteColor,
							[`divider-border-palette-status-${breakpoint}`]:
								paletteStatus,
							[`divider-border-palette-opacity-${breakpoint}`]:
								paletteOpacity,
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
							unit={getLastBreakpointAttribute(
								'divider-width-unit',
								breakpoint,
								props
							)}
							onChangeUnit={val =>
								onChange({
									[`divider-width-unit-${breakpoint}`]: val,
								})
							}
							value={getLastBreakpointAttribute(
								'divider-width',
								breakpoint,
								props
							)}
							onChangeValue={val =>
								onChange({
									[`divider-width-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`divider-width-${breakpoint}`]:
										getDefaultAttribute(
											`divider-width-${breakpoint}`
										),
									[`divider-width-unit-${breakpoint}`]:
										getDefaultAttribute(
											`divider-width-unit-${breakpoint}`
										),
								})
							}
							minMaxSettings={minMaxSettings}
						/>
						<AdvancedNumberControl
							label={__('Line weight', 'maxi-blocks')}
							enableUnit
							allowedUnits={['px', 'em', 'vw']}
							unit={getLastBreakpointAttribute(
								'divider-border-top-unit',
								breakpoint,
								props
							)}
							onChangeUnit={val =>
								onChange({
									[`divider-border-top-unit-${breakpoint}`]:
										val,
								})
							}
							onChange={val =>
								onChange({
									[`divider-border-top-width-${breakpoint}`]:
										val,
								})
							}
							value={getLastBreakpointAttribute(
								'divider-border-top-width',
								breakpoint,
								props
							)}
							onChangeValue={val =>
								onChange({
									[`divider-border-top-width-${breakpoint}`]:
										val,
								})
							}
							onReset={() =>
								onChange({
									[`divider-border-top-width-${breakpoint}`]:
										getDefaultAttribute(
											`divider-border-top-width-${breakpoint}`
										),
									[`divider-border-top-unit-${breakpoint}`]:
										getDefaultAttribute(
											`divider-border-top-unit-${breakpoint}`
										),
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
							value={getLastBreakpointAttribute(
								'divider-height',
								breakpoint,
								props
							)}
							onChangeValue={val => {
								onChange({
									[`divider-height-${breakpoint}`]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									[`divider-height-${breakpoint}`]:
										getDefaultAttribute(
											`divider-height-${breakpoint}`
										),
								})
							}
							initialPosition={getDefaultAttribute(
								`divider-height-${breakpoint}`
							)}
						/>
						<AdvancedNumberControl
							label={__('Weight', 'maxi-blocks')}
							value={getLastBreakpointAttribute(
								'divider-border-right-width',
								breakpoint,
								props
							)}
							onChangeValue={val => {
								onChange({
									[`divider-border-right-width-${breakpoint}`]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									[`divider-border-right-width-${breakpoint}`]:
										getDefaultAttribute(
											`divider-border-right-width-${breakpoint}`
										),
								})
							}
							initialPosition={getDefaultAttribute(
								`divider-border-right-width-${breakpoint}`
							)}
						/>
					</>
				)}
		</>
	);
};

export default DividerControl;
