/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ButtonBlockAppender, Inserter } from '@wordpress/block-editor';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useRef, forwardRef, useState } from '@wordpress/element';
import { Popover, Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import Dropdown from '../dropdown';
import getBoundaryElement from '../../extensions/dom/getBoundaryElement';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNaN } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const WRAPPER_BLOCKS = ['maxi-blocks/column-maxi', 'maxi-blocks/group-maxi'];

const BlockInserter = props => {
	const { className, clientId } = props;

	const { selectBlock } = useDispatch('core/block-editor');

	const classes = classnames('maxi-block-inserter', className);

	return (
		<div
			className={classes}
			onClick={({ target }) => {
				if (target.classList.contains('block-editor-inserter'))
					selectBlock(clientId);
			}}
		>
			<ButtonBlockAppender
				rootClientId={clientId}
				className='maxi-components-button maxi-block-inserter__button'
			/>
		</div>
	);
};

const ButtonInserter = props => {
	const { onToggle, style = {} } = props;

	return (
		<Tooltip text={__('Add block', 'maxi-blocks')} position='top center'>
			<div
				className='maxi-wrapper-block-inserter__button-wrapper'
				style={style}
			>
				<Button
					className='maxi-wrapper-block-inserter__button maxi-block-inserter__button'
					onClick={onToggle}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='24'
						height='24'
						role='img'
						aria-hidden='true'
						focusable='false'
					>
						<path d='M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z' />
					</svg>
				</Button>
			</div>
		</Tooltip>
	);
};

const WrapperBlockInserter = forwardRef((props, ref) => {
	const { clientId, isSelected, hasSelectedChild } = props;

	const { getBlockName, getBlockParents } = select('core/block-editor');
	const { receiveMaxiSettings } = select('maxiBlocks');

	const maxiSettings = receiveMaxiSettings();
	const version = !isEmpty(maxiSettings.editor)
		? maxiSettings.editor.version
		: null;

	const blockHierarchy = {};
	const blockOrder = [...getBlockParents(clientId), clientId];
	blockOrder.forEach(blockClientId => {
		if (WRAPPER_BLOCKS.includes(getBlockName(blockClientId)))
			blockHierarchy[blockClientId] = getBlockName(blockClientId);
	});

	const shouldRemain = useRef(false);
	const setShouldRemain = val => {
		shouldRemain.current = val;
	};

	if (!ref?.current) return null;

	const { width } = ref.current.getBoundingClientRect();

	const style = {
		width: `${width}px`,
	};

	const popoverProps = {
		...((parseFloat(version) <= 13.0 && {
			__unstableStickyBoundaryElement: getBoundaryElement(
				ref.current,
				'.edit-post-visual-editor'
			),
			shouldAnchorIncludePadding: true,
			anchorRef: ref.current,
		}) ||
			(!isNaN(parseFloat(version)) && {
				anchor: ref.current,
				placement: 'bottom',
				flip: false,
				resize: false,
				variant: 'unstyled',
			})),
	};

	if (isSelected || hasSelectedChild || shouldRemain.current)
		return (
			<Popover
				key={`maxi-wrapper-block-inserter__${clientId}`}
				className='maxi-wrapper-block-inserter'
				noArrow
				animate={false}
				position='bottom center'
				focusOnMount={false}
				style={{ zIndex: Object.keys(blockHierarchy).length + 1 }}
				__unstableSlotName='block-toolbar'
				{...popoverProps}
			>
				{Object.keys(blockHierarchy).length > 1 && (
					<Dropdown
						className='maxi-block-inserter__dropdown'
						contentClassName='maxi-block-inserter__dropdown-content'
						position='bottom center'
						renderToggle={({ onToggle }) => (
							<ButtonInserter
								onToggle={onToggle}
								setShouldRemain={setShouldRemain}
								style={style}
							/>
						)}
						renderContent={({ onToggle }) => (
							<div className='maxi-block-inserter__content'>
								{Object.entries(blockHierarchy).map(
									([blockClientId, blockName]) => (
										<Inserter
											key={`maxi-wrapper-block-inserter__content-${blockClientId}`}
											rootClientId={blockClientId}
											position='bottom center'
											isAppender
											__experimentalIsQuick
											onSelectOrClose={() =>
												setShouldRemain(false)
											}
											renderToggle={({
												onToggle: onToggleInserter,
											}) => (
												<Button
													key={`maxi-wrapper-block-inserter__content-item-${blockClientId}`}
													className='maxi-wrapper-block-inserter__content-item'
													onClick={() => {
														onToggleInserter();
													}}
												>
													Add{' '}
													{blockName
														.replace(
															'maxi-blocks/',
															''
														)
														.replace('-', ' ')}
												</Button>
											)}
										/>
									)
								)}
							</div>
						)}
					/>
				)}
				{Object.keys(blockHierarchy).length <= 1 && (
					<Inserter
						key={`maxi-wrapper-block-inserter__content-${clientId}`}
						rootClientId={clientId}
						position='bottom center'
						isAppender
						__experimentalIsQuick
						onSelectOrClose={() => setShouldRemain(false)}
						renderToggle={({ onToggle }) => (
							<ButtonInserter onToggle={onToggle} style={style} />
						)}
					/>
				)}
			</Popover>
		);

	return null;
});

