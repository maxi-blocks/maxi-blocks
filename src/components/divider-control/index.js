/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState, useEffect } = wp.element;
const { RangeControl, SelectControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import __experimentalOpacityControl from '../opacity-control';
import {
	dividerSolidHorizontal,
	dividerDottedHorizontal,
	dividerDashedHorizontal,
	dividerSolidVertical,
	dividerDottedVertical,
	dividerDashedVertical,
	dividerNone,
} from './defaults';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
const DividerControl = props => {
	const {
		onChange,
		lineOrientation,
		disableColor = false,
		disableLineStyle = false,
		disableBorderRadius = false,
	} = props;

	const [orientation, changeOrientation] = useState(lineOrientation);

	const divider = { ...props.divider };
	const defaultDivider = { ...props.defaultDivider };

	useEffect(() => {
		if (lineOrientation !== orientation) {
			changeOrientation(lineOrientation);
			if (lineOrientation === 'vertical') {
				if (!isNil(divider.general.width)) {
					divider.general.height = divider.general.width;
					divider.general.width = '';
				}
				if (!isNil(divider.general['border-top-width'])) {
					divider.general['border-right-width'] =
						divider.general['border-top-width'];
					divider.general['border-top-width'] = '';
				}
			} else {
				if (!isNil(divider.general.height)) {
					divider.general.width = divider.general.height;
					divider.general.height = '';
				}
				if (!isNil(divider.general['border-top-width'])) {
					divider.general['border-top-width'] =
						divider.general['border-right-width'];
					divider.general['border-right-width'] = '';
				}
			}

			onChange(divider);
		}
	}, [lineOrientation, orientation, divider, onChange]);

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem: divider.general['border-style'] === 'none',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChange(dividerNone),
					},
					{
						activeItem: divider.general['border-style'] === 'solid',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={solid}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(dividerSolidHorizontal);
							else onChange(dividerSolidVertical);
						},
					},
					{
						activeItem:
							divider.general['border-style'] === 'dashed',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dashed}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(dividerDashedHorizontal);
							else onChange(dividerDashedVertical);
						},
					},
					{
						activeItem:
							divider.general['border-style'] === 'dotted',
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={dotted}
							/>
						),
						onChange: () => {
							if (lineOrientation === 'horizontal')
								onChange(dividerDottedHorizontal);
							else onChange(dividerDottedVertical);
						},
					},
				]}
			/>
			{!disableColor && (
				<ColorControl
					label={__('Color', 'maxi-blocks')}
					color={divider.general['border-color']}
					defaultColor={defaultDivider.general['border-color']}
					onChange={val => {
						divider.general['border-color'] = val;
						onChange(divider);
					}}
					disableGradient
				/>
			)}
			{!disableLineStyle && (
				<SelectControl
					label={__('Line Style', 'maxi-blocks')}
					options={[
						{ label: __('None', 'maxi-blocks'), value: 'none' },
						{ label: __('Dotted', 'maxi-blocks'), value: 'dotted' },
						{ label: __('Dashed', 'maxi-blocks'), value: 'dashed' },
						{ label: __('Solid', 'maxi-blocks'), value: 'solid' },
						{ label: __('Double', 'maxi-blocks'), value: 'double' },
					]}
					value={divider.general['border-style']}
					onChange={val => {
						divider.general['border-style'] = val;
						if (val === 'none') divider.general.width = 0;
						onChange(divider);
					}}
				/>
			)}
			{!disableBorderRadius &&
				divider.general['border-style'] === 'solid' && (
					<SelectControl
						label={__('Border Radius', 'maxi-blocks')}
						options={[
							{ label: __('No', 'maxi-blocks'), value: '' },
							{ label: __('Yes', 'maxi-blocks'), value: '20px' },
						]}
						value={divider.general['border-radius']}
						onChange={val => {
							divider.general['border-radius'] = val;
							onChange(divider);
						}}
					/>
				)}
			{orientation === 'horizontal' && (
				<Fragment>
					<RangeControl
						label={__('Size', 'maxi-blocks')}
						value={Number(divider.general.width)}
						onChange={val => {
							isNil(val)
								? (divider.general.width =
										defaultDivider.general.width)
								: (divider.general.width = Number(val));

							onChange(divider);
						}}
						allowReset
						initialPosition={defaultDivider.general.width}
					/>
					<RangeControl
						label={__('Weight', 'maxi-blocks')}
						value={Number(divider.general['border-top-width'])}
						onChange={val => {
							isNil(val)
								? (divider.general['border-top-width'] =
										defaultDivider.general[
											'border-top-width'
										])
								: (divider.general['border-top-width'] = Number(
										val
								  ));

							onChange(divider);
						}}
						allowReset
						initialPosition={
							defaultDivider.general['border-top-width']
						}
					/>
				</Fragment>
			)}
			{orientation === 'vertical' && (
				<Fragment>
					<RangeControl
						label={__('Size', 'maxi-blocks')}
						value={Number(divider.general.height)}
						onChange={val => {
							isNil(val)
								? (divider.general.height =
										defaultDivider.general.height)
								: (divider.general.height = Number(val));

							onChange(divider);
						}}
						max={100}
						allowReset
						initialPosition={defaultDivider.general.height}
					/>
					<RangeControl
						label={__('Weight', 'maxi-blocks')}
						value={Number(divider.general['border-right-width'])}
						onChange={val => {
							isNil(val)
								? (divider.general['border-right-width'] =
										defaultDivider.general[
											'border-right-width'
										])
								: (divider.general[
										'border-right-width'
								  ] = Number(val));

							onChange(divider);
						}}
						max={100}
						allowReset
						initialPosition={
							defaultDivider.general['border-right-width']
						}
					/>
				</Fragment>
			)}
			<__experimentalOpacityControl
				opacity={divider.opacity}
				defaultOpacity={defaultDivider.opacity}
				onChange={opacity => {
					divider.opacity = opacity;
					onChange(divider);
				}}
			/>
		</Fragment>
	);
};

export default DividerControl;
