import breakpointAttributesCreator from '../breakpointAttributesCreator';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import { isNil } from 'lodash';

const types = ['scale', 'translate', 'rotate', 'origin'];

const attributes = breakpointAttributesCreator({
	obj: {
		'transform-scale-x': {
			type: 'number',
		},
		'transform-scale-y': {
			type: 'number',
		},
		'transform-translate-x-unit': {
			type: 'string',
			default: '%',
		},
		'transform-translate-x': {
			type: 'number',
		},
		'transform-translate-y-unit': {
			type: 'string',
			default: '%',
		},
		'transform-translate-y': {
			type: 'number',
		},
		'transform-rotate-x': {
			type: 'number',
		},
		'transform-rotate-y': {
			type: 'number',
		},
		'transform-rotate-z': {
			type: 'number',
		},
		'transform-origin-x': {
			type: 'string',
		},
		'transform-origin-y': {
			type: 'string',
		},
		'transform-origin-x-unit': {
			type: 'string',
			default: '%',
		},
		'transform-origin-y-unit': {
			type: 'string',
			default: '%',
		},
	},
});

const isEligible = blockAttributes =>
	Object.keys(blockAttributes).some(key => key in attributes);

const migrate = newAttributes => {
	const getAxis = attribute => attribute.match(/[x,y,z](-unit)?/)[0];

	Object.entries(newAttributes).forEach(([key, attr]) => {
		if (key in attributes) {
			types.every(type => {
				if (key.match(type) && !isNil(attr)) {
					const breakpoint = getBreakpointFromAttribute(key);
					newAttributes[`transform-${type}-${breakpoint}`] = {
						canvas: {
							normal: {
								...newAttributes[
									`transform-${type}-${breakpoint}`
								]?.canvas?.normal,
								[getAxis(key)]: attr,
							},
						},
					};

					delete newAttributes[key];

					return false;
				}
				return true;
			});
		}
	});
};

const transformMigrator = ({ blockAttributes, save }) => {
	return {
		isEligible,
		attributes: {
			...blockAttributes,
			...attributes,
		},
		migrate(oldAttributes) {
			const newAttributes = { ...oldAttributes };

			migrate(newAttributes);

			return newAttributes;
		},
		save(props) {
			const newSave = save(props);

			return newSave;
		},
	};
};

export { attributes, migrate, isEligible, transformMigrator };
