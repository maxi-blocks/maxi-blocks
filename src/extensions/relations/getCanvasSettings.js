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
} from '@components';
import {
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getMarginPaddingStyles,
	getSizeStyles,
} from '@extensions/styles/helpers';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getPaletteAttributes,
} from '@extensions/styles';
import { getEditorWrapper } from '@extensions/dom';
import getRelatedAttributes from './getRelatedAttributes';

/**
 * External dependencies
 */
import { isEmpty, isEqual, pickBy, isNil } from 'lodash';

const getCanvasSettings = ({ name }) => [
	{
		sid: 'bgl',
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
			const { attributes, onChange, blockAttributes, isBeforeSetting } =
				props;
			const { 'background-layers': currentBgLayers } = attributes;
			const { 'background-layers': blockBgLayers } = blockAttributes;

			// Start tab directly updates block attributes, so pass
			// onChange through without stripping media keys or diffing.
			const ibOnChange = isBeforeSetting
				? onChange
				: obj => {
						const { 'background-layers': bgLayers, ...rest } = obj;
						const newBgLayers = bgLayers.map(
							(bgLayer, index) => {
								const newBgLayer = pickBy(
									bgLayer,
									(_value, key) =>
										!key.includes('mediaID') &&
										!key.includes('mediaURL')
								);

								const IBAttributes = newBgLayer
									? Object.fromEntries(
											Object.entries(
												newBgLayer
											).filter(
												([key, attr]) =>
													!isEqual(
														attr,
														blockBgLayers[index][
															key
														]
													)
											)
									  )
									: {};

								const { order, type } =
									blockBgLayers[index];

								return {
									...getRelatedAttributes({
										props: blockBgLayers[index],
										IBAttributes,
										relatedAttributes: [
											'background-gradient-opacity',
											'background-gradient',
										],
									}),
									order,
									type,
								};
							}
						);

						onChange({
							...rest,
							'background-layers': newBgLayers,
						});
				  };

			return !isEmpty(currentBgLayers) ? (
				<BlockBackgroundControl
					{...props}
					onChange={ibOnChange}
					getBounds={() =>
						getEditorWrapper()
							.querySelector(`.${props.attributes.uniqueID}`)
							.getBoundingClientRect()
					}
					getBlockClipPath={layerID => {
						const layerAttributes = Object.values(
							props.blockAttributes['background-layers']
						).find(({ sid }) => sid === layerID);
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
		styleAttrs: [
			'type',
			'order',
			'id',
			'background-color-clip-path-status',
		],
	},
	{
		sid: 'b',
		label: __('Border', 'maxi-blocks'),
		transitionTarget: ['', ' > .maxi-background-displayer'],
		hoverProp: 'border-status-hover',
		attrGroupName: ['border', 'borderWidth', 'borderRadius'],
		component: props => <BorderControl {...props} />,
		helper: props => getBorderStyles(props),
		forceTempPalette: (attributes, breakpoint) => {
			const borderStyle = getLastBreakpointAttribute({
				target: 'border-style',
				attributes,
				breakpoint,
			});

			return borderStyle && borderStyle === 'none';
		},
		styleAttrs: ['border-style'],
	},
	{
		sid: 'bs',
		label: __('Box shadow', 'maxi-blocks'),
		hoverProp: 'box-shadow-status-hover',
		attrGroupName: 'boxShadow',
		component: props => <BoxShadowControl {...props} />,
		helper: props => getBoxShadowStyles(props),
		relatedAttributes: [
			'box-shadow-inset',
			'box-shadow-horizontal',
			'box-shadow-horizontal-unit',
			'box-shadow-vertical',
			'box-shadow-vertical-unit',
			'box-shadow-blur',
			'box-shadow-blur-unit',
			'box-shadow-spread',
			'box-shadow-spread-unit',
		],
		forceTempPalette: (attributes, breakpoint, IBAttributes) => {
			const paletteAttributes = getPaletteAttributes({
				obj: IBAttributes,
				prefix: 'box-shadow-',
				breakpoint,
			});

			return Object.values(paletteAttributes).every(attr => isNil(attr));
		},
		forceTempPalettePrefix: 'box-shadow-',
	},
	{
		sid: 's',
		label: __('Height / Width', 'maxi-blocks'),
		attrGroupName: 'size',
		component: props => {
			const isBlockFullWidth = getLastBreakpointAttribute({
				target: 'full-width',
				breakpoint: props.breakpoint,
				attributes: getGroupAttributes(props, 'size'),
			});

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
		styleAttrs: ['size-advanced-options'],
	},
	{
		sid: 'mp',
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
