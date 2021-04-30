/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { Fragment, forwardRef, createRef } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from '../row-maxi/context';
import {
	BlockPlaceholder,
	BlockResizer,
	MaxiBlockComponent,
	Toolbar,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getLastBreakpointAttribute } from '../../extensions/styles';
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
	const {
		children,
		className,
		attributes: { uniqueID },
	} = props;

	return (
		<MaxiBlock
			key={`maxi-column--${uniqueID}`}
			ref={ref}
			className={className}
			{...getMaxiBlockBlockAttributes(props)}
			disableMotion
		>
			{children}
		</MaxiBlock>
	);
});

/**
 * Editor
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	componentDidUpdate() {
		this.displayStyles();

		if (this.resizableObject.current) {
			// Cheating to make appear 'resizableObject' as an attribute 👍
			this.props.setAttributes({
				resizableObject: this.resizableObject.current,
			});

			const columnWidth = getLastBreakpointAttribute(
				'column-size',
				this.props.deviceType || 'general',
				this.props.attributes
			);

			this.resizableObject.current.updateSize({
				width: `${columnWidth}%`,
			});
		}
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const {
			attributes,
			clientId,
			deviceType,
			hasInnerBlock,
			originalNestedColumns,
			rowBlockId,
			rowBlockWidth,
			setAttributes,
			updateRowPattern,
		} = this.props;
		const { uniqueID } = attributes;

		const classes = 'maxi-column-block';

		const getColumnWidthDefault = () => {
			const columnWidth = getLastBreakpointAttribute(
				'column-size',
				deviceType,
				attributes
			);

			if (columnWidth) return `${columnWidth}%`;

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
						'maxi-blocks/column-maxi',
					].indexOf(blockName) === -1
			);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				resizableObject={this.resizableObject.current}
				{...this.props}
			/>,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<RowContext.Consumer key={`column-content-${uniqueID}`}>
				{context => (
					<Fragment>
						{rowBlockWidth === 0 && <Spinner />}
						{rowBlockWidth !== 0 && (
							<BlockResizer
								resizableObject={this.resizableObject}
								className={classnames(
									'maxi-block',
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
								enable={{
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
										...this.props,
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

const editDispatch = withDispatch(dispatch => {
	const updateRowPattern = (rowBlockId, deviceType, rowPatternAttribute) => {
		dispatch('core/block-editor').updateBlockAttributes(rowBlockId, {
			rowPattern: rowPatternAttribute[`row-pattern-${deviceType}`],
		});
	};

	return {
		updateRowPattern,
	};
});

export default compose(editSelect, editDispatch)(edit);
