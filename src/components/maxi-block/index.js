/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import {
	forwardRef,
	useEffect,
	useState,
	cloneElement,
	memo,
} from '@wordpress/element';
import { select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getHasParallax } from '../../extensions/styles';
import BackgroundDisplayer from '../background-displayer';
import BlockInserter from '../block-inserter';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isArray, compact, isEqual } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const INNER_BLOCKS = ['maxi-blocks/group-maxi', 'maxi-blocks/column-maxi'];

const getBlockClassName = blockName => {
	return `maxi-${blockName
		.replace('maxi-blocks/', '')
		.replace('-maxi', '')}-block`;
};

const MainBlock = forwardRef(
	(
		{
			tagName: TagName = 'div',
			children,
			background,
			disableBackground,
			uniqueID,
			isSave,
			anchorLink,
			...props
		},
		ref
	) => {
		if (isSave)
			return (
				<TagName ref={ref} {...useBlockProps.save(props)}>
					{!isEmpty(anchorLink) && (
						<span id={anchorLink} className='maxi-block-anchor' />
					)}
					{disableBackground && (
						<BackgroundDisplayer
							key={`maxi-background-displayer__${uniqueID}`}
							isSave
							{...background}
						/>
					)}
					{children}
				</TagName>
			);

		return (
			<TagName {...useBlockProps({ ...props, ref })}>
				{!isEmpty(anchorLink) && <span id={anchorLink} />}
				{disableBackground && (
					<BackgroundDisplayer
						key={`maxi-background-displayer__${uniqueID}`}
						{...background}
					/>
				)}
				{children}
			</TagName>
		);
	}
);

const getInnerBlocksChild = ({
	children,
	background,
	disableBackground,
	innerBlocksChildren,
	anchorLink,
	isSave = false,
	uniqueID,
	blockName,
	ref,
	clientId,
	hasInnerBlocks,
	isSelected,
	hasSelectedChild,
	isDragging,
	isHovered,
}) => {
	const needToSplit =
		isArray(children) &&
		children.some(child => child?.props?.afterInnerProps);

	if (!needToSplit)
		return [
			...(!isEmpty(anchorLink) && <span id={anchorLink} />),
			...(disableBackground && (
				<BackgroundDisplayer
					key={`maxi-background-displayer__${uniqueID}`}
					isSave={isSave}
					{...background}
				/>
			)),
			...(children ?? children),
			...cloneElement(innerBlocksChildren, {
				key: `maxi-inner-content__${uniqueID}`,
			}),
			...(!isSave &&
				hasInnerBlocks &&
				!isDragging &&
				blockName !== 'maxi-blocks/row-maxi' && (
					<BlockInserter.WrapperInserter
						key={`maxi-block-wrapper-inserter__${clientId}`}
						ref={ref}
						clientId={clientId}
						isSelected={isSelected}
						hasSelectedChild={hasSelectedChild}
						isHovered={isHovered}
					/>
				)),
		];

	const firstGroup = children.filter(child => !child?.props?.afterInnerProps);
	const secondGroup = children
		.filter(child => child?.props?.afterInnerProps)
		.map(({ props: { afterInnerProps, ...restProps }, ...child }) =>
			cloneElement({ ...child, props: restProps })
		);

	return [
		...(!isEmpty(anchorLink) && <span id={anchorLink} />),
		...(disableBackground && (
			<BackgroundDisplayer
				key={`maxi-background-displayer__${uniqueID}`}
				isSave={isSave}
				{...background}
			/>
		)),
		...firstGroup,
		...cloneElement(innerBlocksChildren, {
			key: `maxi-inner-content__${uniqueID}`,
		}),
		...secondGroup,
		...(!isSave &&
			hasInnerBlocks &&
			!isDragging &&
			blockName !== 'maxi-blocks/row-maxi' && (
				<BlockInserter.WrapperInserter
					key={`maxi-block-wrapper-inserter__${clientId}`}
					ref={ref}
					clientId={clientId}
					isSelected={isSelected}
					hasSelectedChild={hasSelectedChild}
					isHovered={isHovered}
				/>
			)),
	];
};

