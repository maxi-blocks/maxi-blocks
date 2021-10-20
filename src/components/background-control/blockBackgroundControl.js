/**
 * Internal dependencies
 */
import { getAttributeValue, getGroupAttributes } from '../../extensions/styles';
import BackgroundLayersControl from './backgroundLayersControl';
import ParallaxControl from '../parallax-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
		onChange,
		isHover = false,
		prefix = '',
		clientId,
		breakpoint = 'general',
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableSVG = false,
		enableParallax = false,
	} = props;

	const layersOptions =
		getAttributeValue({
			target: 'background-layers',
			props,
			prefix,
		}) || [];

	const hoverStatus = getAttributeValue({
		target: 'background-hover-status',
		props,
		prefix,
	});

	const parallaxStatus = props['parallax-status'];

	const classes = classnames('maxi-background-control', className);

	return (
		<div className={classes}>
			{!parallaxStatus && (
				<BackgroundLayersControl
					layersOptions={layersOptions}
					onChange={obj => onChange(obj)}
					isHover={isHover}
					prefix={prefix}
					disableImage={disableImage}
					disableVideo={disableVideo}
					disableGradient={disableGradient}
					disableColor={disableColor}
					disableSVG={disableSVG}
					clientId={clientId}
					breakpoint={breakpoint}
					hoverStatus={hoverStatus}
				/>
			)}
			{enableParallax && !isHover && (
				<ParallaxControl
					{...getGroupAttributes(props, 'parallax')}
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
				/>
			)}
		</div>
	);
};

export default BlockBackgroundControl;
