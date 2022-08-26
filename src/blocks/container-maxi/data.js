/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const shapeDividerCopyPasteGenerator = position => {
	return {
		[`${capitalize(position)} shape divider`]: {
			group: {
				'Divider status': `shape-divider-${position}-status`,
				'Divider style': `shape-divider-${position}-shape-style`,
				'Divider opacity': `shape-divider-${position}-opacity`,
				'Divider color': [
					`shape-divider-${position}-palette-color`,
					`shape-divider-${position}-color`,
					`shape-divider-${position}-palette-status`,
				],
				'Divider height': `shape-divider-${position}-height`,
				'Divider height unit': `shape-divider-${position}-height-unit`,
				'Divider scroll effect': `shape-divider-${position}-effects-status`,
			},
		},
	};
};

/**
 * Data object
 */
const name = 'container-maxi';
const copyPasteMapping = {
	settings: {
		'Callout arrow': {
			group: {
				'Show arrow': 'arrow-status',
				'Arrow side': 'arrow-side',
				'Arrow position': 'arrow-position',
				'Arrow size': 'arrow-width',
			},
			hasBreakpoints: true,
		},
		...shapeDividerCopyPasteGenerator('top'),
		...shapeDividerCopyPasteGenerator('bottom'),
		Background: {
			template: 'blockBackground',
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};
const customCss = {
	selectors: createSelectors({
		container: '',
	}),
	categories: [
		'container',
		'before container',
		'after container',
		'background',
		'background hover',
	],
};
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
