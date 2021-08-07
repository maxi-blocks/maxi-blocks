/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const BackgroundContent = props => {
	const { blockClassName, isHover = false } = props;

	const layers = cloneDeep(
		props[`background-layers${isHover ? '-hover' : ''}`]
	);

	if (layers) layers.sort((a, b) => a.id - b.id);

	return (
		<>
			{!props[`background-layers-status${isHover ? '-hover' : ''}`] ? (
				<>
					{(props[
						`background-active-media${isHover ? '-hover' : ''}`
					] === 'color' ||
						props[
							`background-active-media${isHover ? '-hover' : ''}`
						] === 'gradient') && (
						<div
							className={classnames(
								'maxi-background-displayer__layer',
								'maxi-background-displayer__color'
							)}
						/>
					)}
					{props[
						`background-active-media${isHover ? '-hover' : ''}`
					] === 'image' && (
						<div
							className={classnames(
								'maxi-background-displayer__layer',
								'maxi-background-displayer__images'
							)}
						/>
					)}
					{props[
						`background-active-media${isHover ? '-hover' : ''}`
					] === 'video' && (
						<VideoLayer
							videoOptions={getGroupAttributes(
								props,
								'backgroundVideo',
								isHover
							)}
							blockClassName={blockClassName}
						/>
					)}
					{props[
						`background-active-media${isHover ? '-hover' : ''}`
					] === 'svg' &&
						props[
							`background-svg-SVGElement${
								isHover ? '-hover' : ''
							}`
						] && (
							<RawHTML
								className={classnames(
									'maxi-background-displayer__layer',
									'maxi-background-displayer__svg'
								)}
							>
								{
									props[
										`background-svg-SVGElement${
											isHover ? '-hover' : ''
										}`
									]
								}
							</RawHTML>
						)}
				</>
			) : (
				layers &&
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
								(layer['background-svg-SVGElement'] && (
									<RawHTML
										key={`maxi-background-displayer__${layer.type}__${layer.id}`}
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__svg',
											`maxi-background-displayer__${layer.id}`
										)}
									>
										{layer['background-svg-SVGElement']}
									</RawHTML>
								)) ||
								null
							);
						default:
							break;
					}

					return null;
				})
			)}
		</>
	);
};

const BackgroundDisplayer = props => {
	const {
		className,
		'background-active-media': backgroundActiveMedia,
		'background-active-media-hover': backgroundActiveMediaHover,
		'background-status-hover': backgroundStatusHover,
	} = props;

	const noneActiveMediaNormal =
		!backgroundActiveMedia || backgroundActiveMedia === 'none';
	const noneActiveMediaHover =
		!backgroundActiveMediaHover ||
		backgroundActiveMediaHover === 'none' ||
		!backgroundStatusHover;

	if (noneActiveMediaNormal && noneActiveMediaHover) return null;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			<BackgroundContent {...props} isHover={false} />
			<BackgroundContent {...props} isHover />
		</div>
	);
};

export default BackgroundDisplayer;
