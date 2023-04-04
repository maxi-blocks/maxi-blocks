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
import { getGroupAttributes } from '../../extensions/attributes';

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
				prefix={`${prefix}bg`}
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
						`${prefix}bg`
					)}
					{...gradientOptions}
					isHover={isHover}
					isIB={isIB}
					prefix={`${prefix}bg`}
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
