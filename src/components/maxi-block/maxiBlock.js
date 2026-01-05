/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useReducer,
	useState,
} from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getHasParallax,
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '@extensions/styles';
import { getIsHoverPreview } from '@extensions/maxi-block';
import InnerBlocksBlock from './innerBlocksBlock';
import MainMaxiBlock from './mainMaxiBlock';
import { inlineLinkFields } from '@extensions/DC/constants';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isEqual, isNil } from 'lodash';
import mobile from 'is-mobile';

/**
 * Styles
 */
import './editor.scss';

const INNER_BLOCKS = ['maxi-blocks/group-maxi', 'maxi-blocks/column-maxi'];

const DISALLOWED_BREAKPOINTS = ['m', 's', 'xs'];

const getBlockClassName = blockName => {
	return `maxi-${blockName
		.replace('maxi-blocks/', '')
		.replace('-maxi', '')}-block`;
};

const getBlockStyle = (attributes, breakpoint, marginValue) => {
	if (!marginValue) return '';
	const getValue = target =>
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes,
		});

	const isFullWidth = getValue('full-width');

	if (!isFullWidth) return '';

	// Margin
	const marginRight = getValue('margin-right') || 0;
	const marginRightUnit = getValue('margin-right-unit') || 'px';
	const marginLeft = getValue('margin-left') || 0;
	const marginLeftUnit = getValue('margin-left-unit') || 'px';
	const marginRightString = `${
		marginRight === 'auto' ? 0 : marginRight
	}${marginRightUnit}`;
	const marginLeftString = `${
		marginLeft === 'auto' ? 0 : marginLeft
	}${marginLeftUnit}`;

	// Width
	const width = getValue('width');
	const widthUnit = getValue('width-unit');
	const maxWidth = getValue('max-width');
	const maxWidthUnit = getValue('max-width-unit');

	return Object.entries({
		'margin-right': `calc(${marginRightString} - ${marginValue}px) !important`,
		'margin-left': `calc(${marginLeftString} - ${marginValue}px) !important`,
		width: `calc(${
			isFullWidth || isNil(width) ? '100%' : `${width}${widthUnit}`
		} + ${marginValue * 2}px)`,
		'max-width': `calc(${
			isFullWidth || isNil(maxWidth)
				? '100%'
				: `${maxWidth}${maxWidthUnit}`
		} + ${marginValue * 2}px)`,
	})
		.map(([key, value]) => `${key}: ${value};`)
		.join('');
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
		isRepeater,
		isSelected,
		hasSelectedChild,
		isHovered,
		isChild,
		dcStatus,
		dcHide,
		pagination = false,
		dcLinkStatus,
		dcLinkTarget,
		showLoader,
		attributes,
		deviceType,
		baseBreakpoint,
		...extraProps
	} = props;

	// Gets if the block is full-width
	const isFullWidth = getLastBreakpointAttribute({
		target: 'full-width',
		breakpoint: deviceType,
		attributes,
	});

	// Gets if the block has to be disabled due to the device type
	const isDisabled =
		DISALLOWED_BREAKPOINTS.includes(baseBreakpoint) &&
		mobile({ tablet: true });

	// Unselect the block if it's disabled
	if (isDisabled && isSelected)
		setTimeout(() => {
			dispatch('core/block-editor').selectBlock();
		}, 0);

	// Are just necessary for the memo() part
	delete extraProps.deviceType;
	delete extraProps.baseBreakpoint;
	delete extraProps.context;
	delete extraProps.state;

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
		}, [isDragging, isDragOverBlock, setIsDragOverBlock]);

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
		// Hidden handling
		displayValue === 'none' && 'maxi-block--hidden',
		customClasses,
		paletteClasses,
		hasLink &&
			// For links that are rendered in content instead of whole block don't add class
			(!inlineLinkFields.includes(dcLinkTarget) || !dcLinkStatus) &&
			'maxi-block--has-link',
		isDragging && isDragOverBlock && 'maxi-block--is-drag-over',
		isHovered && 'maxi-block--is-hovered',
		isRepeater && 'maxi-block--repeater',
		(isDisabled || showLoader) && 'maxi-block--disabled',
		!isSave && isFullWidth && 'maxi-block--full-width',
		!isSave && !isEmpty(attributes?.relations) && 'maxi-block--interaction',
		!isSave &&
			!isEmpty(
				background?.['background-layers']?.filter(
					layer => layer.type !== 'color'
				)
			) &&
			'maxi-block--background',
		isSave && dcStatus && dcHide && '$class-to-replace'
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
		isChild,
		isDisabled,
		showLoader,
		isSave,
		...(!isSave &&
			INNER_BLOCKS.includes(blockName) && {
				onDragLeave,
				onDragOver,
			}),
		...extraProps,
		...(pagination && {
			paginationProps: getGroupAttributes(
				props?.attributes,
				'contextLoop'
			),
		}),
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
			pagination={pagination}
		>
			{children}
		</InnerBlocksBlock>
	);
});

const MaxiBlock = memo(
	forwardRef((props, ref) => {
		const {
			clientId,
			attributes,
			deviceType,
			baseBreakpoint,
			context,
			state,
			isSelected,
		} = props;
		const pagination = attributes?.['cl-pagination'];

		const [isHovered, setHovered] = useReducer(e => !e, false);

		const isHoverPreview = getIsHoverPreview();

		const marginValue = !isHoverPreview
			? select('maxiBlocks/styles').getBlockMarginValue()
			: 0;

		// In order to keep the structure that Gutenberg uses for the block,
		// is necessary to add some inline styles to the first hierarchy blocks.
		const { isFirstOnHierarchy } = attributes;
		const styleStr = getBlockStyle(attributes, deviceType, marginValue);

		useEffect(() => {
			if (isFirstOnHierarchy && styleStr) {
				const style = document.createElement('style');
				style.innerHTML = `#block-${clientId} { ${styleStr} }`;
				// Same full-width styles for the reusable blocks
				style.innerHTML += `.is-reusable:has(#block-${clientId}) { ${styleStr} }`;
				ref.current.ownerDocument.head.appendChild(style);

				return () => {
					style.remove();
				};
			}

			return () => {};
		}, [styleStr, isFirstOnHierarchy, clientId, ref]);

		return (
			<MaxiBlockContent
				key={`maxi-block-content__${clientId}`}
				ref={ref}
				onMouseEnter={setHovered}
				onMouseLeave={setHovered}
				isHovered={isHovered}
				pagination={pagination}
				{...props}
				attributes={attributes}
				deviceType={deviceType}
				context={context}
				state={state}
				isSelected={isSelected}
				baseBreakpoint={baseBreakpoint}
			/>
		);
	}),
	(rawOldProps, rawNewProps) => {
		const {
			attributes: oldAttr,
			isSelected: wasSelected,
			deviceType: oldDeviceType,
			context: oldContext,
			state: oldState,
		} = rawOldProps;

		const {
			attributes: newAttr,
			isSelected,
			deviceType: newDeviceType,
			context,
			state,
		} = rawNewProps;

		// Check differences between attributes
		if (!isEqual(oldAttr, newAttr)) return false;

		if (select('core/block-editor').isDraggingBlocks()) return true;

		if (wasSelected !== isSelected) return false;

		if (!isEqual(oldDeviceType, newDeviceType)) return false;

		if (!isEqual(oldContext, context)) return false;

		if (!isEqual(oldState, state)) return false;

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
