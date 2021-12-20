import breakpointAttributesCreator from '../breakpointAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import {
	rawMaxWidth,
	rawWidth,
	rawMinWidth,
	rawMaxHeight,
	rawHeight,
	rawMinHeight,
} from './size';

const prefix = 'container-';

const rawContainer = {
	'container-size-advanced-options': {
		type: 'boolean',
		default: false,
	},
	...prefixAttributesCreator({
		prefix,
		obj: {
			...rawMaxWidth,
			...rawWidth,
			...rawMinWidth,
			...rawMaxHeight,
			...rawHeight,
			...rawMinHeight,
		},
		diffValAttr: { 'container-max-width': 1170 },
	}),
};

const container = breakpointAttributesCreator({
	obj: rawContainer,
	noBreakpointAttr: ['container-size-advanced-options'],
	diffValAttr: {
		'container-max-width-xxl': 1790,
		'container-max-width-xl': 1170,
		'container-max-width-l': 90,
		'container-max-width-m': 90,
		'container-max-width-s': 90,
		'container-max-width-xs': 90,
		'container-max-width-unit-xxl': 'px',
		'container-max-width-unit-xl': 'px',
		'container-max-width-unit-l': '%',
		'container-max-width-unit-m': '%',
		'container-max-width-unit-s': '%',
		'container-max-width-unit-xs': '%',
		'container-width-l': 1170,
		'container-width-m': 1000,
		'container-width-s': 700,
		'container-width-xs': 460,
		'container-width-unit-l': 'px',
		'container-width-unit-m': 'px',
		'container-width-unit-s': 'px',
		'container-width-unit-xs': 'px',
	},
});

export default container;
