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
	PaddingControl,
} from '../../components';
import {
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getMarginPaddingStyles,
	getSizeStyles,
} from '../styles/helpers';
import { getGroupAttributes, getLastBreakpointAttribute } from '../styles';
import { getEditorWrapper } from '../dom';

/**
 * External dependencies
 */
import { isEmpty, isEqual, pickBy } from 'lodash';

const getCanvasSettings = ({ name }) => [
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
			const { attributes, onChange, blockAttributes } = props;
			const { 'background-layers': currentBgLayers } = attributes;
			const { 'background-layers': blockBgLayers } = blockAttributes;

			return !isEmpty(currentBgLayers) ? (
				<BlockBackgroundControl
					{...props}
					onChange={obj => {
						const { 'background-layers': bgLayers, ...rest } = obj;
						const newBgLayers = bgLayers.map((bgLayer, index) => {
							const newBgLayer = pickBy(
								bgLayer,
								(_value, key) =>
									!key.includes('mediaID') &&
									!key.includes('mediaURL')
							);

							return Object.fromEntries(
								Object.entries(newBgLayer).filter(
									([key, attr]) =>
										!isEqual(
											attr,
											blockBgLayers[index][key]
										)
								)
							);
						});

						onChange({
							...rest,
							'background-layers': newBgLayers,
						});
					}}
					getBounds={() =>
						getEditorWrapper()
							.querySelector(`.${props.attributes.uniqueID}`)
							.getBoundingClientRect()
					}
					getBlockClipPath={layerID => {
						const layerAttributes = Object.values(
							props.blockAttributes['background-layers']
						).find(({ id }) => id === layerID);
						return getGroupAttributes(
							layerAttributes,
							'clipPath',
							false,
							`background-${layerAttributes.type}-`
						);
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
		hoverProp: 'box-shadow-status-hover',
		attrGroupName: 'boxShadow',
		component: props => <BoxShadowControl {...props} />,
		helper: props => getBoxShadowStyles(props),
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
];

export default getCanvasSettings;
