/**
 * WordPress dependencies
 */
import { useSelect, useDispatch, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const MaxiBreadcrumbs = ({ repeaterStatus }) => {
	const { originalNestedBlocks, blocksData } = useSelect(select => {
		const { getSelectedBlockClientId, getBlockParents, getBlock } =
			select('core/block-editor');
		const clientId = getSelectedBlockClientId();
		const originalNestedBlocks = clientId
			? [...getBlockParents(clientId)]
			: [];
		if (!originalNestedBlocks.includes(clientId))
			originalNestedBlocks.push(clientId);
		
		// Get blocks data to make component reactive to attribute changes
		const blocksData = originalNestedBlocks.map(blockId => {
			const block = getBlock(blockId);
			return {
				id: blockId,
				relations: block?.attributes?.relations,
				backgroundLayers: block?.attributes?.['background-layers']?.filter(
					layer => layer.type !== 'color'
				)
			};
		});
		
		return {
			originalNestedBlocks,
			blocksData,
		};
	});

	const { selectBlock } = useDispatch('core/block-editor');

	if (originalNestedBlocks.length <= 1) return null;

	return (
		<ul
			className={classnames(
				'maxi-breadcrumbs',
				repeaterStatus && 'maxi-breadcrumbs--repeater'
			)}
		>
			{originalNestedBlocks.map(blockId => {
				const blockName =
					select('core/block-editor').getBlockName(blockId);
				if (!isNil(blockName)) {
					const blockType =
						select('core/blocks').getBlockType(blockName);
					const { title } = blockType;
					
					// Check if block has interactions
					const blockData = blocksData.find(data => data.id === blockId);
					const hasInteraction = !isEmpty(blockData?.relations);
					
					// Check if block has background layers
					const hasBackgroundLayers = !isEmpty(blockData?.backgroundLayers);

					return (
						<li
							key={`maxi-breadcrumbs__item-${blockId}`}
							className={classnames(
								'maxi-breadcrumbs__item',
								hasInteraction && 'maxi-breadcrumbs__item--has-interaction',
								hasBackgroundLayers && 'maxi-breadcrumbs__item--has-background'
							)}
						>
							<span
								className='maxi-breadcrumbs__item__content'
								target={blockId}
								onClick={() => selectBlock(blockId)}
							>
								{title}
							</span>
						</li>
					);
				}

				return null;
			})}
		</ul>
	);
};

export default MaxiBreadcrumbs;
