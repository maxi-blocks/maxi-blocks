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
import RowContext from '../row-maxi/context';

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
			[`maxi-column-block__resizer__${uniqueID}`]: this.getResizerObject,
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
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
		const { boxShadowHover, borderHover } = this.props.attributes;

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
				columnSize,
				background,
				extraClassName,
				defaultBlockStyle,
				display,
			},
			clientId,
			className,
			rowBlockWidth,
			hasInnerBlock,
			deviceType,
			onDeviceTypeChange,
			originalNestedColumns,
			setAttributes,
			rowBlockId,
			updateRowPattern,
		} = this.props;

		onDeviceTypeChange();

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-column-block',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			extraClassName,
			className
		);

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
			<RowContext.Consumer>
				{context => (
					<Fragment>
						{rowBlockWidth === 0 && <Spinner />}
						{rowBlockWidth !== 0 && (
							<ResizableBox
								showHandle={context.displayHandlers}
								className={classnames(
									'maxi-block--backend', // Required by BackEndResponsiveStyles class to apply the styles
									'maxi-block__resizer',
									'maxi-column-block__resizer',
									`maxi-column-block__resizer__${uniqueID}`
								)}
								defaultSize={{
									width: getColumnWidthDefault(),
								}}
								minWidth='1%'
								maxWidth='100%'
								enable={{
									top: false,
									right: true,
									bottom: false,
									left: true,
									topRight: false,
									bottomRight: false,
									bottomLeft: false,
									topLeft: false,
								}}
								onResizeStop={(event, direction, elt) => {
									columnValue[deviceType].size = round(
										Number(elt.style.width.replace('%', ''))
									);

									updateRowPattern(
										rowBlockId,
										deviceType,
										context.rowPattern
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
											? () => (
													<InnerBlocks.ButtonBlockAppender />
											  )
											: false
									}
								/>
							</ResizableBox>
						)}
					</Fragment>
				)}
			</RowContext.Consumer>,
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
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

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
	} = ownProps;

	const onDeviceTypeChange = () => {
		let newDeviceType = select('maxiBlocks').receiveMaxiDeviceType();
		newDeviceType = newDeviceType === 'Desktop' ? 'general' : newDeviceType;

		const node = document.querySelector(
			`.maxi-column-block__resizer__${uniqueID}`
		);
		if (isNil(node)) return;

		const newColumnSize = JSON.parse(columnSize);

		const newSize = newColumnSize[newDeviceType].size;

		if (['xxl', 'xl', 'l'].includes(newDeviceType)) {
			if (newSize === '') {
				node.style.width = `${newColumnSize.general.size}%`;
			} else {
				node.style.width = `${newSize}%`;
			}
		} else if (['s', 'xs'].includes(newDeviceType)) {
			if (newSize === '') {
				node.style.width = `${newColumnSize.m.size}%`;
			} else {
				node.style.width = `${newSize}%`;
			}
		} else {
			node.style.width = `${newSize}%`;
		}
	};

	const updateRowPattern = (rowBlockId, deviceType, rowPatternAttribute) => {
		const newRowPatternObject = JSON.parse(rowPatternAttribute);

		const { rowPattern } = newRowPatternObject[deviceType];

		if (rowPattern.indexOf('custom-') === -1) {
			newRowPatternObject[deviceType].rowPattern = `custom-${rowPattern}`;
		}

		dispatch('core/block-editor').updateBlockAttributes(rowBlockId, {
			rowPattern: JSON.stringify(newRowPatternObject),
		});
	};

	return {
		onDeviceTypeChange,
		updateRowPattern,
	};
});

export default compose(editSelect, editDispatch)(edit);
