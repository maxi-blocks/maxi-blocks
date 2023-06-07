/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	OpacityControl,
	PositionControl,
	TransformControl,
} from '../../components';
import {
	getOpacityStyles,
	getPositionStyles,
	getTransformStyles,
} from '../styles/helpers';
import {
	getTransformCategories,
	getTransformSelectors,
} from '../../components/transform-control/utils';
import { getGroupAttributes, getLastBreakpointAttribute } from '../attributes';

/**
 * External dependencies
 */
import { isPlainObject } from 'lodash';

const getTransformControl = ({ categories, selectors }) => ({
	label: __('Transform', 'maxi-blocks'),
	transitionTarget: [],
	hoverProp: (attributes, relationAttributes) =>
		Object.entries(getGroupAttributes(attributes, 'transform')).some(
			([attributeKey, attribute]) =>
				relationAttributes?.[attributeKey] &&
				isPlainObject(attribute) &&
				Object.entries(attribute).some(
					([objKey, obj]) =>
						relationAttributes[attributeKey][objKey] && obj?.hs
				)
		),
	attrGroupName: 'transform',
	component: props => (
		<TransformControl
			{...props}
			uniqueID={props.attributes._uid}
			depth={2}
			selectors={getTransformSelectors(selectors, props.attributes)}
			categories={getTransformCategories(categories, props.attributes)}
			disableHover
		/>
	),
	helper: props =>
		getTransformStyles(
			props.obj,
			getTransformSelectors(selectors, props.blockAttributes)
		),
});

const getAdvancedSettings = ({ customCss }) => [
	{
		label: __('Opacity', 'maxi-blocks'),
		hoverProp: '_o.sh',
		attrGroupName: 'opacity',
		component: props => (
			<OpacityControl
				{...props}
				opacity={getLastBreakpointAttribute({
					target: '_o',
					breakpoint: props.breakpoint,
					attributes: getGroupAttributes(props, 'opacity'),
				})}
			/>
		),
		helper: props => getOpacityStyles(props.obj),
	},
	{
		label: __('Position', 'maxi-blocks'),
		attrGroupName: 'position',
		component: props => <PositionControl {...props} />,
		helper: props => getPositionStyles(props.obj),
	},
	...getTransformControl(customCss),
];

export default getAdvancedSettings;
