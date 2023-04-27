/**
 * WordPress dependencies
 */
import { RawHTML, useRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';
import { getAttributesValue } from '../../extensions/attributes';

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

/**
 * Component
 */
const BackgroundContent = props => {
	const { wrapperRef, prefix = '' } = props;
	const [backgroundLayers, backgroundLayersHover] = getAttributesValue({
		target: ['b_ly', 'b_ly.h'],
		props,
	});

	const layers = compact([...backgroundLayers, ...backgroundLayersHover]);

	if (layers) layers.sort((a, b) => a.order - b.order);

	return (
		layers &&
		layers.length > 0 &&
		layers.map(layer => {
			const { type, order, isHover = false } = layer;

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
								`maxi-background-displayer__${order}`
							)}
						/>
					);
				case 'image': {
					const parallaxStatus = getAttributesValue({
						target: 'bi_pa.s',
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
									`maxi-background-displayer__${order}`
								)}
							/>
						);

					const mediaURL = getAttributesValue({
						target: 'bi_mu',
						props: layer,
						prefix,
					});
					const mediaID = getAttributesValue({
						target: 'bi_mi',
						props: layer,
						prefix,
					});
					const alt = getAttributesValue({
						target: 'bi_pal',
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
								`maxi-background-displayer__${order}`
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
							className={`maxi-background-displayer__${order}`}
						/>
					);
				case 'shape': {
					const svg = layer.bsv_se;

					return (
						<RawHTML
							key={`maxi-background-displayer__${type}-${order}${
								isHover ? '--hover' : ''
							}`}
							className={classnames(
								'maxi-background-displayer__layer',
								'maxi-background-displayer__svg',
								`maxi-background-displayer__${order}`
							)}
						>
							{svg}
						</RawHTML>
					);
				}
				default:
					return null;
			}
		})
	);
};

const BackgroundDisplayer = props => {
	const { className, isSave = false } = props;

	const [backgroundLayers, backgroundLayersHover] = getAttributesValue({
		target: ['b_ly', 'b_ly.h'],
		props,
	});

	const haveLayers =
		!isEmpty(backgroundLayers) || !isEmpty(backgroundLayersHover);

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
