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
	__experimentalArrowDisplayer,
	__experimentalMotionPreview,
} from '../../components';
import Inspector from './inspector';
import {
	getBoxShadowObject,
	getShapeDividerObject,
	getShapeDividerSVGObject,
	getTransformObject,
	setBackgroundStyles,
	setArrowStyles,
	getLastBreakpointValue,
} from '../../utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isObject, isNil } from 'lodash';

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
		uniqueID,
		background,
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
				<__experimentalBackgroundDisplayer
					background={background}
					blockClassName={uniqueID}
				/>
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
			arrow,
			background,
			backgroundHover,
			overlay,
			overlayHover,
			border,
			borderHover,
			boxShadow,
			shapeDivider,
		} = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID}>.maxi-container-block__wrapper`]: this
				.getWrapperObject,
			[`${uniqueID}>.maxi-container-block__wrapper>.maxi-container-block__container`]: this
				.getContainerObject,
			[`${uniqueID} .maxi-shape-divider__top`]: {
				shapeDivider: {
					...getShapeDividerObject(JSON.parse(shapeDivider).top),
				},
			},
			[`${uniqueID} .maxi-shape-divider__top svg`]: {
				shapeDivider: {
					...getShapeDividerSVGObject(JSON.parse(shapeDivider).top),
				},
			},
			[`${uniqueID} .maxi-shape-divider__bottom`]: {
				shapeDivider: {
					...getShapeDividerObject(JSON.parse(shapeDivider).bottom),
				},
			},
			[`${uniqueID} .maxi-shape-divider__bottom svg`]: {
				shapeDivider: {
					...getShapeDividerSVGObject(
						JSON.parse(shapeDivider).bottom
					),
				},
			},
		};

		response = Object.assign(
			response,
			setBackgroundStyles(
				`${uniqueID} .maxi-container-block__wrapper`,
				background,
				backgroundHover,
				overlay,
				overlayHover,
				border,
				borderHover
			),
			setArrowStyles(uniqueID, arrow, background, border, boxShadow)
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

	get getHoverObject() {
		const { borderHover, boxShadowHover } = this.props.attributes;

		const response = {
			borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
			borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
		};

		if (!isNil(boxShadowHover) && !!JSON.parse(boxShadowHover).status) {
			response.boxShadowHover = {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			};
		}

		if (!isNil(borderHover) && !!JSON.parse(borderHover).status) {
			response.borderHover = {
				...JSON.parse(borderHover),
			};
		}

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
				blockStyleBackground,
				fullWidth,
				extraClassName,
				background,
				shapeDivider,
				arrow,
				display,
				motion,
			},
			className,
			clientId,
			hasInnerBlock,
			deviceType,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-container-block',
			'maxi-motion-effect',
			`maxi-motion-effect-${uniqueID}`,
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
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
					<__experimentalMotionPreview motion={motion}>
						<__experimentalBlock.section
							className={classes}
							data-align={fullWidth}
							data-maxi_initial_block_class={defaultBlockStyle}
						>
							<__experimentalArrowDisplayer arrow={arrow} />

							{!!shapeDividerValue.top.status && (
								<__experimentalShapeDivider
									shapeDividerOptions={shapeDivider}
								/>
							)}

							<div className='maxi-container-block__wrapper'>
								<__experimentalBackgroundDisplayer
									background={background}
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
					</__experimentalMotionPreview>
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
							background,
							uniqueID,
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
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		hasInnerBlock,
		deviceType,
	};
})(edit);
