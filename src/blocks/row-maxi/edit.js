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

/** Stable reference for row innerBlocksSettings.allowedBlocks */
const ALLOWED_COLUMN_BLOCKS = ['maxi-blocks/column-maxi'];

/**
 * Keep the previous object reference when deep-equal to the freshly computed value,
 * so React context consumers do not re-render on referential churn alone.
 *
 * @param {*}            cached    Previous cached value (may be undefined).
 * @param {*}            fresh     Newly computed value.
 * @param {Function} isEqualFn Lodash `isEqual`.
 * @return {*} Stable reference for `fresh`'s logical value.
 */
function reuseRefIfDeepEqual(cached, fresh, isEqualFn) {
	if (cached !== undefined && isEqualFn(cached, fresh)) {
		return cached;
	}
	return fresh;
}

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
		const { attributes } = this.props;
		return attributes['row-carousel-status'] === true;
	};

	/**
	 * Stable callback identity for InnerBlocks renderAppender (avoids new inline
	 * functions each render, which breaks innerBlocksSettings memoization).
	 *
	 * @return {JSX.Element} Row template appender.
	 */
	renderRowBlockAppender = () => {
		const { clientId, maxiSetAttributes, deviceType } = this.props;
		const repeaterContext = this.getMemoizedRepeaterContext();

		return (
			<RowBlockTemplate
				clientId={clientId}
				maxiSetAttributes={maxiSetAttributes}
				deviceType={deviceType}
				repeaterStatus={repeaterContext.repeaterStatus}
				repeaterRowClientId={repeaterContext.repeaterRowClientId}
				getInnerBlocksPositions={
					repeaterContext.getInnerBlocksPositions
				}
			/>
		);
	};

	/**
	 * Memoize innerBlocksSettings so MaxiBlock / InnerBlocks see a stable object when
	 * logical settings did not change.
	 *
	 * @return {Object} Settings object for useInnerBlocksProps.
	 */
	getMemoizedInnerBlocksSettings() {
		const { hasInnerBlocks } = this.props;

		const next = {
			...(hasInnerBlocks && { templateLock: 'insert' }),
			allowedBlocks: ALLOWED_COLUMN_BLOCKS,
			orientation: 'horizontal',
			renderAppender: hasInnerBlocks
				? false
				: this.renderRowBlockAppender,
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

	/**
	 * Stable handlers for RowContext so Provider value can be referentially memoized.
	 */
	setColumnClientIdForContext = columnClientId => {
		// Avoid a new columnsClientIds array (and RowContext memo MISS) when the
		// id is already registered (e.g. duplicate mount paths).
		if (this.columnsClientIds.includes(columnClientId)) {
			return;
		}
		this.columnsClientIds = [...this.columnsClientIds, columnClientId];
	};

	setColumnSizeForContext = (columnClientId, columnSize) => {
		this.columnsSize = {
			...this.columnsSize,
			[columnClientId]: columnSize,
		};

		this.forceUpdate();
	};

	removeColumnClientIdForContext = columnClientId => {
		this.columnsClientIds = this.columnsClientIds.filter(
			val => val !== columnClientId
		);
		this.columnsSize = Object.keys(this.columnsSize).reduce((acc, key) => {
			if (key !== columnClientId) {
				acc[key] = this.columnsSize[key];
			}
			return acc;
		}, {});
	};

	setCarouselCurrentSlideForContext = slide =>
		this.setState({ carouselCurrentSlide: slide });

	setCarouselSlideWidthForContext = (columnClientId, width) => {
		this.setState(prevState => ({
			carouselSlidesWidth: {
				...prevState.carouselSlidesWidth,
				[columnClientId]: width,
			},
		}));
	};

	/**
	 * Returns the same RepeaterContext object reference when contents are unchanged,
	 * so nested blocks do not re-render when the row re-renders for unrelated reasons.
	 *
	 * @return {Object} Repeater context value for RepeaterContext.Provider.
	 */
	getMemoizedRepeaterContext() {
		const repeaterStatus = getAttributeValue({
			target: 'repeater-status',
			props: this.props.attributes,
		});
		const repeaterRowClientId = this.props.clientId;
		const prev = this._memoizedRepeaterContext;

		/** Fast path: no inherited repeater — avoid full-object isEqual on fresh literals. */
		if (!this.context?.repeaterStatus) {
			if (
				prev &&
				!this._repeaterContextHadParentSpread &&
				prev.repeaterStatus === repeaterStatus &&
				prev.repeaterRowClientId === repeaterRowClientId &&
				prev.getInnerBlocksPositions ===
					this.getInnerBlocksPositions &&
				prev.updateInnerBlocksPositions ===
					this.updateInnerBlocksPositions
			) {
				return prev;
			}

			this._repeaterContextHadParentSpread = false;
			this._memoizedRepeaterContext = {
				repeaterStatus,
				repeaterRowClientId,
				getInnerBlocksPositions: this.getInnerBlocksPositions,
				updateInnerBlocksPositions: this.updateInnerBlocksPositions,
			};
			return this._memoizedRepeaterContext;
		}

		const next = {
			repeaterStatus,
			repeaterRowClientId,
			getInnerBlocksPositions: this.getInnerBlocksPositions,
			updateInnerBlocksPositions: this.updateInnerBlocksPositions,
			...this.context,
		};

		if (prev && isEqual(prev, next)) {
			return prev;
		}

		this._repeaterContextHadParentSpread = true;
		this._memoizedRepeaterContext = next;
		return next;
	}

	/**
	 * Returns the same RowContext object reference when contents are unchanged.
	 *
	 * @return {Object} Row context value for RowContext.Provider.
	 */
	getMemoizedRowContextValue() {
		const { attributes, clientId } = this.props;

		const rowPatternFresh = getGroupAttributes(attributes, 'rowPattern');
		this._stableRowPatternForCtx = reuseRefIfDeepEqual(
			this._stableRowPatternForCtx,
			rowPatternFresh,
			isEqual
		);

		const rowGapPropsFresh = getRowGapProps(attributes);
		this._stableRowGapPropsForCtx = reuseRefIfDeepEqual(
			this._stableRowGapPropsForCtx,
			rowGapPropsFresh,
			isEqual
		);

		const rowBorderRadiusFresh = getGroupAttributes(
			attributes,
			'borderRadius'
		);
		this._stableRowBorderRadiusForCtx = reuseRefIfDeepEqual(
			this._stableRowBorderRadiusForCtx,
			rowBorderRadiusFresh,
			isEqual
		);

		const carouselSlidesWidthFresh = this.state.carouselSlidesWidth;
		this._stableCarouselSlidesWidthForCtx = reuseRefIfDeepEqual(
			this._stableCarouselSlidesWidthForCtx,
			carouselSlidesWidthFresh,
			isEqual
		);

		const next = {
			displayHandlers: this.state.displayHandlers,
			rowPattern: this._stableRowPatternForCtx,
			rowBlockId: clientId,
			columnsSize: this.columnsSize,
			columnsClientIds: this.columnsClientIds,
			setColumnClientId: this.setColumnClientIdForContext,
			setColumnSize: this.setColumnSizeForContext,
			removeColumnClientId: this.removeColumnClientIdForContext,
			rowGapProps: this._stableRowGapPropsForCtx,
			rowBorderRadius: this._stableRowBorderRadiusForCtx,
			carouselEnabled: this.isCarouselEnabled(),
			carouselCurrentSlide: this.state.carouselCurrentSlide,
			setCarouselCurrentSlide: this.setCarouselCurrentSlideForContext,
			carouselSlidesWidth: this._stableCarouselSlidesWidthForCtx,
			setCarouselSlideWidth: this.setCarouselSlideWidthForContext,
		};

		const prevCtx = this._memoizedRowContextValue;
		if (prevCtx) {
			const columnsIdsSame =
				prevCtx.columnsClientIds === this.columnsClientIds ||
				isEqual(prevCtx.columnsClientIds, this.columnsClientIds);
			const columnsSizeSame =
				prevCtx.columnsSize === this.columnsSize ||
				isEqual(prevCtx.columnsSize, this.columnsSize);

			// Compare derived blobs to *fresh* values, not only stabilized refs:
			// reuseRefIfDeepEqual may replace the stable ref while prevCtx still
			// holds the previous ref; both can be deep-equal and still !==.
			const rowPatternSame =
				prevCtx.rowPattern === this._stableRowPatternForCtx ||
				isEqual(prevCtx.rowPattern, rowPatternFresh);
			const rowGapSame =
				prevCtx.rowGapProps === this._stableRowGapPropsForCtx ||
				isEqual(prevCtx.rowGapProps, rowGapPropsFresh);
			const rowBorderSame =
				prevCtx.rowBorderRadius === this._stableRowBorderRadiusForCtx ||
				isEqual(prevCtx.rowBorderRadius, rowBorderRadiusFresh);
			const carouselWidthsSame =
				prevCtx.carouselSlidesWidth ===
					this._stableCarouselSlidesWidthForCtx ||
				isEqual(
					prevCtx.carouselSlidesWidth,
					carouselSlidesWidthFresh
				);

			if (
				prevCtx.rowBlockId === clientId &&
				prevCtx.displayHandlers === this.state.displayHandlers &&
				prevCtx.carouselEnabled === next.carouselEnabled &&
				prevCtx.carouselCurrentSlide ===
					this.state.carouselCurrentSlide &&
				rowPatternSame &&
				rowGapSame &&
				rowBorderSame &&
				carouselWidthsSame &&
				columnsIdsSame &&
				columnsSizeSame &&
				prevCtx.setColumnClientId ===
					this.setColumnClientIdForContext &&
				prevCtx.setColumnSize === this.setColumnSizeForContext &&
				prevCtx.removeColumnClientId ===
					this.removeColumnClientIdForContext &&
				prevCtx.setCarouselCurrentSlide ===
					this.setCarouselCurrentSlideForContext &&
				prevCtx.setCarouselSlideWidth ===
					this.setCarouselSlideWidthForContext
			) {
				return prevCtx;
			}
		}

		this._memoizedRowContextValue = next;
		return next;
	}

	render() {
		const { attributes, clientId, hasInnerBlocks } = this.props;
		const { uniqueID } = attributes;

		const emptyRowClass = !hasInnerBlocks
			? 'maxi-row-block__empty'
			: 'maxi-row-block__has-inner-block';

		const repeaterContext = this.getMemoizedRepeaterContext();

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
				value={this.getMemoizedRowContextValue()}
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
						innerBlocksSettings={this.getMemoizedInnerBlocksSettings()}
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
