/* eslint-disable react/jsx-no-constructed-context-values */

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './rowContext';
import RepeaterContext from './repeaterContext';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getAttributeValue, getGroupAttributes } from '../../extensions/styles';
import { findBlockPosition } from '../../extensions/dom/detectNewBlocks';
import getRowGapProps from '../../extensions/attributes/getRowGapProps';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';
import { RowBlockTemplate } from './components';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		displayHandlers: false,
		blocks: {},
		isInnerBlockWasUpdated: false,
	};

	columnsSize = {};

	columnsClientIds = [];

	shouldMaxiBlockUpdate() {
		return this.state.isInnerBlockWasUpdated;
	}

	maxiBlockDidUpdate() {
		if (this.state.displayHandlers && !this.props.isSelected) {
			this.setState({
				displayHandlers: false,
				// isInnerBlockWasUpdated: false,
			});
		}

		if (this.state.isInnerBlockWasUpdated) {
			this.setState({
				isInnerBlockWasUpdated: false,
			});
		}
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return maxiAttributes;
	}

	render() {
		const {
			attributes,
			clientId,
			deviceType,
			hasInnerBlocks,
			maxiSetAttributes,
		} = this.props;
		const { uniqueID } = attributes;

		const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

		const emptyRowClass = !hasInnerBlocks
			? 'maxi-row-block__empty'
			: 'maxi-row-block__has-inner-block';

		if (attributes.preview)
			return (
				<MaxiBlock
					key={`maxi-row--${uniqueID}`}
					ref={this.blockRef}
					{...getMaxiBlockAttributes(this.props)}
				>
					<img // eslint-disable-next-line no-undef
						src={previews.row_preview}
						alt={__('Row block preview', 'maxi-blocks')}
					/>
				</MaxiBlock>
			);

		const getInnerBlocksPositions = () => {
			const innerBlocksPositions = new Map();

			const goThroughInnerBlocks = (
				innerBlocks,
				column,
				isRootColumn = false
			) => {
				innerBlocks?.forEach(block => {
					const { clientId, innerBlocks } = block;

					const blockPosition = `${findBlockPosition(block, column)}`;

					innerBlocksPositions.set(blockPosition, {
						...(isRootColumn
							? {
									clientId,
							  }
							: innerBlocksPositions.get(blockPosition)),
						uniqueIDs: [
							...(innerBlocksPositions.get(blockPosition)
								?.uniqueIDs || []),
							block.attributes.uniqueID,
						],
					});

					if (innerBlocks?.length) {
						goThroughInnerBlocks(innerBlocks);
					}
				});
			};

			this.columnsClientIds.forEach((columnClientId, index) => {
				const column =
					select('core/block-editor').getBlock(columnClientId);

				goThroughInnerBlocks(column?.innerBlocks, column, index === 0);
			});

			return innerBlocksPositions;
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				columnRefClientId={this.columnsClientIds[0]}
				{...this.props}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				toggleHandlers={() => {
					this.setState({
						displayHandlers: !this.state.displayHandlers,
					});
				}}
				copyPasteMapping={copyPasteMapping}
				{...this.props}
			/>,
			<RowContext.Provider
				key={`row-content-${uniqueID}`}
				value={{
					displayHandlers: this.state.displayHandlers,
					rowPattern: getGroupAttributes(attributes, 'rowPattern'),
					rowBlockId: clientId,
					columnsSize: this.columnsSize,
					columnsClientIds: this.columnsClientIds,
					setColumnClientId: clientId => {
						this.columnsClientIds = [
							...this.columnsClientIds,
							clientId,
						];
					},
					setColumnSize: (clientId, columnSize) => {
						this.columnsSize = {
							...this.columnsSize,
							[clientId]: columnSize,
						};

						this.forceUpdate();
					},
					rowGapProps: getRowGapProps(attributes),
					rowBorderRadius: getGroupAttributes(
						attributes,
						'borderRadius'
					),
				}}
			>
				<RepeaterContext.Provider
					value={{
						repeaterStatus: getAttributeValue({
							target: 'repeater-status',
							props: attributes,
						}),
						columnRefClientId: this.columnsClientIds[0],
						innerBlocksPositions: getInnerBlocksPositions(),
						isInnerBlockWasUpdated:
							this.state.isInnerBlockWasUpdated,
						setIsInnerBlockWasUpdated: update => {
							this.setState({
								isInnerBlockWasUpdated: update,
							});
						},
					}}
				>
					<MaxiBlock
						key={`maxi-row--${uniqueID}`}
						ref={this.blockRef}
						classes={emptyRowClass}
						{...getMaxiBlockAttributes(this.props)}
						useInnerBlocks
						innerBlocksSettings={{
							...(hasInnerBlocks && { templateLock: 'insert' }),
							allowedBlocks: ALLOWED_BLOCKS,
							orientation: 'horizontal',
							renderAppender: !hasInnerBlocks
								? () => (
										<RowBlockTemplate
											clientId={clientId}
											maxiSetAttributes={
												maxiSetAttributes
											}
											deviceType={deviceType}
										/>
								  )
								: false,
						}}
						renderWrapperInserter={false}
					/>
				</RepeaterContext.Provider>
			</RowContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
