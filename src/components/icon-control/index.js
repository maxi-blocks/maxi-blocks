/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AxisControl from '@components/axis-control';
import AxisPositionControl from '@components/axis-position-control';
import BorderControl from '@components/border-control';
import ColorControl from '@components/color-control';
import GradientControl from '@components/gradient-control';
import Icon from '@components/icon';
import InfoBox from '@components/info-box';
import SettingTabsControl from '@components/setting-tabs-control';
import SvgStrokeWidthControl from '@components/svg-stroke-width-control';
import SvgWidthControl from '@components/svg-width-control';
import ToggleSwitch from '@components/toggle-switch';
import MaxiModal from '@editor/library/modal';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	setSVGAriaLabel,
	shouldSetPreserveAspectRatio,
	togglePreserveAspectRatio,
} from '@extensions/svg';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	backgroundColor,
	backgroundGradient,
	styleNone,
	iconStroke,
	iconFill,
} from '@maxi-icons';

/**
 * IconControlResponsiveSettings Component
 *
 * This component renders all the responsive settings for icon customization.
 * It handles icon styling (stroke, fill, outline), sizing, positioning, and background options.
 *
 * Key Features:
 * - Icon style tabs (Stroke, Fill, Outline) based on SVG type
 * - Color controls for stroke and fill
 * - Border/outline controls
 * - Background options (none, color, gradient)
 * - Size and spacing controls
 * - Position controls
 * - Icon-only mode toggle
 * - Inherit from button toggle
 */
