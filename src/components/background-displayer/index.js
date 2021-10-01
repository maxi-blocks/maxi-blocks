/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getAttributeValue,
} from '../../extensions/styles';
import { getSVGClassName } from '../../extensions/svg/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, isEmpty, uniqueId } from 'lodash';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const BackgroundContent = props => {
	const { blockClassName, isHover = false, activeLayers } = props;

	const layers = cloneDeep(
		props[`background-layers${isHover ? '-hover' : ''}`]
	);

	if (layers) layers.sort((a, b) => a.id - b.id);

	return (
		<>
			{Object.entries(activeLayers).map(([breakpoint, activeMedia]) => {
				switch (activeMedia) {
					case 'color':
						return (
							<div
								key={uniqueId(
									'background-displayer-color-layer--'
								)}
								className={classnames(
									'maxi-background-displayer__layer',
									'maxi-background-displayer__color'
								)}
							/>
						);
					case 'gradient':
						return (
							<div
								key={uniqueId(
									'background-displayer-gradient-layer--'
								)}
								className={classnames(
									'maxi-background-displayer__layer',
									'maxi-background-displayer__gradient'
								)}
							/>
						);
					case 'image':
						return (
							<div
								key={uniqueId(
									'background-displayer-image-layer--'
								)}
								className={classnames(
									'maxi-background-displayer__layer',
									'maxi-background-displayer__images'
								)}
							/>
						);
					case 'video':
						return (
							<VideoLayer
								key={uniqueId(
									'background-displayer-video-layer--'
								)}
								videoOptions={getGroupAttributes(
									props,
									'backgroundVideo',
									isHover
								)}
								blockClassName={blockClassName}
								breakpoint={breakpoint}
							/>
						);
					case 'svg': {
						const svg = getLastBreakpointAttribute(
							'background-svg-SVGElement',
							breakpoint,
							props,
							isHover
						);

						return (
							<RawHTML
								key={uniqueId(
									'background-displayer-shape-layer--'
								)}
								className={classnames(
									'maxi-background-displayer__layer',
									'maxi-background-displayer__svg',
									svg &&
										`maxi-background-displayer__svg--${getSVGClassName(
											svg
										)}`
								)}
							>
								{svg}
							</RawHTML>
						);
					}
					default:
						return null;
				}
			})}
			{layers &&
				layers.length > 0 &&
				layers.map(layer => {
					switch (layer.type) {
						case 'color':
						case 'gradient':
						case 'image':
							return (
								<div
									key={`maxi-background-displayer__${layer.type}__${layer.id}`}
									className={classnames(
										'maxi-background-displayer__layer',
										`maxi-background-displayer__${layer.id}`
									)}
								/>
							);
						case 'video':
							return (
								<VideoLayer
									key={`maxi-background-displayer__${layer.type}__${layer.id}`}
									videoOptions={getGroupAttributes(
										layer,
										'backgroundVideo',
										isHover
									)}
									blockClassName={blockClassName}
									className={`maxi-background-displayer__${layer.id}`}
								/>
							);
						case 'shape':
							return (
								(layer['background-svg-SVGElement-general'] && (
									<RawHTML
										key={`maxi-background-displayer__${layer.type}__${layer.id}`}
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__svg',
											`maxi-background-displayer__${layer.id}`
										)}
									>
										{
											layer[
												'background-svg-SVGElement-general'
											]
										}
									</RawHTML>
								)) ||
								null
							);
						default:
							break;
					}

					return null;
				})}
		</>
	);
};

const getBackgroundActiveMedia = (props, prefix = '', isHover = false) => {
	const response = {};
	const target = `${prefix}background-active-media`;

	Object.entries(props).forEach(([key, val]) => {
		if (!key.includes(target) || !val) return;

		const breakpoint = key.replace(`${target}-`, '').replace('-hover', '');
		const prevBreakpoint =
			breakpoint !== 'general'
				? BREAKPOINTS[BREAKPOINTS.indexOf(breakpoint) - 1]
				: breakpoint;
		const lastValue = getLastBreakpointAttribute(
			target,
			prevBreakpoint,
			props,
			isHover
		);
		const currentValue = getLastBreakpointAttribute(
			target,
			breakpoint,
			props,
			isHover
		);

		if (breakpoint === 'general' || lastValue !== val)
			response[breakpoint] = val;

		// Ensures a repeated activeElement for video in case some of the options
		// present on the url of the element are different from the previous breakpoint
		if (currentValue === 'video' && response[breakpoint] !== 'video') {
			const repeatVideo = [
				'mediaURL',
				'loop',
				'startTime',
				'endTime',
				'playOnMobile',
			].some(target => {
				const currentVideo = getAttributeValue({
					target: `background-video-${target}`,
					props,
					breakpoint,
				});
				const prevVideo = getAttributeValue({
					target: `background-video-${target}`,
					props,
					breakpoint: prevBreakpoint,
				});

				if (currentVideo && currentVideo !== prevVideo) return true;

				return false;
			});

			if (repeatVideo) response[breakpoint] = val;
		}
		// Ensures a repeated activeElement for video in case some of the options
		// present on the url of the element are different from the previous breakpoint
		if (currentValue === 'svg') {
			const currentSVG = getAttributeValue({
				target: 'background-svg-SVGElement',
				props,
				breakpoint,
			});
			const prevSVG = getAttributeValue({
				target: 'background-svg-SVGElement',
				props,
				breakpoint: prevBreakpoint,
			});

			if (currentSVG !== prevSVG) response[breakpoint] = val;
		}
	});

	return response;
};

const BackgroundDisplayer = props => {
	const { className } = props;

	const activeLayers = getBackgroundActiveMedia(props);

	if (isEmpty(activeLayers)) return null;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			<BackgroundContent
				key={uniqueId('background-displayer-content--')}
				{...props}
				activeLayers={activeLayers}
				isHover={false}
			/>
			{/* <BackgroundContent {...props} activeLayers={activeLayers} isHover /> */}
		</div>
	);
};

export default BackgroundDisplayer;
