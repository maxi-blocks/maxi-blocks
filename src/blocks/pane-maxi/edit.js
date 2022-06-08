/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
import { select } from '@wordpress/data';

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
		const { paneIcon, paneIconActive, accordionLayout } = this.context;
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
		const { isBlockSelected, getSelectedBlockClientId, getBlockParents } =
			select('core/block-editor');
		let paneOpen = false;

		if (
			(isBlockSelected(clientId) ||
				getBlockParents(getSelectedBlockClientId()).includes(
					clientId
				)) &&
			this.blockRef.current
		) {
			this.blockRef.current.querySelector(
				'.maxi-pane-block__content'
			).style.display = 'block';
			paneOpen = true;
		} else if (this.blockRef.current) {
			this.blockRef.current.querySelector(
				'.maxi-pane-block__content'
			).style.display = 'none';
		}

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
			>
				<div className='maxi-pane-block__header'>
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
					/>

					<div className='maxi-pane-block__icon'>
						<RawHTML>
							{paneOpen ? paneIconActive : paneIcon}
						</RawHTML>
					</div>
				</div>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
