/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const MaxiModal = loadable(() => import('../../editor/library/modal'));
const SizeAndPositionLayerControl = loadable(() =>
	import('./sizeAndPositionLayerControl')
);
const SVGFillControl = loadable(() => import('../svg-fill-control'));
import { getBlockStyle } from '../../extensions/styles';

const SVGLayer = props => {
	const {
		clientId,
		layerOrder,
		onChange,
		breakpoint,
		prefix = '',
		isHover = false,
		isLayer = false,
	} = props;

	const SVGOptions = cloneDeep(props.SVGOptions);
	const isLayerHover = SVGOptions.isHover;

	const SVGElement = SVGOptions[`${prefix}background-svg-SVGElement`];

	return (
		<>
			{(!isHover || (isHover && isLayerHover)) && (
				<MaxiModal
					type='bg-shape'
					style={getBlockStyle(clientId)}
					onRemove={obj => {
						if (layerOrder) {
							delete SVGOptions[
								`${prefix}background-svg-SVGElement`
							];
							delete SVGOptions[
								`${prefix}background-svg-SVGData`
							];
						}
						onChange({ ...SVGOptions, ...obj });
					}}
					layerOrder={layerOrder}
					icon={SVGElement}
					onSelect={obj => onChange(obj)}
				/>
			)}
			{!isEmpty(SVGElement) && (
				<>
					<SVGFillControl
						SVGOptions={SVGOptions}
						onChange={onChange}
						clientId={clientId}
						isHover={isHover}
						isLayer
						breakpoint={breakpoint}
					/>
					<SizeAndPositionLayerControl
						prefix={prefix}
						options={SVGOptions}
						onChange={onChange}
						isHover={isHover}
						isLayer={isLayer}
						breakpoint={breakpoint}
						onlyWidth
					/>
				</>
			)}
		</>
	);
};

export default SVGLayer;
