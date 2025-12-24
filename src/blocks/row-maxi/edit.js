/* eslint-disable react/jsx-no-constructed-context-values */

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

// Add requestIdleCallback polyfill
const requestIdleCallbackPolyfill = callback => {
	const start = Date.now();
	return setTimeout(() => {
		callback({
			didTimeout: false,
			timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
		});
	}, 1);
};

const requestIdle = window.requestIdleCallback || requestIdleCallbackPolyfill;
const cancelIdle = window.cancelIdleCallback || clearTimeout;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import RowBlockTemplate from './components/row-block-template';
import RowCarouselPreview from './components/row-carousel-preview';

import RepeaterContext from './repeaterContext';
import RowContext from './rowContext';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import {
	getAttributeValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
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

	_widthMigrationCallback = null;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		displayHandlers: false,
		innerBlocksPositions: {},
		carouselCurrentSlide: 0,
		carouselSlidesWidth: {},
	};

	columnsSize = {};

	columnsClientIds = [];

	isRepeaterInherited = !!this.context?.repeaterStatus;

	// Add new method to handle width migration
	handleWidthMigration = () => {
		const { attributes, maxiSetAttributes } = this.props;
		const fullWidthGeneral = attributes['full-width-general'];
		const sizeAdvancedOptions = attributes['size-advanced-options'];

		// Only proceed if we need to update something
		if (
			!sizeAdvancedOptions ||
			(fullWidthGeneral !== undefined && fullWidthGeneral !== false)
		) {
			return;
		}

		// Cache the breakpoints that need updates
		const updates = {};
		const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

		// Default values for each breakpoint
		const defaultValues = {
			xxl: '1690',
			xl: '1170',
			l: '90',
			m: '90',
			s: '90',
			xs: '90',
		};

		// Default units for each breakpoint
		const defaultUnits = {
			xxl: 'px',
			xl: 'px',
			l: '%',
			m: '%',
			s: '%',
			xs: '%',
		};

		for (const breakpoint of breakpoints) {
			const fullWidthBreakpoint = attributes[`full-width-${breakpoint}`];
			const needsUpdate = !(
				fullWidthBreakpoint === true ||
				(fullWidthBreakpoint === undefined && fullWidthGeneral === true)
			);

			if (needsUpdate) {
				const key = `max-width-${breakpoint}`;
				const value = attributes[key];

				if (value !== undefined) {
					updates[key] = value;

					const unitKey = `max-width-unit-${breakpoint}`;
					if (attributes[unitKey] !== undefined) {
						updates[unitKey] = attributes[unitKey];
					}
				} else {
					// Apply default value and unit if max-width is undefined
					updates[key] = defaultValues[breakpoint];

					const unitKey = `max-width-unit-${breakpoint}`;
					updates[unitKey] = defaultUnits[breakpoint];
				}
			}
		}

		// Set general values based on the base breakpoint only if xxl is undefined
		if (attributes['max-width-xxl'] === undefined) {
			// Get the current base breakpoint
			const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
			// Use the value from base breakpoint, or fallback to default
			const baseValue =
				updates[`max-width-${baseBreakpoint}`] ||
				defaultValues[baseBreakpoint];
			const baseUnit =
				updates[`max-width-unit-${baseBreakpoint}`] ||
				defaultUnits[baseBreakpoint];

			updates['max-width-general'] = baseValue;
			updates['max-width-unit-general'] = baseUnit;
		}
		// Only call maxiSetAttributes if we have updates
		if (Object.keys(updates).length > 0) {
			maxiSetAttributes(updates);
		}
	};

	maxiBlockDidMount() {
		// Early return if row pattern exists
		if (
			this.props.attributes['row-pattern'] !== undefined ||
			this.props.attributes['row-pattern-general'] !== undefined
		) {
			return;
		}

		// Schedule width migration to run after initial render
		this._widthMigrationCallback = requestIdle(() => {
			this.handleWidthMigration();
		});
	}

	componentWillUnmount() {
		if (this._widthMigrationCallback) {
			cancelIdle(this._widthMigrationCallback);
		}
	}

	maxiBlockDidUpdate() {
		const { displayHandlers } = this.state;
		const { isSelected } = this.props;

		if (displayHandlers && !isSelected) {
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

	/**
	 * Get custom data for row carousel
	 * @returns {object|null} Custom data object
	 */
	get getMaxiCustomData() {
		const { attributes } = this.props;

		// Check if carousel is enabled (global, not breakpoint-specific)
		const carouselEnabled = attributes['row-carousel-status'] === true;

		if (carouselEnabled) {
			return {
				row_carousel: true,
			};
		}

		return null;
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

	isCarouselEnabled = () => {
		const { attributes, deviceType } = this.props;
		return getLastBreakpointAttribute({
			target: 'row-carousel-status',
			breakpoint: deviceType,
			attributes,
		});
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

		// Get carousel preview status
		const carouselPreviewEnabled =
			attributes['row-carousel-status'] &&
			attributes['row-carousel-preview'];

		// Inline styles targets for carousel navigation icons
		const inlineStylesTargets = {
			dot: '.maxi-row-carousel__dot:not(.maxi-row-carousel__dot--active)',
			dotActive: '.maxi-row-carousel__dot--active',
			arrow: '.maxi-row-carousel__arrow',
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				inlineStylesTargets={inlineStylesTargets}
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
					// Carousel context
					carouselEnabled: this.isCarouselEnabled(),
					carouselCurrentSlide: this.state.carouselCurrentSlide,
					setCarouselCurrentSlide: slide =>
						this.setState({ carouselCurrentSlide: slide }),
					carouselSlidesWidth: this.state.carouselSlidesWidth,
					setCarouselSlideWidth: (clientId, width) => {
						this.setState(prevState => ({
							carouselSlidesWidth: {
								...prevState.carouselSlidesWidth,
								[clientId]: width,
							},
						}));
					},
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
			<RowCarouselPreview
				key={`row-carousel-preview-${uniqueID}`}
				clientId={clientId}
				attributes={attributes}
				isPreviewEnabled={carouselPreviewEnabled}
			/>,
		];
	}
}

export default withMaxiContextLoop(
	withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)))
);
