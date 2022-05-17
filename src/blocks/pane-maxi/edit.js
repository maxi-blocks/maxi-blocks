/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
} from '../../extensions/maxi-block';
import { BlockInserter } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import getStyles from './styles';
import onMerge, { onReplaceBlocks } from './utils';

/**
 * External dependencies
 */
import { isEmpty, compact, flatten } from 'lodash';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const { attributes, blockFullWidth, hasInnerBlocks, clientId } =
			this.props;
		const { uniqueID, title } = attributes;

		const onChangeRichText = ({ value }) => {
			this.props.setAttributes({ title: value });
		};

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */

		const ALLOWED_BLOCKS = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(
				blockName =>
					['maxi-blocks/accordion-maxi'].indexOf(blockName) === -1
			);

		return [
			<MaxiBlock
				key={`maxi-group--${uniqueID}`}
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
					className='maxi-text-block__content'
					identifier='title'
					value={title}
					// Needs to stay: if there's no `onSplit` function, `onReplace` function
					// is not called when pasting content with blocks; is called with plainText
					// Check `packages/block-editor/src/components/rich-text/use-enter.js` on Gutenberg
					onSplit={() => null}
					onReplace={(blocks, indexToSelect, initialPosition) => {
						if (
							!blocks ||
							isEmpty(compact(blocks)) ||
							flatten(blocks).every(block => isEmpty(block))
						)
							return;

						const { blocks: cleanBlocks } = onReplaceBlocks(
							blocks,
							clientId,
							title
						);

						if (!isEmpty(compact(cleanBlocks)))
							onReplace(
								cleanBlocks,
								indexToSelect,
								initialPosition
							);
					}}
					onMerge={forward => onMerge(this.props, forward)}
					__unstableEmbedURLOnPaste
					withoutInteractiveFormatting
				>
					{onChangeRichText}
				</RichText>
			</MaxiBlock>,
		];
	}
}

export default edit;
