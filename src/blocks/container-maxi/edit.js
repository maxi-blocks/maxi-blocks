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
	__experimentalToolbar,
	__experimentalBreadcrumbs,
	__experimentalBlockPlaceholder,
	__experimentalShapeDivider,
	__experimentalBackgroundDisplayer,
} from '../../components';
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getShapeDividerObject,
	getShapeDividerSVGObject,
	getArrowObject,
	getTransformObject,
	setBackgroundStyles,
} from '../../utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const {
		children,
		shapeDivider,
		className,
		dataAlign,
		maxiBlockClass,
	} = props;

	const shapeDividerValue = !isObject(shapeDivider)
		? JSON.parse(shapeDivider)
		: shapeDivider;

	return (
		<__experimentalBlock
			ref={ref}
			className={className}
			data-align={dataAlign}
			data-gx_initial_block_class={maxiBlockClass}
		>
			{!!shapeDividerValue.top.status && (
				<__experimentalShapeDivider
					shapeDividerOptions={shapeDivider}
				/>
			)}
			<div className='maxi-container-block__wrapper'>
				<div className='maxi-container-block__container'>
					{children}
				</div>
			</div>
			{!!shapeDividerValue.bottom.status && (
				<__experimentalShapeDivider
					position='bottom'
					shapeDividerOptions={shapeDivider}
				/>
			)}
		</__experimentalBlock>
	);
});

/**
 * Edit
 */
class edit extends MaxiBlock {
	get getObject() {
		const {
			uniqueID,
			background,
			backgroundHover,
			overlay,
			overlayHover,
		} = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${this.props.attributes.uniqueID}:before`]: this.getBeforeObject,
			[`${uniqueID}>.maxi-container-block__wrapper`]: this
				.getWrapperObject,
			[`${uniqueID}>.maxi-container-block__wrapper>.maxi-container-block__container`]: this
				.getContainerObject,
			[`${uniqueID} .maxi-shape-divider__top`]: {
				shapeDivider: {
					...getShapeDividerObject(
						JSON.parse(this.props.attributes.shapeDivider).top
					),
				},
			},
			[`${uniqueID} .maxi-shape-divider__top svg`]: {
				shapeDivider: {
					...getShapeDividerSVGObject(
						JSON.parse(this.props.attributes.shapeDivider).top
					),
				},
			},
			[`${uniqueID} .maxi-shape-divider__bottom`]: {
				shapeDivider: {
					...getShapeDividerObject(
						JSON.parse(this.props.attributes.shapeDivider).bottom
					),
				},
			},
			[`${uniqueID} .maxi-shape-divider__bottom svg`]: {
				shapeDivider: {
					...getShapeDividerSVGObject(
						JSON.parse(this.props.attributes.shapeDivider).bottom
					),
				},
			},
		};

		response = Object.assign(
			response,
			setBackgroundStyles(
				uniqueID,
				background,
				backgroundHover,
				overlay,
				overlayHover
			)
		);

		return response;
	}

	get getNormalObject() {
		const {
			size,
			opacity,
			border,
			boxShadow,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			size: { ...JSON.parse(size) },
			border: { ...JSON.parse(border) },
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			opacity: { ...JSON.parse(opacity) },
			zIndex: { ...JSON.parse(zIndex) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
			container: {
				label: 'Container',
				general: {},
			},
		};

		return response;
	}

	get getBeforeObject() {
		const { arrow } = this.props.attributes;

		const response = {
			arrow: { ...getArrowObject(JSON.parse(arrow)) },
		};

		return response;
	}

	get getHoverObject() {
		const { borderHover, boxShadowHover } = this.props.attributes;

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
			borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
		};

		return response;
	}

	get getWrapperObject() {
		const { margin, padding } = this.props.attributes;

		const response = {
			margin: { ...JSON.parse(margin) },
			padding: { ...JSON.parse(padding) },
		};

		return response;
	}

	get getContainerObject() {
		const { isFirstOnHierarchy, sizeContainer } = this.props.attributes;

		const response = {
			sizeContainer: { ...JSON.parse(sizeContainer) },
		};

		if (isFirstOnHierarchy) return response;

		return {};
	}

	render() {
		const {
			attributes: {
				uniqueID,
				isFirstOnHierarchy,
				blockStyle,
				defaultBlockStyle,
				fullWidth,
				extraClassName,
				background,
				shapeDivider,
			},
			className,
			clientId,
			hasInnerBlock,
		} = this.props;

		const classes = classnames(
			'maxi-block maxi-container-block',
			`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
			uniqueID,
			blockStyle,
			extraClassName,
			className
		);

		const shapeDividerValue = !isObject(shapeDivider)
			? JSON.parse(shapeDivider)
			: shapeDivider;

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBreadcrumbs />,
			<Fragment>
				{isFirstOnHierarchy && fullWidth && (
					<__experimentalBlock.section
						className={classes}
						data-align={fullWidth}
						data-maxi_initial_block_class={defaultBlockStyle}
					>
						<__experimentalBackgroundDisplayer
							background={background}
						/>

						{!!shapeDividerValue.top.status && (
							<__experimentalShapeDivider
								shapeDividerOptions={shapeDivider}
							/>
						)}

						<div className='maxi-container-block__wrapper'>
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
												<__experimentalBlockPlaceholder
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
						</div>
						{!!shapeDividerValue.bottom.status && (
							<__experimentalShapeDivider
								position='bottom'
								shapeDividerOptions={shapeDivider}
							/>
						)}
					</__experimentalBlock.section>
				)}
				{(!isFirstOnHierarchy || !fullWidth) && (
					<InnerBlocks
						templateLock={false}
						__experimentalTagName={ContainerInnerBlocks}
						__experimentalPassedProps={{
							className: classes,
							dataAlign: fullWidth,
							maxiBlockClass: defaultBlockStyle,
							shapeDivider,
						}}
						renderAppender={
							!hasInnerBlock
								? () => (
										<__experimentalBlockPlaceholder
											clientId={clientId}
										/>
								  )
								: true
								? () => <InnerBlocks.ButtonBlockAppender />
								: false
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
	let deviceType = select(
		'core/edit-post'
	).__experimentalGetPreviewDeviceType();
	deviceType = deviceType === 'Desktop' ? 'general' : deviceType;

	return {
		hasInnerBlock,
		deviceType,
	};
})(edit);
