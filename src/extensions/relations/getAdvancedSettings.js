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
	DisplayControl,
} from '@components';
import {
	getOpacityStyles,
	getPositionStyles,
	getTransformStyles,
	getDisplayStyles,
} from '@extensions/styles/helpers';
import {
	getTransformCategories,
	getTransformSelectors,
} from '@components/transform-control/utils';
import { getGroupAttributes, getLastBreakpointAttribute } from '@extensions/styles';
import { getBlockNameFromUniqueID } from '@extensions/attributes';

/**
 * External dependencies
 */
import { isPlainObject } from 'lodash';

const getTransformControl = ({ categories, selectors }) => ({
	sid: 't',
	label: __('Transform', 'maxi-blocks'),
	transitionTarget: [],
	hoverProp: (attributes, relationAttributes) =>
		Object.entries(getGroupAttributes(attributes, 'transform')).some(
			([attributeKey, attribute]) =>
				relationAttributes?.[attributeKey] &&
				isPlainObject(attribute) &&
				Object.entries(attribute).some(
					([objKey, obj]) =>
						relationAttributes[attributeKey][objKey] &&
						obj?.['hover-status']
				)
		),
	attrGroupName: 'transform',
	component: props => (
		<TransformControl
			{...props}
			uniqueID={props.attributes.uniqueID}
			depth={2}
			selectors={getTransformSelectors(selectors, props.blockAttributes)}
			categories={getTransformCategories(
				categories,
				props.blockAttributes,
				getBlockNameFromUniqueID(props.blockAttributes.uniqueID)
			)}
			disableHover
		/>
	),
	helper: props =>
		getTransformStyles(
			props.obj,
			getTransformSelectors(selectors, props.blockAttributes)
		),
	styleAttrs: [
		'transform-scale',
		'transform-translate',
		'transform-rotate',
		'transform-origin',
	],
});

const getAdvancedSettings = ({ customCss }) => [
	{
		sid: 'o',
		label: __('Opacity', 'maxi-blocks'),
		hoverProp: 'opacity-status-hover',
		attrGroupName: 'opacity',
		component: props => (
			<OpacityControl
				{...props}
				opacity={getLastBreakpointAttribute({
					target: 'opacity',
					breakpoint: props.breakpoint,
					attributes: getGroupAttributes(props, 'opacity'),
				})}
			/>
		),
		helper: props => getOpacityStyles(props.obj),
	},
	{
		sid: 'p',
		label: __('Position', 'maxi-blocks'),
		attrGroupName: 'position',
		component: props => <PositionControl {...props} />,
		helper: props => getPositionStyles(props.obj),
	},
	...getTransformControl(customCss),
	{
		sid: 'sh',
		label: __('Show/hide block', 'maxi-blocks'),
		attrGroupName: 'display',
		component: props => <DisplayControl {...props} />,
		helper: props => getDisplayStyles(props.obj, false, true),
	},
];

export default getAdvancedSettings;
