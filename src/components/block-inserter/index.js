/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ButtonBlockAppender, Inserter } from '@wordpress/block-editor';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useRef, forwardRef, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import Dropdown from '../dropdown';
import Popover from '../popover';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const WRAPPER_BLOCKS = [
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/pane-maxi',
];

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

	const { getBlockName, getBlockParents, getAdjacentBlockClientId } =
		select('core/block-editor');

	const blockHierarchy = [];
	const blockOrder = [clientId, ...getBlockParents(clientId, true)];
	for (let i = 0; i < blockOrder.length; i += 1) {
		const blockClientId = blockOrder[i];
		if (WRAPPER_BLOCKS.includes(getBlockName(blockClientId))) {
			if (i > 1 && getAdjacentBlockClientId(blockOrder[i - 2])) break;
			blockHierarchy.push({
				blockClientId,
				blockName: getBlockName(blockClientId),
			});
		}
	}

	const shouldRemain = useRef(false);
	const setShouldRemain = val => {
		shouldRemain.current = val;
	};

	if (!ref?.current) return null;

	const { width } = ref.current.getBoundingClientRect();

	const style = {
		'--maxi-inter-blocks-inserter-width': `${width}px`,
	};

	if (isSelected || hasSelectedChild || shouldRemain.current)
		return (
			<Popover
				key={`maxi-wrapper-block-inserter__${clientId}`}
				anchor={ref.current}
				className='maxi-wrapper-block-inserter'
				noArrow
				animate={false}
				position='bottom center'
				focusOnMount={false}
				style={{ zIndex: Object.keys(blockHierarchy).length + 1 }}
				__unstableSlotName='block-toolbar'
				useAnimationFrame
				placement='bottom'
			>
				{blockHierarchy.length > 1 && (
					<Dropdown
						className='maxi-block-inserter__dropdown'
						contentClassName='maxi-block-inserter__dropdown-content'
						position='bottom center'
						renderToggle={({ onToggle }) => (
							<ButtonInserter
								onToggle={onToggle}
								setShouldRemain={setShouldRemain}
								style={{
									zIndex:
										Object.keys(blockHierarchy).length + 1,
									...style,
								}}
							/>
						)}
						renderContent={() => (
							<div className='maxi-block-inserter__content'>
								{blockHierarchy.map(
									({ blockClientId, blockName }, i) => (
										<Inserter
											key={`maxi-wrapper-block-inserter__content-${blockClientId}`}
											rootClientId={blockClientId}
											clientId={
												i > 0 &&
												getAdjacentBlockClientId(
													blockHierarchy[i - 1]
														.blockClientId
												)
											}
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
													style={{
														textTransform: 'none',
													}}
												>
													Add to{' '}
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
				{blockHierarchy.length <= 1 && (
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
	const { clientId, onToggleInserter, blockRef, isOpen } = props;

	const [isHovered, setHovered] = useState(false);

	const { nextBlockClientId } = useSelect(select => {
		const { getAdjacentBlockClientId } = select('core/block-editor');

		return {
			nextBlockClientId: getAdjacentBlockClientId(clientId, 1),
		};
	});

	const classes = classnames(
		'maxi-inter-blocks-inserter__toggle',
		(isHovered || isOpen) &&
			'maxi-inter-blocks-inserter__toggle--is-hovered'
	);

	const { width } = blockRef.getBoundingClientRect();

	const style = {
		width: `${width}px`,
	};

	return (
		<div
			className={classes}
			style={style}
			onMouseOver={() => setHovered(true)}
			onMouseOut={e => {
				if (!e.target?.contains(e.relatedTarget)) setHovered(false);
			}}
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
					<style>
						{
							/** Removes original WP inserter, so avoids both inserters at same time */
							'.block-editor-block-list__insertion-point: {display: none}'
						}
						{clientId &&
							/** Adds blue boundary outline on the current block */
							`.maxi-block[data-block="${clientId}"]::after {
								content: '';
								position: absolute;
								pointer-events: none;
								opacity: 1;
							} `}
						{nextBlockClientId &&
							/** Adds blue boundary outline on the next block */
							`.maxi-block[data-block="${nextBlockClientId}"]::after {
								content: '';
								position: absolute;
								pointer-events: none;
								opacity: 1;
							} `}
					</style>
				</>
			)}
		</div>
	);
};

const InterBlockInserter = forwardRef((props, ref) => {
	const { clientId } = props;
	const blockRef = ref?.current?.blockRef?.current;

	const popoverRef = useRef(null);

	const { nextClientId, isNextMaxiBlock, blockName } = useSelect(select => {
		const { getBlockOrder, getBlockRootClientId, getBlockName } =
			select('core/block-editor');

		const rootClientId = getBlockRootClientId(clientId);
		const blockOrder = getBlockOrder(rootClientId);

		const index = blockOrder.indexOf(clientId);

		const nextClientId = blockOrder[index + 1];

		const isNextMaxiBlock =
			nextClientId && getBlockName(nextClientId).includes('maxi-blocks/');

		const blockName = getBlockName(clientId);

		return {
			nextClientId,
			isNextMaxiBlock,
			blockName,
		};
	}, []);

	if (
		!blockRef ||
		!nextClientId ||
		!isNextMaxiBlock ||
		WRAPPER_BLOCKS.includes(blockName)
	)
		return null;

	return (
		<Popover
			ref={popoverRef}
			anchor={blockRef}
			key={`maxi-inter-blocks-inserter__${clientId}`}
			className='maxi-inter-blocks-inserter'
			noArrow
			animate={false}
			position='bottom center'
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			observeBlockPosition={clientId}
			dataclientid={clientId}
			useAnimationFrame
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
