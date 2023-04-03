/**
 * Internal dependencies
 */
import MaxiModal from '../../editor/library/modal';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import SVGFillControl from '../svg-fill-control';
import { getBlockStyle } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';
import { ImageShapeResponsiveSettings } from '../image-shape';

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
						breakpoint={breakpoint}
					/>
					<ImageShapeResponsiveSettings
						prefix='background-svg-'
						onChange={onChange}
						breakpoint={breakpoint}
						{...SVGOptions}
						isHover={isHover}
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
