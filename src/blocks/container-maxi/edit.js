/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import Toolbar from '@components/toolbar';
import ArrowDisplayer from '@components/arrow-displayer';
import BlockInserter from '@components/block-inserter';
import ShapeDivider from '@components/shape-divider';
import { BlockIndicators } from '@components';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import { getGroupAttributes } from '@extensions/styles';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '@extensions/DC';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * General
 */
const ALLOWED_BLOCKS = ['maxi-blocks/row-maxi'];
const ROW_TEMPLATE = [['maxi-blocks/row-maxi']];

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return maxiAttributes;
	}

	hasNavigationInChildren(innerBlocks) {
		return innerBlocks.some(innerBlock => {
			if (innerBlock.name === 'core/navigation') {
				return true;
			}
			if (innerBlock.innerBlocks && innerBlock.innerBlocks.length) {
				return this.hasNavigationInChildren(innerBlock.innerBlocks);
			}
			return false;
		});
	}

	get getMaxiCustomData() {
		const { attributes, clientId } = this.props;
		const { uniqueID, blockStyle } = attributes;
		const {
			'shape-divider-top-status': shapeDividerTopStatus,
			'shape-divider-bottom-status': shapeDividerBottomStatus,
		} = attributes;

		const shapeStatus = shapeDividerTopStatus || shapeDividerBottomStatus;

		// Prepare the initial data object
		const data = {
			...(shapeStatus && {
				[uniqueID]: {
					...getGroupAttributes(attributes, 'shapeDivider'),
				},
			}),
		};

		// Check for 'core/navigation' child blocks at any level of nesting
		const block = select('core/block-editor').getBlock(clientId);
		if (block && block.innerBlocks && block.innerBlocks.length) {
			const hasNavigationChild = this.hasNavigationInChildren(
				block.innerBlocks
			);
			if (hasNavigationChild) {
				// Ensure the uniqueID key exists in the data object
				if (!data[uniqueID]) {
					data[uniqueID] = {};
				}

				// Add 'navigation: true' under the uniqueID key
				data[uniqueID].navigation = { enable: true, style: blockStyle };
			}
		}

		return data;
	}

	maxiBlockDidUpdate() {
		if (!this.props.hasInnerBlocks) {
			const { removeBlock } = dispatch('core/block-editor');
			removeBlock(this.props.clientId);
		}
	}

	render() {
		const {
			attributes,
			deviceType,
			hasInnerBlocks,
			maxiSetAttributes,
			clientId,
			insertInlineStyles,
			cleanInlineStyles,
			isSelected,
		} = this.props;
		const { uniqueID, isFirstOnHierarchy } = attributes;

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-container--${uniqueID}`}
				ref={this.blockRef}
				useInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					template: !hasInnerBlocks ? ROW_TEMPLATE : false,
					templateLock: false,
					orientation: 'horizontal',
					renderAppender: !hasInnerBlocks
						? () => <BlockInserter clientId={clientId} />
						: false,
				}}
				{...getMaxiBlockAttributes(this.props)}
			>
				{attributes['shape-divider-top-status'] && (
					<ShapeDivider
						key={`maxi-shape-divider-top__${uniqueID}`}
						{...getGroupAttributes(attributes, 'shapeDivider')}
						location='top'
					/>
				)}
				{isFirstOnHierarchy && (
					<>
						<ArrowDisplayer
							key={`maxi-arrow-displayer__${uniqueID}`}
							{...getGroupAttributes(
								attributes,
								['blockBackground', 'arrow', 'border'],
								true
							)}
							breakpoint={deviceType}
						/>
						<BlockIndicators
							key={`indicators-${uniqueID}`}
							{...getGroupAttributes(attributes, [
								'padding',
								'margin',
							])}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={deviceType}
							avoidIndicators={
								attributes['full-width-general'] === true && {
									margin: ['right', 'left'],
								}
							}
							insertInlineStyles={insertInlineStyles}
							cleanInlineStyles={cleanInlineStyles}
							isBlockSelected={isSelected}
						/>
					</>
				)}
				{attributes['shape-divider-bottom-status'] && (
					<ShapeDivider
						key={`maxi-shape-divider-bottom__${uniqueID}`}
						{...getGroupAttributes(attributes, 'shapeDivider')}
						location='bottom'
						afterInnerProps
					/>
				)}
			</MaxiBlock>,
		];
	}
}

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
