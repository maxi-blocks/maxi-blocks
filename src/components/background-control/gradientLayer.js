/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import GradientControl from '../gradient-control';
import ClipPath from '../clip-path-control';
import {
	getDefaultAttribute,
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const GradientLayer = props => {
	const {
		onChange,
		disableClipPath,
		isHover = false,
		prefix = '',
		breakpoint,
	} = props;
	const gradientOptions = cloneDeep(props.gradientOptions);

	return (
		<>
			<GradientControl
				label={__('Background Gradient', 'maxi-blocks')}
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
				defaultGradient={getDefaultAttribute(
					getAttributeKey('background-gradient', isHover, prefix)
				)}
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
						})
					}
				/>
			)}
		</>
	);
};

export default GradientLayer;
