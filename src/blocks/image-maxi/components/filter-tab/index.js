/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ColorControl from '@components/color-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	IMAGE_FILTER_CONTROLS,
	IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT,
	IMAGE_FILTER_DROP_SHADOW_CONTROLS,
	getDropShadowAttribute,
	getFilterAttribute,
} from './constants';

const filterLabels = {
	blur: __('Blur', 'maxi-blocks'),
	brightness: __('Brightness', 'maxi-blocks'),
	contrast: __('Contrast', 'maxi-blocks'),
	grayscale: __('Grayscale', 'maxi-blocks'),
	'hue-rotate': __('Hue rotate', 'maxi-blocks'),
	invert: __('Invert', 'maxi-blocks'),
	opacity: __('Opacity', 'maxi-blocks'),
	saturate: __('Saturate', 'maxi-blocks'),
	sepia: __('Sepia', 'maxi-blocks'),
};

const dropShadowLabels = {
	horizontal: __('Horizontal shadow', 'maxi-blocks'),
	vertical: __('Vertical shadow', 'maxi-blocks'),
	blur: __('Shadow blur', 'maxi-blocks'),
};

const FilterTab = props => {
	const { blockStyle, breakpoint, clientId, onChange } = props;

	const getResponsiveValue = target =>
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes: props,
		});

	const getAttributeKey = target => `${target}-${breakpoint}`;

	const onChangeNumber = (target, val, meta) =>
		onChange({
			[getAttributeKey(target)]:
				val !== undefined && val !== '' ? val : '',
			meta,
		});

	const onReset = target =>
		onChange({
			[getAttributeKey(target)]: getDefaultAttribute(
				getAttributeKey(target)
			),
			isReset: true,
		});

	return (
		<div className='maxi-image-filter-control'>
			{IMAGE_FILTER_CONTROLS.map(
				({ key, unit, defaultValue, min, max, step }) => {
					const target = getFilterAttribute(key);
					const attributeKey = getAttributeKey(target);

					return (
						<AdvancedNumberControl
							key={key}
							label={`${filterLabels[key]} (${unit})`}
							value={props[attributeKey]}
							placeholder={getResponsiveValue(target)}
							onChangeValue={(val, meta) =>
								onChangeNumber(target, val, meta)
							}
							min={min}
							max={max}
							step={step}
							onReset={() => onReset(target)}
							initialPosition={defaultValue}
						/>
					);
				}
			)}
			<hr />
			{IMAGE_FILTER_DROP_SHADOW_CONTROLS.map(
				({ key, defaultValue, min, max, step }) => {
					const target = getDropShadowAttribute(key);
					const attributeKey = getAttributeKey(target);

					return (
						<AdvancedNumberControl
							key={key}
							label={`${dropShadowLabels[key]} (px)`}
							value={props[attributeKey]}
							placeholder={getResponsiveValue(target)}
							onChangeValue={(val, meta) =>
								onChangeNumber(target, val, meta)
							}
							min={min}
							max={max}
							step={step}
							onReset={() => onReset(target)}
							initialPosition={defaultValue}
						/>
					);
				}
			)}
			<ColorControl
				label={__('Drop shadow colour', 'maxi-blocks')}
				paletteStatus={false}
				paletteSCStatus={false}
				paletteOpacity={1}
				color={
					getResponsiveValue(getDropShadowAttribute('color')) ||
					IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT
				}
				disablePalette
				blockStyle={blockStyle}
				clientId={clientId}
				deviceType={breakpoint}
				onChange={({ color }) =>
					onChange({
						[getAttributeKey(getDropShadowAttribute('color'))]:
							color,
					})
				}
				onReset={() => onReset(getDropShadowAttribute('color'))}
			/>
		</div>
	);
};

export default FilterTab;
