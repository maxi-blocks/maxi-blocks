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
import { BlockInserter } from '../../components';
import getStyles from './styles';
import AccordionContext from '../accordion-maxi/context';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	static contextType = AccordionContext;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const {
			attributes,
			blockFullWidth,
			maxiSetAttributes,
			clientId,
			hasInnerBlocks,
		} = this.props;
		const { uniqueID, title } = attributes;
		const {
			paneIcon,
			paneIconActive,
			accordionLayout,
			titleLevel,
			openPane,
			setOpenPane,
		} = this.context;

		const isOpen = openPane === clientId;

		const ALLOWED_BLOCKS = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(
				blockName =>
					[
						'maxi-blocks/accordion-maxi',
						'maxi-blocks/pane-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<MaxiBlock
				key={`maxi-pane--${uniqueID}`}
				blockFullWidth={blockFullWidth}
				ref={this.blockRef}
				useInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					templateLock: false,
					renderAppender: !hasInnerBlocks
						? () => <BlockInserter clientId={clientId} />
						: false,
				}}
				{...getMaxiBlockAttributes(this.props)}
				accordionLayout={accordionLayout}
				aria-expanded={isOpen}
			>
				<div
					className='maxi-pane-block__header'
					onClick={() => {
						setOpenPane(clientId);
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
