import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

/**
 * Classnames
 */
const infoWindowClass = ' .map-marker-info-window';

const data = {
	name: 'map-maxi',
	customCss: {
		selectors: {
			...createSelectors({
				map: '',
			}),
			...createSelectors(
				{
					title: `${infoWindowClass}__title`,
					address: `${infoWindowClass}__address`,
				},
				false
			),
		},
		categories: ['map', 'before map', 'after map', 'title', 'address'],
	},
	get interactionBuilderSettings() {
		return getCanvasSettings(this);
	},
};

const { customCss, interactionBuilderSettings } = data;

export { customCss, interactionBuilderSettings };
export default data;
