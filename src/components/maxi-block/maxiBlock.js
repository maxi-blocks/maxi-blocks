/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import {
	forwardRef,
	useEffect,
	useState,
	memo,
	useCallback,
	useReducer,
} from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getHasParallax,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import InnerBlocksBlock from './innerBlocksBlock';
import MainMaxiBlock from './mainMaxiBlock';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isEqual } from 'lodash';

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

const getMarginStyles = (attributes, breakpoint) => {
	const marginTop =
		getLastBreakpointAttribute({
			target: 'margin-top',
			breakpoint,
			attributes,
		}) || 0;
	const marginTopUnit =
		getLastBreakpointAttribute({
			target: 'margin-top-unit',
			breakpoint,
			attributes,
		}) || 'px';
	const marginBottom =
		getLastBreakpointAttribute({
			target: 'margin-bottom',
			breakpoint,
			attributes,
		}) || 0;
	const marginBottomUnit =
		getLastBreakpointAttribute({
			target: 'margin-bottom-unit',
			breakpoint,
			attributes,
		}) || 'px';

	return {
		marginTop: `calc(${marginTop}${marginTopUnit} + 50px)`,
		marginBottom: `calc(${marginBottom}${marginBottomUnit} + 50px)`,
	};
};

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

	// To forbid the use of links for container blocks from having links when their child has one
	if (!isSave && useInnerBlocks && hasLink) {
		let childHasLink = false;
		const children = select('core/block-editor').getClientIdsOfDescendants([
			clientId,
		]);

		for (const child of children) {
			const attributes =
				select('core/block-editor').getBlockAttributes(child);

			if (
				!isEmpty(attributes.linkSettings?.url) ||
				(select('core/block-editor').getBlockName(child) ===
					'maxi-blocks/text-maxi' &&
					attributes.content.includes('<a '))
			) {
				childHasLink = true;
				break;
			}
		}
		if (childHasLink) {
			dispatch('core/block-editor').updateBlockAttributes(clientId, {
				linkSettings: {
					...extraProps.attributes.linkSettings,
					disabled: true,
				},
			});
		} else if (extraProps.attributes.linkSettings.disabled) {
			dispatch('core/block-editor').updateBlockAttributes(clientId, {
				linkSettings: {
					...extraProps.attributes.linkSettings,
					disabled: false,
				},
			});
		}
	}

	// To preserve some space between first hierarchy blocks, we allow introducing inline styles on the block;
	// that way, blue button for adding new blocks appears in the right place.
	const { isFirstOnHierarchy } = extraProps.attributes;
	const marginStyles = getMarginStyles(
		extraProps.attributes,
		extraProps.deviceType
	);

	// Are just necessary for the memo() part
	delete extraProps.attributes;
	delete extraProps.isChild;
	delete extraProps.deviceType;
	delete extraProps.context;

	// Not usable/necessary on save blocks
	const [isDragOverBlock, setIsDragOverBlock] = isSave ? [] : useState(false);

	const {
		isDraggingBlocks,
		getDraggedBlockClientIds,
		getBlockParentsByBlockName,
	} = select('core/block-editor');

	const isDragging = isDraggingBlocks();

	const draggedBlockClientIds = getDraggedBlockClientIds();
	const blockParents = getBlockParentsByBlockName(
		draggedBlockClientIds[0],
		INNER_BLOCKS,
		true
	);
	const isDraggingOrigin = blockParents.includes(clientId);

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
			: `maxi-${blockStyle ?? 'light'}`,
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

	const onDragLeave = isSave
		? null
		: useCallback(({ target }) => {
				if (
					isDragOverBlock &&
					(!ref.current.isSameNode(target) ||
						isDraggingOrigin ||
						!ref.current.contains(target))
				)
					setIsDragOverBlock(false);
		  }, []);

	const onDragOver = isSave
		? null
		: useCallback(() => {
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
		  }, []);

	const blockProps = {
		tagName,
		className: classes,
		ref,
		id: uniqueID,
		key: `maxi-block-${uniqueID}`,
		uniqueID,
		anchorLink,
		background,
		disableBackground: !disableBackground,
		isSave,
		...(isFirstOnHierarchy && { style: marginStyles }),
		...(!isSave &&
			INNER_BLOCKS.includes(blockName) && {
				onDragLeave,
				onDragOver,
			}),
		...extraProps,
	};

	if (!useInnerBlocks)
		return <MainMaxiBlock {...blockProps}>{children}</MainMaxiBlock>;

	return (
		<InnerBlocksBlock
			{...blockProps}
			clientId={clientId}
			blockName={blockName}
			hasInnerBlocks={hasInnerBlocks}
			isSelected={isSelected}
			hasSelectedChild={hasSelectedChild}
		>
			{children}
		</InnerBlocksBlock>
	);
});

const MaxiBlock = memo(
	forwardRef((props, ref) => {
		const { clientId } = props;

		const [isHovered, setHovered] = useReducer(e => !e, false);

		return (
			<MaxiBlockContent
				key={`maxi-block-content__${clientId}`}
				ref={ref}
				onMouseEnter={setHovered}
				onMouseLeave={setHovered}
				isHovered={isHovered}
				{...props}
			/>
		);
	}),
	(rawOldProps, rawNewProps) => {
		const {
			attributes: oldAttr,
			isSelected: wasSelected,
			deviceType: oldDeviceType,
			context: oldContext,
		} = rawOldProps;

		const {
			attributes: newAttr,
			isSelected,
			deviceType: newDeviceType,
			context,
		} = rawNewProps;

		if (!isEqual(oldAttr, newAttr)) return false;

		if (select('core/block-editor').isDraggingBlocks()) return true;

		if (wasSelected !== isSelected) return false;

		if (!isEqual(oldDeviceType, newDeviceType)) return false;

		if (!isEqual(oldContext, context)) return false;

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
