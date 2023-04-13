/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPathControl from '../clip-path-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
	getGroupAttributes,
	getBlockStyle,
	getDefaultAttribute,
} from '../../extensions/attributes';
import { getDefaultLayerAttr } from './utils';
import { getPaletteColor } from '../../extensions/style-cards';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const breakpoints = ['general', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Component
 */
const ColorLayerContent = props => {
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
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	const onChangeColor = ({
		color,
		paletteColor,
		paletteStatus,
		paletteOpacity,
	}) => {
		const response = {
			[getAttributeKey('bc_ps', isHover, prefix, breakpoint)]:
				paletteStatus,
			[getAttributeKey('bc_pc', isHover, prefix, breakpoint)]:
				paletteColor,
			[getAttributeKey('bc_po', isHover, prefix, breakpoint)]:
				paletteOpacity,
			[getAttributeKey('bc_cc', isHover, prefix, breakpoint)]: color,
		};

		onChange(response);
	};

	const getDefaultAttr = () => {
		const bgPrefix = `${prefix}bc`;

		if (isLayer) {
			const defaultColor = {};
			const prevBreakpoint =
				breakpoints[breakpoints.indexOf(breakpoint) - 1];

			const getResetValue = target =>
				prevBreakpoint
					? getLastBreakpointAttribute({
							target,
							breakpoint: prevBreakpoint,
							attributes: colorOptions,
							isHover,
					  })
					: getDefaultLayerAttr('colorOptions', target);

			defaultColor.paletteStatus = getResetValue(`${bgPrefix}_ps`);
			defaultColor.paletteColor = getResetValue(`${bgPrefix}_pc`);
			defaultColor.paletteOpacity = getResetValue(`${bgPrefix}_po`);
			defaultColor.color = getResetValue(`${bgPrefix}_cc`);

			return defaultColor;
		}

		return {
			paletteStatus: getDefaultAttribute(
				`${bgPrefix}_ps-${breakpoint}`,
				clientId
			),
			paletteColor: getDefaultAttribute(
				`${bgPrefix}_pc-${breakpoint}`,
				clientId
			),
			paletteOpacity: getDefaultAttribute(
				`${bgPrefix}_po-${breakpoint}`,
				clientId
			),
			color: getDefaultAttribute(
				`${bgPrefix}_cc-${breakpoint}`,
				clientId
			),
		};
	};

	const onReset = ({
		showPalette = false,
		paletteStatus,
		paletteColor,
		paletteOpacity,
		color,
	}) => {
		const defaultColorAttr = getDefaultAttr();

		if (showPalette)
			onChangeColor({
				paletteStatus: defaultColorAttr.paletteStatus,
				paletteColor: defaultColorAttr.paletteColor,
				paletteOpacity: paletteOpacity || 1,
				color,
			});
		else {
			const defaultColor = `rgba(${getPaletteColor({
				clientId,
				color: defaultColorAttr.paletteColor,
				blockStyle: getBlockStyle(clientId),
			})},${paletteOpacity || 1})`;

			onChangeColor({
				paletteStatus,
				paletteColor,
				paletteOpacity,
				color: defaultColor,
			});
		}
	};

	return (
		<>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: 'bc_cc',
					prefix,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				prefix={`${prefix}bc`}
				defaultColorAttributes={getDefaultAttr()}
				{...(isLayer && { onReset })}
				paletteStatus={getLastBreakpointAttribute({
					target: 'bc_ps',
					prefix,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'bc_pc',
					prefix,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'bc_po',
					prefix,
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
						`${prefix}bc`
					)}
					{...colorOptions}
					isHover={isHover}
					isIB={isIB}
					prefix={`${prefix}bc`}
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

const ColorLayer = props => {
	const { breakpoint, disableResponsiveTabs = false, ...rest } = props;

	if (disableResponsiveTabs)
		return <ColorLayerContent breakpoint={breakpoint} {...rest} />;

	return (
		<ResponsiveTabsControl breakpoint={breakpoint}>
			<ColorLayerContent {...rest} />
		</ResponsiveTabsControl>
	);
};

export default ColorLayer;
