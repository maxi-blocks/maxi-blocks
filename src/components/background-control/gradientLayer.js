/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ClipPathControl from '@components/clip-path-control';
import GradientControl from '@components/gradient-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import { getGroupAttributes } from '@extensions/styles';

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
		isIB = false,
		prefix = '',
		breakpoint,
		isLayer = false,
		getBounds,
		getBlockClipPath, // for IB
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
				<ClipPathControl
					onChange={onChange}
					{...getGroupAttributes(
						props,
						'clipPath',
						false,
						`${prefix}background-gradient-`
					)}
					{...gradientOptions}
					isHover={isHover}
					isIB={isIB}
					prefix={`${prefix}background-gradient-`}
					breakpoint={breakpoint}
					isLayer
					disableRTC
					getBounds={getBounds}
					getBlockClipPath={getBlockClipPath}
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
