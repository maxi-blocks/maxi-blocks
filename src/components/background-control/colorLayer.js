/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '@components/color-control';
import ClipPathControl from '@components/clip-path-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
	getGroupAttributes,
	getBlockStyle,
	getDefaultAttribute,
} from '@extensions/styles';
import { getDefaultLayerAttr } from './utils';
import { getPaletteColor } from '@extensions/style-cards';
import withRTC from '@extensions/maxi-block/withRTC';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const breakpoints = ['general', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Component
 */
const ColorLayer = props => {
	const {
		onChange,
		onChangeInline,
		disableClipPath,
		isHover = false,
		isIB = false,
		prefix = '',
		clientId,
		breakpoint,
		isLayer = false,
		globalProps,
		isToolbar = false,
		getBounds,
		getBlockClipPath, // for IB
		blockAttributes, // for IB reset
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	const onChangeColor = ({
		color,
		paletteColor,
		paletteStatus,
		paletteSCStatus,
		paletteOpacity,
		isReset = false,
	}) => {
		const response = {
			[getAttributeKey(
				'background-palette-status',
				isHover,
				prefix,
				breakpoint
			)]: paletteStatus,
			[getAttributeKey(
				'background-palette-sc-status',
				isHover,
				prefix,
				breakpoint
			)]: paletteSCStatus,
			[getAttributeKey(
				'background-palette-color',
				isHover,
				prefix,
				breakpoint
			)]: paletteColor,
			[getAttributeKey(
				'background-palette-opacity',
				isHover,
				prefix,
				breakpoint
			)]: paletteOpacity,
			[getAttributeKey('background-color', isHover, prefix, breakpoint)]:
				color,
			...(isReset && { isReset: true }),
		};

		onChange(response);
	};

	const getDefaultAttr = () => {
		const bgPrefix = `${prefix}background-`;

		if (isLayer) {
			const defaultColor = {};
			const prevBreakpoint =
				breakpoints[breakpoints.indexOf(breakpoint) - 1];

			const getResetValue = target => {
				if (isIB) {
					// For IB reset, we want to reset to the target block's actual background color
					// NOT the IB override values - we're clearing the IB override!

					// First, get the value from the target block's actual attributes
					// If we're in hover mode, check for the block's hover value first
					if (blockAttributes) {
						// Try to get the hover value if we're in hover mode
						if (isHover) {
							const blockHoverValue = getLastBreakpointAttribute({
								target,
								breakpoint,
								attributes: blockAttributes,
								isHover: true,
							});

							if (blockHoverValue !== undefined) {
								return blockHoverValue;
							}
						}

						// If not in hover mode, or no hover value exists, get non-hover value
						const blockValue = getLastBreakpointAttribute({
							target,
							breakpoint,
							attributes: blockAttributes,
							isHover: false,
						});

						if (blockValue !== undefined) {
							return blockValue;
						}
					}

					// If block has no value, return default first color
					let defaultValue;
					if (target.includes('palette-status')) defaultValue = true;
					else if (target.includes('palette-sc-status'))
						defaultValue = true;
					else if (target.includes('palette-color')) defaultValue = 1;
					else if (target.includes('palette-opacity'))
						defaultValue = 1;
					else if (target.includes('color'))
						defaultValue = 'rgba(var(--maxi-light-color-1), 1)';

					return defaultValue;
				}

				// Regular layer logic
				return isHover
					? getLastBreakpointAttribute({
							target,
							breakpoint,
							attributes: colorOptions,
							isHover: false,
					  })
					: prevBreakpoint
						? getLastBreakpointAttribute({
								target,
								breakpoint: prevBreakpoint,
								attributes: colorOptions,
								isHover: false,
						  })
						: getLastBreakpointAttribute({
								target,
								breakpoint,
								attributes: colorOptions,
								isHover: false,
						  });
			};

			defaultColor.paletteStatus = getResetValue(
				`${bgPrefix}palette-status`
			);
			defaultColor.paletteSCStatus = getResetValue(
				`${bgPrefix}palette-sc-status`
			);
			defaultColor.paletteColor = getResetValue(
				`${bgPrefix}palette-color`
			);
			defaultColor.paletteOpacity = getResetValue(
				`${bgPrefix}palette-opacity`
			);
			defaultColor.color = getResetValue(`${bgPrefix}color`);

			return defaultColor;
		}

		return {
			paletteStatus: getDefaultAttribute(
				`${bgPrefix}palette-status-${breakpoint}`,
				clientId
			),
			paletteSCStatus: getDefaultAttribute(
				`${bgPrefix}palette-sc-status-${breakpoint}`,
				clientId
			),
			paletteColor: getDefaultAttribute(
				`${bgPrefix}palette-color-${breakpoint}`,
				clientId
			),
			paletteOpacity: getDefaultAttribute(
				`${bgPrefix}palette-opacity-${breakpoint}`,
				clientId
			),
			color: getDefaultAttribute(
				`${bgPrefix}color-${breakpoint}`,
				clientId
			),
		};
	};

	const onReset = ({
		showPalette = false,
		paletteStatus,
		paletteSCStatus,
		paletteColor,
		paletteOpacity,
		color,
	}) => {
		const defaultColorAttr = getDefaultAttr();

		if (showPalette) {
			onChangeColor({
				paletteStatus: defaultColorAttr.paletteStatus,
				paletteSCStatus: defaultColorAttr.paletteSCStatus,
				paletteColor: defaultColorAttr.paletteColor,
				paletteOpacity: paletteOpacity || 1,
				color,
				isReset: true,
			});
		} else {
			const paletteColorResult = getPaletteColor({
				clientId,
				color: defaultColorAttr.paletteColor,
				blockStyle: getBlockStyle(clientId),
			});

			const defaultColor = `rgba(${paletteColorResult},${
				paletteOpacity || 1
			})`;

			onChangeColor({
				paletteStatus,
				paletteSCStatus,
				paletteColor,
				paletteOpacity,
				color: defaultColor,
				isReset: true,
			});
		}
	};

	return (
		<>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: `${prefix}background-color`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				prefix={`${prefix}background-`}
				defaultColorAttributes={getDefaultAttr()}
				{...(isLayer && { onReset })}
				paletteStatus={getLastBreakpointAttribute({
					target: `${prefix}background-palette-status`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteSCStatus={getLastBreakpointAttribute({
					target: `${prefix}background-palette-sc-status`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: `${prefix}background-palette-color`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: `${prefix}background-palette-opacity`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				onChangeInline={({ color }) => {
					onChangeInline({
						'background-color': color,
					});
				}}
				onChange={onChangeColor}
				globalProps={globalProps}
				isHover={isHover}
				clientId={clientId}
				deviceType={breakpoint}
				isToolbar={isToolbar}
			/>
			{!disableClipPath && (
				<ClipPathControl
					onChange={onChange}
					{...getGroupAttributes(
						props,
						'clipPath',
						false,
						`${prefix}background-color-`
					)}
					{...colorOptions}
					isHover={isHover}
					isIB={isIB}
					prefix={`${prefix}background-color-`}
					breakpoint={breakpoint}
					isLayer
					disableRTC
					getBounds={getBounds}
					getBlockClipPath={getBlockClipPath}
				/>
			)}
			<SizeAndPositionLayerControl
				prefix={prefix}
				options={colorOptions}
				onChange={onChange}
				isHover={isHover}
				isLayer={isLayer}
				breakpoint={breakpoint}
			/>
		</>
	);
};

export default withRTC(ColorLayer);
