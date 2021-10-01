/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getAttributeKey,
	getLastBreakpointAttribute,
	getAttributeValue,
} from '../../extensions/styles';
import BackgroundLayersControl from './backgroundLayersControl';
import ColorLayer from './colorLayer';
import FancyRadioControl from '../fancy-radio-control';
import GradientLayer from './gradientLayer';
import Icon from '../icon';
import ImageLayer from './imageLayer';
import SVGLayer from './svgLayer';
import VideoLayer from './videoLayer';

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
		disableLayers = false,
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
		isButton = false,
		breakpoint = 'general',
	} = props;

	const backgroundActiveMedia = getLastBreakpointAttribute(
		`${prefix}background-active-media`,
		breakpoint,
		props,
		isHover
	);
	const layersOptions =
		getAttributeValue({
			target: 'background-layers',
			props,
			isHover,
			prefix,
		}) || [];
	const layersStatus =
		getLastBreakpointAttribute(
			`${prefix}background-layers-status`,
			breakpoint,
			props,
			isHover
		) || false;

	const classes = classnames('maxi-background-control', className);

	const getOptions = () => {
		const options = [];

		!disableNoneStyle &&
			options.push({
				label: <Icon icon={styleNone} />,
				value: '',
			});

		!disableColor &&
			options.push({
				label: <Icon icon={backgroundColor} />,
				value: 'color',
			});

		!disableImage &&
			options.push({
				label: <Icon icon={backgroundImage} />,
				value: 'image',
			});

		!disableVideo &&
			options.push({
				label: <Icon icon={backgroundVideo} />,
				value: 'video',
			});

		!disableGradient &&
			options.push({
				label: <Icon icon={backgroundGradient()} />,
				value: 'gradient',
			});

		!disableSVG &&
			options.push({
				label: <Icon icon={shape} />,
				value: 'svg',
			});

		return options;
	};

	return (
		<div className={classes}>
			{!disableLayers && (
				<BackgroundLayersControl
					layersOptions={layersOptions}
					layersStatus={layersStatus}
					onChange={obj => onChange(obj)}
					isHover={isHover}
					prefix={prefix}
					disableImage={disableImage}
					disableVideo={disableVideo}
					disableGradient={disableGradient}
					disableColor={disableColor}
					disableSVG={disableSVG}
					clientId={clientId}
					isButton={isButton}
					breakpoint={breakpoint}
				/>
			)}
			{!layersStatus && getOptions().length > 1 && (
				<FancyRadioControl
					label={__('Background', 'maxi-blocks')}
					className='maxi-background-control__simple'
					fullWidthMode
					selected={backgroundActiveMedia || ''}
					options={getOptions()}
					optionType='string'
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
			{!layersStatus && (
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
							isButton={isButton}
							breakpoint={breakpoint}
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
			)}
		</div>
	);
};

export default BackgroundControl;
