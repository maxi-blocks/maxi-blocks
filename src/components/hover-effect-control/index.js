/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl, TextareaControl, Icon } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import TypographyControl from '../typography-control';
import BackgroundControl from '../background-control';
import BorderControl from '../border-control';
import AxisControl from '../axis-control';
import FancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import {
	hoverNone,
	hoverBasic,
	hoverText,
	alignCenterCenter,
	alignLeftTop,
	alignLeftBottom,
	alignRightTop,
	alignRightBottom,
} from '../../icons';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

/**
 * Component
 */
const HoverEffectControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-hover-effect-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Hover Animation', 'maxi-blocks')}
				selected={props['hover-type']}
				options={[
					{ label: <Icon icon={hoverNone} />, value: 'none' },
					{ label: <Icon icon={hoverBasic} />, value: 'basic' },
					{ label: <Icon icon={hoverText} />, value: 'text' },
				]}
				onChange={val => onChange({ 'hover-type': val })}
			/>
			<FancyRadioControl
				label={__('Preview', 'maxi-blocks')}
				selected={+props['hover-preview']}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => onChange({ 'hover-preview': !!+val })}
			/>
			{props['hover-type'] === 'basic' && (
				<Fragment>
					<SelectControl
						label={__('Effect Type', 'maxi-blocks')}
						value={props['hover-basic-effect-type']}
						options={[
							{
								label: __('Zoom In', 'maxi-blocks'),
								value: 'zoom-in',
							},
							{
								label: __('Zoom Out', 'maxi-blocks'),
								value: 'zoom-out',
							},
							{
								label: __('Slide', 'maxi-blocks'),
								value: 'slide',
							},
							{
								label: __('Rotate', 'maxi-blocks'),
								value: 'rotate',
							},
							{
								label: __('Flashing', 'maxi-blocks'),
								value: 'flashing',
							},
							{ label: __('Blur', 'maxi-blocks'), value: 'blur' },
							{
								label: __('Clear Blur', 'maxi-blocks'),
								value: 'clear-blur',
							},
							{
								label: __('Sepia', 'maxi-blocks'),
								value: 'sepia',
							},
							{
								label: __('Clear Sepia', 'maxi-blocks'),
								value: 'clear-sepia',
							},
							{
								label: __('Gray Scale', 'maxi-blocks'),
								value: 'greay-scale',
							},
							{
								label: __('Clear Gray Scale', 'maxi-blocks'),
								value: 'clear-greay-scale',
							},
							{
								label: __('Shine', 'maxi-blocks'),
								value: 'shine',
							},
							{
								label: __('Circle Shine', 'maxi-blocks'),
								value: 'circle-shine',
							},
						]}
						onChange={val =>
							onChange({ 'hover-basic-effect-type': val })
						}
					/>
				</Fragment>
			)}
			{props['hover-type'] === 'text' && (
				<Fragment>
					<SelectControl
						label={__('Animation Type', 'maxi-blocks')}
						value={props['hover-text-effect-type']}
						options={[
							{ label: __('Fade', 'maxi-blocks'), value: 'fade' },
							{
								label: __('Push Up', 'maxi-blocks'),
								value: 'push-up',
							},
							{
								label: __('Push Right', 'maxi-blocks'),
								value: 'push-right',
							},
							{
								label: __('Push Down', 'maxi-blocks'),
								value: 'push-down',
							},
							{
								label: __('Push Left', 'maxi-blocks'),
								value: 'push-left',
							},
							{
								label: __('Slide Up', 'maxi-blocks'),
								value: 'slide-up',
							},
							{
								label: __('Slide Right', 'maxi-blocks'),
								value: 'slide-right',
							},
							{
								label: __('Slide Down', 'maxi-blocks'),
								value: 'slide-down',
							},
							{
								label: __('Slide Left', 'maxi-blocks'),
								value: 'slide-left',
							},
							{
								label: __('Hinge Up', 'maxi-blocks'),
								value: 'hinge-up',
							},
							{
								label: __('Hinge Right', 'maxi-blocks'),
								value: 'hinge-right',
							},
							{
								label: __('Hinge Down', 'maxi-blocks'),
								value: 'hinge-down',
							},
							{
								label: __('Hinge Left', 'maxi-blocks'),
								value: 'hinge-left',
							},
							{
								label: __('Flip Horizontal', 'maxi-blocks'),
								value: 'flip-horiz',
							},
							{
								label: __('Flip Vertical', 'maxi-blocks'),
								value: 'flip-vert',
							},
							{
								label: __('Fold Up', 'maxi-blocks'),
								value: 'fold-up',
							},
							{
								label: __('Fold Right', 'maxi-blocks'),
								value: 'fold-right',
							},
							{
								label: __('Fold Down', 'maxi-blocks'),
								value: 'fold-down',
							},
							{
								label: __('Fold Left', 'maxi-blocks'),
								value: 'fold-left',
							},
							{
								label: __('Zoom In', 'maxi-blocks'),
								value: 'zoom-in',
							},
							{
								label: __('Zoom Out', 'maxi-blocks'),
								value: 'zoom-out',
							},
							{
								label: __('Zoom Out Up', 'maxi-blocks'),
								value: 'zoom-out-up',
							},
							{
								label: __('Zoom Out Down', 'maxi-blocks'),
								value: 'zoom-out-down',
							},
							{
								label: __('Zoom Out Right', 'maxi-blocks'),
								value: 'zoom-out-right',
							},
							{
								label: __('Zoom Out Left', 'maxi-blocks'),
								value: 'zoom-out-left',
							},
							{
								label: __(
									'Zoom Out Flip Horizontal',
									'maxi-blocks'
								),
								value: 'zoom-out-flip-horiz',
							},
							{
								label: __(
									'Zoom Out Flip Vertical',
									'maxi-blocks'
								),
								value: 'zoom-out-flip-vert',
							},
							{ label: __('Blur', 'maxi-blocks'), value: 'blur' },
						]}
						onChange={val =>
							onChange({ 'hover-text-effect-type': val })
						}
					/>
					<FancyRadioControl
						type='classic-border'
						selected={props['hover-text-preset']}
						options={[
							{
								label: <Icon icon={alignLeftTop} />,
								value: 'left-top',
							},
							{
								label: <Icon icon={alignRightTop} />,
								value: 'right-top',
							},
							{
								label: <Icon icon={alignCenterCenter} />,
								value: 'center-center',
							},
							{
								label: <Icon icon={alignLeftBottom} />,
								value: 'left-bottom',
							},
							{
								label: <Icon icon={alignRightBottom} />,
								value: 'right-bottom',
							},
						]}
						onChange={val => onChange({ 'hover-text-preset': val })}
					/>
					<TextareaControl
						placeholder={__(
							'Add your Hover Title Text here',
							'maxi-blocks'
						)}
						value={props['hover-title-typography-content']}
						onChange={val =>
							onChange({
								'hover-title-typography-content': isNil(val)
									? getDefaultAttribute(
											'hover-title-typography-content'
									  )
									: val,
							})
						}
					/>
					<FancyRadioControl
						label={__('Custom Hover Text', 'maxi-block')}
						selected={+props['hover-title-typography-status']}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val =>
							onChange({
								'hover-title-typography-status': !!+val,
							})
						}
					/>
					{props['hover-title-typography-status'] && (
						<TypographyControl
							typography={{
								...getGroupAttributes(
									props,
									'hoverTitleTypography'
								),
							}}
							hideAlignment
							onChange={obj => onChange(obj)}
							prefix='hover-title-'
						/>
					)}
					<hr />
					<TextareaControl
						placeholder={__(
							'Add your Hover Content Text here',
							'maxi-blocks'
						)}
						value={props['hover-content-typography-content']}
						onChange={val =>
							onChange({
								'hover-content-typography-content': isNil(val)
									? getDefaultAttribute(
											'hover-content-typography-content'
									  )
									: val,
							})
						}
					/>
					<FancyRadioControl
						label={__('Custom Content Text', 'maxi-block')}
						selected={+props['hover-content-typography-status']}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val =>
							onChange({
								'hover-content-typography-status': !!+val,
							})
						}
					/>
					{props['hover-content-typography-status'] && (
						<TypographyControl
							typography={{
								...getGroupAttributes(
									props,
									'hoverContentTypography'
								),
							}}
							hideAlignment
							onChange={obj => onChange(obj)}
							prefix='hover-content-'
						/>
					)}
					<hr />
					<BackgroundControl
						{...getGroupAttributes(props, [
							'hoverBackground',
							'hoverBackgroundColor',
							'hoverBackgroundGradient',
						])}
						onChange={obj => onChange(obj)}
						disableClipPath
						disableImage
						disableVideo
						disableSVG
						prefix='hover-'
					/>
					<FancyRadioControl
						label={__('Custom Border', 'maxi-block')}
						selected={+props['hover-border-status']}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val =>
							onChange({ 'hover-border-status': !!+val })
						}
					/>
					{props['hover-border-status'] && (
						<BorderControl
							{...getGroupAttributes(props, [
								'hoverBorder',
								'hoverBorderWidth',
								'hoverBorderRadius',
							])}
							onChange={obj => onChange(obj)}
							prefix='hover-'
						/>
					)}
					<FancyRadioControl
						label={__('Custom Padding', 'maxi-block')}
						selected={+props['hover-padding-status']}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val =>
							onChange({ 'hover-padding-status': !!+val })
						}
					/>
					{props['hover-padding-status'] && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverPadding')}
							label={__('Padding', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							target='hover-padding'
							disableAuto
						/>
					)}
					<FancyRadioControl
						label={__('Custom Margin', 'maxi-block')}
						selected={+props['hover-margin-status']}
						options={[
							{ label: __('No', 'maxi-block'), value: 0 },
							{ label: __('Yes', 'maxi-block'), value: 1 },
						]}
						onChange={val =>
							onChange({ 'hover-margin-status': !!+val })
						}
					/>
					{props['hover-margin-status'] && (
						<AxisControl
							{...getGroupAttributes(props, 'hoverMargin')}
							label={__('Margin', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							target='hover-margin'
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default HoverEffectControl;
