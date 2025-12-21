/**
 * WordPress dependencies
 */
import { RawHTML, useRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';
import { getAttributeValue, getGroupAttributes } from '@extensions/styles';
import { getDCValues } from '@extensions/DC';

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
	const { wrapperRef, prefix = '', isSave = false } = props;

	const layers = compact([
		...props['background-layers'],
		...props['background-layers-hover'],
	]);

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
								`maxi-background-displayer__${order}`,
								isHover && 'maxi-background-displayer__layer--hover'
							)}
						/>
					);
				case 'image': {
					const {
						status: dcStatus,
						mediaId: rawDCMediaId,
						mediaUrl: rawDCMediaUrl,
					} = getDCValues(
						getGroupAttributes(
							layer,
							'dynamicContent',
							false,
							prefix
						),
						{}
					);

					const dcMediaId = isSave
						? '$bg-media-id-to-replace'
						: rawDCMediaId;
					const dcMediaUrl = isSave
						? '$bg-media-url-to-replace'
						: rawDCMediaUrl;

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
									isHover && 'maxi-background-displayer__layer--hover'
								)}
								style={
									dcStatus
										? {
												backgroundImage: `url(${dcMediaUrl})`,
										  }
										: {}
								}
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
					const altSelector = getAttributeValue({
						target: 'background-image-parallax-alt-selector',
						props: layer,
						prefix,
					});
					const alt =
						altSelector !== 'none'
							? getAttributeValue({
									target: 'background-image-parallax-alt',
									props: layer,
									prefix,
							  })
							: undefined;

					if (!mediaURL && !dcStatus) return null;

					return (
						<div
							key={`maxi-background-displayer__${type}-${order}${
								isHover ? '--hover' : ''
							}`}
							className={classnames(
								'maxi-background-displayer__layer',
								'maxi-background-displayer__parallax',
								`maxi-background-displayer__${order}`,
								isHover && 'maxi-background-displayer__layer--hover'
							)}
						>
							<img
								className={`wp-image-${
									dcStatus ? dcMediaId : mediaID
								}`}
								src={dcStatus ? dcMediaUrl : mediaURL}
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
								isHover && 'maxi-background-displayer__layer--hover'
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
