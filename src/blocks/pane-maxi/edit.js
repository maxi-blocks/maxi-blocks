/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { forwardRef, RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';
import { Toolbar, BlockInserter } from '../../components';
import getStyles from './styles';
import AccordionContext from '../accordion-maxi/context';
import Inspector from './inspector';
import copyPasteMapping from './copy-paste-mapping';

const boxedPreset = {
	'border-bottom-left-radius-general': 10,
	'border-bottom-right-radius-general': 10,
	'border-bottom-width-general': 5,
	'border-left-width-general': 5,
	'border-right-width-general': 5,
	'border-top-left-radius-general': 10,
	'border-top-right-radius-general': 10,
	'border-top-width-general': 5,
	'border-unit-radius-general': 'px',
	'border-unit-width-general': 'px',
	'border-style-general': 'solid',
};

const simplePreset = {
	'border-style-general': 'none',
};

const Content = forwardRef((props, ref) => {
	const { clientId, isSelected, hasSelectedChild, hasInnerBlocks, isOpen } =
		props;

	const ALLOWED_BLOCKS = wp.blocks
		.getBlockTypes()
		.map(block => block.name)
		.filter(
			blockName =>
				[
					'maxi-blocks/container-maxi',
					'maxi-blocks/column-maxi',
					'maxi-blocks/pane-maxi',
				].indexOf(blockName) === -1
		);

	return (
		<>
			<div
				{...useInnerBlocksProps(
					{ className: 'maxi-pane-block__content' },
					{
						allowedBlocks: ALLOWED_BLOCKS,
						renderAppender: !hasInnerBlocks
							? () => <BlockInserter clientId={clientId} />
							: false,
					}
				)}
			/>
			{isOpen && (
				<BlockInserter.WrapperInserter
					key={`maxi-block-wrapper-inserter__${clientId}`}
					ref={ref}
					clientId={clientId}
					isSelected={isSelected}
					hasSelectedChild={hasSelectedChild}
				/>
			)}
		</>
	);
});

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	static contextType = AccordionContext;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	maxiBlockDidMount() {
		const content = this.blockRef.current.querySelector(
			'.maxi-pane-block__content'
		);

		this.content = content;
	}

	maxiBlockDidUpdate() {
		if (this.context.titleLevel !== this.props.attributes.titleLevel) {
			const { maxiSetAttributes } = this.props;

			maxiSetAttributes({ titleLevel: this.context.titleLevel });
		}
		if (
			this.context.accordionLayout !==
			this.props.attributes.accordionLayout
		) {
			const { maxiSetAttributes } = this.props;

			if (this.context.accordionLayout === 'boxed') {
				maxiSetAttributes({
					...boxedPreset,
					accordionLayout: this.context.accordionLayout,
				});
			} else {
				maxiSetAttributes({
					...simplePreset,
					accordionLayout: this.context.accordionLayout,
				});
			}
		}
	}

	openPane() {
		const { clientId } = this.props;
		const { onOpen, animationDuration } = this.context;

		this.content.style.overflow = 'hidden';
		// The css doesn't run transition if set to 100% so need to set exact value, for transition to happen
		this.content.style.maxHeight = `${this.content.scrollHeight}px`;
		setTimeout(() => {
			this.content.style = null;
		}, animationDuration);
		onOpen(clientId);
	}

	closePane() {
		const { clientId } = this.props;
		const { onClose, animationDuration, isCollapsible, openPanes } =
			this.context;

		if (!isCollapsible && openPanes.length <= 1) return;
		this.content.style.overflow = 'hidden';
		// Same here, transition doesn't run if max-height is not set to exact value
		this.content.style.maxHeight = `${this.content.scrollHeight}px`;
		setTimeout(() => {
			this.content.style.maxHeight = 0;
			setTimeout(() => {
				this.content.style = null;
			}, animationDuration);
		}, 1);
		onClose(clientId);
	}

	render() {
		const {
			attributes,
			maxiSetAttributes,
			clientId,
			isSelected,
			hasSelectedChild,
			hasInnerBlocks,
		} = this.props;
		const { uniqueID, title } = attributes;
		const {
			paneIcon,
			paneIconActive,
			titleLevel,
			openPanes,
			accordionLayout,
		} = this.context;

		const isOpen = openPanes.includes(clientId);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-pane--${uniqueID}`}
				ref={this.blockRef}
				className={`maxi-pane-block--${accordionLayout}-layout`}
				context={this.context}
				{...getMaxiBlockAttributes(this.props)}
				aria-expanded={isOpen}
			>
				<div
					className='maxi-pane-block__header'
					onClick={e => {
						if (
							e.target.classList.contains(
								'maxi-pane-block__title'
							)
						)
							return;

						if (!isOpen) {
							this.openPane();
						} else {
							this.closePane();
						}
					}}
				>
					<RichText
						className='maxi-pane-block__title'
						value={title}
						identifier='content'
						onChange={title => {
							if (this.typingTimeout) {
								clearTimeout(this.typingTimeout);
							}

							this.typingTimeout = setTimeout(() => {
								maxiSetAttributes({ title });
							}, 100);
						}}
						placeholder={__('Title', 'maxi-blocks')}
						withoutInteractiveFormatting
						tagName={titleLevel}
					/>
					<div className='maxi-pane-block__icon'>
						<RawHTML>{isOpen ? paneIconActive : paneIcon}</RawHTML>
					</div>
				</div>
				<Content
					ref={this.blockRef}
					clientId={clientId}
					isSelected={isSelected}
					hasSelectedChild={hasSelectedChild}
					hasInnerBlocks={hasInnerBlocks}
					isOpen={isOpen}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
