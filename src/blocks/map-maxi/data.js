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
				map: {
					label: 'map',
					target: '',
				},
			}),
			...createSelectors(
				{
					title: {
						label: 'title',
						target: `${infoWindowClass}__title`,
					},
					address: {
						label: 'address',
						target: `${infoWindowClass}__address`,
					},
				},
				false
			),
		},
		categories: ['map', 'before map', 'after map', 'title', 'address'],
	},
	get interactionBuilderSettings() {
		delete this.interactionBuilderSettings;
		this.interactionBuilderSettings = getCanvasSettings(this);
		return this.interactionBuilderSettings;
	},
};

const { customCss, interactionBuilderSettings } = data;

export { customCss, interactionBuilderSettings };
export default data;
