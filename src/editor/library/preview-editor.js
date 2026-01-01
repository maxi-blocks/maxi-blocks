/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { rawHandler } from '@wordpress/blocks';
import { RawHTML, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SelectEditOverlay from '@components/select-edit-overlay';

const buildBlockTree = (blocks, path = []) =>
	blocks.map((block, index) => {
		const blockId = [...path, index].join('-');

		return {
			...block,
			__maxiId: blockId,
			innerBlocks: buildBlockTree(block.innerBlocks || [], [
				...path,
				index,
			]),
		};
	});

const renderBlockContent = ({ block, renderBlock }) => {
	const { innerContent = [], innerBlocks = [] } = block;
	let childIndex = 0;

	return innerContent.map((item, index) => {
		if (item === null) {
			const child = innerBlocks[childIndex];
			childIndex += 1;

			if (!child) return null;

			return renderBlock(child);
		}

		return (
			<RawHTML key={`${block.__maxiId}-chunk-${index}`}>{item}</RawHTML>
		);
	});
};

const PreviewEditor = ({ gutenbergCode }) => {
	const [selectedBlockId, setSelectedBlockId] = useState(null);
	const [selectedBlockData, setSelectedBlockData] = useState(null);

	const blocks = useMemo(() => {
		if (!gutenbergCode) return [];
		const cleanedCode = gutenbergCode.replace(/\\u002d/g, '-');

		const parsedBlocks = rawHandler({
			HTML: cleanedCode,
			mode: 'BLOCKS',
		});

		return buildBlockTree(parsedBlocks);
	}, [gutenbergCode]);

	const handleSelectBlock = block => {
		setSelectedBlockId(block.__maxiId);
		setSelectedBlockData(block);
	};

	const renderBlock = block => (
		<div
			key={block.__maxiId}
			className='maxi-cloud-editor-preview__block'
			data-block-id={block.__maxiId}
			data-block-name={block.name}
			onClick={event => {
				event.stopPropagation();
				handleSelectBlock(block);
			}}
			onKeyDown={event => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					handleSelectBlock(block);
				}
			}}
			role='button'
			tabIndex={0}
		>
			<SelectEditOverlay isSelected={selectedBlockId === block.__maxiId} />
			<div className='maxi-cloud-editor-preview__block-content'>
				{renderBlockContent({ block, renderBlock })}
			</div>
		</div>
	);

	return (
		<div className='maxi-cloud-editor-preview'>
			<div className='maxi-cloud-editor-preview__canvas'>
				{blocks.length ? (
					blocks.map(block => renderBlock(block))
				) : (
					<div className='maxi-cloud-editor-preview__empty'>
						{__('No preview available.', 'maxi-blocks')}
					</div>
				)}
			</div>
			<div className='maxi-cloud-editor-preview__meta'>
				<div className='maxi-cloud-editor-preview__meta-header'>
					{__('Block metadata', 'maxi-blocks')}
				</div>
				{selectedBlockData ? (
					<>
						<div className='maxi-cloud-editor-preview__meta-name'>
							{selectedBlockData.name}
						</div>
						<pre className='maxi-cloud-editor-preview__meta-attributes'>
							{JSON.stringify(
								selectedBlockData.attributes ?? {},
								null,
								2
							)}
						</pre>
					</>
				) : (
					<div className='maxi-cloud-editor-preview__meta-empty'>
						{__(
							'Select a block to view its attributes.',
							'maxi-blocks'
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewEditor;
