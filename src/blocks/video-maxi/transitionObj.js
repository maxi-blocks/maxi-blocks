import { createIconTransitions } from '../../extensions/styles';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'video-';

const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: [
				' .maxi-video-block__overlay',
				' .maxi-video-block__video-player',
			],
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: [
				' .maxi-video-block__overlay',
				' .maxi-video-block__video-player',
			],
			property: 'box-shadow',
			prefix,
		},
		'overlay colour': {
			title: 'Overlay colour',
			target: ' .maxi-video-block__overlay-background',
			hoverProp: 'overlay-background-hover-status',
			property: 'background-color',
		},
		...createIconTransitions({
			className: ' .maxi-video-block__play-button',
			prefix: 'play-icon-',
			titlePrefix: 'play icon',
			disableBorder: true,
			disableBackground: true,
		}),
		...createIconTransitions({
			className: ' .maxi-video-block__close-button',
			prefix: 'close-icon-',
			titlePrefix: 'close icon',
			disableBorder: true,
			disableBackground: true,
		}),
	},
};

export default transitionObj;
