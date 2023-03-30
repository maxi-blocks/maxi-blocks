/**
 * Internal dependencies
 */
import { getAttributesValue } from '../../extensions/attributes';
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
		breakpoint = 'general',
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableSVG = false,
		disableAddLayer = false,
		t: transition,
		getBounds,
		getBlockClipPath, // for IB
	} = props;

	const layersOptions = compact([
		...getAttributesValue({
			target: 'b_ly',
			props,
			prefix,
		}),
	]);
	const layersHoverOptions = compact([
		...getAttributesValue({
			target: 'b_ly.h',
			props,
			prefix,
		}),
	]);

	const hoverStatus = getAttributesValue({
		target: 'bb.sh',
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
