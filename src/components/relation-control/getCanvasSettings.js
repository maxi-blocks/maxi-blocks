/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	BlockBackgroundControl,
	BorderControl,
	BoxShadowControl,
	FullSizeControl,
	InfoBox,
	MarginControl,
	OpacityControl,
	PaddingControl,
	PositionControl,
	TransformControl,
} from '../../components';
import {
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
} from '../../extensions/styles/helpers';
import {
	getTransformCategories,
	getTransformSelectors,
} from '../transform-control/utils';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, isPlainObject, pickBy } from 'lodash';

const getTransformControl = (name, { categories, selectors }) => ({
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
			selectors={getTransformSelectors(selectors)}
			categories={getTransformCategories(categories, props.attributes)}
			disableHover
		/>
	),
	helper: props =>
		getTransformStyles(props.obj, getTransformSelectors(selectors)),
});

const getCanvasSettings = ({ name, customCss }) => [
	{
		label: __('Background / Layer', 'maxi-blocks'),
		transitionTarget: ' > .maxi-background-displayer > div',
		hoverProp: 'block-background-status-hover',
		attrGroupName: [
			'blockBackground',
			'border',
			'borderWidth',
			'borderRadius',
		],
		component: props => {
			const { attributes, onChange } = props;
			const { 'background-layers': bgLayers } = attributes;

			return !isEmpty(bgLayers) ? (
				<BlockBackgroundControl
					{...props}
					onChange={obj => {
						const { 'background-layers': bgLayers, ...rest } = obj;
						const newBgLayers = bgLayers.map(bgLayer =>
							pickBy(
								bgLayer,
								(_value, key) =>
									!key.includes('mediaID') &&
									!key.includes('mediaURL')
							)
						);

						onChange({
							...rest,
							'background-layers': newBgLayers,
						});
					}}
					isIB
					disableAddLayer
				/>
			) : (
				<InfoBox
					message={__('No background layers added', 'maxi-blocks')}
				/>
			);
		},
		helper: ({ obj, blockStyle }) =>
			getBlockBackgroundStyles({
				...obj,
				blockStyle,
				ignoreMediaAttributes: true,
			}),
	},
	{
		label: __('Border', 'maxi-blocks'),
		transitionTarget: ['', ' > .maxi-background-displayer'],
		hoverProp: 'border-status-hover',
		attrGroupName: ['border', 'borderWidth', 'borderRadius'],
		component: props => <BorderControl {...props} />,
		helper: props => getBorderStyles(props),
	},
	{
		label: __('Box shadow', 'maxi-blocks'),
		attrGroupName: 'boxShadow',
		component: props => <BoxShadowControl {...props} />,
		helper: props => getBoxShadowStyles(props),
	},
	{
		label: __('Opacity', 'maxi-blocks'),
		attrGroupName: 'opacity',
		component: props => (
			<OpacityControl
				{...props}
				opacity={getLastBreakpointAttribute({
					target: 'opacity',
					breakpoint: props.breakpoint,
					attributes: getGroupAttributes(props, 'opacity'),
				})}
				onChange={val =>
					props.onChange({ [`opacity-${props.breakpoint}`]: val })
				}
			/>
		),
		helper: props => getOpacityStyles(props.obj),
	},
	{
		label: __('Height / Width', 'maxi-blocks'),
		attrGroupName: 'size',
		component: props => {
			const fullWidth = getLastBreakpointAttribute({
				target: 'full-width',
				breakpoint: props.breakpoint,
				attributes: getGroupAttributes(props, 'size'),
			});

			const isBlockFullWidth = fullWidth === 'full';

			return (
				<FullSizeControl
					{...props}
					hideWidth={isBlockFullWidth || name === 'column-maxi'}
					hideMaxWidth={isBlockFullWidth}
					isBlockFullWidth={isBlockFullWidth}
				/>
			);
		},
		helper: props => getSizeStyles(props.obj, props.prefix),
	},
	{
		label: __('Margin / Padding', 'maxi-blocks'),
		attrGroupName: ['margin', 'padding'],
		component: props => (
			<>
				<MarginControl {...props} />
				<PaddingControl {...props} />
			</>
		),
		helper: props => getMarginPaddingStyles(props),
	},
	{
		label: __('Position', 'maxi-blocks'),
		attrGroupName: 'position',
		component: props => <PositionControl {...props} />,
		helper: props => getPositionStyles(props.obj),
	},
	...getTransformControl(name, customCss),
];

export default getCanvasSettings;
