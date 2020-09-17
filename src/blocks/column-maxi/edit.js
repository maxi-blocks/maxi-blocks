/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Fragment, forwardRef } = wp.element;
const { ResizableBox, Spinner } = wp.components;
const { withSelect, withDispatch, select } = wp.data;
const { InnerBlocks, __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
	MaxiBlock,
	__experimentalToolbar,
	__experimentalBlockPlaceholder,
	__experimentalBackgroundDisplayer,
} from '../../components';
import Inspector from './inspector';
import {
	getLastBreakpointValue,
	getBackgroundObject,
	getBoxShadowObject,
	getOpacityObject,
	getColumnSizeObject,
	getTransformObject,
	setBackgroundStyles,
} from '../../utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, round, isObject } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
	const { children, background, className, maxiBlockClass } = props;

	return (
		<__experimentalBlock.div
			ref={ref}
			className={className}
			data-gx_initial_block_class={maxiBlockClass}
		>
			<__experimentalBackgroundDisplayer background={background} />
			{children}
		</__experimentalBlock.div>
	);
});

/**
 * Editor
 */
class edit extends MaxiBlock {
	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`maxi-column-block__resizer__${uniqueID}`]: this.getResizerObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		return response;
	}

	/**
	 * Get object for styling
	 */
	get getNormalObject() {
		const {
			attributes: {
				columnSize,
				verticalAlign,
				opacity,
				boxShadow,
				border,
				size,
				margin,
				padding,
				zIndex,
				display,
				transform,
			},
		} = this.props;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			size: { ...JSON.parse(size) },
			margin: { ...JSON.parse(margin) },
			padding: { ...JSON.parse(padding) },
			opacity: { ...getOpacityObject(JSON.parse(opacity)) },
			zIndex: { ...JSON.parse(zIndex) },
			columnSize: { ...getColumnSizeObject(JSON.parse(columnSize)) },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
			column: {
				label: 'Column',
				general: {},
			},
		};

		if (!isNil(verticalAlign))
			response.column.general['justify-content'] = verticalAlign;

		return response;
	}

	get getHoverObject() {
		const {
			opacityHover,
			boxShadowHover,
			borderHover,
		} = this.props.attributes;

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
			borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
			opacity: { ...getOpacityObject(JSON.parse(opacityHover)) },
		};

		return response;
	}

	get getBackgroundObject() {
		const { background } = this.props.attributes;

		const response = {
			background: { ...getBackgroundObject(JSON.parse(background)) },
		};

		return response;
	}

	get getResizerObject() {
		const { margin, display } = this.props.attributes;

		const response = {
			margin: { ...JSON.parse(margin) },
			display: { ...JSON.parse(display) },
		};

		return response;
	}

	render() {
		const {
			attributes: {
				uniqueID,
				blockStyle,
				size,
				columnSize,
				background,
				extraClassName,
				defaultBlockStyle,
			},
			clientId,
			className,
			rowBlockWidth,
			hasInnerBlock,
			deviceType,
			onDeviceTypeChange,
			originalNestedColumns,
			setAttributes,
		} = this.props;

		onDeviceTypeChange();

		const classes = classnames(
			'maxi-block',
			'maxi-column-block',
			uniqueID,
			blockStyle,
			extraClassName,
			className
		);

		const sizeValue = !isObject(size) ? JSON.parse(size) : size;

		const columnValue = !isObject(columnSize)
			? JSON.parse(columnSize)
			: columnSize;

		const getColumnWidthDefault = () => {
			if (getLastBreakpointValue(columnValue, 'size', deviceType))
				return `${getLastBreakpointValue(
					columnValue,
					'size',
					deviceType
				)}%`;

			return `${100 / originalNestedColumns.length}%`;
		};

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<Fragment>
				{rowBlockWidth === 0 && <Spinner />}
				{rowBlockWidth !== 0 && (
					<ResizableBox
						className={classnames(
							'maxi-block__resizer',
							'maxi-column-block__resizer',
							`maxi-column-block__resizer__${uniqueID}`
						)}
						defaultSize={{
							width: getColumnWidthDefault(),
						}}
						minWidth='1%'
						maxWidth={
							(sizeValue[deviceType]['max-width'] &&
								`${sizeValue[deviceType]['max-width']}${sizeValue[deviceType]['max-widthUnit']}`) ||
							'100%'
						}
						enable={{
							top: false,
							right: true,
							bottom: false,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						}}
						onResizeStop={(event, direction, elt) => {
							columnValue[deviceType].size = round(
								Number(elt.style.width.replace('%', ''))
							);

							setAttributes({
								columnSize: JSON.stringify(columnValue),
							});
						}}
					>
						<InnerBlocks
							// allowedBlocks={ALLOWED_BLOCKS}
							templateLock={false}
							__experimentalTagName={ContainerInnerBlocks}
							__experimentalPassedProps={{
								className: classes,
								maxiBlockClass: defaultBlockStyle,
								background,
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
					</ResizableBox>
				)}
			</Fragment>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const rowBlockId = select('core/block-editor').getBlockRootClientId(
		clientId
	); // getBlockHierarchyRootClientId
	const rowBlockNode = document.querySelector(
		`div[data-block="${rowBlockId}"]`
	);
	const rowBlockWidth = !isNil(rowBlockNode)
		? rowBlockNode.getBoundingClientRect().width
		: 0;
	const hasInnerBlock =
		select('core/block-editor').getBlockOrder(clientId).length >= 1;
	const originalNestedColumns = select('core/block-editor').getBlockOrder(
		rowBlockId
	);
	let deviceType = select(
		'core/edit-post'
	).__experimentalGetPreviewDeviceType();
	deviceType = deviceType === 'Desktop' ? 'general' : deviceType;

	return {
		rowBlockId,
		rowBlockWidth,
		hasInnerBlock,
		originalNestedColumns,
		deviceType,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: { uniqueID, columnSize },
		deviceType,
	} = ownProps;

	const onDeviceTypeChange = () => {
		let newDeviceType = select(
			'core/edit-post'
		).__experimentalGetPreviewDeviceType();
		newDeviceType = newDeviceType === 'Desktop' ? 'general' : newDeviceType;

		const allowedDeviceTypes = ['general', 'xl', 'l', 'm', 's'];

		if (
			allowedDeviceTypes.includes(newDeviceType) &&
			deviceType !== newDeviceType
		) {
			const node = document.querySelector(
				`.maxi-column-block__resizer__${uniqueID}`
			);
			if (isNil(node)) return;
			const newColumnSize = JSON.parse(columnSize);
			node.style.width = `${newColumnSize[newDeviceType].size}%`;
		}
	};

	return {
		onDeviceTypeChange,
	};
});

export default compose(editSelect, editDispatch)(edit);
