/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { useBlockEditContext } = wp.blockEditor;
const { Fragment, useEffect, useState } = wp.element;
const { useSelect, useDispatch, select } = wp.data;

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const MaxiBreadcrumbs = () => {
	const { uniqueID, originalNestedBlocks } = useSelect(select => {
		const {
			getSelectedBlockClientId,
			getBlockAttributes,
			getBlockParents,
		} = select('core/block-editor');
		const clientId = getSelectedBlockClientId();
		const attributes = clientId ? getBlockAttributes(clientId) : null;
		const uniqueID = attributes ? attributes.uniqueID : '';
		const originalNestedBlocks = clientId ? getBlockParents(clientId) : [];
		if (!originalNestedBlocks.includes(clientId))
			originalNestedBlocks.push(clientId);
		return {
			uniqueID,
			originalNestedBlocks,
		};
	}, []);

	const { clientId } = useBlockEditContext();

	const { selectBlock } = useDispatch('core/block-editor');

	const [anchorRef, setAnchorRef] = useState(
		document.getElementById(`block-${clientId}`)
	);

	useEffect(() => {
		setAnchorRef(document.getElementById(`block-${clientId}`));
	});

	if (originalNestedBlocks[0] !== clientId) return null;

	const { isRTL } = select('core/editor').getEditorSettings();

	return (
		<Fragment>
			{anchorRef && (
				<Popover
					noArrow
					animate={false}
					position={isRTL ? 'top left right' : 'top right left'}
					focusOnMount={false}
					anchorRef={anchorRef}
					className='maxi-popover maxi-breadcrumbs__popover'
					uniqueid={uniqueID}
					__unstableSticky
					__unstableSlotName='block-toolbar'
					shouldAnchorIncludePadding
				>
					<ul className='maxi-breadcrumbs'>
						{!isEmpty(originalNestedBlocks) &&
							originalNestedBlocks.map((blockId, i) => {
								const blockName = select(
									'core/block-editor'
								).getBlockName(blockId);
								if (!isNil(blockName)) {
									const blockType = select(
										'core/blocks'
									).getBlockType(blockName);
									const { title } = blockType;

									return (
										<li className='maxi-breadcrumbs__item'>
											{i !== 0 && <span>{' > '}</span>}
											<span
												className='maxi-breadcrumbs__item__content'
												target={blockId}
												onClick={() =>
													selectBlock(blockId)
												}
											>
												{title}
											</span>
										</li>
									);
								}

								return null;
							})}
					</ul>
				</Popover>
			)}
		</Fragment>
	);
};

export default MaxiBreadcrumbs;
