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
import './style.scss';

/**
 * Component
 */
const BackgroundContent = props => {
	const { wrapperRef } = props;

	const layers = compact([
		...props['background-layers'],
		...props['background-layers-hover'],
	]);

	if (layers) layers.sort((a, b) => a.id - b.id);

	return (
		<>
			{layers &&
				layers.length > 0 &&
				layers.map(layer => {
					const { type, id, isHover = false } = layer;

					switch (type) {
						case 'color':
						case 'gradient':
						case 'image':
							return (
								<div
									key={`maxi-background-displayer__${type}-${id}${
										isHover ? '--hover' : ''
									}`}
									className={classnames(
										'maxi-background-displayer__layer',
										`maxi-background-displayer__${id}`
									)}
								/>
							);
						case 'video':
							return (
								<VideoLayer
									key={`maxi-background-displayer__${type}-${id}${
										isHover ? '--hover' : ''
									}`}
									wrapperRef={wrapperRef}
									videoOptions={layer}
									className={`maxi-background-displayer__${id}`}
								/>
							);
						case 'shape': {
							const svg = layer['background-svg-SVGElement'];

							return (
								<RawHTML
									key={`maxi-background-displayer__${type}-${id}${
										isHover ? '--hover' : ''
									}`}
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
