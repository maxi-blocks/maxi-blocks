/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import GradientControl from '../gradient-control';
import ClipPath from '../clip-path-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getDefaultAttribute,
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';
import getActiveAttributes from '../../extensions/active-indicators';

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
		isGeneral = false,
		isLayer = false,
	} = props;

	const gradientOptions = cloneDeep(props.gradientOptions);

	const getDefaultAttr = target => {
		if (isLayer) return getDefaultLayerAttr('colorOptions', target);

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	return (
		<>
			<GradientControl
				label={__('Background gradient', 'maxi-blocks')}
				gradient={getLastBreakpointAttribute(
					`${prefix}background-gradient`,
					breakpoint,
					gradientOptions,
					isHover
				)}
				gradientOpacity={getLastBreakpointAttribute(
					`${prefix}background-gradient-opacity`,
					breakpoint,
					gradientOptions,
					isHover
				)}
				defaultGradient={getDefaultAttr('background-gradient')}
				onChange={val =>
					onChange({
						[getAttributeKey(
							'background-gradient',
							isHover,
							prefix,
							breakpoint
						)]: val,
						...(isGeneral && {
							[getAttributeKey(
								'background-gradient',
								isHover,
								prefix,
								'general'
							)]: val,
						}),
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
						...(isGeneral && {
							[getAttributeKey(
								'background-gradient-opacity',
								isHover,
								prefix,
								'general'
							)]: val,
						}),
					})
				}
			/>
			{!disableClipPath && (
				<ClipPath
					clipPath={getLastBreakpointAttribute(
						`${prefix}background-gradient-clip-path`,
						breakpoint,
						gradientOptions,
						isHover
					)}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-gradient-clip-path',
								isHover,
								prefix,
								breakpoint
							)]: val,
							...(isGeneral && {
								[getAttributeKey(
									'background-gradient-clip-path',
									isHover,
									prefix,
									'general'
								)]: val,
							}),
						})
					}
				/>
			)}
		</>
	);
};

const GradientLayer = props => {
	const { breakpoint, ...rest } = props;

	return (
		<ResponsiveTabsControl
			breakpoint={breakpoint}
			activeTabs={getActiveAttributes(
				props?.gradientOptions,
				'breakpoints'
			)}
		>
			<GradientLayerContent {...rest} />
		</ResponsiveTabsControl>
	);
};

export default GradientLayer;
