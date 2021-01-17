/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const { Fragment, forwardRef } = wp.element;
const { InnerBlocks, __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
	MaxiBlock,
	Toolbar,
	Breadcrumbs,
	BlockPlaceholder,
	ArrowDisplayer,
} from '../../components';
import Inspector from './inspector';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import ShapeDivider from '../../components/shape-divider/newShapeDivider';
import MotionPreview from '../../components/motion-preview/newMotionPreview';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';

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
			{props['shape-divider-top-status'] && (
				<ShapeDivider
					{...getGroupAttributes(props, 'shapeDivider')}
					location='top'
				/>
			)}
			<div className='maxi-container-block__wrapper'>
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
				<div className='maxi-container-block__container'>
					{children}
				</div>
			</div>
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
					...getGroupAttributes(this.props.attributes, 'motion'),
					...getGroupAttributes(this.props.attributes, 'entrance'),
					...getGroupAttributes(this.props.attributes, 'parallax'),
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
			`maxi-motion-effect-${uniqueID}`,
			getLastBreakpointValue('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			className
		);

		return [
			<Inspector {...this.props} />,
			<Toolbar {...this.props} />,
			<Breadcrumbs />,
			<Fragment>
				{isFirstOnHierarchy && fullWidth && (
					<MotionPreview
						{...getGroupAttributes(attributes, 'motion')}
					>
						<__experimentalBlock.section
							className={classes}
							data-align={fullWidth}
							data-maxi_initial_block_class={defaultBlockStyle}
						>
							<ArrowDisplayer
								{...getGroupAttributes(attributes, 'arrow')}
								breakpoint={deviceType}
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
							<div className='maxi-container-block__wrapper'>
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
								<InnerBlocks
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
											: () => (
													<InnerBlocks.ButtonBlockAppender />
											  )
									}
								/>
							</div>
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
				{(!isFirstOnHierarchy || !fullWidth) && (
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
