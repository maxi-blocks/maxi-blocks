/**
 * WordPress dependencies
 */
const { RawHTML, Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';

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
	const { className, blockClassName } = props;

	const background = { ...props.background };
	const { status, layers } = background.layersOptions;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			{!status ? (
				<Fragment>
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
					{background.activeMedia === 'image' && (
						<div
							className={classnames(
								'maxi-background-displayer__layer',
								'maxi-background-displayer__images'
							)}
						/>
					)}
					{background.activeMedia === 'video' && (
						<VideoLayer
							videoOptions={background.videoOptions}
							blockClassName={blockClassName}
						/>
					)}
					{background.activeMedia === 'svg' &&
						background.SVGOptions.SVGElement && (
							<RawHTML
								className={classnames(
									'maxi-background-displayer__layer',
									'maxi-background-displayer__svg'
								)}
							>
								{background.SVGOptions.SVGElement}
							</RawHTML>
						)}
				</Fragment>
			) : (
				!!layers &&
				layers.reverse().map(layer => {
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
				})
			)}
		</div>
	);
};

export default BackgroundDisplayer;
