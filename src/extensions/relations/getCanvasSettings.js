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
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../attributes';
import { getEditorWrapper } from '../dom';

/**
 * External dependencies
 */
import { isEmpty, isEqual, pickBy } from 'lodash';

const getCanvasSettings = ({ name }) => [
	{
		label: __('Background / Layer', 'maxi-blocks'),
		transitionTarget: ' > .maxi-background-displayer > div',
		hoverProp: 'bb.sh',
		attrGroupName: [
			'blockBackground',
			'border',
			'borderWidth',
			'borderRadius',
		],
		component: props => {
			const { attributes, onChange, blockAttributes } = props;
			const currentBgLayers = getAttributesValue({
				target: 'b_ly',
				props: attributes,
			});
			const blockBgLayers = getAttributesValue({
				target: 'b_ly',
				props: blockAttributes,
			});

			return !isEmpty(currentBgLayers) ? (
				<BlockBackgroundControl
					{...props}
					onChange={obj => {
						const { b_ly: bgLayers, ...rest } = obj;
						const newBgLayers = bgLayers.map((bgLayer, index) => {
							const newBgLayer = pickBy(
								bgLayer,
								(_value, key) =>
									!key.includes('_mi') && !key.includes('_mu')
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
							b_ly: newBgLayers,
						});
					}}
					getBounds={() =>
						getEditorWrapper()
							.querySelector(`.${props.attributes._uid}`)
							.getBoundingClientRect()
					}
					getBlockClipPath={layerID => {
						const layerAttributes = Object.values(
							props.blockAttributes.b_ly
						).find(({ id }) => id === layerID);
						return getGroupAttributes(
							layerAttributes,
							'clipPath',
							false,
							`b${
								layerAttributes.type === 'svg'
									? 'sv'
									: layerAttributes.type?.[0]
							}-`
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
		hoverProp: 'bo.sh',
		attrGroupName: ['border', 'borderWidth', 'borderRadius'],
		component: props => <BorderControl {...props} />,
		helper: props => getBorderStyles(props),
	},
	{
		label: __('Box shadow', 'maxi-blocks'),
		hoverProp: 'bs.sh',
		attrGroupName: 'boxShadow',
		component: props => <BoxShadowControl {...props} />,
		helper: props => getBoxShadowStyles(props),
	},
	{
		label: __('Height / Width', 'maxi-blocks'),
		attrGroupName: 'size',
		component: props => {
			const fullWidth = getLastBreakpointAttribute({
				target: '_fw',
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
