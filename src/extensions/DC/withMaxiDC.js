/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useContext, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import getDCValues from './getDCValues';
import LoopContext from './loopContext';

/**
 * External dependencies
 */
import { onChangeLayer } from '../../components/background-control/utils';
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
			const { attributes, name, setAttributes, clientId } = ownProps;
			const {
				'background-layers': backgroundLayers,
				'background-layers-hover': backgroundLayersHover,
			} = attributes;
			const isDCBlock = DCBlocks.includes(name);

			const contextLoop = useContext(LoopContext)?.contextLoop;
			const dynamicContent =
				isDCBlock && getGroupAttributes(attributes, 'dynamicContent');
			const dynamicContentProps =
				isDCBlock && getDCValues(dynamicContent, contextLoop);

			const contentType = name
				.replace(/maxi-blocks\//, '')
				.replace(/-maxi/, '');

			useEffect(() => {
				if (isDCBlock) {
					fetchAndUpdateDCData(
						attributes,
						setAttributes,
						contextLoop,
						contentType,
						clientId
					).catch(console.error);
				}

				[...backgroundLayers, ...backgroundLayersHover]?.forEach(
					layer => {
						if (
							layer &&
							layer.type === 'image' &&
							layer['dc-status']
						) {
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
						}
					}
				);
			}, [
				contextLoop,
				dynamicContentProps,
				backgroundLayers,
				backgroundLayersHover,
			]);

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
