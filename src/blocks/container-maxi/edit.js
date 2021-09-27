/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	ArrowDisplayer,
	BlockPlaceholder,
	Indicators,
	MaxiBlockComponent,
	ShapeDivider,
	Toolbar,
	InnerBlocks,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
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

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!!this.props.attributes['parallax-status'];

		const shapeStatus =
			!!this.props.attributes['shape-divider-top-status'] ||
			!!this.props.attributes['shape-divider-bottom-status'];

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'parallax',
					]),
				}),
				...(shapeStatus && {
					...getGroupAttributes(
						this.props.attributes,
						'shapeDivider'
					),
				}),
			},
		};
	}

	render() {
		const {
			attributes,
			clientId,
			deviceType,
			hasInnerBlocks,
			setAttributes,
		} = this.props;
		const { uniqueID, isFirstOnHierarchy, fullWidth } = attributes;

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
				{...getMaxiBlockBlockAttributes(this.props)}
				disableMotion
			>
				{attributes['shape-divider-top-status'] && (
					<ShapeDivider
						{...getGroupAttributes(attributes, 'shapeDivider')}
						location='top'
					/>
				)}
				{isFirstOnHierarchy && fullWidth && (
					<>
						<ArrowDisplayer
							{...getGroupAttributes(
								attributes,
								['background', 'arrow', 'border'],
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
							onChange={obj => setAttributes(obj)}
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
							? () => <BlockPlaceholder clientId={clientId} />
							: () => <InnerBlocks.ButtonBlockAppender />
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

export default withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const hasInnerBlocks = !isEmpty(
		select('core/block-editor').getBlockOrder(clientId)
	);
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		hasInnerBlocks,
		deviceType,
	};
})(edit);
