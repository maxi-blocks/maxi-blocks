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
import VideoLayer from './newVideoLayer';

/**
 * Styles
 */
import './style.scss';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

/**
 * Component
 */
const BackgroundContent = props => {
	const { blockClassName, isHover = false } = props;

	return (
		<Fragment>
			{props[`background-layers${isHover ? '-hover' : ''}`].length <=
			0 ? (
				<Fragment>
					<div
						className={classnames(
							'maxi-background-displayer__layer',
							'maxi-background-displayer__color'
						)}
					/>
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
				</Fragment>
			) : (
				props[`background-layers${isHover ? '-hover' : ''}`].length >
					0 &&
				props[`background-layers${isHover ? '-hover' : ''}`]
					.reverse()
					.map(layer => {
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
		</Fragment>
	);
};

const BackgroundDisplayer = props => {
	const { className } = props;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			<BackgroundContent {...props} isHover={false} />
			<BackgroundContent {...props} isHover />
		</div>
	);
};

export default BackgroundDisplayer;