const InnerBlocksBlock = forwardRef(
	(
		{
			tagName: TagName = 'div',
			children,
			background,
			disableBackground,
			uniqueID,
			blockName,
			isSave,
			anchorLink,
			innerBlocksSettings,
			clientId,
			hasInnerBlocks,
			isSelected,
			hasSelectedChild,
			isDragging,
			isHovered,
			...props
		},
		ref
	) => {
		const blockProps = isSave
			? useBlockProps.save(props)
			: useBlockProps({ ...props, ref });

		const innerBlocksProps = isSave
			? useInnerBlocksProps.save(blockProps)
			: useInnerBlocksProps(blockProps, {
					...innerBlocksSettings,
					wrapperRef: ref,
			  });

		const { children: innerBlocksChildren, ...restInnerBlocksProps } =
			innerBlocksProps;

		const blockChildren = compact(
			getInnerBlocksChild({
				children,
				background,
				disableBackground,
				innerBlocksChildren,
				anchorLink,
				isSave,
				uniqueID,
				blockName,
				ref,
				clientId,
				hasInnerBlocks,
				isSelected,
				hasSelectedChild,
				isDragging,
				isHovered,
			})
		);

		if (isSave)
			return (
				<TagName ref={ref} {...innerBlocksProps}>
					{blockChildren}
				</TagName>
			);

		return <TagName {...restInnerBlocksProps}>{blockChildren}</TagName>;
	}
);

