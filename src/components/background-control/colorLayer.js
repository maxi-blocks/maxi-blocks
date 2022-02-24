/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPath from '../clip-path-control';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const ColorLayer = props => {
	const {
		onChange,
		disableClipPath,
		isHover = false,
		prefix = '',
		clientId,
		breakpoint,
		isLayer = false,
		globalProps,
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	const getDefaultAttr = () => {
		const prefix = 'background-';

		if (isLayer) {
			const defaultColor = {};
			defaultColor.paletteStatus = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}palette-status`
			);
			defaultColor.paletteColor = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}palette-color`
			);
			defaultColor.paletteOpacity = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}palette-opacity`
			);
			defaultColor.color = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}color`
			);

			return defaultColor;
		}

		return null;
	};

	return (
		<>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={getLastBreakpointAttribute(
					`${prefix}background-color`,
					breakpoint,
					colorOptions,
					isHover
				)}
				prefix={`${prefix}background-`}
				useBreakpointForDefault
				defaultColorAttributes={getDefaultAttr()}
				paletteStatus={getLastBreakpointAttribute(
					`${prefix}background-palette-status`,
					breakpoint,
					colorOptions,
					isHover
				)}
				paletteColor={getLastBreakpointAttribute(
					`${prefix}background-palette-color`,
					breakpoint,
					colorOptions,
					isHover
				)}
				paletteOpacity={getLastBreakpointAttribute(
					`${prefix}background-palette-opacity`,
					breakpoint,
					colorOptions,
					isHover
				)}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) => {
					onChange({
						[getAttributeKey(
							'background-palette-status',
							isHover,
							prefix,
							breakpoint
						)]: paletteStatus,
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
						[getAttributeKey(
							'background-color',
							isHover,
							prefix,
							breakpoint
						)]: color,
					});
				}}
				globalProps={globalProps}
				isHover={isHover}
				clientId={clientId}
				deviceType={breakpoint}
			/>
			{!disableClipPath && (
				<ClipPath
					clipPath={getLastBreakpointAttribute(
						`${prefix}background-color-clip-path`,
						breakpoint,
						colorOptions,
						isHover
					)}
					onChange={val => {
						onChange({
							[getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix,
								breakpoint
							)]: val,
						});
					}}
				/>
			)}
		</>
	);
};

export default ColorLayer;
