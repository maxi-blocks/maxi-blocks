/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ClipPath from '../clip-path-control';
import GradientControl from '../gradient-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import { getGroupAttributes } from '../../extensions/styles';

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

	return (
		<>
			<GradientControl
				{...gradientOptions}
				label={__('Background gradient', 'maxi-blocks')}
				breakpoint={breakpoint}
				prefix={`${prefix}background-`}
				isHover={isHover}
				onChange={onChange}
			/>
			{!disableClipPath && (
				<ClipPath
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
