/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ButtonBlockAppender, Inserter } from '@wordpress/block-editor';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { forwardRef, useContext, useRef, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * Internal dependencies
 */
import Button from '@components/button';
import Dropdown from '@components/dropdown';
import Popover from '@components/popover';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

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
];

const BlockInserter = props => {
	const { className, clientId } = props;

	const { selectBlock } = useDispatch('core/block-editor');

	const repeaterStatus = useContext(RepeaterContext)?.repeaterStatus;

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
				className={classnames(
					'maxi-components-button',
					'maxi-block-inserter__button',
					repeaterStatus && 'maxi-block-inserter__button--repeater'
				)}
			/>
		</div>
	);
};

const ButtonInserter = props => {
	const { onToggle, style = {} } = props;

	const repeaterStatus = useContext(RepeaterContext)?.repeaterStatus;

	return (
		<Tooltip text={__('Add block', 'maxi-blocks')} placement='top'>
			<div
				className={classnames(
					'maxi-wrapper-block-inserter__button-wrapper',
					repeaterStatus &&
						'maxi-wrapper-block-inserter__button-wrapper--repeater'
				)}
				style={style}
			>
				<Button
					className={classnames(
						'maxi-wrapper-block-inserter__button',
						'maxi-block-inserter__button'
					)}
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
				focusOnMount={false}
				style={{ zIndex: Object.keys(blockHierarchy).length + 1 }}
				__unstableSlotName='block-toolbar'
				useAnimationFrame
				observeBlockPosition={clientId}
				dataclientid={clientId}
				position='bottom center'
				placement='bottom'
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
			</style>
			{(isHovered || isOpen) && (
				<style>
					{clientId &&
						/** Adds blue boundary outline on the current block */
						`.maxi-block[data-block="${clientId}"]::after {
                content: '';
                position: absolute;
                pointer-events: none;
                opacity: 1;
              }`}
					{nextBlockClientId &&
						/** Adds blue boundary outline on the next block */
						`.maxi-block[data-block="${nextBlockClientId}"]::after {
                content: '';
                position: absolute;
                pointer-events: none;
                opacity: 1;
              }`}
				</style>
			)}
		</div>
	);
};

const InterBlockInserter = forwardRef((props, ref) => {
	const { clientId } = props;
	const blockRef = ref?.current?.blockRef?.current;

	const popoverRef = useRef(null);

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
			useHide
			strategy='fixed'
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