const MaxiBlockContent = forwardRef((props, ref) => {
	const {
		clientId,
		blockName,
		tagName = 'div',
		children,
		blockStyle,
		extraClassName,
		anchorLink,
		uniqueID,
		className,
		displayValue,
		blockFullWidth,
		motion,
		background,
		disableBackground = false,
		isSave = false,
		classes: customClasses,
		paletteClasses,
		hasLink,
		useInnerBlocks = false,
		hasInnerBlocks = false,
		isSelected,
		hasSelectedChild,
		isHovered,
		...extraProps
	} = props;
	// Are just necessary for the memo() part
	delete extraProps.attributes;
	delete extraProps.isChild;

	// Not usable/necessary on save blocks
	const [isDragOverBlock, setIsDragOverBlock] = isSave ? [] : useState(false);

	// Not usable/necessary on save blocks
	const { isDragging, isDraggingOrigin } =
		isSave || (!isSave && !INNER_BLOCKS.includes(blockName))
			? { isDragging: false, isDraggingOrigin: false }
			: useSelect(select => {
					const {
						isDraggingBlocks,
						getDraggedBlockClientIds,
						getBlockParentsByBlockName,
					} = select('core/block-editor');

					const draggedBlockClientIds = getDraggedBlockClientIds();
					const blockParents = getBlockParentsByBlockName(
						draggedBlockClientIds[0],
						INNER_BLOCKS,
						true
					);
					const isDraggingOrigin = blockParents.includes(clientId);

					return {
						isDragging: isDraggingBlocks(),
						isDraggingOrigin,
					};
			  });

	if (!isSave && !INNER_BLOCKS.includes(blockName))
		useEffect(() => {
			if (!isDragging && isDragOverBlock) setIsDragOverBlock(false);
		}, [isDragging]);

	const classes = classnames(
		'maxi-block',
		!isSave && 'maxi-block--backend',
		blockName && getBlockClassName(blockName),
		motion['hover-type'] &&
			motion['hover-type'] !== 'none' &&
			`maxi-hover-effect maxi-hover-effect-${uniqueID}`,
		getHasParallax(background['background-layers']) &&
			`maxi-bg-parallax maxi-bg-parallax-${uniqueID}`,
		motion['number-counter-status'] &&
			`maxi-nc-effect maxi-nc-effect-${uniqueID}`,
		(motion['shape-divider-top-status'] ||
			motion['shape-divider-bottom-status']) &&
			`maxi-sd-effect maxi-sd-effect-${uniqueID}`,
		// blockStyle is included 'maxi-' prefix before #2885, now it's not and we need to add prefix to className
		// to support old blocks, we check if blockStyle has 'maxi-' prefix
		blockStyle && blockStyle.includes('maxi-')
			? blockStyle
			: `maxi-${blockStyle}`,
		extraClassName,
		uniqueID,
		className,
		displayValue === 'none' && 'maxi-block-display-none',
		customClasses,
		paletteClasses,
		hasLink && 'maxi-block--has-link',
		isDragging && isDragOverBlock && 'maxi-block--is-drag-over',
		isHovered && 'maxi-block--is-hovered'
	);

	const blockProps = {
		tagName,
		className: classes,
		'data-align': blockFullWidth,
		ref,
		id: uniqueID,
		key: `maxi-block-${uniqueID}`,
		uniqueID,
		anchorLink,
		background,
		disableBackground: !disableBackground,
		isSave,
		...(INNER_BLOCKS.includes(blockName) && {
			onDragLeave: ({ target }) => {
				if (
					isDragOverBlock &&
					(!ref.current.isSameNode(target) ||
						isDraggingOrigin ||
						!ref.current.contains(target))
				)
					setIsDragOverBlock(false);
			},
			onDragOver: () => {
				const { getBlock } = select('core/block-editor');
				const { innerBlocks } = getBlock(clientId);

				const isLastOnHierarchy = isEmpty(innerBlocks)
					? true
					: innerBlocks.every(
							({ name }) =>
								![
									...INNER_BLOCKS,
									'maxi-blocks/row-maxi',
								].includes(name)
					  );

				if (
					!isDragOverBlock &&
					!isSave &&
					INNER_BLOCKS.includes(blockName) &&
					isLastOnHierarchy
				)
					setIsDragOverBlock(true);
			},
		}),
		...extraProps,
	};

	if (!useInnerBlocks)
		return <MainBlock {...blockProps}>{children}</MainBlock>;

	return (
		<InnerBlocksBlock
			{...blockProps}
			clientId={clientId}
			blockName={blockName}
			hasInnerBlocks={hasInnerBlocks}
			isSelected={isSelected}
			hasSelectedChild={hasSelectedChild}
			isDragging={isDragging}
			isHovered={isHovered}
		>
			{children}
		</InnerBlocksBlock>
	);
});

const MaxiBlock = memo(
	forwardRef((props, ref) => {
		const { clientId } = props;

		const [isHovered, setIsHovered] = useState(false);

		return (
			<MaxiBlockContent
				key={`maxi-block-content__${clientId}`}
				ref={ref}
				onMouseEnter={e => {
					setIsHovered(true);
				}}
				onMouseLeave={() => {
					setIsHovered(false);
				}}
				isHovered={isHovered}
				{...props}
			/>
		);
	}),
	(rawOldProps, rawNewProps) => {
		const { attributes: oldAttr, isSelected: wasSelected } = rawOldProps;

		const { attributes: newAttr, isSelected } = rawNewProps;

		if (!isEqual(oldAttr, newAttr)) return false;

		if (select('core/block-editor').isDraggingBlocks()) return true;

		if (wasSelected !== isSelected) return false;

		const propsCleaner = props => {
			const response = {};

			const propsToClean = [
				'innerBlocksSettings',
				'resizableObject',
				'tagName',
				'background',
				'motion',
				'children',
			];

			Object.entries(props).forEach(([key, value]) => {
				if (
					!propsToClean.includes(key) &&
					typeof value !== 'function' &&
					typeof value !== 'object'
				)
					response[key] = value;
			});

			return response;
		};

		const oldProps = propsCleaner(rawOldProps);
		const newProps = propsCleaner(rawNewProps);

		return isEqual(oldProps, newProps);
	}
);

MaxiBlock.save = props => <MaxiBlockContent {...props} isSave />;

export default MaxiBlock;
