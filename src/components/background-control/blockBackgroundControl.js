/**
 * Internal dependencies
 */
import { getAttributeValue } from '@extensions/styles';
import BackgroundLayersControl from './backgroundLayersControl';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { compact } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Components
 */
const BlockBackgroundControl = props => {
	const {
		className,
		onChangeInline,
		onChange,
		isHover = false,
		isIB = false,
		prefix = '',
		clientId,
		blockAttributes,
		breakpoint = 'general',
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableSVG = false,
		disableAddLayer = false,
		transition,
		getBounds,
		getBlockClipPath, // for IB
	} = props;

	const layersOptions = compact([
		...getAttributeValue({
			target: 'background-layers',
			props,
			prefix,
		}),
	]);
	const layersHoverOptions = compact([
		...getAttributeValue({
			target: 'background-layers-hover',
			props,
			prefix,
		}),
	]);

	const hoverStatus = getAttributeValue({
		target: 'block-background-status-hover',
		props,
		prefix,
	});

	const classes = classnames('maxi-background-control', className);

	return (
		<div className={classes}>
			<BackgroundLayersControl
				layersOptions={layersOptions}
				layersHoverOptions={layersHoverOptions}
				onChangeInline={onChangeInline}
				onChange={onChange}
				isHover={isHover}
				isIB={isIB}
				prefix={prefix}
				blockAttributes={blockAttributes}
				disableImage={disableImage}
				disableVideo={disableVideo}
				disableGradient={disableGradient}
				disableColor={disableColor}
				disableSVG={disableSVG}
				disableAddLayer={disableAddLayer}
				clientId={clientId}
				breakpoint={breakpoint}
				hoverStatus={hoverStatus}
				transition={transition}
				getBounds={getBounds}
				getBlockClipPath={getBlockClipPath}
			/>
		</div>
	);
};

export default BlockBackgroundControl;
