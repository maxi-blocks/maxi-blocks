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
	const { originalNestedBlocks } = useSelect(select => {
		const { getSelectedBlockClientId, getBlockParents } =
			select('core/block-editor');
		const clientId = getSelectedBlockClientId();
		const originalNestedBlocks = clientId
			? [...getBlockParents(clientId)]
			: [];
		if (!originalNestedBlocks.includes(clientId))
			originalNestedBlocks.push(clientId);
		return {
			originalNestedBlocks,
		};
	}, []);

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
					const block = select('core/block-editor').getBlock(blockId);
					const hasInteraction = !isEmpty(block?.attributes?.relations);
					
					// Debug logging
					if (hasInteraction) {
						console.log('MaxiBlocks Breadcrumbs: Block has interaction', {
							blockId,
							title,
							relations: block?.attributes?.relations
						});
					}

					return (
						<li
							key={`maxi-breadcrumbs__item-${blockId}`}
							className={classnames(
								'maxi-breadcrumbs__item',
								hasInteraction && 'maxi-breadcrumbs__item--has-interaction'
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
