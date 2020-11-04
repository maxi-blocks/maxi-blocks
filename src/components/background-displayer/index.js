/**
 * WordPress dependencies
 */
const { RawHTML } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const BackgroundDisplayer = props => {
	const { background, className, blockClassName } = props;

	const backgroundValue = !isObject(background)
		? JSON.parse(background)
		: background;
	const { layers } = backgroundValue;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			{!!layers &&
				layers.map(layer => {
					switch (layer.type) {
						case 'color':
						case 'gradient':
						case 'image':
							return (
								<div
									key={`maxi-background-displayer__${layer.id}`}
									className={classnames(
										'maxi-background-displayer__layer',
										`maxi-background-displayer__${layer.id}`
									)}
								/>
							);
						case 'video':
							return (
								<VideoLayer
									videoOptions={layer.options}
									blockClassName={blockClassName}
									className={`maxi-background-displayer__${layer.id}`}
								/>
							);
						case 'shape':
							return (
								(layer.options.SVGElement && (
									<RawHTML
										className={classnames(
											'maxi-background-displayer__layer',
											'maxi-background-displayer__svg',
											`maxi-background-displayer__${layer.id}`
										)}
									>
										{layer.options.SVGElement}
									</RawHTML>
								)) ||
								null
							);
						default:
							break;
					}

					return null;
				})}
			<div
				className={classnames(
					'maxi-background-displayer__layer',
					'maxi-background-displayer__overlay'
				)}
			/>
			<div
				className={classnames(
					'maxi-background-displayer__layer',
					'maxi-background-displayer__color'
				)}
			/>
			{backgroundValue.activeMedia === 'image' && (
				<div
					className={classnames(
						'maxi-background-displayer__layer',
						'maxi-background-displayer__images'
					)}
				/>
			)}
			{backgroundValue.activeMedia === 'video' && (
				<VideoLayer
					videoOptions={backgroundValue.videoOptions}
					blockClassName={blockClassName}
				/>
			)}
			{backgroundValue.activeMedia === 'svg' &&
				backgroundValue.SVGOptions.SVGElement && (
					<RawHTML
						className={classnames(
							'maxi-background-displayer__layer',
							'maxi-background-displayer__svg'
						)}
					>
						{backgroundValue.SVGOptions.SVGElement}
					</RawHTML>
				)}
		</div>
	);
};

export default BackgroundDisplayer;