const InterBlockToggle = props => {
	const {
		clientId,
		onToggleInserter,
		blockRef,
		setHasInterBlocksAppender,
		isOpen,
	} = props;

	const [isHovered, setHovered] = useState(false);

	const classes = classnames(
		'maxi-inter-blocks-inserter__toggle',
		(isHovered || isOpen) &&
			'maxi-inter-blocks-inserter__toggle--is-hovered'
	);

	const { width } = blockRef.getBoundingClientRect();

	const style = {
		width: `${width}px`,
	};

	const onMouseOver = () => {
		setHovered(true);

		setHasInterBlocksAppender(true);
	};

	const onMouseOut = e => {
		if (!e.target?.contains(e.relatedTarget)) {
			setHovered(false);

			setHasInterBlocksAppender(false);
		}
	};

	return (
		<div
			className={classes}
			style={style}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			onClick={onToggleInserter}
		>
			{(isHovered || isOpen) && (
				<>
					<Button
						key={`maxi-inter-blocks-inserter__content-item-${clientId}`}
						className='maxi-inter-blocks-inserter__content-item'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							width='24'
							height='24'
							role='img'
							aria-hidden='true'
							focusable='false'
						>
							<path d='M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z' />
						</svg>
					</Button>
					{/** Removes original WP inserter, so avoids both inserters at same time */}
					<style>
						{
							'.block-editor-block-list__insertion-point: {display: none}'
						}
					</style>
				</>
			)}
		</div>
	);
};

const InterBlockInserter = forwardRef((props, ref) => {
	const { clientId, setHasInterBlocksAppender } = props;
	const blockRef = ref?.current?.blockRef?.current;

	const popoverRef = useRef(null);

	const { nextClientId, isNextMaxiBlock, version } = useSelect(select => {
		const { getBlockOrder, getBlockRootClientId, getBlockName } =
			select('core/block-editor');
		const { receiveMaxiSettings } = select('maxiBlocks');

		const rootClientId = getBlockRootClientId(clientId);
		const blockOrder = getBlockOrder(rootClientId);

		const index = blockOrder.indexOf(clientId);

		const nextClientId = blockOrder[index + 1];

		const isNextMaxiBlock =
			nextClientId && getBlockName(nextClientId).includes('maxi-blocks/');

		const maxiSettings = receiveMaxiSettings();
		const { editor } = maxiSettings;

		return {
			nextClientId,
			isNextMaxiBlock,
			version: editor?.version,
		};
	}, []);

	if (!blockRef || !nextClientId || !isNextMaxiBlock) return null;

	const getAnchor = popoverRef => {
		const popoverRect = popoverRef
			?.querySelector('.components-popover__content')
			?.getBoundingClientRect();

		if (!popoverRect) return null;

		const rect = blockRef.getBoundingClientRect();

		const { width, x } = rect;
		const { width: popoverWidth } = popoverRect;

		const expectedContentX = x + width / 2 - popoverWidth / 2;

		const container = document
			.querySelector('.editor-styles-wrapper')
			?.getBoundingClientRect();

		if (container) {
			const { x: containerX, width: containerWidth } = container;

			// Left cut off check
			if (expectedContentX < containerX)
				rect.x += containerX - expectedContentX;

			// Right cut off check
			if (expectedContentX + popoverWidth > containerX + containerWidth)
				rect.x -=
					expectedContentX +
					popoverWidth -
					(containerX + containerWidth);
		}

		return {
			getBoundingClientRect: () => rect,
			ownerDocument: blockRef.ownerDocument,
		};
	};

	const popoverProps = {
		...((parseFloat(version) <= 13.0 && {
			getAnchorRect: spanEl => {
				// span element needs to be hidden to don't break the grid
				spanEl.style.display = 'none';

				return getAnchor(popoverRef.current).getBoundingClientRect();
			},
			shouldAnchorIncludePadding: true,
			__unstableStickyBoundaryElement: getBoundaryElement(blockRef),
			className:
				'maxi-inter-blocks-inserter maxi-inter-blocks-inserter--old',
		}) ||
			(!isNaN(parseFloat(version)) && {
				anchor: blockRef,
				flip: false,
				resize: false,
			})),
	};

	return (
		<Popover
			ref={popoverRef}
			key={`maxi-inter-blocks-inserter__${clientId}`}
			className='maxi-inter-blocks-inserter'
			noArrow
			animate={false}
			position='bottom center'
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			dataclientid={clientId}
			{...popoverProps}
		>
			<Inserter
				key={`maxi-inter-blocks-inserter__content-${clientId}`}
				clientId={nextClientId}
				position='bottom center'
				__experimentalIsQuick
				renderToggle={({ onToggle: onToggleInserter, isOpen }) => (
					<InterBlockToggle
						onToggleInserter={onToggleInserter}
						isOpen={isOpen}
						setHasInterBlocksAppender={setHasInterBlocksAppender}
						clientId={clientId}
						blockRef={blockRef}
					/>
				)}
			/>
		</Popover>
	);
});

BlockInserter.WrapperInserter = WrapperBlockInserter;
BlockInserter.InterBlockInserter = InterBlockInserter;

export default BlockInserter;
