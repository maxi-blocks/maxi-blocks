/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ColorControl from '@components/color-control';
import ManageHoverTransitions from '@components/manage-hover-transitions';
import SettingTabsControl from '@components/setting-tabs-control';
import ToggleSwitch from '@components/toggle-switch';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	IMAGE_FILTER_ATTRIBUTE_KEYS,
	IMAGE_FILTER_CONTROLS,
	IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT,
	IMAGE_FILTER_DROP_SHADOW_CONTROLS,
	IMAGE_FILTER_HOVER_ATTRIBUTE_KEYS,
	IMAGE_FILTER_STATUS_HOVER,
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

const FilterControls = props => {
	const {
		blockStyle,
		breakpoint,
		clientId,
		isHover = false,
		onChange,
	} = props;

	const getResponsiveValue = target =>
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes: props,
			isHover,
		});

	const getStateAttributeKey = target =>
		getAttributeKey(target, isHover, false, breakpoint);

	const onChangeNumber = (target, val, meta) =>
		onChange({
			[getStateAttributeKey(target)]:
				val !== undefined && val !== '' ? val : '',
			meta,
		});

	const onReset = target =>
		onChange({
			[getStateAttributeKey(target)]: getDefaultAttribute(
				getStateAttributeKey(target)
			),
			isReset: true,
		});

	return (
		<div className='maxi-image-filter-control'>
			{IMAGE_FILTER_CONTROLS.map(
				({ key, unit, defaultValue, min, max, step }) => {
					const target = getFilterAttribute(key);
					const attributeKey = getStateAttributeKey(target);

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
					const attributeKey = getStateAttributeKey(target);

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
						[getStateAttributeKey(getDropShadowAttribute('color'))]:
							color,
					})
				}
				onReset={() => onReset(getDropShadowAttribute('color'))}
			/>
		</div>
	);
};

const FilterTab = props => {
	const { onChange } = props;
	const hoverStatus = props[IMAGE_FILTER_STATUS_HOVER];

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal', 'maxi-blocks'),
					indicatorProps: IMAGE_FILTER_ATTRIBUTE_KEYS,
					content: <FilterControls {...props} />,
				},
				{
					label: __('Hover', 'maxi-blocks'),
					indicatorProps: hoverStatus
						? IMAGE_FILTER_HOVER_ATTRIBUTE_KEYS
						: [],
					extraIndicators: [IMAGE_FILTER_STATUS_HOVER],
					content: (
						<>
							<ManageHoverTransitions />
							<ToggleSwitch
								label={__('Enable filter hover', 'maxi-blocks')}
								selected={hoverStatus}
								className='maxi-image-filter-status-hover'
								onChange={val =>
									onChange({
										[IMAGE_FILTER_STATUS_HOVER]: val,
									})
								}
							/>
							{hoverStatus && (
								<FilterControls {...props} isHover />
							)}
						</>
					),
				},
			]}
			depth={2}
		/>
	);
};

export default FilterTab;
