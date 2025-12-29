/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { createRef, forwardRef, RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { BlockInserter } from '@components';
import getStyles from './styles';
import AccordionContext from '@blocks/accordion-maxi/context';
import { copyPasteMapping } from './data';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '@extensions/DC';
import withMaxiDC from '@extensions/DC/withMaxiDC';
import { getAllowedBlocks } from '@extensions/common/getAllowedBlocks';

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
	'border-style-general': null,
	'border-top-left-radius-general': 0,
	'border-top-right-radius-general': 0,
	'border-bottom-left-radius-general': 0,
	'border-bottom-right-radius-general': 0,
};

const Content = forwardRef((props, ref) => {
	const { clientId, isSelected, hasSelectedChild, hasInnerBlocks, isOpen } =
		props;

	const ALLOWED_BLOCKS = getAllowedBlocks([
		'maxi-blocks/container-maxi',
		'maxi-blocks/column-maxi',
		'maxi-blocks/pane-maxi',
		'maxi-blocks/maxi-cloud',
		'maxi-blocks/slide-maxi',
		'maxi-blocks/list-item-maxi',
		'core/list-item',
	]);

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

	constructor(...args) {
		super(...args);

		this.contentWrapper = createRef();
		this.state = { isOpen: false };
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	updateAttributesFromContext() {
		// Attributes from context that need to be saved for frontend
		const accordionAttributes = ['accordionUniqueId', 'titleLevel'];

		accordionAttributes.forEach(attributeName => {
			if (
				this.context[attributeName] !==
				this.props.attributes[attributeName]
			) {
				const { maxiSetAttributes } = this.props;

				maxiSetAttributes({
					[attributeName]: this.context[attributeName],
				});
			}
		});

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

	maxiBlockDidMount() {
		this.updateAttributesFromContext();
	}

	maxiBlockDidUpdate() {
		this.updateAttributesFromContext();

		const newIsOpen = this.context.openPanes.includes(this.props.clientId);
		if (newIsOpen !== this.state.isOpen) {
			newIsOpen ? this.openPane() : this.closePane();
		}
	}

	openPane() {
		this.contentWrapper.current.style.overflow = 'hidden';
		// The css doesn't run transition if set to 100% so need to set exact value, for transition to happen
		this.contentWrapper.current.style.maxHeight = `${this.contentWrapper.current.scrollHeight}px`;

		this.setState({ isOpen: true });
	}

	closePane() {
		const { isCollapsible, openPanes } = this.context;

		if (!isCollapsible && openPanes.length <= 1) return;
		this.contentWrapper.current.style.overflow = 'hidden';
		// Transition doesn't run if max-height is not set to exact value
		this.contentWrapper.current.style.maxHeight = `${this.contentWrapper.current.scrollHeight}px`;
		setTimeout(() => {
			this.contentWrapper.current.style.maxHeight = 0;
		}, 1);

		this.setState({ isOpen: false });
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
			accordionLayout,
			accordionUniqueId,
			onOpen,
			onClose,
		} = this?.context || {};

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
				data-accordion={accordionUniqueId}
				{...getMaxiBlockAttributes(this.props)}
				aria-expanded={this.state.isOpen}
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

						!this.state.isOpen
							? onOpen(clientId)
							: onClose(clientId);
					}}
				>
					<div className='maxi-pane-block__header-content'>
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
							<RawHTML>
								{this.state.isOpen ? paneIconActive : paneIcon}
							</RawHTML>
						</div>
					</div>
					<div className='maxi-pane-block__header-line-container maxi-pane-block__line-container'>
						<hr className='maxi-pane-block__header-line maxi-pane-block__line' />
					</div>
				</div>
				{/* Wrapper is only for open/close animations, no styles should be applied on it */}
				<div
					className='maxi-pane-block__content-wrapper'
					ref={this.contentWrapper}
					onTransitionEnd={() => {
						this.contentWrapper.current.style = null;
					}}
				>
					<Content
						ref={this.blockRef}
						clientId={clientId}
						isSelected={isSelected}
						hasSelectedChild={hasSelectedChild}
						hasInnerBlocks={hasInnerBlocks}
						isOpen={this.state.isOpen}
					/>
				</div>
				<div className='maxi-pane-block__content-line-container maxi-pane-block__line-container'>
					<hr className='maxi-pane-block__content-line maxi-pane-block__line' />
				</div>
			</MaxiBlock>,
		];
	}
}

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
