/**
 * WordPress dependencies
 */
import { createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from '../row-maxi/context';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { BlockInserter, BlockResizer, Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

import { getLastBreakpointAttribute } from '../../extensions/styles';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';
import getRowBorderRadius from './utils';

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

	static contextType = RowContext;

	rowGapProps = {};

	rowBorderRadius = {};

	maxiBlockDidMount() {
		this.context.setColumnClientId(this.props.clientId);
	}

	maxiBlockGetSnapshotBeforeUpdate() {
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
		return getStyles(
			{
				...this.props.attributes,
				rowBorderRadius: this.rowBorderRadius,
			},
			this.rowGapProps
		);
	}

	render() {
		const {
			attributes,
			deviceType,
			maxiSetAttributes,
			hasInnerBlocks,
			clientId,
		} = this.props;
		const { uniqueID } = attributes;
		const { columnsClientIds } = this.context;

		const getColumnWidthDefault = () => {
			const columnWidth = getLastBreakpointAttribute({
				target: 'column-size',
				breakpoint: deviceType,
				attributes,
			});

			if (columnWidth) return `${columnWidth}%`;

			return `${100 / columnsClientIds.length}%`;
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
							height: `${getLastBreakpointAttribute({
								target: 'height',
								breakpoint: deviceType,
								attributes,
							})}${getLastBreakpointAttribute({
								target: 'height-unit',
								breakpoint: deviceType,
								attributes,
							})}`,
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

export default withMaxiProps(edit);
