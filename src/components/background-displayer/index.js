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

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';

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
			<>
				{Object.entries(activeLayers).map(
					([breakpoint, activeMedia]) => {
						switch (activeMedia) {
							case 'color':
								return (
									<div
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__color'
										)}
									/>
								);
							case 'gradient':
								return (
									<div
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__gradient'
										)}
									/>
								);
							case 'image':
								return (
									<div
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__images'
										)}
									/>
								);
							case 'video':
								return (
									<VideoLayer
										videoOptions={getGroupAttributes(
											props,
											'backgroundVideo',
											isHover
										)}
										blockClassName={blockClassName}
										breakpoint={breakpoint}
									/>
								);
							case 'svg':
								return (
									<RawHTML
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__svg'
										)}
									>
										{getLastBreakpointAttribute(
											'background-svg-SVGElement',
											breakpoint,
											props,
											isHover
										)}
									</RawHTML>
								);
							default:
								return null;
						}
					}
				)}
			</>
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

	// const noneActiveMediaNormal =
	// 	!backgroundActiveMedia || backgroundActiveMedia === 'none';
	// const noneActiveMediaHover =
	// 	!backgroundActiveMediaHover ||
	// 	backgroundActiveMediaHover === 'none' ||
	// 	!backgroundStatusHover;

	// if (noneActiveMediaNormal && noneActiveMediaHover) return null;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			<BackgroundContent
				{...props}
				activeLayers={activeLayers}
				isHover={false}
			/>
			{/* <BackgroundContent {...props} activeLayers={activeLayers} isHover /> */}
		</div>
	);
};

export default BackgroundDisplayer;
