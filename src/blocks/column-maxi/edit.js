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
import { MaxiBlockComponent } from '../../extensions/maxi-block';
import {
	BlockPlaceholder,
	BlockResizer,
	Toolbar,
	InnerBlocks,
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
		} = this.props;
		const { uniqueID } = attributes;

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
						'maxi-blocks/column-maxi',
					].indexOf(blockName) === -1
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
							<MaxiBlock
								key={`maxi-column--${uniqueID}`}
								ref={this.blockRef}
								{...getMaxiBlockBlockAttributes(this.props)}
								disableMotion
								tagName={BlockResizer}
								resizableObject={this.resizableObject}
								classes={classnames(
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
								<InnerBlocks
									allowedBlocks={ALLOWED_BLOCKS}
									orientation='horizontal'
									renderAppender={
										!hasInnerBlocks
											? BlockPlaceholder
											: InnerBlocks.ButtonBlockAppender
									}
								/>
							</MaxiBlock>
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
