/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useContext,
	useEffect,
	useMemo,
	useCallback,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import LoopContext from './loopContext';

/**
 * External dependencies
 */
import { onChangeLayer } from '@components/background-control/utils';
import fetchAndUpdateDCData from './fetchAndUpdateDCData';

// List of blocks that have dynamic content
const DCBlocks = [
	'maxi-blocks/text-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/divider-maxi',
];

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			if (!ownProps) {
				return null;
			}
			const { attributes, name, setAttributes, clientId } = ownProps;
			const {
				'background-layers': backgroundLayers,
				'background-layers-hover': backgroundLayersHover,
			} = attributes;

			const isDCBlock = useMemo(() => DCBlocks.includes(name), [name]);
			const contextLoop = useContext(LoopContext)?.contextLoop;
			const dynamicContent =
				isDCBlock && getGroupAttributes(attributes, 'dynamicContent');
			const contentType = useMemo(
				() => name.replace(/maxi-blocks\//, '').replace(/-maxi/, ''),
				[name]
			);

			const fetchDCData = useCallback(
				(
					attributes,
					setAttributes,
					contextLoop,
					contentType,
					clientId
				) => {
					fetchAndUpdateDCData(
						attributes,
						setAttributes,
						contextLoop,
						contentType,
						clientId
					).catch(console.error);
				},
				[]
			);

			const fetchDCDataForLayer = useCallback(
				(
					layer,
					setAttributes,
					backgroundLayersHover,
					backgroundLayers,
					contextLoop,
					clientId
				) => {
					fetchAndUpdateDCData(
						layer,
						obj =>
							onChangeLayer(
								{ ...layer, ...obj },
								setAttributes,
								backgroundLayersHover,
								backgroundLayers
							),
						contextLoop,
						'image',
						clientId
					).catch(console.error);
				},
				[]
			);

			useEffect(() => {
				if (isDCBlock) {
					fetchDCData(
						attributes,
						setAttributes,
						contextLoop,
						contentType,
						clientId
					);
				}

				[...backgroundLayers, ...backgroundLayersHover]?.forEach(
					layer => {
						if (
							layer &&
							layer.type === 'image' &&
							layer['dc-status']
						) {
							fetchDCDataForLayer(
								layer,
								setAttributes,
								backgroundLayersHover,
								backgroundLayers,
								contextLoop,
								clientId
							);
						}
					}
				);
			}, [
				isDCBlock,
				contextLoop,
				contentType,
				clientId,
				backgroundLayers,
				backgroundLayersHover,
				setAttributes,
				fetchDCData,
				fetchDCDataForLayer,
				dynamicContent,
			]);

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
