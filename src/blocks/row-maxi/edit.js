/* eslint-disable react/jsx-no-constructed-context-values */

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
import { getInnerBlocksPositions } from '../../extensions/repeater';
import getRowGapProps from '../../extensions/attributes/getRowGapProps';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';

/**
 * External dependencies
 */
import { withMaxiContextLoop } from '../../extensions/DC';
import { RowBlockTemplate } from './components';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

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
		innerBlocksPositions: null,
		isInnerBlockWasUpdated: false,
	};

	columnsSize = {};

	columnsClientIds = [];

	maxiBlockDidUpdate() {
		if (this.state.displayHandlers && !this.props.isSelected) {
			this.setState({
				displayHandlers: false,
			});
		}
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return maxiAttributes;
	}

	updateInnerBlocksPositions = () => {
		const tempInnerBlocksPositions = getInnerBlocksPositions(
			this.columnsClientIds
		);

		if (
			!isEqual(tempInnerBlocksPositions, this.state.innerBlocksPositions)
		) {
			console.log('updateInnerBlocksPositions');
			this.setState({
				innerBlocksPositions: tempInnerBlocksPositions,
			});
		}
	};

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

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				columnRefClientId={this.columnsClientIds[0]}
				innerBlocksPositions={this.state.innerBlocksPositions}
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
						// TODO: consider removing this
						columnRefClientId: this.columnsClientIds[0],
						innerBlocksPositions: this.state.innerBlocksPositions,
						updateInnerBlocksPositions:
							this.updateInnerBlocksPositions,
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

export default withMaxiContextLoop(withMaxiProps(edit));
