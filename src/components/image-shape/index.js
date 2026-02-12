/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SelectControl from '@components/select-control';
import ToggleSwitch from '@components/toggle-switch';
import MaxiModal from '@editor/library/modal';

import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	setSVGRatio,
	setSVGPosition,
	getSVGPosition,
	getSVGRatio,
} from '@extensions/svg';
import { svgAttributesReplacer } from '@editor/library/util';

const ImageShapeResponsiveSettings = ({
	breakpoint,
	prefix = '',
	onChange,
	isHover = false,
	...attributes
}) => {
	const getLastShapeAttribute = target =>
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes,
			isHover,
		});

	const getProps = (rawTarget, component = 'AdvancedNumberControl') => {
		const dictionary = {
			AdvancedNumberControl: {
				value: 'value',
				onChange: 'onChangeValue',
			},
			ToggleSwitch: {
				value: 'selected',
				onChange: 'onChange',
			},
		};

		const getDictionaryValue = value => dictionary[component][value];

		const target = `${prefix}image-shape-${rawTarget}`;
		const targetWithBreakpoint = `${target}-${breakpoint}${
			isHover ? '-hover' : ''
		}`;

		return {
			[getDictionaryValue('value')]: getLastShapeAttribute(target) ?? '',
			[getDictionaryValue('onChange')]: (value, meta) =>
				onChange({
					[targetWithBreakpoint]:
						value !== undefined && value !== '' ? value : '',
					meta,
				}),
			...(component === 'AdvancedNumberControl' && {
				onReset: () =>
					onChange({
						[targetWithBreakpoint]:
							getDefaultAttribute(targetWithBreakpoint),
						isReset: true,
					}),
			}),
		};
	};

	return (
		<>
			<AdvancedNumberControl
				label={__('Scale shape', 'maxi-blocks')}
				min={0}
				max={500}
				step={1}
				placeholder='100'
				initial={100}
				{...getProps('scale')}
			/>
			<AdvancedNumberControl
				label={__('Rotate shape', 'maxi-blocks')}
				min={-360}
				max={360}
				step={1}
				placeholder='0'
				{...getProps('rotate')}
			/>
			<ToggleSwitch
				label={__('Flip shape horizontally', 'maxi-blocks')}
				{...getProps('flip-x', 'ToggleSwitch')}
			/>
			<ToggleSwitch
				label={__('Flip shape vertically', 'maxi-blocks')}
				{...getProps('flip-y', 'ToggleSwitch')}
			/>
		</>
	);
};

/**
 * ImageShape
 */
const ImageShape = props => {
	const {
		onChange,
		breakpoint,
		icon,
		isHover = false,
		isLayer = false,
		disableModal = false,
		disableImagePosition = false,
		disableImageRatio = false,
	} = props;

	const shapePosition = getSVGPosition(icon);
	const shapeRatio = getSVGRatio(icon);

	// Process icon with current colors for preview
	const processedIcon = icon
		? svgAttributesReplacer(icon, 'image-shape', 'image-shape')
		: icon;

	return (
		<>
			{!isHover && (
				<>
					{!disableModal && breakpoint === 'general' && (
						<MaxiModal
							type='image-shape'
							onSelect={obj => {
								const { SVGElement } = obj;

								const newSVGElement = SVGElement.replace(
									/class="(.*?)"/,
									`class="${
										SVGElement.match(/class="(.*?)"/)[1]
									} maxi-image-block__image"`
								);

								onChange({ ...obj, SVGElement: newSVGElement });
							}}
							onRemove={obj => {
								onChange(obj);
							}}
							icon={processedIcon}
						/>
					)}
					{icon && breakpoint === 'general' && (
						<>
							{!disableImageRatio && (
								<SelectControl
									__nextHasNoMarginBottom
									label={__('Image ratio', 'maxi-blocks')}
									value={shapeRatio || ''}
									options={[
										{
											label: __('Fit', 'maxi-blocks'),
											value: 'meet',
										},
										{
											label: __('Fill', 'maxi-blocks'),
											value: 'slice',
										},
									]}
									onChange={val =>
										onChange({
											SVGElement: setSVGRatio(icon, val),
										})
									}
								/>
							)}
							{!disableImagePosition && (
								<SelectControl
									__nextHasNoMarginBottom
									label={__('Image position', 'maxi-blocks')}
									value={shapePosition || 'xMidYMid'}
									options={[
										{
											label: __(
												'Center center',
												'maxi-blocks'
											),
											value: 'xMidYMid',
										},
										{
											label: __(
												'Left center',
												'maxi-blocks'
											),
											value: 'xMinYMid',
										},
										{
											label: __(
												'Right center',
												'maxi-blocks'
											),
											value: 'xMaxYMid',
										},
										{
											label: __(
												'Center top',
												'maxi-blocks'
											),
											value: 'xMidYMax',
										},
										{
											label: __(
												'Center bottom',
												'maxi-blocks'
											),
											value: 'xMidYMin',
										},
										{
											label: __(
												'Left bottom',
												'maxi-blocks'
											),
											value: 'xMinYMin',
										},
										{
											label: __(
												'Right bottom',
												'maxi-blocks'
											),
											value: 'xMaxYMin',
										},
										{
											label: __(
												'Left top',
												'maxi-blocks'
											),
											value: 'xMinYMax',
										},
										{
											label: __(
												'Right top',
												'maxi-blocks'
											),
											value: 'xMaxYMax',
										},
									]}
									onChange={val =>
										onChange({
											SVGElement: setSVGPosition(
												icon,
												val
											),
										})
									}
								/>
							)}
						</>
					)}
				</>
			)}
			{icon && (
				<>
					{isLayer && <ImageShapeResponsiveSettings {...props} />}
					{!isLayer && (
						<ResponsiveTabsControl breakpoint={breakpoint}>
							<ImageShapeResponsiveSettings {...props} />
						</ResponsiveTabsControl>
					)}
				</>
			)}
		</>
	);
};

export default ImageShape;
