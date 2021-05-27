/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { createRef } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

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
	InnerBlocks,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import {
	getLastBreakpointAttribute,
	getPaletteClasses,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round, isEmpty } from 'lodash';

/**
 * Editor
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	maxiBlockDidUpdate() {
		this.displayStyles();

		if (this.resizableObject.current) {
			const columnWidth = getLastBreakpointAttribute(
				'column-size',
				this.props.deviceType || 'general',
				this.props.attributes
			);

			if (this.resizableObject.current.state.width !== `${columnWidth}%`)
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
			deviceType,
			originalNestedColumns,
			rowBlockId,
			setAttributes,
			updateRowPattern,
			hasInnerBlocks,
			clientId,
		} = this.props;
		const { uniqueID, parentBlockStyle } = attributes;

		const getColumnWidthDefault = () => {
			const columnWidth = getLastBreakpointAttribute(
				'column-size',
				deviceType,
				attributes
			);

			if (columnWidth) return `${columnWidth}%`;

			return `${100 / originalNestedColumns.length}%`;
		};

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

		const paletteClasses = getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
			],
			'maxi-blocks/column-maxi',
			parentBlockStyle
		);

		return [
			<RowContext.Consumer key={`column-content-${uniqueID}`}>
				{context => {
					return (
						<>
							<Inspector
								key={`block-settings-${uniqueID}`}
								rowPattern={context.rowPattern}
								{...this.props}
							/>
							<Toolbar
								key={`toolbar-${uniqueID}`}
								ref={this.blockRef}
								rowPattern={context.rowPattern}
								propsToAvoid={['resizableObject']}
								{...this.props}
							/>
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
										attributes,
										false,
										true
									) === 'none' && 'maxi-block-display-none'
								)}
								defaultSize={{
									width: getColumnWidthDefault(),
								}}
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
								<MaxiBlock
									key={`maxi-column--${uniqueID}`}
									ref={this.blockRef}
									paletteClasses={paletteClasses}
									{...getMaxiBlockBlockAttributes(this.props)}
									disableMotion
								>
									<InnerBlocks
										allowedBlocks={ALLOWED_BLOCKS}
										orientation='horizontal'
										renderAppender={
											!hasInnerBlocks
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
								</MaxiBlock>
							</BlockResizer>
						</>
					);
				}}
			</RowContext.Consumer>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const { getBlockRootClientId, getBlockOrder } = select('core/block-editor');

	const rowBlockId = getBlockRootClientId(clientId);
	const originalNestedColumns = getBlockOrder(rowBlockId);
	const hasInnerBlocks = !isEmpty(getBlockOrder(clientId));

	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		rowBlockId,
		originalNestedColumns,
		deviceType,
		hasInnerBlocks,
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
