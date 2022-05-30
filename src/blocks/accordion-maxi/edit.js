/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import MaxiBlock from '../../components/maxi-block';
import getStyles from './styles';
import { Button } from '../../components';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const { attributes, blockFullWidth, maxiSetAttributes } = this.props;
		const { uniqueID, lastIndex } = attributes;

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */

		const ALLOWED_BLOCKS = ['maxi-blocks/pane-maxi'];
		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
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
				<Button
					className='maxi-accordion__add-item-button'
					onClick={() => {
						dispatch('core/block-editor').insertBlock(
							createBlock('maxi-blocks/pane-maxi'),
							lastIndex,
							this.props.clientId
						);
						maxiSetAttributes({ lastIndex: lastIndex + 1 });
					}}
				>
					{__('Add Item', 'maxi-blocks')}
				</Button>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
