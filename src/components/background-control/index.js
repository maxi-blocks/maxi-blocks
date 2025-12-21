/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import ColorLayer from './colorLayer';
import GradientLayer from './gradientLayer';
import Icon from '@components/icon';
import ImageLayer from './imageLayer';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';
import SettingTabsControl from '@components/setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * Styles and icons
 */
import {
	styleNone,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	shape,
} from '@maxi-icons';
import './editor.scss';

/**
 * Components
 */

/**
 * BackgroundUI: Memoized Render Layer
 * Only updates when background-specific data changes.
 */
const BackgroundUI = memo( ( props ) => {
	const {
		className,
		disableImage,
		disableVideo,
		disableGradient,
		disableColor,
		disableClipPath,
		disableSVG,
		disableNoneStyle,
		onChangeInline,
		onChange,
		isHover,
		prefix,
		disablePalette,
		clientId,
		breakpoint,
		globalProps,
		inlineTarget,
		getBounds,
		tabsClassName,
		backgroundActiveMedia,
		backgroundAttributes, // Pre-grouped attributes
	} = props;

	const classes = classnames('maxi-background-control', className);

	const getOptions = () => {
		const options = [];

		!disableNoneStyle &&
			options.push({
				label: __('None', 'maxi-blocks'),
				value: 'none',
			});

		!disableColor &&
			options.push({
				label: __('Solid', 'maxi-blocks'),
				value: 'color',
			});

		!disableImage &&
			options.push({
				icon: <Icon icon={backgroundImage} />,
				value: 'image',
			});

		!disableVideo &&
			options.push({
				icon: <Icon icon={backgroundVideo} />,
				value: 'video',
			});

		!disableGradient &&
			options.push({
				label: __('Gradient', 'maxi-blocks'),
				value: 'gradient',
			});

		!disableSVG &&
			options.push({
				icon: <Icon icon={shape} />,
				value: 'svg',
			});

		return options;
	};

	return (
		<div className={classes}>
			{getOptions().length > 1 && (
				<SettingTabsControl
					label={__('Background', 'maxi-blocks')}
					type='buttons'
					className={classnames(
						'maxi-background-control__simple',
						tabsClassName
					)}
					fullWidthMode
					selected={backgroundActiveMedia || 'none'}
					items={getOptions()}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-active-media',
								isHover,
								prefix,
								breakpoint
							)]: val,
						})
					}
				/>
			)}
			{!disableColor && backgroundActiveMedia === 'color' && (
				<ColorLayer
					colorOptions={backgroundAttributes.backgroundColor}
					onChangeInline={obj =>
						onChangeInline && onChangeInline(obj, inlineTarget)
					}
					onChange={onChange}
					disableClipPath={disableClipPath}
					isHover={isHover}
					prefix={prefix}
					disablePalette={disablePalette}
					clientId={clientId}
					breakpoint={breakpoint}
					globalProps={globalProps}
					getBounds={getBounds}
				/>
			)}
			{!disableImage && backgroundActiveMedia === 'image' && (
				<ImageLayer
					imageOptions={backgroundAttributes.backgroundImage}
					onChange={onChange}
					disableClipPath={disableClipPath}
					isHover={isHover}
					prefix={prefix}
					breakpoint={breakpoint}
					getBounds={getBounds}
				/>
			)}
			{!disableVideo && backgroundActiveMedia === 'video' && (
				<VideoLayer
					videoOptions={backgroundAttributes.backgroundVideo}
					onChange={onChange}
					disableClipPath={disableClipPath}
					isHover={isHover}
					prefix={prefix}
					breakpoint={breakpoint}
				/>
			)}
			{!disableGradient && backgroundActiveMedia === 'gradient' && (
				<GradientLayer
					gradientOptions={backgroundAttributes.backgroundGradient}
					onChange={onChange}
					disableClipPath={disableClipPath}
					isHover={isHover}
					prefix={prefix}
					breakpoint={breakpoint}
					getBounds={getBounds}
				/>
			)}
			{!disableSVG && backgroundActiveMedia === 'svg' && (
				<SVGLayer
					SVGOptions={backgroundAttributes.backgroundSVG}
					onChange={onChange}
					isHover={isHover}
					prefix={prefix}
					clientId={clientId}
					breakpoint={breakpoint}
				/>
			)}
		</div>
	);
}, ( prevProps, nextProps ) => {
	return (
		isEqual( prevProps.backgroundAttributes, nextProps.backgroundAttributes ) &&
		prevProps.backgroundActiveMedia === nextProps.backgroundActiveMedia &&
		prevProps.isHover === nextProps.isHover &&
		prevProps.prefix === nextProps.prefix &&
		prevProps.breakpoint === nextProps.breakpoint &&
		prevProps.clientId === nextProps.clientId
	);
} );

const BackgroundControl = props => {
	const {
		isHover = false,
		prefix = '',
		breakpoint = 'general',
	} = props;

	const backgroundActiveMedia = getLastBreakpointAttribute({
		target: `${prefix}background-active-media`,
		breakpoint,
		attributes: props,
		isHover,
	});

	// Use useMemo to extract ONLY the background-related attributes
	const backgroundAttributes = useMemo( () => {
		return {
			backgroundColor: getGroupAttributes( props, 'backgroundColor', isHover, prefix ),
			backgroundImage: getGroupAttributes( props, 'backgroundImage', isHover, prefix ),
			backgroundVideo: getGroupAttributes( props, 'backgroundVideo', isHover, prefix ),
			backgroundGradient: getGroupAttributes( props, 'backgroundGradient', isHover, prefix ),
			backgroundSVG: getGroupAttributes( props, 'backgroundSVG', isHover, prefix ),
		};
	}, [ props, isHover, prefix ] );

	return (
		<BackgroundUI
			{ ...props }
			backgroundActiveMedia={ backgroundActiveMedia }
			backgroundAttributes={ backgroundAttributes }
		/>
	);
};

export default BackgroundControl;
