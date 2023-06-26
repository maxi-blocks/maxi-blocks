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
		innerBlocksPositions: {},
	};

	columnsSize = {};

	columnsClientIds = [];

	isRepeaterInherited = !!this.context?.repeaterStatus;

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
		const newInnerBlocksPositions = retrieveInnerBlocksPositions(
			this.columnsClientIds
		);

		if (
			!isEqual(newInnerBlocksPositions, this.state.innerBlocksPositions)
		) {
			this.setState({
				innerBlocksPositions: newInnerBlocksPositions,
			});
		}

		return newInnerBlocksPositions;
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

		const repeaterContext = {
			repeaterStatus: getAttributeValue({
				target: 'repeater-status',
				props: attributes,
			}),
			repeaterRowClientId: clientId,
			getInnerBlocksPositions: this.getInnerBlocksPositions,
			updateInnerBlocksPositions: this.updateInnerBlocksPositions,
			...(this.context?.repeaterStatus && this.context),
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				repeaterStatus={repeaterContext.repeaterStatus}
				repeaterRowClientId={repeaterContext.repeaterRowClientId}
				isRepeaterInherited={this.isRepeaterInherited}
				getInnerBlocksPositions={
					repeaterContext.getInnerBlocksPositions
				}
				updateInnerBlocksPositions={
					repeaterContext.updateInnerBlocksPositions
				}
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
				repeaterStatus={repeaterContext.repeaterStatus}
				repeaterRowClientId={repeaterContext.repeaterRowClientId}
				getInnerBlocksPositions={this.getInnerBlocksPositions}
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
				<RepeaterContext.Provider value={repeaterContext}>
					<MaxiBlock
						key={`maxi-row--${uniqueID}`}
						ref={this.blockRef}
						classes={emptyRowClass}
						{...getMaxiBlockAttributes({
							...this.props,
							...repeaterContext,
						})}
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
											repeaterStatus={
												repeaterContext.repeaterStatus
											}
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
