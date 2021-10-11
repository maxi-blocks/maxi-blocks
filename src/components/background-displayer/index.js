/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import VideoLayer from './videoLayer';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, isEmpty } from 'lodash';

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
			{layers &&
				layers.length > 0 &&
				layers.map(layer => {
					const { type, id } = layer;

					switch (type) {
						case 'color':
						case 'gradient':
						case 'image':
							return (
								<div
									key={`maxi-background-displayer__${type}__${id}`}
									className={classnames(
										'maxi-background-displayer__layer',
										`maxi-background-displayer__${id}`
									)}
								/>
							);
						case 'video':
							return (
								<VideoLayer
									key={`maxi-background-displayer__${type}__${id}`}
									videoOptions={layer}
									blockClassName={blockClassName}
									className={`maxi-background-displayer__${id}`}
								/>
							);
						case 'shape': {
							const svg = layer['background-svg-SVGElement'];

							return (
								<RawHTML
									key={`maxi-background-displayer__${type}__${id}`}
									className={classnames(
										'maxi-background-displayer__layer',
										'maxi-background-displayer__svg',
										`maxi-background-displayer__${id}`
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
	const { className, 'parallax-status': parallaxStatus } = props;

	const haveLayers = !isEmpty(props['background-layers']);

	if (!parallaxStatus && !haveLayers) return null;

	const classes = classnames('maxi-background-displayer', className);

	return (
		<div className={classes}>
			{!parallaxStatus && (
				<>
					<BackgroundContent {...props} isHover={false} />
					<BackgroundContent {...props} isHover />
				</>
			)}
			{parallaxStatus && (
				<div className='maxi-background-displayer__parallax' />
			)}
		</div>
	);
};

export default BackgroundDisplayer;
