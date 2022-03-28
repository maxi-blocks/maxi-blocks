/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

export default function parseVideo(url) {
	// - Supported YouTube URL formats:
	//   - http://www.youtube.com/watch?v=My2FRPA3Gf8
	//   - http://youtu.be/My2FRPA3Gf8
	//   - https://youtube.googleapis.com/v/My2FRPA3Gf8
	// - Supported Vimeo URL formats:
	//   - http://vimeo.com/25451551
	//   - http://player.vimeo.com/video/25451551
	// - Also supports relative URLs:
	//   - //player.vimeo.com/video/25451551

	url.match(
		/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
	);

	let type = 'direct';

	if (RegExp.$3.indexOf('youtu') > -1) {
		type = 'youtube';
	} else if (RegExp.$3.indexOf('vimeo') > -1) {
		type = 'vimeo';
	}

	return {
		type,
		id: RegExp.$6,
	};
}

export function getBgLayersSelectorsCss(bgLayers) {
	const bgLayersSelectors = {
		background: {},
		'background hover': {},
	};

	bgLayers
		?.sort((a, b) => a.order - b.order)
		.forEach(bgLayer => {
			const newBgLayersSelectors = {
				...bgLayersSelectors.background,
				[`_${bgLayer.id}`]: {
					label: `background ${bgLayer.type} ${bgLayer.order + 1}`,
					target: ` .maxi-background-displayer .maxi-background-displayer__${bgLayer.order}`,
				},
			};

			const newBgHoverSelectors = {
				...bgLayersSelectors['background hover'],
				[`_${bgLayer.id}`]: {
					label: `background ${bgLayer.type} ${
						bgLayer.order + 1
					} on hover`,
					target: `:hover .maxi-background-displayer .maxi-background-displayer__${bgLayer.order}`,
				},
			};

			if (bgLayer?.isHover) {
				bgLayersSelectors['background hover'] = newBgHoverSelectors;
			} else {
				bgLayersSelectors.background = newBgLayersSelectors;
				bgLayersSelectors['background hover'] = newBgHoverSelectors;
			}
		});

	return bgLayersSelectors;
}
