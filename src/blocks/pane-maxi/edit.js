/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';
import { BlockInserter, Toolbar } from '../../components';
import getStyles from './styles';
import AccordionContext from '../accordion-maxi/context';
import Inspector from './inspector';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	static contextType = AccordionContext;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	maxiBlockDidUpdate() {
		if (this.context.titleLevel !== this.props.attributes.titleLevel) {
			const { maxiSetAttributes } = this.props;

			maxiSetAttributes({ titleLevel: this.context.titleLevel });
		}
	}

	render() {
		const { attributes, maxiSetAttributes, clientId, hasInnerBlocks } =
			this.props;
		const { uniqueID, title } = attributes;
		const {
			paneIcon,
			paneIconActive,
			accordionLayout,
			titleLevel,
			openPanes,
			onOpen,
			onClose,
			setAccordionAttributes,
			accordionAttributes,
		} = this.context;

		const isOpen = openPanes.includes(clientId);

		const ALLOWED_BLOCKS = ['maxi-blocks/row-maxi'];
		const ROW_TEMPLATE = [['maxi-blocks/row-maxi']];

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				setAccordionAttributes={setAccordionAttributes}
				accordionAttributes={accordionAttributes}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				// copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-pane--${uniqueID}`}
				ref={this.blockRef}
				useInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					template: ROW_TEMPLATE,
					templateLock: false,
					renderAppender: !hasInnerBlocks
						? () => <BlockInserter clientId={clientId} />
						: false,
				}}
				{...getMaxiBlockAttributes(this.props)}
				accordionLayout={accordionLayout}
				renderWrapperInserter={isOpen}
				aria-expanded={isOpen}
			>
				<div
					className='maxi-pane-block__header'
					onClick={() => {
						if (!isOpen) onOpen(clientId);
						else onClose(clientId);
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
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
