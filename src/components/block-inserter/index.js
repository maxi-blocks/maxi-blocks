/**
 * WordPress dependencies
 */
import { ButtonBlockAppender, Inserter } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useRef, forwardRef } from '@wordpress/element';
import { getScrollContainer } from '@wordpress/dom';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import Dropdown from '../dropdown';

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
				className='maxi-block-inserter__button'
			/>
		</div>
	);
};

const ButtonInserter = props => {
	const { setButtonIsHovered, onToggle, setShouldRemain, clientId } = props;

	const { selectBlock } = useDispatch('core/block-editor');

	return (
		<Button
			onMouseOver={() => setButtonIsHovered(true)}
			onMouseOut={() => setButtonIsHovered(false)}
			className='maxi-wrapper-block-inserter__button maxi-block-inserter__button'
			onClick={() => {
				selectBlock(clientId).then(() => {
					if (setShouldRemain) setShouldRemain(true);

					onToggle();
				});
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
	);
};

const WrapperBlockInserter = forwardRef((props, ref) => {
	const { clientId, isSelected, hasSelectedChild, isHovered } = props;

	const { blockHierarchy } = useSelect(select => {
		const { getBlockName, getBlockParents } = select('core/block-editor');

		const blockOrder = [...getBlockParents(clientId), clientId];

		const blockHierarchy = {};

		blockOrder.forEach(blockClientId => {
			if (WRAPPER_BLOCKS.includes(getBlockName(blockClientId)))
				blockHierarchy[blockClientId] = getBlockName(blockClientId);
		});

		return { blockHierarchy };
	});

	const [buttonIsHovered, setButtonIsHovered] = useState(false);
	const shouldRemain = useRef(false);
	const setShouldRemain = val => {
		shouldRemain.current = val;
	};

	if (!ref?.current) return null;

	const boundaryElement =
		document.defaultView.frameElement?.querySelector(
			'.edit-post-visual-editor'
		) ||
		getScrollContainer(ref.current)?.querySelector(
			'.edit-post-visual-editor'
		) ||
		document.body?.querySelector('.edit-post-visual-editor');

	if (
		isHovered ||
		buttonIsHovered ||
		isSelected ||
		hasSelectedChild ||
		shouldRemain.current
	)
		return (
			<Popover
				key={`maxi-wrapper-block-inserter__${clientId}`}
				className='maxi-wrapper-block-inserter'
				noArrow
				animate={false}
				position='bottom center'
				focusOnMount={false}
				style={{ zIndex: Object.keys(blockHierarchy).length + 1 }}
				anchorRef={ref.current}
				__unstableSlotName='block-toolbar'
				__unstableStickyBoundaryElement={boundaryElement}
				shouldAnchorIncludePadding
			>
				{Object.keys(blockHierarchy).length > 1 && (
					<Dropdown
						className='maxi-block-inserter__dropdown'
						contentClassName='maxi-block-inserter__dropdown-content'
						position='bottom center'
						renderToggle={({ onToggle }) => (
							<ButtonInserter
								setButtonIsHovered={setButtonIsHovered}
								onToggle={onToggle}
								setShouldRemain={setShouldRemain}
								clientId
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
							<ButtonInserter
								setButtonIsHovered={setButtonIsHovered}
								onToggle={onToggle}
								setShouldRemain={setShouldRemain}
								clientId
							/>
						)}
					/>
				)}
				{JSON.stringify(isHovered)}
			</Popover>
		);

	return null;
});

BlockInserter.WrapperInserter = WrapperBlockInserter;

export default BlockInserter;
