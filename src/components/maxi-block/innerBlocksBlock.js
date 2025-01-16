/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { forwardRef, cloneElement, memo } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BackgroundDisplayer from '@components/background-displayer';
import BlockInserter from '@components/block-inserter';
import DisabledMaxiBlock from './disabledMaxiBlock';
import Pagination from './pagination';
import ContentLoader from '@components/content-loader';

/**
 * External dependencies
 */
import { isEmpty, isArray, compact, isEqual } from 'lodash';

const getInnerBlocksChild = ({
	children,
	background,
	disableBackground,
	innerBlocksChildren,
	anchorLink,
	isSave = false,
	uniqueID,
	ref,
	clientId,
	hasInnerBlocks,
	isSelected,
	hasSelectedChild,
	renderWrapperInserter = true,
	isChild,
	isDisabled,
}) => {
	const needToSplit =
		isArray(children) &&
		children.some(child => child?.props?.afterInnerProps);

	const showWrapperInserter =
		!isSave && hasInnerBlocks && renderWrapperInserter;

	if (!needToSplit)
		return [
			...(isDisabled && !isChild && (
				<DisabledMaxiBlock key={`maxi-block-disabled__${uniqueID}`} />
			)),
			...(!isEmpty(anchorLink) && (
				<span
					id={anchorLink}
					className='maxi-block-anchor'
					key={`maxi-block-anchor-${anchorLink}`}
				/>
			)),
			...(disableBackground && (
				<BackgroundDisplayer
					key={`maxi-background-displayer__${uniqueID}`}
					isSave={isSave}
					{...background}
				/>
			)),
			...(children ?? children),
			...(!!innerBlocksChildren &&
				cloneElement(innerBlocksChildren, {
					key: `maxi-inner-content__${uniqueID}`,
				})),
			...(showWrapperInserter && (
				<BlockInserter.WrapperInserter
					key={`maxi-block-wrapper-inserter__${clientId}`}
					ref={ref}
					clientId={clientId}
					isSelected={isSelected}
					hasSelectedChild={hasSelectedChild}
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
		...(isDisabled && !isChild && (
			<DisabledMaxiBlock key={`maxi-block-disabled__${uniqueID}`} />
		)),
		...(!isEmpty(anchorLink) && (
			<span
				id={anchorLink}
				className='maxi-block-anchor'
				key={`maxi-block-anchor-${anchorLink}`}
			/>
		)),
		...(disableBackground && (
			<BackgroundDisplayer
				key={`maxi-background-displayer__${uniqueID}`}
				isSave={isSave}
				{...background}
			/>
		)),
		...firstGroup,
		...(!!innerBlocksChildren &&
			cloneElement(innerBlocksChildren, {
				key: `maxi-inner-content__${uniqueID}`,
			})),
		...secondGroup,
		...(showWrapperInserter && (
			<BlockInserter.WrapperInserter
				key={`maxi-block-wrapper-inserter__${clientId}`}
				ref={ref}
				clientId={clientId}
				isSelected={isSelected}
				hasSelectedChild={hasSelectedChild}
			/>
		)),
	];
};

const MainInnerBlocksBlock = forwardRef(
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
			renderWrapperInserter,
			isChild,
			isDisabled,
			pagination,
			paginationProps,
			showLoader,
			...props
		},
		ref
	) => {
		const clStatus = select('core/block-editor')
			.getBlockAttributes(clientId)?.['cl-status'];
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
				renderWrapperInserter,
				isChild,
				isDisabled,
			})
		);

		if (isSave)
			return (
				<TagName ref={ref} {...innerBlocksProps}>
					{blockChildren}
				</TagName>
			);

		return (
			<TagName {...restInnerBlocksProps}>
				{blockChildren}
				{showLoader && <ContentLoader overlay />}
				{clStatus && pagination && <Pagination {...paginationProps} />}
			</TagName>
		);
	}
);

const EditInnerBlocksBlock = memo(
	MainInnerBlocksBlock,
	(rawOldProps, rawNewProps) => {
		const propsCleaner = props => {
			const response = {};

			Object.entries(props).forEach(([key, value]) => {
				if (typeof value !== 'function') response[key] = value;
				if (typeof value !== 'object')
					response[key] = JSON.stringify(value);
			});

			return response;
		};

		const oldProps = propsCleaner(rawOldProps);
		const newProps = propsCleaner(rawNewProps);

		return isEqual(oldProps, newProps);
	}
);

const InnerBlocksBlock = forwardRef(({ isSave, ...restProps }, ref) => {
	if (isSave) return <MainInnerBlocksBlock isSave {...restProps} />;

	return <EditInnerBlocksBlock ref={ref} {...restProps} />;
});

export default InnerBlocksBlock;
