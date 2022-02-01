/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import {
	ArrowDisplayer,
	BlockPlaceholder,
	Indicators,
	ShapeDivider,
	Toolbar,
	InnerBlocks,
} from '../../components';
import MaxiBlock, { getMaxiBlockAttributes } from '../../components/maxi-block';
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
		const { attributes, deviceType, hasInnerBlocks, handleSetAttributes } =
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
				{...getMaxiBlockAttributes(this.props)}
			>
				{attributes['shape-divider-top-status'] && (
					<ShapeDivider
						{...getGroupAttributes(attributes, 'shapeDivider')}
						location='top'
					/>
				)}
				{isFirstOnHierarchy && blockFullWidth === 'full' && (
					<>
						<ArrowDisplayer
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
							onChange={obj => handleSetAttributes(obj)}
							breakpoint={deviceType}
						/>
					</>
				)}
				<InnerBlocks
					ref={this.blockRef}
					className='maxi-container-block__container'
					allowedBlocks={ALLOWED_BLOCKS}
					template={ROW_TEMPLATE}
					templateLock={false}
					orientation='horizontal'
					renderAppender={
						!hasInnerBlocks
							? BlockPlaceholder
							: InnerBlocks.ButtonBlockAppender
					}
				/>
				{attributes['shape-divider-bottom-status'] && (
					<ShapeDivider
						{...getGroupAttributes(attributes, 'shapeDivider')}
						location='bottom'
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
