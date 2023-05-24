/**
 * Internal dependencies
 */
import MaxiModal from '../../editor/library/modal';
import SizeAndPositionLayerControl from './sizeAndPositionLayerControl';
import SVGFillControl from '../svg-fill-control';
import {
	getAttributeKey,
	getAttributesValue,
	getBlockStyle,
} from '../../extensions/attributes';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

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

	const SVGElement = getAttributesValue({
		target: 'bsv_se',
		props: SVGOptions,
		prefix,
	});

	return (
		<>
			{(!isHover || (isHover && isLayerHover)) && (
				<MaxiModal
					type='bg-shape'
					style={getBlockStyle(clientId)}
					onRemove={obj => {
						if (layerOrder) {
							delete SVGOptions[
								getAttributeKey({ key: 'bsv_se', prefix })
							];
							delete SVGOptions[
								getAttributeKey({ key: 'bsv_sd', prefix })
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
					<SizeAndPositionLayerControl
						prefix={prefix}
						options={SVGOptions}
						onChange={onChange}
						isHover={isHover}
						isLayer={isLayer}
						breakpoint={breakpoint}
					/>
				</>
			)}
		</>
	);
};

export default SVGLayer;
