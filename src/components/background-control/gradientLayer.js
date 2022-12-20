/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ClipPathControl from '../clip-path-control';
import GradientControl from '../gradient-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import {
	getDefaultAttribute,
	getAttributeKey,
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const GradientLayerContent = props => {
	const {
		onChange,
		disableClipPath,
		isHover = false,
		prefix = '',
		breakpoint,
		isLayer = false,
	} = props;

	const gradientOptions = cloneDeep(props.gradientOptions);

	const getDefaultAttr = target => {
		if (isLayer)
			return getDefaultLayerAttr('colorOptions', `${prefix}${target}`);

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	return (
		<>
			<GradientControl
				label={__('Background gradient', 'maxi-blocks')}
				gradient={getLastBreakpointAttribute({
					target: `${prefix}background-gradient`,
					breakpoint,
					attributes: gradientOptions,
					isHover,
				})}
				gradientOpacity={getLastBreakpointAttribute({
					target: `${prefix}background-gradient-opacity`,
					breakpoint,
					attributes: gradientOptions,
					isHover,
				})}
				defaultGradient={getDefaultAttr('background-gradient')}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-gradient',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onChangeOpacity={val =>
					onChange({
						[getAttributeKey(
							'background-gradient-opacity',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
			/>
			{!disableClipPath && (
				<ClipPathControl
					onChange={onChange}
					{...getGroupAttributes(
						props,
						'clipPath',
						false,
						'background-gradient-'
					)}
					{...gradientOptions}
					isHover={isHover}
					prefix='background-gradient-'
					breakpoint={breakpoint}
					isLayer
					disableRTC
				/>
			)}
			<SizeAndPositionLayerControl
				prefix={prefix}
				options={gradientOptions}
				onChange={onChange}
				isHover={isHover}
				isLayer={isLayer}
				breakpoint={breakpoint}
			/>
		</>
	);
};

const GradientLayer = props => {
	const { breakpoint, ...rest } = props;

	return (
		<ResponsiveTabsControl breakpoint={breakpoint}>
			<GradientLayerContent {...rest} />
		</ResponsiveTabsControl>
	);
};

export default GradientLayer;
