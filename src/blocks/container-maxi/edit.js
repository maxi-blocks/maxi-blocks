/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import {
	ArrowDisplayer,
	BlockInserter,
	ShapeDivider,
	Toolbar,
	BlockIndicators,
} from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/styles';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';

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

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const uniqueID = getAttributesValue({
			target: 'uniqueID',
			props: attributes,
		});
		const {
			'shape-divider-top-status': shapeDividerTopStatus,
			'shape-divider-bottom-status': shapeDividerBottomStatus,
		} = attributes;

		const shapeStatus = shapeDividerTopStatus || shapeDividerBottomStatus;

		return {
			...(shapeStatus && {
				shape_divider: {
					[uniqueID]: {
						...getGroupAttributes(attributes, 'shapeDivider'),
					},
				},
			}),
		};
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
		const {
			uniqueID,
			isFirstOnHierarchy,
			shapeDividerTopStatus,
			shapeDividerBottomStatus,
		} = getAttributesValue({
			target: [
				'uniqueID',
				'isFirstOnHierarchy',
				'shape-divider-top-status',
				'shape-divider-bottom-status',
			],
			props: attributes,
		});

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
				{shapeDividerTopStatus && (
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
							avoidIndicators={{ margin: ['right', 'left'] }}
							insertInlineStyles={insertInlineStyles}
							cleanInlineStyles={cleanInlineStyles}
							isBlockSelected={isSelected}
						/>
					</>
				)}
				{shapeDividerBottomStatus && (
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

export default withMaxiProps(edit);
