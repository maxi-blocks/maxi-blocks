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
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { BlockInserter, BlockResizer, Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round, isEqual } from 'lodash';

/**
 * Editor
 */
class edit extends MaxiBlockComponent {
	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	maxiBlockGetSnapshotBeforeUpdate(prevProps) {
		return isEqual(prevProps.rowGapProps, this.props.rowGapProps);
	}

	maxiBlockDidUpdate() {
		if (this.resizableObject.current) {
			const columnWidth = getLastBreakpointAttribute({
				target: 'column-size',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			});

			if (
				this.resizableObject.current.state.width !== `${columnWidth}%`
			) {
				this.resizableObject.current.updateSize({
					width: `${columnWidth}%`,
				});

				this.resizableObject.current.resizable.style.flexBasis = '';
				this.resizableObject.current.resizable.style.flexShrink = '';
			}
		}
	}

	get getStylesObject() {
		return getStyles(this.props.attributes, this.props.rowGapProps);
	}

	render() {
		const {
			attributes,
			deviceType,
			originalNestedColumns,
			rowBlockId,
			maxiSetAttributes,
			updateRowPattern,
			hasInnerBlocks,
			clientId,
		} = this.props;
		const { uniqueID } = attributes;

		const getColumnWidthDefault = () => {
			const columnWidth = getLastBreakpointAttribute({
				target: 'column-size',
				breakpoint: deviceType,
				attributes,
			});

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

		const getIsOverflowHidden = () =>
			getLastBreakpointAttribute({
				target: 'overflow-y',
				breakpoint: deviceType,
				attributes,
			}) === 'hidden' &&
			getLastBreakpointAttribute({
				target: 'overflow-x',
				breakpoint: deviceType,
				attributes,
			}) === 'hidden';

		const emptyColumnClass = !hasInnerBlocks
			? 'maxi-column-block__empty'
			: 'maxi-column-block__has-innerBlock';

		return (
			<RowContext.Consumer>
				{context => [
					<Inspector
						key={`block-settings-${uniqueID}`}
						rowPattern={context.rowPattern}
						{...this.props}
					/>,
					<Toolbar
						key={`toolbar-${uniqueID}`}
						ref={this.blockRef}
						rowPattern={context.rowPattern}
						copyPasteMapping={copyPasteMapping}
						propsToAvoid={['resizableObject']}
						{...this.props}
					/>,
					<MaxiBlock
						key={`maxi-column--${uniqueID}`}
						ref={this.blockRef}
						{...getMaxiBlockAttributes(this.props)}
						isOverflowHidden={getIsOverflowHidden()}
						tagName={BlockResizer}
						resizableObject={this.resizableObject}
						classes={classnames(
							emptyColumnClass,
							'maxi-block',
							'maxi-block--backend',
							'maxi-column-block__resizer',
							`maxi-column-block__resizer__${uniqueID}`,
							getLastBreakpointAttribute({
								target: 'display',
								breakpoint: deviceType,
								attributes,
								isHover: false,
								forceSingle: true,
							}) === 'none' && 'maxi-block-display-none'
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

							maxiSetAttributes({
								[`column-size-${deviceType}`]: round(
									+elt.style.width.replace('%', '')
								),
							});
						}}
						useInnerBlocks
						innerBlocksSettings={{
							allowedBlocks: ALLOWED_BLOCKS,
							orientation: 'vertical',
							templateLock: false,
							renderAppender: !hasInnerBlocks
								? () => <BlockInserter clientId={clientId} />
								: false,
						}}
					/>,
				]}
			</RowContext.Consumer>
		);
	}
}

const editSelect = withSelect((select, ownProps) => {
	const { clientId } = ownProps;

	const { getBlockRootClientId, getBlockOrder, getBlockAttributes } =
		select('core/block-editor');

	const rowBlockId = getBlockRootClientId(clientId);
	const originalNestedColumns = getBlockOrder(rowBlockId);
	const rowAttributes = getBlockAttributes(rowBlockId);

	const rowGapProps =
		rowAttributes &&
		(() => {
			const response = getGroupAttributes(rowAttributes, 'flex');

			Object.keys(response).forEach(key => {
				if (!key.includes('gap')) delete response[key];
			});

			return response;
		})();

	return {
		rowBlockId,
		originalNestedColumns,
		rowGapProps,
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

export default compose(editSelect, editDispatch, withMaxiProps)(edit);
