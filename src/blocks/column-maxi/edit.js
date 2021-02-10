/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Fragment, forwardRef, createRef } = wp.element;
const { Spinner } = wp.components;
const { withSelect, withDispatch, select } = wp.data;
const { InnerBlocks, __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from '../row-maxi/context';
import {
	BackgroundDisplayer,
	BlockPlaceholder,
	BlockResizer,
	MaxiBlock,
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
import { isNil, round } from 'lodash';

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
			<BackgroundDisplayer {...background} />
			{children}
		</__experimentalBlock.div>
	);
});

/**
 * Editor
 */
class edit extends MaxiBlock {
	constructor(props) {
		super(props);
		this.resizableObject = createRef();
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const {
			attributes,
			className,
			clientId,
			deviceType,
			hasInnerBlock,
			onDeviceTypeChange,
			originalNestedColumns,
			rowBlockId,
			rowBlockWidth,
			setAttributes,
			updateRowPattern,
		} = this.props;
		const {
			blockStyle,
			blockStyleBackground,
			defaultBlockStyle,
			extraClassName,
			uniqueID,
		} = attributes;

		onDeviceTypeChange(this.resizableObject.current);

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-column-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			uniqueID,
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			className
		);

		const getColumnWidthDefault = () => {
			if (
				getLastBreakpointAttribute(
					'column-size',
					deviceType,
					attributes
				)
			)
				return `${getLastBreakpointAttribute(
					'column-size',
					deviceType,
					attributes
				)}%`;

			return `${100 / originalNestedColumns.length}%`;
		};

		/**
		 * TODO: Gutenberg still does not have the disallowedBlocks feature
		 */
		const ALLOWED_BLOCKS = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(
				blockName =>
					[
						'maxi-blocks/container-maxi',
						'maxi-blocks/row-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				resizableObject={this.resizableObject.current}
				{...this.props}
			/>,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<RowContext.Consumer>
				{context => (
					<Fragment>
						{rowBlockWidth === 0 && <Spinner />}
						{rowBlockWidth !== 0 && (
							<BlockResizer
								resizableObject={this.resizableObject}
								className={classnames(
									'maxi-block--backend',
									'maxi-column-block__resizer',
									`maxi-column-block__resizer__${uniqueID}`,
									getLastBreakpointAttribute(
										'display',
										deviceType,
										attributes
									) === 'none' && 'maxi-block-display-none'
								)}
								defaultSize={{ width: getColumnWidthDefault() }}
								deviceType={deviceType}
								updateRowPattern={updateRowPattern}
								rowBlockId={rowBlockId}
								directions={{
									right: true,
									left: true,
								}}
								minWidth='1%'
								maxWidth='100%'
								showHandle={context.displayHandlers}
								onResizeStop={(event, direction, elt) => {
									updateRowPattern(
										rowBlockId,
										deviceType,
										context.rowPattern
									);

									setAttributes({
										[`column-size-${deviceType}`]: round(
											+elt.style.width.replace('%', '')
										),
									});
								}}
							>
								<InnerBlocks
									allowedBlocks={ALLOWED_BLOCKS}
									templateLock={false}
									__experimentalTagName={ContainerInnerBlocks}
									__experimentalPassedProps={{
										className: classes,
										maxiBlockClass: defaultBlockStyle,
										background: {
											...getGroupAttributes(attributes, [
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
											]),
										},
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
							</BlockResizer>
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
	const onDeviceTypeChange = resizableObject => {
		if (isNil(resizableObject)) return;

		let newDeviceType = select('maxiBlocks').receiveMaxiDeviceType();
		newDeviceType = newDeviceType === 'Desktop' ? 'general' : newDeviceType;

		const node = resizableObject.resizable;
		const newSize = ownProps.attributes[`column-size-${newDeviceType}`];

		if (['xxl', 'xl', 'l'].includes(newDeviceType)) {
			if (newSize === '') {
				node.style.width = `${ownProps.attributes['column-size-general']}%`;
			} else {
				node.style.width = `${newSize}%`;
			}
		} else if (['s', 'xs'].includes(newDeviceType)) {
			if (newSize === '') {
				node.style.width = `${ownProps.attributes['column-size-m']}%`;
			} else {
				node.style.width = `${newSize}%`;
			}
		} else {
			node.style.width = `${newSize}%`;
		}
	};

	const updateRowPattern = (rowBlockId, deviceType, rowPatternAttribute) => {
		dispatch('core/block-editor').updateBlockAttributes(rowBlockId, {
			rowPattern: rowPatternAttribute[`row-pattern-${deviceType}`],
		});
	};

	return {
		onDeviceTypeChange,
		updateRowPattern,
	};
});

export default compose(editSelect, editDispatch)(edit);
