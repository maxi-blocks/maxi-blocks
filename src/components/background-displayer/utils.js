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
	const bgLayersSelectors = {};
	bgLayers?.forEach((bgLayer, index) => {
		bgLayersSelectors[`background ${bgLayer.type} ${index + 1}`] = {
			normal: {
				label: `background ${bgLayer.type} ${index + 1}`,
				target: ` .maxi-background-displayer .maxi-background-displayer__${bgLayer.id}`,
			},
			hover: {
				label: `background ${bgLayer.type} ${bgLayer.id + 1} on hover`,
				target: ` .maxi-background-displayer:hover .maxi-background-displayer__${bgLayer.id}`,
			},
		};
	});

	return bgLayersSelectors;
}

export function getBgLayersCategoriesCss(bgLayers) {
	console.log(bgLayers);

	const bgLayersCategories = bgLayers?.map(
		(bgLayer, index) => `background ${bgLayer.type} ${index + 1}`
	);

	return bgLayersCategories;
}
