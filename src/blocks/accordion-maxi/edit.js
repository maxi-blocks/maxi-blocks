/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

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
	constructor(...args) {
		super(...args);
	}

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
				key={`maxi-accordion--${uniqueID}`}
				blockFullWidth={blockFullWidth}
				ref={this.blockRef}
				useInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					templateLock: false,
				}}
				{...getMaxiBlockAttributes(this.props)}
			>
				<button
					onClick={() => {
						dispatch('core/block-editor').insertBlock(
							createBlock('maxi-blocks/pane-maxi'),
							1,
							this.props.clientId
						);
					}}
				>
					Click
				</button>
			</MaxiBlock>,
		];
	}
}

export default edit;
