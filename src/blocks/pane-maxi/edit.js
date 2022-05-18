/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import MaxiBlock from '../../components/maxi-block';
import getStyles from './styles';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const { attributes, blockFullWidth, maxiSetAttributes } = this.props;
		const { uniqueID, title } = attributes;

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */

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
				}}
				{...getMaxiBlockAttributes(this.props)}
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
				/>

				<div className='maxi-accordion-block__icon'>
					<RawHTML>{attributes['icon-content']}</RawHTML>
				</div>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
