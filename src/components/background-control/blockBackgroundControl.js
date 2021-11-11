/**
 * Internal dependencies
 */
import { getAttributeValue } from '../../extensions/styles';
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
			target: 'background-layers',
			props,
			prefix,
			isHover: true,
		}),
	]);

	const hoverStatus = getAttributeValue({
		target: 'background-hover-status',
		props,
		prefix,
	});

	const classes = classnames('maxi-background-control', className);

	return (
		<div className={classes}>
			<BackgroundLayersControl
				layersOptions={layersOptions}
				layersHoverOptions={layersHoverOptions}
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
		</div>
	);
};

export default BlockBackgroundControl;
