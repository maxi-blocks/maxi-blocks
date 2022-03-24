/**
 * WordPress dependencies
 */
import { RawHTML, useRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { compact, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import './style.scss';
import { getAttributeValue } from '../../extensions/styles';

/**
 * Component
 */
const BackgroundContent = props => {
	const { wrapperRef, prefix = '' } = props;

	const layers = compact([
		...props['background-layers'],
		...props['background-layers-hover'],
	]);

	if (layers) layers.sort((a, b) => a.order - b.order);

	return (
		<>
			{layers &&
				layers.length > 0 &&
				layers.map(layer => {
					const { type, order, uniqueId, isHover = false } = layer;

					switch (type) {
						case 'color':
						case 'gradient':
							return (
								<div
									key={`maxi-background-displayer__${type}-${order}${
										isHover ? '--hover' : ''
									}`}
									className={classnames(
										'maxi-background-displayer__layer',
										`maxi-background-displayer__${order}`,
										uniqueId
									)}
								/>
							);
						case 'image': {
							const parallaxStatus = getAttributeValue({
								target: 'background-image-parallax-status',
								props: layer,
								prefix,
							});

							if (!parallaxStatus)
								return (
									<div
										key={`maxi-background-displayer__${type}-${order}${
											isHover ? '--hover' : ''
										}`}
										className={classnames(
											'maxi-background-displayer__layer',
											`maxi-background-displayer__${order}`,
											uniqueId
										)}
									/>
								);

							const mediaURL = getAttributeValue({
								target: 'background-image-mediaURL',
								props: layer,
								prefix,
							});
							const mediaID = getAttributeValue({
								target: 'background-image-mediaID',
								props: layer,
								prefix,
							});
							const alt = getAttributeValue({
								target: 'background-image-parallax-alt',
								props: layer,
								prefix,
							});

							if (!mediaURL) return null;

							return (
								<div
									key={`maxi-background-displayer__${type}-${order}${
										isHover ? '--hover' : ''
									}`}
									className={classnames(
										'maxi-background-displayer__layer',
										'maxi-background-displayer__parallax',
										`maxi-background-displayer__${order}`,
										uniqueId
									)}
								>
									<img
										className={`wp-image-${mediaID}`}
										src={mediaURL}
										alt={alt}
									/>
								</div>
							);
						}
						case 'video':
							return (
								<VideoLayer
									key={`maxi-background-displayer__${type}-${order}${
										isHover ? '--hover' : ''
									}`}
									wrapperRef={wrapperRef}
									videoOptions={layer}
									className={classnames(
										`maxi-background-displayer__${order}`,
										uniqueId
									)}
								/>
							);
						case 'shape': {
							const svg = layer['background-svg-SVGElement'];

							return (
								<RawHTML
									key={`maxi-background-displayer__${type}-${order}${
										isHover ? '--hover' : ''
									}`}
									className={classnames(
										'maxi-background-displayer__layer',
										'maxi-background-displayer__svg',
										`maxi-background-displayer__${order}`,
										uniqueId
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
		</>
	);
};

const BackgroundDisplayer = props => {
	const { className, isSave = false } = props;

	const haveLayers =
		!isEmpty(props['background-layers']) ||
		!isEmpty(props['background-layers-hover']);

	if (!haveLayers) return null;

	const classes = classnames('maxi-background-displayer', className);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const wrapperRef = isSave ? false : useRef(null);

	return (
		<div ref={wrapperRef} className={classes}>
			<BackgroundContent
				wrapperRef={wrapperRef}
				isHover={false}
				{...props}
			/>
		</div>
	);
};

export default BackgroundDisplayer;
