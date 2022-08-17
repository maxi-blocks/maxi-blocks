import { __ } from '@wordpress/i18n';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import {
	getTransformCategories,
	getTransformSelectors,
} from '../transform-control/utils';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { isEmpty } from 'lodash';

const getTransformControl = ({ categories, selectors }) => ({
	label: __('Transform', 'maxi-blocks'),
	attrGroupName: 'transform',
	component: props => (
		<Controls.TransformControl
			{...props}
			uniqueID={props.attributes.uniqueID}
			depth={2}
			selectors={getTransformSelectors(selectors)}
			categories={getTransformCategories(categories, props.attributes)}
			disableHover
		/>
	),
	helper: props =>
		styleHelpers.getTransformStyles(
			props.obj,
			getTransformSelectors(selectors)
		),
});

const getCanvasSettings = ({ name, customCss }) => [
	{
		label: __('Background / Layer', 'maxi-blocks'),
		attrGroupName: [
			'blockBackground',
			'border',
			'borderWidth',
			'borderRadius',
		],
		component: props => {
			const { attributes } = props;
			const { 'background-layers': bgLayers } = attributes;

			return !isEmpty(bgLayers) ? (
				<Controls.BlockBackgroundControl {...props} disableAddLayer />
			) : (
				<Controls.InfoBox
					message={__('No background layers added', 'maxi-blocks')}
				/>
			);
		},
		helper: ({ obj, blockStyle }) =>
			styleHelpers.getBlockBackgroundStyles({ ...obj, blockStyle }),
	},
	{
		label: __('Border', 'maxi-blocks'),
		attrGroupName: ['border', 'borderWidth', 'borderRadius'],
		component: props => <Controls.BorderControl {...props} />,
		helper: props => styleHelpers.getBorderStyles(props),
	},
	{
		label: __('Box shadow', 'maxi-blocks'),
		attrGroupName: 'boxShadow',
		component: props => <Controls.BoxShadowControl {...props} />,
		helper: props => styleHelpers.getBoxShadowStyles(props),
	},
	{
		label: __('Opacity', 'maxi-blocks'),
		attrGroupName: 'opacity',
		component: props => (
			<Controls.OpacityControl
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
		helper: props => styleHelpers.getOpacityStyles(props.obj),
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
				<Controls.FullSizeControl
					{...props}
					hideWidth={isBlockFullWidth || name === 'column-maxi'}
					hideMaxWidth={isBlockFullWidth}
					isBlockFullWidth={isBlockFullWidth}
				/>
			);
		},
		helper: props => styleHelpers.getSizeStyles(props.obj, props.prefix),
	},
	{
		label: __('Margin / Padding', 'maxi-blocks'),
		attrGroupName: ['margin', 'padding'],
		component: props => (
			<>
				<Controls.MarginControl {...props} />
				<Controls.PaddingControl {...props} />
			</>
		),
		helper: props => styleHelpers.getMarginPaddingStyles(props),
	},
	{
		label: __('Position', 'maxi-blocks'),
		attrGroupName: 'position',
		component: props => <Controls.PositionControl {...props} />,
		helper: props => styleHelpers.getPositionStyles(props.obj),
	},
	...getTransformControl(customCss),
];

export default getCanvasSettings;
