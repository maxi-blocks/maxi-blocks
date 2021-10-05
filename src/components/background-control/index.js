/**
 * Internal dependencies
 */
import { getAttributeValue } from '../../extensions/styles';
import BackgroundLayersControl from './backgroundLayersControl';

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
const BackgroundControl = props => {
	const {
		className,
		disableImage = false,
		disableVideo = false,
		disableGradient = false,
		disableColor = false,
		disableSVG = false,
		onChange,
		isHover = false,
		prefix = '',
		clientId,
		isButton = false,
		breakpoint = 'general',
	} = props;

	const layersOptions =
		getAttributeValue({
			target: 'background-layers',
			props,
			isHover,
			prefix,
		}) || [];

	const classes = classnames('maxi-background-control', className);

	return (
		<div className={classes}>
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
				isButton={isButton}
				breakpoint={breakpoint}
			/>
		</div>
	);
};

export default BackgroundControl;
