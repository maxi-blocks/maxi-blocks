/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { Fragment, forwardRef } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

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
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const { children, className } = props;

	return (
		<MaxiBlock
			ref={ref}
			className={className}
			{...getMaxiBlockBlockAttributes(this.props)}
			disableMotion
		>
			{props['shape-divider-top-status'] && (
				<ShapeDivider
					{...getGroupAttributes(props, 'shapeDivider')}
					location='top'
				/>
			)}
			<div className='maxi-container-block__container'>{children}</div>
			{props['shape-divider-bottom-status'] && (
				<ShapeDivider
					{...getGroupAttributes(props, 'shapeDivider')}
					location='bottom'
				/>
			)}
		</MaxiBlock>
	);
});

/**
 * Edit
 */

const ALLOWED_BLOCKS = ['maxi-blocks/row-maxi'];
const ROW_TEMPLATE = [['maxi-blocks/row-maxi']];

class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']) ||
			!!this.props.attributes['parallax-status'];

		const shapeStatus =
			!!this.props.attributes['shape-divider-top-status'] ||
			!!this.props.attributes['shape-divider-bottom-status'];

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
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
		const { attributes, clientId, hasInnerBlock, deviceType } = this.props;
		const { uniqueID, isFirstOnHierarchy, fullWidth } = attributes;

		const classes = 'maxi-container-block';

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<Fragment key={`container-content-${uniqueID}`}>
				{isFirstOnHierarchy && fullWidth && (
					<MaxiBlock
						className={classes}
						{...getMaxiBlockBlockAttributes(this.props)}
					>
						<ArrowDisplayer
							{...getGroupAttributes(attributes, 'arrow')}
							breakpoint={deviceType}
						/>
						<Indicators
							key={`indicators-${uniqueID}`}
							deviceType={deviceType}
							{...getGroupAttributes(attributes, [
								'padding',
								'margin',
							])}
						/>
						{attributes['shape-divider-top-status'] && (
							<ShapeDivider
								{...getGroupAttributes(
									attributes,
									'shapeDivider'
								)}
								location='top'
							/>
						)}
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={ROW_TEMPLATE}
							templateLock={false}
							__experimentalTagName='div'
							__experimentalPassedProps={{
								className: 'maxi-container-block__container',
							}}
							renderAppender={
								!hasInnerBlock
									? () => (
											<BlockPlaceholder
												clientId={clientId}
											/>
									  )
									: true
									? () => <InnerBlocks.ButtonBlockAppender />
									: false
							}
						/>
						{attributes['shape-divider-bottom-status'] && (
							<ShapeDivider
								{...getGroupAttributes(
									attributes,
									'shapeDivider'
								)}
								location='bottom'
							/>
						)}
					</MaxiBlock>
				)}
				{!fullWidth && (
					<InnerBlocks
						templateLock={false}
						__experimentalTagName={ContainerInnerBlocks}
						__experimentalPassedProps={{
							className: classes,
							...this.props,
						}}
						renderAppender={
							!hasInnerBlock
								? () => <BlockPlaceholder clientId={clientId} />
								: () => <InnerBlocks.ButtonBlockAppender />
						}
					/>
				)}
			</Fragment>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const hasInnerBlock = !isEmpty(
		select('core/block-editor').getBlockOrder(clientId)
	);
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		hasInnerBlock,
		deviceType,
	};
})(edit);
