/* eslint-disable react/jsx-no-constructed-context-values */

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import RowBlockTemplate from './components/row-block-template';

import RepeaterContext from './repeaterContext';
import RowContext from './rowContext';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import { getAttributeValue, getGroupAttributes } from '@extensions/styles';
import { retrieveInnerBlocksPositions } from '@extensions/repeater';
import getRowGapProps from '@extensions/attributes/getRowGapProps';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';
import {
	withMaxiContextLoop,
	withMaxiContextLoopContext,
} from '@extensions/DC';
import withMaxiDC from '@extensions/DC/withMaxiDC';

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

		this.isRepeaterInherited = !!this.context?.repeaterStatus;
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return maxiAttributes;
	}

	updateInnerBlocksPositions = () => {
		const newInnerBlocksPositions = retrieveInnerBlocksPositions(
			!isEmpty(this.columnsClientIds)
				? this.columnsClientIds
				: select('core/block-editor').getBlockOrder(this.props.clientId)
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
		if (
			!getAttributeValue({
				target: 'repeater-status',
				props: this.props.attributes,
			})
		)
			return {};

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
				getInnerBlocksPositions={
					repeaterContext.getInnerBlocksPositions
				}
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
					removeColumnClientId: clientId => {
						this.columnsClientIds = this.columnsClientIds.filter(
							val => val !== clientId
						);
						this.columnsSize = Object.keys(this.columnsSize).reduce(
							(acc, key) => {
								if (key !== clientId) {
									acc[key] = this.columnsSize[key];
								}
								return acc;
							},
							{}
						);
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
											repeaterRowClientId={
												repeaterContext.repeaterRowClientId
											}
											getInnerBlocksPositions={
												repeaterContext.getInnerBlocksPositions
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

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
