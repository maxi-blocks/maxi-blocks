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
		order: RegExp.$6,
	};
}

export function getBgLayersSelectorsCss(bgLayers) {
	const bgLayersSelectors = {};
	bgLayers?.forEach(bgLayer => {
		bgLayersSelectors[bgLayer.uniqueId] = {
			normal: {
				label: `background ${bgLayer.type} ${bgLayer.order + 1}`,
				target: ` .maxi-background-displayer .${bgLayer.uniqueId}`,
			},
			hover: {
				label: `background ${bgLayer.type} ${
					bgLayer.order + 1
				} on hover`,
				target: `:hover .maxi-background-displayer .${bgLayer.uniqueId}`,
			},
		};
	});

	return bgLayersSelectors;
}

export function getBgLayersCategoriesCss(bgLayers) {
	const bgLayersCategories = bgLayers?.map((bgLayer, index) => {
		return {
			label: `background ${bgLayer.type} ${index + 1}`,
			value: bgLayer.uniqueId,
		};
	});

	return bgLayersCategories;
}
