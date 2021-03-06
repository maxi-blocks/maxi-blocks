/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const { Fragment, forwardRef } = wp.element;
const { InnerBlocks, __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	ArrowDisplayer,
	BackgroundDisplayer,
	BlockPlaceholder,
	Breadcrumbs,
	MaxiBlock,
	MotionPreview,
	ShapeDivider,
	Toolbar,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const {
		children,
		className,
		fullWidth,
		defaultBlockStyle,
		uniqueID,
	} = props;

	return (
		<__experimentalBlock
			ref={ref}
			className={className}
			data-align={fullWidth}
			data-gx_initial_block_class={defaultBlockStyle}
		>
			<BackgroundDisplayer
				{...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
				])}
				blockClassName={uniqueID}
			/>
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
		</__experimentalBlock>
	);
});

/**
 * Edit
 */

const ALLOWED_BLOCKS = ['maxi-blocks/row-maxi'];
const ROW_TEMPLATE = [['maxi-blocks/row-maxi']];

class edit extends MaxiBlock {
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
		const {
			attributes,
			className,
			clientId,
			hasInnerBlock,
			deviceType,
		} = this.props;
		const {
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			fullWidth,
			extraClassName,
		} = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-container-block',
			'maxi-motion-effect',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			className
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<Breadcrumbs key={`breadcrumbs-${uniqueID}`} />,
			<Fragment key={`container-content-${uniqueID}`}>
				{isFirstOnHierarchy && fullWidth && (
					<MotionPreview
						key={`motion-preview-${uniqueID}`}
						{...getGroupAttributes(attributes, 'motion')}
					>
						<__experimentalBlock.section
							className={classes}
							data-align={fullWidth}
						>
							<ArrowDisplayer
								{...getGroupAttributes(attributes, 'arrow')}
								breakpoint={deviceType}
							/>
							<BackgroundDisplayer
								{...getGroupAttributes(attributes, [
									'background',
									'backgroundColor',
									'backgroundImage',
									'backgroundVideo',
									'backgroundGradient',
									'backgroundSVG',
									'backgroundHover',
									'backgroundColorHover',
									'backgroundImageHover',
									'backgroundVideoHover',
									'backgroundGradientHover',
									'backgroundSVGHover',
								])}
								blockClassName={uniqueID}
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
									className:
										'maxi-container-block__container',
								}}
								renderAppender={
									!hasInnerBlock
										? () => (
												<BlockPlaceholder
													clientId={clientId}
												/>
										  )
										: true
										? () => (
												<InnerBlocks.ButtonBlockAppender />
										  )
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
						</__experimentalBlock.section>
					</MotionPreview>
				)}
				{!fullWidth && (
					<InnerBlocks
						templateLock={false}
						__experimentalTagName={ContainerInnerBlocks}
						__experimentalPassedProps={{
							className: classes,
							...attributes,
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
