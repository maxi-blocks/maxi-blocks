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
import { getBoundaryElement } from '../../extensions/dom';

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
	const { onToggle } = props;

	return (
		<Tooltip text={__('Add block', 'maxi-blocks')} position='top center'>
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
							<ButtonInserter onToggle={onToggle} />
						)}
					/>
				)}
			</Popover>
		);

	return null;
});

const InterBlockToggle = props => {
	const { clientId, onToggleInserter, blockRef, setHasInterBlocksAppender } =
		props;

	const [isVisible, setIsVisible] = useState(false);
	const [isHovered, setHovered] = useState(false);
	const hoverTimeout = useRef(null);

	const classes = classnames(
		'maxi-inter-blocks-inserter__toggle',
		isHovered && 'maxi-inter-blocks-inserter__toggle--is-hovered'
	);

	const { width } = blockRef.getBoundingClientRect();

	const style = {
		width: `${width}px`,
	};

	const onMouseOver = () => {
		setHovered(true);

		if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

		hoverTimeout.current = setTimeout(() => {
			setHasInterBlocksAppender(true);
			setIsVisible(true);
		}, 500);
	};

	const onMouseOut = () => {
		setHovered(false);

		if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

		hoverTimeout.current = setTimeout(() => {
			setHasInterBlocksAppender(false);
			setIsVisible(false);
		}, 500);
	};

	return (
		<div
			className={classes}
			style={style}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
		>
			{isVisible && (
				<Button
					key={`maxi-inter-blocks-inserter__content-item-${clientId}`}
					className='maxi-inter-blocks-inserter__content-item'
					onClick={() => {
						onToggleInserter();
					}}
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
			)}
		</div>
	);
};

const InterBlockInserter = forwardRef((props, ref) => {
	const { clientId, setHasInterBlocksAppender } = props;
	const blockRef = ref?.current?.blockRef?.current;

	const { nextClientId, isNextMaxiBlock } = useSelect(select => {
		const { getBlockOrder, getBlockRootClientId, getBlockName } =
			select('core/block-editor');

		const rootClientId = getBlockRootClientId(clientId);
		const blockOrder = getBlockOrder(rootClientId);

		const index = blockOrder.indexOf(clientId);

		const nextClientId = blockOrder[index + 1];

		const isNextMaxiBlock =
			nextClientId && getBlockName(nextClientId).includes('maxi-blocks/');

		return {
			nextClientId,
			isNextMaxiBlock,
		};
	}, []);

	if (!blockRef || !nextClientId || !isNextMaxiBlock) return null;

	return (
		<Popover
			key={`maxi-inter-blocks-inserter__${clientId}`}
			className='maxi-inter-blocks-inserter'
			noArrow
			animate={false}
			position='bottom center'
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			flip={false}
			resize={false}
			anchor={blockRef}
			dataclientid={clientId}
			// {...popoverProps}
		>
			<Inserter
				key={`maxi-inter-blocks-inserter__content-${clientId}`}
				clientId={nextClientId}
				position='bottom center'
				// isAppender
				__experimentalIsQuick
				// onSelectOrClose={() => setShouldRemain(false)}
				renderToggle={({ onToggle: onToggleInserter }) => (
					<InterBlockToggle
						onToggleInserter={onToggleInserter}
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
