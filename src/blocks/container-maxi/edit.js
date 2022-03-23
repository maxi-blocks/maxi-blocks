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
import {
	ArrowDisplayer,
	BlockPlaceholder,
	Indicators,
	ShapeDivider,
	Toolbar,
} from '../../components';
import MaxiBlock from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;
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

	render() {
		const { attributes, deviceType, hasInnerBlocks, maxiSetAttributes } =
			this.props;
		const { uniqueID, isFirstOnHierarchy, blockFullWidth } = attributes;

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-container--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				hasInnerBlocks
				innerBlocksSettings={{
					allowedBlocks: ALLOWED_BLOCKS,
					template: !hasInnerBlocks ? ROW_TEMPLATE : false,
					templateLock: false,
					orientation: 'horizontal',
					renderAppender: !hasInnerBlocks
						? BlockPlaceholder
						: InnerBlocks.ButtonBlockAppender,
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
						<Indicators
							key={`indicators-${uniqueID}`}
							deviceType={deviceType}
							{...getGroupAttributes(attributes, [
								'padding',
								'margin',
							])}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={deviceType}
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