const IconControlResponsiveSettings = withRTC(props => {
	const { prefix = '' } = props;
	const iconOnlyKey = `${prefix}icon-only`;
	const iconInheritKey = `${prefix}icon-inherit`;

	const {
		onChangeInline = null, // Function for inline style changes
		onChange, // Main change handler
		clientId, // Block client ID
		svgType, // Type of SVG: 'Shape', 'Line', or other
		breakpoint, // Current responsive breakpoint
		isHover = false, // Whether we're in hover state
		isIB = false, // Whether this is an image block
		disableBackground = false, // Hide background controls
		disableBorder = false, // Hide border/outline controls
		disableIconInherit = false, // Hide inherit toggle
		disableIconOnly = false, // Hide icon-only toggle
		disablePadding = false, // Hide padding controls
		disablePosition = false, // Hide position controls
		disableSpacing = false, // Hide spacing controls
		disableHeightFitContent = false, // Disable height fit content
		disablePositionY = false, // Disable Y-axis positioning
		getIconWithColor, // Function to apply colors to icon SVG
		inlineTarget, // Target selector for inline styles
		[iconOnlyKey]: iconOnly, // Icon-only mode state
		[iconInheritKey]: iconInherit, // Inherit from button state
	} = props;

	// State: Current active icon style tab ('color' = stroke, 'fill', or 'border' = outline)
	const [iconStyle, setIconStyle] = useState('color');

	// Effect: Auto-switch to 'border' tab when not on general breakpoint
	// (stroke and fill options are only available on general breakpoint)
	// Only switch if current iconStyle is 'color' or 'fill' which aren't available
	useEffect(() => {
		if (
			breakpoint !== 'general' &&
			(iconStyle === 'color' || iconStyle === 'fill')
		) {
			setIconStyle('border');
		}
	}, [breakpoint, iconStyle]);

	// Effect: Handle icon style switching based on SVG type
	useEffect(() => {
		if (breakpoint === 'general') {
			if (svgType === 'Shape' && iconStyle === 'color') {
				setIconStyle('fill');
			} else if (svgType === 'Line' && iconStyle === 'fill') {
				setIconStyle('color');
			}
		}
	}, [svgType, iconStyle, breakpoint]);

	/**
	 * Build icon style tab options based on SVG type and breakpoint
	 *
	 * Returns array of tab options with labels and values:
	 * - 'Stroke' (value: 'color') - for non-Shape SVGs on general breakpoint
	 * - 'Fill' (value: 'fill') - for non-Line SVGs on general breakpoint
	 * - 'Outline' (value: 'border') - always available unless disabled
	 */
	const getOptions = () => {
		const options = [];

		// Only show Stroke and Fill tabs on general breakpoint
		if (breakpoint === 'general') {
			// Stroke tab: Available for all SVG types except 'Shape'
			if (svgType !== 'Shape')
				options.push({
					label: __('Stroke', 'maxi-blocks'),
					value: 'color',
				});

			// Fill tab: Available for all SVG types except 'Line'
			if (svgType !== 'Line')
				options.push({
					label: __('Fill', 'maxi-blocks'),
					value: 'fill',
				});
		}

		// Border tab: Always available unless explicitly disabled
		if (!disableBorder) {
			options.push({
				label: __('Border', 'maxi-blocks'),
				value: 'border',
			});
		}

		return options;
	};

	/**
	 * Build background type options
	 *
	 * Returns array of background options:
	 * - None - no background
	 * - Color - solid color background
	 * - Gradient - gradient background
	 */
	const getBackgroundOptions = () => {
		const options = [];

		options.push({
			label: 'None',
			value: 'none',
		});

		options.push({
			label: 'Solid',
			value: 'color',
		});

		options.push({
			label: 'Gradient',
			value: 'gradient',
		});

		return options;
	};

	// Min/max settings for padding controls based on unit type
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
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	// Get the current background type from attributes
	const iconBackgroundActiveMedia = getLastBreakpointAttribute({
		target: `${prefix}icon-background-active-media`,
		breakpoint,
		attributes: props,
		isHover,
	});

	// State: Current active background type ('none', 'color', or 'gradient')
	const [iconBgActive, setIconBgActive] = useState(
		iconBackgroundActiveMedia || 'none'
	);

	return (
		<>
			{/* Icon-only toggle: Only show on general breakpoint, not in hover state or image blocks */}
			{!isIB && !disableIconOnly && !isHover && breakpoint === 'general' && (
				<ToggleSwitch
					label={__('Icon only (remove text)', 'maxi-blocks')}
					className='maxi-icon-control__icon-only'
					selected={iconOnly}
					onChange={val => {
						// Update icon SVG with new icon-only state
						const icon = getIconWithColor({
							isIconOnly: val,
							isHover,
						});

						onChange({
							[`${prefix}icon-only`]: val,
							[`${prefix}icon-content`]: icon,
						});
					}}
				/>
			)}

			{/* Icon width and height controls */}
			<SvgWidthControl
				{...getGroupAttributes(props, 'icon', isHover, prefix)}
				className='maxi-icon-control__width'
				onChange={onChange}
				prefix={`${prefix}icon-`}
				breakpoint={breakpoint}
				isHover={isHover}
				disableHeightFitContent={disableHeightFitContent}
				isIB={isIB}
			/>

			{/* Stroke width control: Always show for non-Shape SVGs */}
			{svgType !== 'Shape' && (
				<SvgStrokeWidthControl
					{...getGroupAttributes(props, 'icon', isHover, prefix)}
					{...(isHover && {
						...{
							...getGroupAttributes(
								props,
								'icon',
								isHover,
								prefix
							),
						},
					})}
					className='maxi-icon-control__stroke-width'
					onChange={obj => onChange(obj)}
					prefix={`${prefix}icon-`}
					breakpoint={breakpoint}
					isHover={isHover}
					content={props[`${prefix}icon-content`]}
				/>
			)}

			{/* Spacing and position controls: Only when not in icon-only mode */}
			{!isHover && !iconOnly && (
				<>
					{/* Spacing control: Distance between icon and text */}
					{!disableSpacing && (
						<AdvancedNumberControl
							label={__('Spacing', 'maxi-blocks')}
							className='maxi-icon-control__spacing'
							min={0}
							max={999}
							initial={1}
							step={1}
							breakpoint={breakpoint}
							value={props[`${prefix}icon-spacing-${breakpoint}`]}
							onChangeValue={val => {
								onChange({
									[`${prefix}icon-spacing-${breakpoint}`]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							onReset={() =>
								onChange({
									[`${prefix}icon-spacing-${breakpoint}`]:
										getDefaultAttribute(
											`${prefix}icon-spacing-${breakpoint}`
										),
									isReset: true,
								})
							}
							disableRange
						/>
					)}

					{/* Position control: Icon placement relative to text (left/right/top/bottom) */}
					{!isIB && !disablePosition && (
						<AxisPositionControl
							label='Icon'
							className='maxi-icon-control__position'
							selected={props[`${prefix}icon-position`]}
							onChange={val => {
								onChange({
									[`${prefix}icon-position`]: val,
								});
							}}
							disableY={disablePositionY}
							breakpoint={breakpoint}
						/>
					)}
				</>
			)}

			{/* Icon style tabs: Stroke, Fill, Outline (only show if more than 1 option) */}
			{getOptions().length > 1 && (
				<SettingTabsControl
					className='maxi-icon-styles-control'
					type='buttons'
					fullWidthMode
					selected={iconStyle}
					items={getOptions()}
					onChange={val => setIconStyle(val)}
				/>
			)}

			{/* STROKE TAB CONTENT: Color control for icon stroke */}
			{iconStyle === 'color' &&
				(!iconInherit || iconOnly || disableIconInherit ? (
					svgType !== 'Shape' && (
						<ColorControl
							label={__('Icon stroke', 'maxi-blocks')}
							className='maxi-icon-styles-control--color'
							avoidBreakpointForDefault
							color={getAttributeValue({
								target: 'icon-stroke-color',
								props,
								isHover,
								prefix,
							})}
							prefix={`${prefix}icon-stroke-`}
							paletteColor={getAttributeValue({
								target: 'icon-stroke-palette-color',
								props,
								isHover,
								prefix,
							})}
							paletteOpacity={getAttributeValue({
								target: 'icon-stroke-palette-opacity',
								props,
								isHover,
								prefix,
							})}
							paletteStatus={getAttributeValue({
								target: 'icon-stroke-palette-status',
								props,
								isHover,
								prefix,
							})}
							paletteSCStatus={getAttributeValue({
								target: 'icon-stroke-palette-sc-status',
								props,
								isHover,
								prefix,
							})}
							onChangeInline={({ color }) =>
								onChangeInline &&
								onChangeInline(
									{ stroke: color },
									'[data-stroke]',
									true
								)
							}
							onChange={({
								color,
								paletteColor,
								paletteStatus,
								paletteSCStatus,
								paletteOpacity,
							}) => {
								// Apply color to icon SVG
								const icon = getIconWithColor({
									color,
									paletteColor,
									paletteStatus,
									paletteSCStatus,
									paletteOpacity,
									isHover,
								});

								// Save all stroke color attributes
								onChange({
									[`${prefix}icon-stroke-color${
										isHover ? '-hover' : ''
									}`]: color,
									[`${prefix}icon-stroke-palette-color${
										isHover ? '-hover' : ''
									}`]: paletteColor,
									[`${prefix}icon-stroke-palette-status${
										isHover ? '-hover' : ''
									}`]: paletteStatus,
									[`${prefix}icon-stroke-palette-sc-status${
										isHover ? '-hover' : ''
									}`]: paletteSCStatus,
									[`${prefix}icon-stroke-palette-opacity${
										isHover ? '-hover' : ''
									}`]: paletteOpacity,
									[`${prefix}icon-content`]: icon,
								});
							}}
							isHover={isHover}
							globalProps={{
								target: `${isHover ? 'hover-line' : 'line'}`,
								type: 'icon',
							}}
						/>
					)
				) : (
					// Info box shown when stroke is inherited from button
					<InfoBox
						key='maxi-warning-box__icon-color'
						message={__(
							'Icon stroke colour is inherited from button ',
							'maxi-blocks'
						)}
						links={[
							{
								title: __('Button colour', 'maxi-blocks'),
								panel: 'typography',
							},
						]}
					/>
				))}

			{/* Inherit toggle: Allow icon to inherit colors from parent button */}
			{!disableIconInherit && !isHover && breakpoint === 'general' && (
				<ToggleSwitch
					label={__(
						'Inherit stroke colour/background from button',
						'maxi-blocks'
					)}
					className='maxi-icon-control__inherit'
					selected={iconInherit}
					onChange={val => {
						// Update icon SVG with inherit state
						const icon = getIconWithColor({
							isInherit: val,
							isHover,
						});

						onChange({
							[`${prefix}icon-inherit`]: val,
							[`${prefix}icon-content`]: icon,
						});
					}}
				/>
			)}

			{/* OUTLINE TAB CONTENT: Border controls for icon outline */}
			{iconStyle === 'border' && (
				<BorderControl
					{...getGroupAttributes(
						props,
						['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
						isHover,
						prefix
					)}
					prefix={`${prefix}icon-`}
					onChange={onChange}
					breakpoint={breakpoint}
					clientId={clientId}
					isHover={isHover}
					disableRTC
				/>
			)}

			{/* FILL TAB CONTENT: Color control for icon fill */}
			{iconStyle === 'fill' && svgType !== 'Line' && (
				<ColorControl
					label={__('Icon fill', 'maxi-blocks')}
					color={getAttributeValue({
						target: 'icon-fill-color',
						props,
						isHover,
						prefix,
					})}
					prefix={`${prefix}icon-fill-`}
					paletteColor={getAttributeValue({
						target: 'icon-fill-palette-color',
						props,
						isHover,
						prefix,
					})}
					paletteOpacity={getAttributeValue({
						target: 'icon-fill-palette-opacity',
						props,
						isHover,
						prefix,
					})}
					paletteStatus={getAttributeValue({
						target: 'icon-fill-palette-status',
						props,
						isHover,
						prefix,
					})}
					paletteSCStatus={getAttributeValue({
						target: 'icon-fill-palette-sc-status',
						props,
						isHover,
						prefix,
					})}
					onChangeInline={({ color }) =>
						onChangeInline &&
						onChangeInline({ fill: color }, '[data-fill]', true)
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
					}) => {
						// Apply fill color to icon SVG
						const icon = getIconWithColor({
							color,
							paletteColor,
							paletteStatus,
							paletteSCStatus,
							paletteOpacity,
							type: 'fill',
							isHover,
						});

						// Save all fill color attributes
						onChange({
							[`${prefix}icon-fill-color${
								isHover ? '-hover' : ''
							}`]: color,
							[`${prefix}icon-fill-palette-color${
								isHover ? '-hover' : ''
							}`]: paletteColor,
							[`${prefix}icon-fill-palette-status${
								isHover ? '-hover' : ''
							}`]: paletteStatus,
							[`${prefix}icon-fill-palette-sc-status${
								isHover ? '-hover' : ''
							}`]: paletteSCStatus,
							[`${prefix}icon-fill-palette-opacity${
								isHover ? '-hover' : ''
							}`]: paletteOpacity,
							[`${prefix}icon-content`]: icon,
						});
					}}
					isHover={isHover}
					globalProps={{
						target: `${isHover ? 'hover-fill' : 'fill'}`,
						type: 'icon',
					}}
					avoidBreakpointForDefault
				/>
			)}

			{/* BACKGROUND CONTROLS: None, Color, or Gradient background for icon */}
			{!disableBackground && (
				<>
					{/* Background type selector tabs */}
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						selected={iconBgActive}
						items={getBackgroundOptions()}
						onChange={val => {
							setIconBgActive(val);
							onChange({
								[getAttributeKey(
									'background-active-media',
									isHover,
									`${prefix}icon-`,
									breakpoint
								)]: val,
							});
						}}
					/>

					{/* Color background controls */}
					{iconBgActive === 'color' &&
						(!iconInherit || disableIconInherit ? (
							<ColorControl
								label={__('Icon background', 'maxi-blocks')}
								paletteStatus={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-status`,
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteSCStatus={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-sc-status`,
									breakpoint,
									attributes: props,
									isHover,
								})}
								paletteColor={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-color`,
									breakpoint,
									attributes: props,
									isHover,
									prefix,
								})}
								paletteOpacity={getLastBreakpointAttribute({
									target: `${prefix}icon-background-palette-opacity`,
									breakpoint,
									attributes: props,
									isHover,
									prefix,
								})}
								color={getLastBreakpointAttribute({
									target: `${prefix}icon-background-color`,
									breakpoint,
									attributes: props,
									isHover,
									prefix,
								})}
								prefix={`${prefix}icon-background-`}
								avoidBreakpointForDefault
								onChangeInline={({ color }) =>
									onChangeInline &&
									onChangeInline(
										{
											background: color,
										},
										inlineTarget
									)
								}
								onChange={({
									paletteStatus,
									paletteSCStatus,
									paletteColor,
									paletteOpacity,
									color,
								}) => {
									// Save all background color attributes
									onChange(
										{
											[getAttributeKey(
												'background-palette-status',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: paletteStatus,
											[getAttributeKey(
												'background-palette-sc-status',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: paletteSCStatus,
											[getAttributeKey(
												'background-palette-color',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: paletteColor,
											[getAttributeKey(
												'background-palette-opacity',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: paletteOpacity,
											[getAttributeKey(
												'background-color',
												isHover,
												`${prefix}icon-`,
												breakpoint
											)]: color,
										},
										inlineTarget
									);
								}}
								isHover={isHover}
							/>
						) : (
							// Info box shown when background is inherited from button
							<InfoBox
								key='maxi-warning-box__icon-background'
								message={__(
									'Icon background is inherited from button ',
									'maxi-blocks'
								)}
								links={[
									{
										title: __(
											'Button Background colour',
											'maxi-blocks'
										),
										panel: 'button background',
									},
								]}
							/>
						))}

					{/* Gradient background controls */}
					{iconBgActive === 'gradient' && (
						<GradientControl
							{...getGroupAttributes(
								props,
								'iconBackgroundGradient',
								isHover,
								prefix
							)}
							label={__(
								'Icon background gradient',
								'maxi-blocks'
							)}
							breakpoint={breakpoint}
							prefix={`${prefix}icon-background-`}
							isHover={isHover}
							onChange={onChange}
						/>
					)}
				</>
			)}

			{/* Icon padding controls */}
			{!disablePadding && !isHover && (
				<AxisControl
					{...getGroupAttributes(props, 'iconPadding', false, prefix)}
					prefix={prefix}
					label={__('Icon padding', 'maxi-blocks')}
					onChange={onChange}
					breakpoint={breakpoint}
					target='icon-padding'
					disableAuto
					optionType='string'
					minMaxSettings={minMaxSettings}
					enableAxisUnits
				/>
			)}
		</>
	);
});

/**
 * IconControl Component (Main Export)
 *
 * This is the main wrapper component that:
 * 1. Renders the icon selection modal (MaxiModal)
 * 2. Renders the IconControlResponsiveSettings when an icon is selected
 *
 * The modal allows users to choose an icon from the library.
 * Once selected, all the styling controls become available.
 */
const IconControl = props => {
	const {
		className,
		onChange,
		breakpoint,
		blockStyle,
		isHover = false,
		isIB = false,
		disableModal = false,
		disableHeightFitContent = false,
		getIconWithColor,
		ariaLabels,
		type = 'button-icon',
		prefix = '',
		[`${prefix}icon-content`]: iconContent,
		[`${prefix}svgType`]: svgType,
		disablePadding = false,
	} = props;

	// Process default icon on mount if it contains data markers
	useEffect(() => {
		if (
			iconContent &&
			breakpoint === 'general' &&
			!isHover &&
			(iconContent.includes('data-fill') ||
				iconContent.includes('data-stroke'))
		) {
			const processedIcon = getIconWithColor({
				rawIcon: iconContent,
				type: [
					svgType !== 'Shape' && 'stroke',
					svgType !== 'Line' && 'fill',
				].filter(Boolean),
			});

			if (processedIcon !== iconContent) {
				onChange({
					[`${prefix}icon-content`]: processedIcon,
				});
			}
		}
	}, []); // Run only on mount

	// Build CSS classes for the wrapper
	const classes = classnames(
		'maxi-icon-control',
		className,
		disablePadding
			? 'maxi-accordion-control__item__panel--disable-padding'
			: ''
	);

	return (
		<div className={classes}>
			{/* Icon selection modal: Only show on general breakpoint, not in hover/IB states */}
			{!isIB && !disableModal && !isHover && breakpoint === 'general' && (
				<MaxiModal
					type={type}
					style={blockStyle}
					onSelect={obj => {
						const newSvgType = obj[`${prefix}svgType`];

						// Apply colors to the selected icon based on its type
						let icon = getIconWithColor({
							rawIcon: obj[`${prefix}icon-content`],
							type: [
								newSvgType !== 'Shape' && 'stroke',
								newSvgType !== 'Line' && 'fill',
							].filter(Boolean),
						});

						// Set preserve aspect ratio if needed
						if (
							!disableHeightFitContent &&
							shouldSetPreserveAspectRatio(
								props,
								`${prefix}icon-`
							)
						) {
							icon = togglePreserveAspectRatio(icon, true);
						}

						// Set ARIA labels for accessibility
						if (type === 'button-icon') {
							if (icon && ariaLabels?.icon) {
								icon = setSVGAriaLabel(
									ariaLabels.icon,
									() => icon,
									'icon'
								);
							}
						} else if (type === 'search-icon') {
							if (
								prefix === 'close-' &&
								icon &&
								ariaLabels?.['close icon']
							) {
								icon = setSVGAriaLabel(
									ariaLabels['close icon'],
									() => icon,
									'search'
								);
							} else if (icon && ariaLabels?.icon) {
								icon = setSVGAriaLabel(
									ariaLabels.icon,
									() => icon,
									'search'
								);
							}
						}

						// Save the selected icon and its attributes
						onChange({
							...obj,
							[`${prefix}icon-content`]: icon,
						});
					}}
					onRemove={obj => onChange(obj)}
					icon={iconContent}
					prefix={prefix}
				/>
			)}

			{/* Render all icon styling controls if an icon is selected */}
			{iconContent && <IconControlResponsiveSettings {...props} />}
		</div>
	);
};

export default IconControl;
