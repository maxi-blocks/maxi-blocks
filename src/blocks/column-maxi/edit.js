/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { createRef } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round, isEmpty, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import BlockInserter from '@components/block-inserter';
import BlockResizer from '@components/block-resizer';

import RowContext from '@blocks/row-maxi/rowContext';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getMaxiBlockAttributes, MaxiBlock } from '@components/maxi-block';
import { getColumnSizeStyles } from '@extensions/styles/helpers';
import {
	getGroupAttributes,
	getIsOverflowHidden,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import getRowBorderRadius from './utils';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '@extensions/DC';
import { DISALLOWED_BLOCKS } from '@extensions/repeater';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * Editor
 */
class edit extends MaxiBlockComponent {
	static contextType = RowContext;

	constructor(props) {
		super(props);

		this.resizableObject = createRef();
	}

	rowGapProps = {};

	rowBorderRadius = {};

	maxiBlockDidMount() {
		this.context.setColumnClientId(this.props.clientId);

		this.context.setColumnSize(
			this.props.clientId,
			getGroupAttributes(this.props.attributes, 'columnSize')
		);
	}

	maxiBlockGetSnapshotBeforeUpdate(prevProps) {
		// maxiBlockComponent doesn't get the context from its extensions,
		// and we need to compare the previous and current row border radius
		// to know if we need to update the styles.
		if (
			!isEqual(this.rowGapProps, this.context.rowGapProps) ||
			!isEqual(this.rowBorderRadius, this.context.rowBorderRadius)
		) {
			this.rowGapProps = this.context.rowGapProps;
			this.rowBorderRadius = getRowBorderRadius(
				this.context.rowBorderRadius,
				this.context.columnsClientIds,
				this.props.clientId
			);

			return false;
		}

		return true;
	}

	getWidth() {
		const { attributes, deviceType, clientId } = this.props;
		const { rowGapProps, columnsSize, columnsClientIds } = this.context;

		const columnValues = getColumnSizeStyles(
			{
				...getGroupAttributes(attributes, 'columnSize'),
			},
			{
				...rowGapProps,
				columnNum: columnsClientIds.length,
				columnsSize,
			},
			clientId
		);

		return getLastBreakpointAttribute({
			target: null,
			breakpoint: deviceType,
			attributes: columnValues,
			keys: ['width'],
		});
	}

	getHeight() {
		const forceAspectRatio = getLastBreakpointAttribute({
			target: 'force-aspect-ratio',
			breakpoint: this.props.deviceType || 'general',
			attributes: this.props.attributes,
		});

		if (forceAspectRatio) return 'auto';

		const columnHeightAttribute = getLastBreakpointAttribute({
			target: 'height',
			breakpoint: this.props.deviceType || 'general',
			attributes: this.props.attributes,
		});

		if (columnHeightAttribute)
			return `${columnHeightAttribute}${getLastBreakpointAttribute({
				target: 'height-unit',
				breakpoint: this.props.deviceType || 'general',
				attributes: this.props.attributes,
			})}`;

		return 'auto';
	}

	maxiBlockDidUpdate(prevProps) {
		if (this.resizableObject.current) {
			const columnWidth = this.getWidth();
			const columnHeight = this.getHeight();

			if (
				this.resizableObject.current.state.width !== columnWidth ||
				this.resizableObject.current.state.height !== columnHeight
			) {
				this.resizableObject.current.updateSize({
					width: columnWidth,
					height: columnHeight,
				});
			}

			this.resizableObject.current.resizable.style.flexBasis = '';
			this.resizableObject.current.resizable.style.flexShrink = '';
		}

		// Updates columnSize on the context if the column size has changed.
		const prevColumnSize = getGroupAttributes(
			prevProps.attributes,
			'columnSize'
		);
		const columnSize = getGroupAttributes(
			this.props.attributes,
			'columnSize'
		);

		if (!isEqual(prevColumnSize, columnSize))
			this.context.setColumnSize(this.props.clientId, columnSize);
	}

	maxiBlockWillUnmount() {
		this.context.removeColumnClientId(this.props.clientId);
	}

	/**
	 * Same stabilization as row/container: avoid flipping `renderAppender` when `withMaxiProps`
	 * briefly reports no inner blocks during a store update (e.g. main inserter).
	 *
	 * @return {boolean}
	 */
	getHasInnerBlocksStable() {
		const { clientId, hasInnerBlocks } = this.props;
		return (
			hasInnerBlocks ||
			!isEmpty(select('core/block-editor').getBlockOrder(clientId))
		);
	}

	/**
	 * Memoize innerBlocksSettings to avoid a new object reference on every render.
	 */
	getMemoizedInnerBlocksSettings() {
		const hasInnerBlocks = this.getHasInnerBlocksStable();

		// ALLOWED_BLOCKS is expensive: computed once per repeaterStatus change.
		const repeaterStatus = this.props.repeaterStatus;
		if (
			!this._memoizedAllowedBlocks ||
			this._prevRepeaterStatus !== repeaterStatus
		) {
			this._prevRepeaterStatus = repeaterStatus;
			this._memoizedAllowedBlocks = wp.blocks
				.getBlockTypes()
				.map(block => block.name)
				.filter(
					blockName =>
						[
							'maxi-blocks/container-maxi',
							'maxi-blocks/column-maxi',
							'maxi-blocks/pane-maxi',
							'maxi-blocks/maxi-cloud',
							'maxi-blocks/slide-maxi',
							'maxi-blocks/list-item-maxi',
							'core/list-item',
							...DISALLOWED_BLOCKS,
						].indexOf(blockName) === -1
				)
				.concat(
					repeaterStatus
						? Array(DISALLOWED_BLOCKS.length).fill(null)
						: DISALLOWED_BLOCKS
				);
		}

		const next = {
			allowedBlocks: this._memoizedAllowedBlocks,
			orientation: 'vertical',
			templateLock: false,
			renderAppender: !hasInnerBlocks
				? this.renderColumnAppender
				: false,
		};

		if (
			this._memoizedInnerBlocksSettings &&
			isEqual(this._memoizedInnerBlocksSettings, next)
		) {
			return this._memoizedInnerBlocksSettings;
		}

		this._memoizedInnerBlocksSettings = next;
		return next;
	}

	/** Stable renderAppender for column — avoids inline function on every render. */
	renderColumnAppender = () => {
		const { clientId } = this.props;
		return <BlockInserter clientId={clientId} />;
	};

	get getStylesObject() {
		return getStyles(
			{
				...this.props.attributes,
				rowBorderRadius:
					this.rowBorderRadius ?? this.context?.rowBorderRadius,
			},
			{
				...(this.rowGapProps ?? this.context?.rowGapProps),
				columnNum: this.context?.columnsClientIds.length,
				columnsSize: this.context?.columnsSize,
			},
			this.props.clientId
		);
	}

	render() {
		const { attributes, deviceType, maxiSetAttributes, clientId } =
			this.props;
		const { uniqueID } = attributes;
		const hasInnerBlocks = this.getHasInnerBlocksStable();

		const emptyColumnClass = !hasInnerBlocks
			? 'maxi-column-block__empty'
			: 'maxi-column-block__has-inner-block';

		return (
			<RowContext.Consumer>
				{context => [
					<Inspector
						key={`block-settings-${uniqueID}`}
						rowPattern={context.rowPattern}
						propsToAvoid={['rowGapProps', 'rowBorderRadius']}
						{...this.props}
					/>,
					<Toolbar
						key={`toolbar-${uniqueID}`}
						ref={this.blockRef}
						rowPattern={context.rowPattern}
						copyPasteMapping={copyPasteMapping}
						propsToAvoid={[
							'resizableObject',
							'rowGapProps',
							'rowBorderRadius',
						]}
						{...this.props}
					/>,
					<MaxiBlock
						key={`maxi-column--${uniqueID}`}
						ref={this.blockRef}
						{...getMaxiBlockAttributes({
							...this.props,
							hasInnerBlocks,
						})}
						isOverflowHidden={getIsOverflowHidden(
							attributes,
							deviceType
						)}
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
							width: this.getWidth(),
							height: this.getHeight(),
						}}
						enable={{
							right: true,
							left: true,
						}}
						minWidth='1%'
						maxWidth='100%'
						showHandle={context.displayHandlers}
						onResizeStop={(event, direction, elt) => {
							maxiSetAttributes({
								[`column-size-${deviceType}`]: round(
									+elt.style.width.replace('%', '')
								),
							});
						}}
						useInnerBlocks
						innerBlocksSettings={this.getMemoizedInnerBlocksSettings()}
						cleanStyles
					/>,
				]}
			</RowContext.Consumer>
		);
	}
}

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
