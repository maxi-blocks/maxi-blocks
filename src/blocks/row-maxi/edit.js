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
import { retrieveInnerBlocksPositions } from '../../extensions/repeater';
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
import { isEmpty, isEqual } from 'lodash';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	static contextType = RepeaterContext;

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

	isRepeaterInherited = !!this.context;

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
		const tempInnerBlocksPositions = retrieveInnerBlocksPositions(
			this.columnsClientIds
		);

		if (
			!isEqual(tempInnerBlocksPositions, this.state.innerBlocksPositions)
		) {
			this.setState({
				innerBlocksPositions: tempInnerBlocksPositions,
			});
		}

		return tempInnerBlocksPositions;
	};

	getInnerBlocksPositions = () => {
		if (isEmpty(this.state.innerBlocksPositions)) {
			return this.updateInnerBlocksPositions();
		}

		return this.state.innerBlocksPositions;
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

		const repeaterStatus =
			this.context?.repeaterStatus ||
			getAttributeValue({
				target: 'repeater-status',
				props: attributes,
			});

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				repeaterStatus={repeaterStatus}
				isRepeaterInherited={this.isRepeaterInherited}
				getInnerBlocksPositions={this.getInnerBlocksPositions}
				updateInnerBlocksPositions={this.updateInnerBlocksPositions}
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
				repeaterStatus={repeaterStatus}
				getInnerBlocksPositions={this.getInnerBlocksPositions}
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
						repeaterStatus,
						getInnerBlocksPositions: this.getInnerBlocksPositions,
						updateInnerBlocksPositions:
							this.updateInnerBlocksPositions,
						...this.context,
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
											repeaterStatus={repeaterStatus}
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
