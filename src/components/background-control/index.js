/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import ColorLayer from './colorLayer';
import GradientLayer from './gradientLayer';
import Icon from '../icon';
import ImageLayer from './imageLayer';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';
import SettingTabsControl from '../setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
} from '../../icons';
import './editor.scss';

/**
 * Components
 */
const BackgroundControl = props => {
	const {
		className,
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableClipPath = false,
		disableSVG = false,
		disableNoneStyle = false,
		onChange,
		isHover = false,
		prefix = '',
		disablePalette,
		clientId,
		breakpoint = 'general',
		globalProps,
	} = props;

	const backgroundActiveMedia = getLastBreakpointAttribute(
		`${prefix}background-active-media`,
		breakpoint,
		props,
		isHover
	);

	const classes = classnames('maxi-background-control', className);

	const getOptions = () => {
		const options = [];

		!disableNoneStyle &&
			options.push({
				icon: <Icon icon={styleNone} />,
				value: 'none',
			});

		!disableColor &&
			options.push({
				icon: <Icon icon={backgroundColor} />,
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
				icon: <Icon icon={backgroundGradient()} />,
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
					className='maxi-background-control__simple'
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
			<>
				{!disableColor && backgroundActiveMedia === 'color' && (
					<ColorLayer
						colorOptions={{
							...getGroupAttributes(
								props,
								'backgroundColor',
								isHover,
								prefix
							),
						}}
						onChange={obj => onChange(obj)}
						disableClipPath={disableClipPath}
						isHover={isHover}
						prefix={prefix}
						disablePalette={disablePalette}
						clientId={clientId}
						breakpoint={breakpoint}
						globalProps={globalProps}
					/>
				)}
				{!disableImage && backgroundActiveMedia === 'image' && (
					<ImageLayer
						imageOptions={{
							...getGroupAttributes(
								props,
								'backgroundImage',
								isHover,
								prefix
							),
						}}
						onChange={obj => onChange(obj)}
						disableClipPath={disableClipPath}
						isHover={isHover}
						prefix={prefix}
						breakpoint={breakpoint}
					/>
				)}
				{!disableVideo && backgroundActiveMedia === 'video' && (
					<VideoLayer
						videoOptions={{
							...getGroupAttributes(
								props,
								'backgroundVideo',
								isHover,
								prefix
							),
						}}
						onChange={obj => onChange(obj)}
						disableClipPath={disableClipPath}
						isHover={isHover}
						prefix={prefix}
						breakpoint={breakpoint}
					/>
				)}
				{!disableGradient && backgroundActiveMedia === 'gradient' && (
					<GradientLayer
						gradientOptions={{
							...getGroupAttributes(
								props,
								'backgroundGradient',
								isHover,
								prefix
							),
						}}
						onChange={obj => onChange(obj)}
						disableClipPath={disableClipPath}
						isHover={isHover}
						prefix={prefix}
						breakpoint={breakpoint}
					/>
				)}
				{!disableSVG && backgroundActiveMedia === 'svg' && (
					<SVGLayer
						SVGOptions={{
							...getGroupAttributes(
								props,
								'backgroundSVG',
								isHover,
								prefix
							),
						}}
						onChange={obj => onChange(obj)}
						isHover={isHover}
						prefix={prefix}
						clientId={clientId}
						breakpoint={breakpoint}
					/>
				)}
			</>
		</div>
	);
};

export default BackgroundControl;
