/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { ArrowDisplayer, BlockPlaceholder, Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const { attributes, blockFullWidth, deviceType, hasInnerBlock } =
			this.props;
		const { uniqueID } = attributes;

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */
		const ALLOWED_BLOCKS = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(
				blockName =>
					[
						'maxi-blocks/container-maxi',
						'maxi-blocks/column-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				className={hasInnerBlock && 'has-child'}
				key={`maxi-group--${uniqueID}`}
				blockFullWidth={blockFullWidth}
				ref={this.blockRef}
				hasInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					templateLock: false,
					renderAppender: !hasInnerBlock
						? BlockPlaceholder
						: InnerBlocks.ButtonBlockAppender,
				}}
				{...getMaxiBlockAttributes(this.props)}
			>
				<ArrowDisplayer
					key={`maxi-arrow-displayer__${uniqueID}`}
					{...getGroupAttributes(
						attributes,
						['blockBackground', 'arrow', 'border'],
						true
					)}
					breakpoint={deviceType}
				/>
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const hasInnerBlocks = !isEmpty(
		select('core/block-editor').getBlockOrder(clientId)
	);
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		hasInnerBlocks,
		deviceType,
	};
});

export default compose(editSelect, withMaxiProps)(edit);
