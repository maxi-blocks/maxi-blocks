/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/**
 * MaxiBlocks Block component extension
 *
 * @todo Comment properly
 * @todo Transform to functional component or HOC
 * @todo Integrate `formatValue` into it
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, createRef } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	getDefaultAttribute,
	getGroupAttributes,
	getScrollEffects,
	getHasVideo,
	getParallaxLayers,
	getRelations,
	styleGenerator,
	styleResolver,
	getHasDC,
} from '@extensions/styles';
import getBreakpoints from '@extensions/styles/helpers/getBreakpoints';
import getIsIDTrulyUnique from './getIsIDTrulyUnique';
import getCustomLabel from './getCustomLabel';
import { loadFonts, getAllFonts, getPageFonts } from '@extensions/text/fonts';
import {
	getIsSiteEditor,
	getSiteEditorIframe,
	getTemplatePartChooseList,
	getTemplateViewIframe,
	getSiteEditorPreviewIframes,
} from '@extensions/fse';
import {
	getClientIdFromUniqueId,
	uniqueIDGenerator,
} from '@extensions/attributes';
import updateRelationHoverStatus from './updateRelationHoverStatus';
import propagateNewUniqueID from './propagateNewUniqueID';
import propsObjectCleaner from './propsObjectCleaner';
import { addBlockStyles, removeBlockStyles } from './globalStyleManager';
import updateRelationsRemotely from '@extensions/relations/updateRelationsRemotely';
import getIsUniqueCustomLabelRepeated from './getIsUniqueCustomLabelRepeated';
import { removeBlockFromColumns } from '@extensions/repeater';
import processRelations from '@extensions/relations/processRelations';
import compareVersions from './compareVersions';
import batchBlockDispatcher from './batchBlockDispatcher';

/**
 * External dependencies
 */
import { isArray, isEmpty, isEqual, isNil, isObject } from 'lodash';
import { diff } from 'deep-object-diff';
import { isLinkObfuscationEnabled } from '@extensions/DC/utils';

/**
 * Constants
 */
const WHITE_SPACE_REGEX = /white-space:\s*nowrap(?!\s*!important)/g;

/**
 * Class
 */
class MaxiBlockComponent extends Component {
	constructor(...args) {
		super(...args);

		const { attributes } = args[0] || {};
		const { uniqueID } = attributes || {};

		this.state = {
			oldSC: {},
			scValues: {},
			showLoader: false,
		};

		this.areFontsLoaded = createRef(false);

		const { clientId } = this.props;

		this.isReusable = false;
		this.blockRef = createRef();
		this.typography = getGroupAttributes(attributes, 'typography');
		this.paginationTypographyStatus = attributes['cl-pagination'];
		this.isTemplatePartPreview = !!getTemplatePartChooseList();
		this.relationInstances = null;
		this.previousRelationInstances = null;
		this.popoverStyles = null;
		this.isPatternsPreview = false;

		const previewIframes = getSiteEditorPreviewIframes();

		const blockName = select('core/block-editor').getBlockName(
			this.props.clientId
		);

		const templateModal = document.querySelector(
			'.editor-post-template__swap-template-modal'
		);

		// Check if this block is actually inside a preview container
		const blockElement = document.querySelector(
			`[data-block="${this.props.clientId}"]`
		);

		// Check inside preview iframes for block elements
		let isInsidePreviewIframe = false;
		previewIframes.forEach((iframe, index) => {
			try {
				const iframeDoc = iframe.contentDocument;
				if (iframeDoc) {
					const blockInIframe = iframeDoc.querySelector(
						`[data-block="${this.props.clientId}"]`
					);
					const allBlocksInIframe =
						iframeDoc.querySelectorAll('[data-block]');

					if (blockInIframe) {
						isInsidePreviewIframe = true;
					} else if (allBlocksInIframe.length > 0) {
						// If there are blocks but not our specific one, let's assume we're in a preview context
						// This might be a pattern preview where the clientId doesn't match
						isInsidePreviewIframe = true;
					}
				}
			} catch (error) {
				// If we can't access iframe content but it's a blob URL, assume preview context
				if (iframe.src && iframe.src.startsWith('blob:')) {
					isInsidePreviewIframe = true;
				}
			}
		});

		// TIMING FALLBACK: If we have preview iframes but couldn't detect blocks,
		// assume we're in preview context (timing issue)
		if (!isInsidePreviewIframe && previewIframes.length > 0) {
			const hasBlobIframes = Array.from(previewIframes).some(
				iframe => iframe.src && iframe.src.startsWith('blob:')
			);
			if (hasBlobIframes) {
				isInsidePreviewIframe = true;
			}
		}

		const isInsidePreview =
			(blockElement &&
				(blockElement.closest(
					'.block-editor-block-preview__container'
				) ||
					blockElement.closest(
						'.block-editor-block-patterns-list__list-item'
					) ||
					blockElement.closest(
						'.edit-site-page-content .block-editor-block-preview__container'
					))) ||
			isInsidePreviewIframe;

		// Only set as patterns preview if actually inside a preview container

		if (
			previewIframes.length > 0 &&
			(!blockName || templateModal) &&
			isInsidePreview
		) {
			this.isPatternsPreview = true;
			this.showPreviewImage(previewIframes);
			return;
		}

		if (this.isPatternsPreview) {
			return;
		}
		dispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Init
		this.updateLastInsertedBlocks();
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		this.getCurrentBlockStyle();
		this.setMaxiAttributes();
		this.setRelations();

		// Add block to store (batched for performance)
		batchBlockDispatcher.addBlock(newUniqueID, clientId, this.rootSlot);

		// In case the blockRoot has been saved on the store, we get it back. It will avoid 2 situations:
		// 1. Adding again the root and having a React error
		// 2. Will request `displayStyles` without re-rendering the styles, which speeds up the process
		this.rootSlot = select('maxiBlocks/blocks').getBlockRoot(newUniqueID);
		// Cache DOM references
		this.editorIframe = null;
		this.templateModal = null;
		this.updateDOMReferences();

		// MINIMAL tracking - only essential timeouts
		this.settingsTimeout = null;
		this.fseIframeTimeout = null;
	}

	updateDOMReferences() {
		// SIMPLIFIED - no caching, just direct queries
		const editorIframeSelector =
			'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)';
		const editorIframeSelectorAttemptTwo =
			'.block-editor-iframe__scale-container iframe[name="editor-canvas"]';
		this.editorIframe =
			document.querySelector(editorIframeSelector) ||
			document.querySelector(editorIframeSelectorAttemptTwo);
		if (!getIsSiteEditor()) {
			const templateModalSelector =
				'.editor-post-template__swap-template-modal';
			this.templateModal = document.querySelector(templateModalSelector);
		} else {
			this.templateModal = null;
		}
	}

	componentDidMount() {
		// Step 1: DOM references
		this.updateDOMReferences();

		const { isFirstOnHierarchy, legacyUniqueID } = this.props.attributes;

		// Block mounted successfully

		if (this.isPatternsPreview || this.templateModal) {
			return;
		}

		// Step 2: FSE iframe styles and observer
		if (getIsSiteEditor()) {
			this.addMaxiFSEIframeStyles();
			this.setupFSEIframeObserver();
		}

		// Step 3: Relations processing
		const blocksIBRelations = select(
			'maxiBlocks/relations'
		).receiveBlockUnderRelationClientIDs(this.props.attributes.uniqueID);

		if (!isEmpty(blocksIBRelations)) {
			const { getBlockAttributes } = select('core/block-editor');
			const { clientId, attributes, deviceType } = this.props;

			blocksIBRelations.forEach(({ clientId: relationClientId }) => {
				const blockMaxiVersionCurrent =
					getBlockAttributes(relationClientId)?.[
						'maxi-version-current'
					];

				if (blockMaxiVersionCurrent) {
					const needUpdate = [
						'0.0.1-SC1',
						'0.0.1-SC2',
						'0.0.1-SC3',
						'0.0.1-SC4',
						'0.0.1-SC5',
						'0.0.1-SC6',
						'1.0.0-RC1',
						'1.0.0-RC2',
						'1.0.0',
						'1.0.1',
					].includes(blockMaxiVersionCurrent);

					if (needUpdate) {
						updateRelationsRemotely({
							blockTriggerClientId: relationClientId,
							blockTargetClientId: clientId,
							blockAttributes: attributes,
							breakpoint: deviceType,
						});
					}
				}
			});
		}

		// Migrate uniqueID for IB
		if (isFirstOnHierarchy && legacyUniqueID) {
			const isRelationEligible = relation =>
				isObject(relation) &&
				'uniqueID' in relation &&
				!relation.uniqueID.endsWith('-u');

			// Optimized function to collect all uniqueID and legacyUniqueID pairs
			const collectIDs = (attributes, innerBlocks, idPairs = {}) => {
				const { uniqueID, legacyUniqueID } = attributes;

				if (uniqueID && legacyUniqueID) {
					idPairs[legacyUniqueID] = uniqueID;
				}

				if (isArray(innerBlocks)) {
					for (let i = 0; i < innerBlocks.length; i += 1) {
						const { attributes, innerBlocks: nestedBlocks } =
							innerBlocks[i];
						collectIDs(attributes, nestedBlocks, idPairs);
					}
				}

				return idPairs;
			};

			// Collect all uniqueID and legacyUniqueID pairs
			const { getBlock } = select('core/block-editor');
			const block = getBlock(this.props.clientId);
			const idPairs = collectIDs(
				this.props.attributes,
				block.innerBlocks
			);

			if (!isEmpty(idPairs)) {
				// Function to replace relation.uniqueID with legacyUniqueID in each block's relations
				const replaceRelationIDs = (
					attributes,
					innerBlocks,
					clientId
				) => {
					const { relations } = attributes;

					if (isArray(relations)) {
						const { updateBlockAttributes } =
							dispatch('core/block-editor');
						const newRelations = relations.map(relation => {
							if (
								isRelationEligible(relation) &&
								idPairs[relation.uniqueID]
							) {
								return {
									...relation,
									uniqueID: idPairs[relation.uniqueID],
								};
							}
							return relation;
						});
						updateBlockAttributes(clientId, {
							relations: newRelations,
						});
					}

					if (isArray(innerBlocks)) {
						for (let i = 0; i < innerBlocks.length; i += 1) {
							const {
								attributes,
								innerBlocks: nestedBlocks,
								clientId: nestedClientId,
							} = innerBlocks[i];
							replaceRelationIDs(
								attributes,
								nestedBlocks,
								nestedClientId
							);
						}
					}
				};

				// Replace relation.uniqueID with legacyUniqueID in all blocks
				replaceRelationIDs(
					this.props.attributes,
					block.innerBlocks,
					this.props.clientId
				);
			}
		}

		// Step 4: Block setup and reusable check
		this.isReusable = this.hasParentWithClass(this.blockRef, 'is-reusable');

		if (this.maxiBlockDidMount) {
			this.maxiBlockDidMount();
		}

		// Step 6: Font loading
		this.loadFonts();

		// Step 7: Display styles
		try {
			// Call directly without debouncing to avoid memory accumulation
			this?.displayStyles(!!this?.rootSlot);
		} catch (error) {
			console.warn('MaxiBlocks: Display styles error:', error);
		}

		// Step 8: Force update if needed
		if (!this.getBreakpoints.xxl) {
			try {
				this.forceUpdate();
			} catch (error) {
				console.warn('MaxiBlocks: Force update error:', error);
			}
		}

		// Step 9: Hide Gutenberg popover on initial mount
		this.hideGutenbergPopover();
	}

	/**
	 * Prevents rendering
	 */
	shouldComponentUpdate(nextProps, nextState) {
		if (this.isPatternsPreview || this.templateModal) {
			return false;
		}

		// Force update when selection state changes
		if (this.props.isSelected !== nextProps.isSelected) {
			return true;
		}

		// Ensures rendering when breakpoint changes
		const wasBreakpointChanged =
			this.props.deviceType !== nextProps.deviceType ||
			this.props.baseBreakpoint !== nextProps.baseBreakpoint;

		if (wasBreakpointChanged) return true;

		if (
			this.props?.attributes?.blockStyle &&
			this.props.attributes.blockStyle !== nextProps.attributes.blockStyle
		)
			return true;

		// Check changes on states
		if (!isEqual(this.state, nextState)) return true;

		// Force rendering the block when SC related values change
		if (this.scProps && this.state.oldSC && !isEmpty(this.state.oldSC)) {
			const SC = select(
				'maxiBlocks/style-cards'
			).receiveMaxiSelectedStyleCard();

			if (!isEqual(this.state.oldSC, SC)) {
				this.setState({
					oldSC: SC,
					scValues: select(
						'maxiBlocks/style-cards'
					).receiveActiveStyleCardValue(
						this.scProps.scElements,
						this.props.attributes.blockStyle,
						this.scProps.scType
					),
				});

				return true;
			}
		}

		const result = !isEqual(
			propsObjectCleaner(this.props),
			propsObjectCleaner(nextProps)
		);

		if (this.shouldMaxiBlockUpdate) {
			return (
				this.shouldMaxiBlockUpdate(
					this.props,
					nextProps,
					this.state,
					nextState
				) || !result
			);
		}

		return result;
	}

	/**
	 * Prevents styling
	 */
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.isPatternsPreview || this.templateModal) {
			// Clear cached diff for consistency
			this.cachedDiffAttributes = null;
			return false;
		}

		// OPTIMIZATION: Calculate diff once and cache for componentDidUpdate
		// This avoids expensive diff() recalculation in componentDidUpdate
		this.cachedDiffAttributes = diff(
			prevProps.attributes,
			this.props.attributes
		);

		// If deviceType or baseBreakpoint changes, render styles
		const wasBreakpointChanged =
			this.props.deviceType !== prevProps.deviceType ||
			this.props.baseBreakpoint !== prevProps.baseBreakpoint;
		if (wasBreakpointChanged) return false;

		// Force render styles when changing state
		if (!isEqual(prevState, this.state)) return false;

		// Force render styles when changing CL
		if (
			this.props.attributes['dc-status'] &&
			!isEqual(
				this.props?.contextLoopContext,
				prevProps?.contextLoopContext
			)
		)
			return false;

		if (this.maxiBlockGetSnapshotBeforeUpdate) {
			return (
				this.maxiBlockGetSnapshotBeforeUpdate(prevProps) &&
				isEqual(prevProps.attributes, this.props.attributes)
			);
		}

		// For render styles when there's no styles for the block in the store
		// Normally happens when duplicate the block
		// With GlobalStyleManager, we only need to check the store, not DOM elements
		if (
			isNil(
				select('maxiBlocks/styles').getBlockStyles(
					this.props.attributes.uniqueID
				)
			)
		)
			return false;

		if (
			this.props.attributes.uniqueID !== prevProps.attributes.uniqueID &&
			!wasBreakpointChanged
		)
			return false;

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
		this.updateDOMReferences();

		// Update FSE iframe styles even for template parts
		if (getIsSiteEditor()) {
			this.addMaxiFSEIframeStyles();
		}

		if (this.isPatternsPreview || this.templateModal) return;
		const { uniqueID } = this.props.attributes;

		// OPTIMIZATION: Use cached diff from getSnapshotBeforeUpdate instead of recalculating
		// Falls back to calculating if not cached (edge case)
		const diffAttributes =
			this.cachedDiffAttributes !== undefined
				? this.cachedDiffAttributes
				: diff(prevProps.attributes, this.props.attributes);

		const onlyRelationsChanged =
			!isEmpty(diffAttributes) &&
			Object.keys(diffAttributes).length === 1 &&
			Object.keys(diffAttributes)[0] === 'relations';

		if (!shouldDisplayStyles && !onlyRelationsChanged) {
			// Call directly without debouncing to avoid memory accumulation
			!this.isReusable &&
				this.displayStyles(
					this.props.deviceType !== prevProps.deviceType ||
						(this.props.baseBreakpoint !==
							prevProps.baseBreakpoint &&
							!!prevProps.baseBreakpoint),
					this.props.attributes.blockStyle !==
						prevProps.attributes.blockStyle
				);
			// For reusable blocks, also call directly
			this.isReusable && this.displayStyles();
		}

		// Note: diffAttributes already calculated above to check onlyRelationsChanged

		if (!isEmpty(diffAttributes)) {
			// Check if the modified attribute is related with hover status,
			// and in that case update the other blocks IB relation
			if (Object.keys(diffAttributes).some(key => key.includes('hover')))
				updateRelationHoverStatus(
					this.props.name,
					this.props.attributes
				);
			// If relations is modified, update the relations store
			if (Object.keys(diffAttributes).some(key => key === 'relations')) {
				const { relations } = this.props.attributes;

				if (
					relations &&
					Object.values(
						select('maxiBlocks/relations').receiveRelations(
							uniqueID
						)
					).length !== relations.length
				) {
					relations.forEach(({ uniqueID: targetUniqueID }) =>
						dispatch('maxiBlocks/relations').addRelation(
							{ uniqueID, clientId: this.props.clientId },
							{
								uniqueID: targetUniqueID,
								clientId:
									getClientIdFromUniqueId(targetUniqueID),
							}
						)
					);
				}
			}

			// Skip relation updates if only 'relations' changed (prevents cascade)
			// Only update relations when actual content/style attributes change
			const hasNonRelationChanges = Object.keys(diffAttributes).some(
				key => key !== 'relations'
			);

			// If there's a relation affecting this concrete block, check if is necessary
			// to update it's content to keep the coherence and the good UX
			if (hasNonRelationChanges) {
				const blocksIBRelations = select(
					'maxiBlocks/relations'
				).receiveBlockUnderRelationClientIDs(uniqueID);

				if (!isEmpty(blocksIBRelations)) {
					blocksIBRelations.forEach(({ clientId }) =>
						updateRelationsRemotely({
							blockTriggerClientId: clientId,
							blockTargetClientId: this.props.clientId,
							blockAttributes: this.props.attributes,
							breakpoint: this.props.deviceType,
						})
					);
				}
			}
		}

		this.hideGutenbergPopover();
		this.getCurrentBlockStyle();

		if (this.maxiBlockDidUpdate) {
			this.maxiBlockDidUpdate(prevProps, prevState, shouldDisplayStyles);
		}
	}

	componentWillUnmount() {
		const { uniqueID } = this.props.attributes;

		// Block cleanup initiated

		// Return early checks
		if (
			this.isTemplatePartPreview ||
			this.isPatternsPreview ||
			this.templateModal
		)
			return;

		// Clear all timeouts to prevent memory leaks (more comprehensive)
		if (this.settingsTimeout) {
			clearTimeout(this.settingsTimeout);
			this.settingsTimeout = null;
		}

		if (this.fseIframeTimeout) {
			clearTimeout(this.fseIframeTimeout);
			this.fseIframeTimeout = null;
		}

		if (this.fontLoadTimeout) {
			clearTimeout(this.fontLoadTimeout);
			this.fontLoadTimeout = null;
		}

		// MINIMAL cleanup - only clear essential timeouts
		if (this.previewTimeouts) {
			this.previewTimeouts.forEach(timeout => clearTimeout(timeout));
			this.previewTimeouts = null;
		}

		// Disconnect all preview observers to prevent memory leaks
		if (this.previewObservers) {
			this.previewObservers.forEach(observer => {
				if (observer && typeof observer.disconnect === 'function') {
					observer.disconnect();
				}
			});
			this.previewObservers.clear();
			this.previewObservers = null;
		}

		// Disconnect FSE observer if present
		if (this.fseIframeObserver) {
			this.fseIframeObserver.disconnect();
			this.fseIframeObserver = null;
		}

		// Remove temporary popover-hiding styles if still injected
		if (this.popoverStyles) {
			this.popoverStyles.remove();
			this.popoverStyles = null;
		}

		// Clear DOM references
		this.rootSlot = null;
		this.editorIframe = null;
		this.templateModal = null;
		this.previousIframeContent = null;
		this.blockRef = null;

		// Clear font cache references
		if (this.fontCache) {
			this.fontCache = null;
		}
		if (this.areFontsLoaded) {
			this.areFontsLoaded.current = false;
		}

		const keepStylesOnEditor = !!select('core/block-editor').getBlock(
			this.props.clientId
		);
		const keepStylesOnCloning =
			Array.from(document.getElementsByClassName(uniqueID)).length > 1;
		const isBlockBeingRemoved = !keepStylesOnEditor && !keepStylesOnCloning;

		if (isBlockBeingRemoved) {
			const { clientId } = this.props;

			// Use a single rAF for all style operations
			const batchStyleOperations = () => {
				const obj = this.getStylesObject;

				// Batch all style removals into a single operation
				styleResolver({
					styles: obj,
					remover: true,
					uniqueID,
				});
				this.removeStyles();

				// Use microtask for store updates to avoid blocking
				queueMicrotask(() => {
					// Batch dispatch operations
					const batchedDispatch = () => {
						dispatch('maxiBlocks/blocks').removeBlock(
							uniqueID,
							clientId
						);
						dispatch('maxiBlocks/customData').removeCustomData(
							uniqueID
						);
						dispatch('maxiBlocks/relations').removeBlockRelation(
							uniqueID
						);
						dispatch('maxiBlocks/styles').removeCSSCache(uniqueID);
					};
					batchedDispatch();

					if (this.props.repeaterStatus) {
						this.handleRepeaterCleanup();
					}
				});
			};

			// Schedule style operations in the next frame
			requestAnimationFrame(batchStyleOperations);
		}

		if (this.maxiBlockWillUnmount) {
			this.maxiBlockWillUnmount(isBlockBeingRemoved);
		}
	}

	// Add new helper method for repeater cleanup
	handleRepeaterCleanup() {
		const { getBlockParentsByBlockName } = select('core/block-editor');
		const parentRows = getBlockParentsByBlockName(
			this.props.parentColumnClientId,
			'maxi-blocks/row-maxi'
		);

		const isRepeaterWasUndo = parentRows.every(parentRowClientId => {
			const parentRowAttributes =
				select('core/block-editor').getBlockAttributes(
					parentRowClientId
				);
			return !parentRowAttributes['repeater-status'];
		});

		if (!isRepeaterWasUndo) {
			removeBlockFromColumns(
				this.props.blockPositionFromColumn,
				this.props.parentColumnClientId,
				this.props.clientId,
				this.props.getInnerBlocksPositions(),
				this.props.updateInnerBlocksPositions
			);
		}
	}

	handleResponsivePreview(editorWrapper, currentBreakpoint) {
		// Helper function to apply styles
		const applyPreviewStyles = () => {
			const { tabletPreview, mobilePreview, desktopPreview } =
				this.getPreviewElements(editorWrapper, currentBreakpoint);
			const previewTarget =
				tabletPreview ?? mobilePreview ?? desktopPreview;

			if (!previewTarget) return;

			if (desktopPreview) {
				previewTarget.style.height = '100%';
				// Clear mobile/tablet width constraints when switching to desktop
				previewTarget.style.width = '';
				const previewTargetIframe = document.querySelector(
					'iframe[name="editor-canvas"]'
				);
				if (previewTargetIframe) {
					previewTargetIframe.style.width = '';
				}
				return;
			}

			const postEditor = document?.body?.querySelector(
				'.edit-post-visual-editor'
			);
			if (!postEditor) return;

			const responsiveWidth = postEditor.getAttribute(
				'maxi-blocks-responsive-width'
			);
			previewTarget.style.width = `${responsiveWidth}px`;
			previewTarget.style.boxSizing = 'content-box';
			previewTarget.style.padding = '0';

			const previewTargetIframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);
			if (previewTargetIframe) {
				previewTargetIframe.style.width = `${responsiveWidth}px`;
			}
		};

		// Check if we need to use fallback (wrong preview class in DOM)
		const breakpointMap = {
			xxl: 'desktop',
			xl: 'desktop',
			l: 'desktop',
			m: 'tablet',
			s: 'mobile',
			xs: 'mobile',
			general: 'desktop',
		};
		const expectedPreviewType =
			breakpointMap[currentBreakpoint] || 'desktop';
		const expectedElement = editorWrapper.querySelector(
			`.is-${expectedPreviewType}-preview`
		);

		// If the expected preview element doesn't exist yet (WordPress timing issue),
		// defer style application to next frame to give DOM time to update
		if (!expectedElement) {
			requestAnimationFrame(() => {
				applyPreviewStyles();
			});
		} else {
			// Element exists, apply styles immediately
			applyPreviewStyles();
		}
	}

	handleIframeStyles(iframe, currentBreakpoint) {
		const iframeDocument = iframe.contentDocument;
		const editorWrapper = iframeDocument.body;
		const { isPreview } = this.getPreviewElements(
			editorWrapper,
			currentBreakpoint
		);

		if (isPreview) {
			this.handleResponsivePreview(editorWrapper, currentBreakpoint);
		}

		if (editorWrapper) {
			this.setupIframeForMaxi(
				iframe,
				iframeDocument,
				editorWrapper,
				currentBreakpoint
			);
		}
	}

	setMaxiAttributes() {
		if (this.isPatternsPreview || this.templateModal) return;

		const maxiAttributes = this.getMaxiAttributes();

		if (!maxiAttributes) return;

		Object.entries(maxiAttributes).forEach(([key, value]) => {
			const currentValue = this.props.attributes[key];
			const defaultValue = getDefaultAttribute(key, this.props.clientId);

			if (
				(!isEqual(currentValue, defaultValue) ||
					!isEqual(currentValue, value)) &&
				// Using `maxi-version-current` as is an attribute that set on componentDidMount
				// so it ensures we add these attributes the first time we add the block
				'maxi-version-current' in this.props.attributes
			)
				return;

			this.props.attributes[key] = value;
		});
	}

	setRelations() {
		if (this.isPatternsPreview || this.templateModal) return;

		const { clientId, attributes } = this.props;
		const { relations, uniqueID } = attributes;

		if (!isEmpty(relations)) {
			relations.forEach(relation => {
				const { uniqueID: targetUniqueID } = relation;

				dispatch('maxiBlocks/relations').addRelation(
					{
						uniqueID,
						clientId,
					},
					{
						uniqueID: targetUniqueID,
						clientId: getClientIdFromUniqueId(targetUniqueID),
					}
				);
			});
		}
	}

	get getBreakpoints() {
		return getBreakpoints(this.props.attributes);
	}

	// eslint-disable-next-line class-methods-use-this
	get getStylesObject() {
		return null;
	}

	get getCustomData() {
		if (this.isPatternsPreview || this.templateModal) return null;
		const {
			uniqueID,
			'dc-status': dcStatus,
			'dc-link-status': dcLinkStatus,
			'dc-link-target': dcLinkTarget,
			'background-layers': bgLayers,
			relations: relationsRaw,
		} = this.props.attributes;

		const { contextLoop } = this.props.contextLoopContext ?? {};

		const scroll = getGroupAttributes(
			this.props.attributes,
			'scroll',
			false,
			'',
			true
		);

		const bgParallaxLayers = getParallaxLayers(uniqueID, bgLayers);
		const hasVideo = getHasVideo(uniqueID, bgLayers);
		const hasDC = dcStatus || getHasDC(bgLayers);
		const shouldEnableLinkObfuscation = isLinkObfuscationEnabled(
			dcStatus,
			dcLinkStatus,
			dcLinkTarget
		);
		const scrollEffects = getScrollEffects(uniqueID, scroll);
		const relations = getRelations(uniqueID, relationsRaw);

		return {
			[uniqueID]: {
				...(!isEmpty(bgParallaxLayers) && {
					...{ parallax: bgParallaxLayers },
				}),
				...(relations && {
					relations,
				}),
				...(hasVideo && { bg_video: true }),
				...(!isEmpty(scrollEffects) && scrollEffects),
				...(hasDC &&
					contextLoop?.['cl-status'] && {
						dynamic_content: {
							[uniqueID]: contextLoop,
						},
					}),
				...(!hasDC &&
					contextLoop?.['cl-status'] && {
						context_loop: {
							[uniqueID]: contextLoop,
						},
					}),
				...(shouldEnableLinkObfuscation && {
					email_obfuscate: true,
				}),
				...(this.getMaxiCustomData && { ...this.getMaxiCustomData }),
			},
		};
	}

	getCurrentBlockStyle() {
		const {
			clientId,
			attributes: { blockStyle },
		} = this.props;

		const newBlockStyle = getBlockStyle(clientId);

		if (blockStyle !== newBlockStyle) {
			this.props.attributes.blockStyle = newBlockStyle;
			return true;
		}

		return false;
	}

	showPreviewImage(previewIframes) {
		const disconnectTimeout = 10000; // 10 seconds

		// Use instance property to track timeouts for proper cleanup
		if (!this.previewTimeouts) {
			this.previewTimeouts = new Map();
		}

		// Track observers for proper cleanup to prevent memory leaks
		if (!this.previewObservers) {
			this.previewObservers = new Set();
		}

		const isSiteEditor = getIsSiteEditor();

		const imageName = isSiteEditor
			? 'pattern-preview.jpg'
			: 'pattern-preview-edit.jpg';

		const defaultImgPath = `/wp-content/plugins/maxi-blocks/img/${imageName}`;
		const linkElement = document.querySelector('#maxi-blocks-block-css');
		const href = linkElement?.getAttribute('href');
		const pluginsPath = href?.substring(0, href?.lastIndexOf('/build'));
		const imgPath = pluginsPath
			? `${pluginsPath}/img/${imageName}`
			: defaultImgPath;

		previewIframes.forEach((iframe, index) => {
			if (
				!iframe ||
				!iframe?.parentNode ||
				iframe?.parentNode.classList.contains(
					'maxi-blocks-pattern-preview'
				) ||
				this.hasParentWithClass(
					iframe?.parentNode,
					'maxiblocks-custom-pattern'
				) ||
				this.hasParentWithClass(
					iframe?.parentNode,
					'maxiblocks-go-custom-pattern'
				)
			)
				return;

			const replaceIframeWithImage = (iframe, observer) => {
				if (
					iframe?.parentNode?.classList?.contains(
						'maxi-blocks-pattern-preview'
					) ||
					iframe?.parentNode?.querySelector(
						'img.maxiblocks-pattern-preview-image'
					) ||
					iframe?.parentNode?.querySelector(
						'img.maxiblocks-go-pattern-preview-image'
					)
				)
					return;
				const iframeDocument = iframe?.contentDocument;
				const iframeBody = iframeDocument?.body;
				if (!iframeBody) return;

				// Clear and reset the timeout for this iframe
				const existingTimeout = this.previewTimeouts.get(iframe);
				if (existingTimeout) {
					clearTimeout(existingTimeout);
				}
				const newTimeout = setTimeout(() => {
					observer.disconnect();
					this.previewTimeouts.delete(iframe);
					// Remove observer from tracking when it disconnects
					if (this.previewObservers) {
						this.previewObservers.delete(observer);
					}
				}, disconnectTimeout);

				this.previewTimeouts.set(iframe, newTimeout);

				const containsMaxiBlocksContainer = iframeBody.querySelector(
					'.is-root-container .maxi-block'
				);
				if (!containsMaxiBlocksContainer) return;

				iframe?.parentNode.classList.add('maxi-blocks-pattern-preview');

				const parentWithClass = this.findParentWithClass(
					iframe,
					'dataviews-view-grid__media'
				);

				if (parentWithClass !== null) {
					parentWithClass.classList.add(
						'maxi-blocks-pattern-preview-grid'
					);
				}

				const parentCardWithClass = this.findParentWithClass(
					iframe,
					'dataviews-view-grid__card'
				);

				if (parentCardWithClass !== null) {
					parentCardWithClass.classList.add(
						'maxi-blocks-pattern-preview-grid__card'
					);
				}
				const img = new Image();
				img.src = imgPath;
				img.alt = __(
					'Preview for pattern with MaxiBlocks',
					'maxi-blocks'
				);
				img.style.width = '100%';
				img.style.height = 'auto';
				img.classList.add('maxi-blocks-pattern-preview-image');

				iframe?.parentNode?.insertBefore(img, iframe);
				iframe.style.display = 'none';

				observer.disconnect();
				// Remove observer from tracking when it disconnects
				if (this.previewObservers) {
					this.previewObservers.delete(observer);
				}
			};

			const observer = new MutationObserver((mutationsList, observer) => {
				mutationsList.forEach(mutation =>
					replaceIframeWithImage(mutation.target, observer)
				);
			});

			observer.observe(iframe, {
				attributes: true,
				childList: true,
				subtree: true,
			});

			// Track observer for cleanup to prevent memory leaks
			this.previewObservers.add(observer);
		});
	}

	// This function saves the last inserted blocks' clientIds, so we can use them
	// to update IB relations.
	updateLastInsertedBlocks() {
		if (this.isPatternsPreview || this.templateModal) return;
		const { clientId } = this.props;

		if (
			![
				...select('maxiBlocks/blocks').getLastInsertedBlocks(),
				...select('maxiBlocks/blocks').getBlockClientIds(),
			].includes(clientId)
		) {
			const allClientIds =
				select('core/block-editor').getClientIdsWithDescendants();

			dispatch('maxiBlocks/blocks').saveLastInsertedBlocks(allClientIds);
			dispatch('maxiBlocks/blocks').saveBlockClientIds(allClientIds);
		}
	}

	uniqueIDChecker(idToCheck) {
		if (this.isPatternsPreview || this.templateModal) return idToCheck;

		const { clientId, name: blockName, attributes } = this.props;
		const { customLabel } = attributes;

		const lastInsertedBlocks =
			select('maxiBlocks/blocks').getLastInsertedBlocks();
		const isNewBlock = select('maxiBlocks/blocks').getIsNewBlock(
			this.props.attributes.uniqueID
		);

		const isBlockCopied =
			!isNewBlock && lastInsertedBlocks.includes(this.props.clientId);

		// OPTIMIZATION: Skip expensive uniqueID check if block is being loaded from DB
		// Only check uniqueID in these scenarios:
		// 1. Block was just copied/pasted (isBlockCopied = true)
		// 2. Block is in lastInsertedBlocks (new insertion, pattern, or template)
		// 3. Block is marked as new (first-time creation)
		const needsUniqueIDCheck =
			isBlockCopied ||
			(lastInsertedBlocks && lastInsertedBlocks.includes(clientId)) ||
			isNewBlock;

		// Fast path: Block is being loaded from saved content, trust the ID
		if (!needsUniqueIDCheck) {
			// Still check custom label even if we skip uniqueID check
			if (getIsUniqueCustomLabelRepeated(customLabel)) {
				this.props.attributes.customLabel = getCustomLabel(
					this.props.attributes.customLabel,
					this.props.attributes.uniqueID
				);
			}
			return idToCheck;
		}

		// Slow path: Actually check if uniqueID is unique (only for copy/paste/new blocks)
		const isUnique = getIsIDTrulyUnique(idToCheck, 1, clientId);

		if (isBlockCopied || !isUnique) {
			const newUniqueID = uniqueIDGenerator({
				blockName,
			});

			// Immediately add to cache for batch paste optimization
			// This ensures subsequent blocks in the same paste operation see this ID
			dispatch('maxiBlocks/blocks').addToUniqueIDCache(newUniqueID);

			propagateNewUniqueID(
				idToCheck,
				newUniqueID,
				clientId,
				this.props.repeaterStatus,
				this.props.repeaterRowClientId,
				this.props.attributes['background-layers']
			);

			this.props.attributes.uniqueID = newUniqueID;

			/**
			 * Use `updateBlockAttributes` for `uniqueID` update in case if
			 * `updateBlockAttributes` was called before (for example in `propagateNewUniqueID`)
			 */
			if (
				select('maxiBlocks/blocks').getIsBlockWithUpdatedAttributes(
					clientId
				)
			) {
				const { updateBlockAttributes } = dispatch('core/block-editor');
				updateBlockAttributes(clientId, {
					uniqueID: newUniqueID,
				});
			}

			if (!this.props.repeaterStatus) {
				this.props.attributes.customLabel = getCustomLabel(
					this.props.attributes.customLabel,
					this.props.attributes.uniqueID
				);
			}

			if (this.maxiBlockDidChangeUniqueID)
				this.maxiBlockDidChangeUniqueID(newUniqueID);

			return newUniqueID;
		}

		if (getIsUniqueCustomLabelRepeated(customLabel)) {
			this.props.attributes.customLabel = getCustomLabel(
				this.props.attributes.customLabel,
				this.props.attributes.uniqueID
			);
		}

		return idToCheck;
	}

	loadFonts() {
		if (this.isPatternsPreview || this.templateModal) {
			return;
		}

		// Early return if fonts are already loaded
		if (this.areFontsLoaded.current) {
			return;
		}

		const typographyToCheck = Object.fromEntries(
			Object.entries(this.typography || {}).filter(
				([key, value]) => value !== undefined
			)
		);

		if (isEmpty(typographyToCheck) && !this.paginationTypographyStatus) {
			return;
		}

		const target = getIsSiteEditor() ? getSiteEditorIframe() : document;
		if (!target) {
			return;
		}

		// Cancel any pending font load operations
		if (this.fontLoadTimeout) {
			clearTimeout(this.fontLoadTimeout);
			this.fontLoadTimeout = null;
		}

		let response = {};
		if (this.paginationTypographyStatus) {
			const paginationTypography = getGroupAttributes(
				this.props.attributes,
				'typography',
				false,
				'cl-pagination-'
			);

			response = getAllFonts(
				paginationTypography,
				false,
				false,
				'p',
				'light',
				true,
				['cl-pagination-']
			);
		} else {
			response = getAllFonts(this.typography, 'custom-formats');
		}

		if (isEmpty(response)) {
			return;
		}

		// Clear font cache to prevent memory accumulation
		if (this.fontCache) {
			this.fontCache = null;
		}

		// Load fonts with error handling
		try {
			loadFonts(response, true, target);
			this.areFontsLoaded.current = true;
		} catch (error) {
			console.warn('MaxiBlocks: Font loading failed:', error);
			// Still mark as loaded to prevent infinite retries
			this.areFontsLoaded.current = true;
		}
	}

	/**
	 * Refresh the styles on the Editor
	 */
	displayStyles(isBreakpointChange = false, isBlockStyleChange = false) {
		const { uniqueID } = this.props.attributes;

		// Early return for invalid states
		if (this.isPatternsPreview || this.templateModal || !uniqueID) {
			return;
		}

		// Update references if they're null (but don't do it too frequently)
		if (!this.editorIframe || !this.isElementInDOM(this.editorIframe)) {
			this.updateDOMReferences();
		}
		const isSiteEditor = getIsSiteEditor();
		const breakpoints = this.getBreakpoints;
		let obj;
		let customDataRelations;

		// Generate new styles if it's not a breakpoint change or if it's XXL breakpoint
		let shouldGenerateNewStyles =
			!isBreakpointChange || this.props.deviceType === 'xxl';
		let stylesForViewportCheck;

		if (!shouldGenerateNewStyles && isBreakpointChange) {
			stylesForViewportCheck = this.getStylesObject || {};
			if (this.hasViewportUnits(stylesForViewportCheck)) {
				shouldGenerateNewStyles = true;
			}
		}

		if (shouldGenerateNewStyles) {
			obj = stylesForViewportCheck || this.getStylesObject || {};

			// When duplicating, need to change the obj target for the new uniqueID
			if (
				obj &&
				!obj[uniqueID] &&
				!!obj[this.props.attributes.uniqueID]
			) {
				obj[uniqueID] = obj[this.props.attributes.uniqueID];
				delete obj[this.props.attributes.uniqueID];
			}

			const customData = this.getCustomData;
			if (customData) {
				dispatch('maxiBlocks/customData').updateCustomData(customData);
				customDataRelations = customData[uniqueID]?.relations;
			}
		}

		this.injectStyles(
			uniqueID,
			obj,
			this.props.deviceType,
			breakpoints,
			isSiteEditor,
			isBreakpointChange,
			isBlockStyleChange,
			shouldGenerateNewStyles,
			this.editorIframe
		);

		// Update responsive classes for non-XXL breakpoint changes
		if (isBreakpointChange && this.props.deviceType !== 'xxl') {
			this.updateResponsiveClasses(
				this.editorIframe,
				this.props.deviceType
			);
		}

		// Handle relations if they exist
		if (customDataRelations) {
			const isRelationsPreview =
				this.props.attributes['relations-preview'];

			if (isRelationsPreview) {
				this.relationInstances = processRelations(customDataRelations);
			}

			this.relationInstances?.forEach(relationInstance => {
				relationInstance.setIsPreview(isRelationsPreview);
			});

			if (
				isRelationsPreview &&
				this.relationInstances !== null &&
				this.previousRelationInstances !== null
			) {
				const keysToCompare = [
					'action',
					'uniqueID',
					'trigger',
					'target',
					'blockTarget',
					'stylesString',
				];

				const isEquivalent = (a, b) => {
					for (const key of keysToCompare) {
						if (a[key] !== b[key]) {
							return false;
						}
					}
					return true;
				};

				const compareRelations = (
					previousRelations,
					currentRelations
				) => {
					const previousIds = new Set(
						previousRelations.map(relation => relation.id)
					);
					const currentIds = new Set(
						currentRelations.map(relation => relation.id)
					);

					let removed = null;
					let updated = null;

					// Identify removed relation
					for (const relation of previousRelations) {
						if (!currentIds.has(relation.id)) {
							removed = relation.id;
							break; // Stop after finding the first removed item
						}
					}

					// Identify updated relation
					for (const relation of currentRelations) {
						if (previousIds.has(relation.id)) {
							const previousRelation = previousRelations.find(
								prev => prev.id === relation.id
							);
							if (!isEquivalent(relation, previousRelation)) {
								updated = relation.id;
								break;
							}
						}
					}

					return { removed, updated };
				};

				// Usage
				const { removed, updated } = compareRelations(
					this.previousRelationInstances,
					this.relationInstances
				);

				if (removed !== null) {
					processRelations(
						this.previousRelationInstances,
						'remove',
						removed
					);
					processRelations(this.relationInstances);
				}
				if (updated !== null) {
					processRelations(this.relationInstances, 'remove', removed);
					processRelations(this.relationInstances);
				}
			}

			if (!isRelationsPreview) {
				this.relationInstances = null;
			}

			this.previousRelationInstances = this.relationInstances;
		}
	}

	hasViewportUnits(stylesObj) {
		if (!stylesObj) return false;

		// Regex to match actual CSS viewport units (e.g., "100vw", "-0.5vh", ".5vmin")
		// Requires: number (with optional sign/decimal) + viewport unit
		// Boundaries prevent matching "overview", URLs, or identifiers
		const viewportUnitRegex = /(?<![a-zA-Z])[-+]?\d*\.?\d+(vw|vh|vmin|vmax)(?![a-zA-Z])/;

		const stack = [stylesObj];

		while (stack.length) {
			const current = stack.pop();

			if (typeof current === 'string') {
				if (viewportUnitRegex.test(current)) {
					return true;
				}
			} else if (isArray(current)) {
				stack.push(...current);
			} else if (isObject(current)) {
				stack.push(...Object.values(current));
			}
		}

		return false;
	}

	injectStyles(
		uniqueID,
		stylesObj,
		currentBreakpoint,
		breakpoints,
		isSiteEditor,
		isBreakpointChange,
		isBlockStyleChange,
		forceGenerate,
		iframe
	) {
		if (iframe?.contentDocument?.body) {
			this.handleIframeStyles(iframe, currentBreakpoint);
		}

		const target = this.getStyleTarget(isSiteEditor, iframe);

		// Only generate new styles if it's not a breakpoint change or if it's a breakpoint change to XXL
		if (
			forceGenerate ||
			!isBreakpointChange ||
			currentBreakpoint === 'xxl'
		) {
			const styleContent = this.generateStyleContent(
				uniqueID,
				stylesObj,
				currentBreakpoint,
				breakpoints,
				isBreakpointChange,
				isBlockStyleChange,
				forceGenerate,
				iframe,
				isSiteEditor
			);

			// Use batched style injection instead of individual style elements
			addBlockStyles(uniqueID, styleContent, target);
		}
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return null;
	}

	setupIframeForMaxi(
		iframe,
		iframeDocument,
		editorWrapper,
		currentBreakpoint
	) {
		if (
			iframe &&
			!iframeDocument.body.classList.contains('maxi-blocks--active')
		) {
			this.addMaxiClassesToIframe(
				iframeDocument,
				editorWrapper,
				currentBreakpoint
			);
			this.copyFontsToIframe(iframeDocument, iframe);
			this.copyMaxiStylesToIframe(iframeDocument, iframe);
			this.copyMaxiVariablesToIframe(iframeDocument, iframe);
			this.ensureMaxiStylesLoaded(iframeDocument, iframe);
		}

		// Clear previous iframe references
		if (this.previousIframeContent) {
			this.previousIframeContent = null;
		}

		// Remove unused style elements
		const unusedStyles = iframeDocument.querySelectorAll(
			'style[id*="maxi-temp"]'
		);
		unusedStyles.forEach(el => el.remove());
	}

	addMaxiClassesToIframe(iframeDocument, editorWrapper, currentBreakpoint) {
		iframeDocument.body.classList.add('maxi-blocks--active');
		iframeDocument.documentElement.style.scrollbarWidth = 'none';
		const { isPreview } = this.getPreviewElements(
			editorWrapper,
			currentBreakpoint
		);

		if (!isPreview) {
			return;
		}

		editorWrapper.setAttribute('maxi-blocks-responsive', currentBreakpoint);
	}

	copyFontsToIframe(iframeDocument, iframe) {
		loadFonts(getPageFonts(), true, iframeDocument);

		// Collect fonts from both main document and FSE iframe
		const fontSelector =
			'link[rel="stylesheet"][id*="maxi-blocks-styles-font"]';
		const maxiFonts = Array.from(document.querySelectorAll(fontSelector));

		// Also check FSE iframe for SC fonts (for reusables/template parts)
		const siteEditorDoc = getSiteEditorIframe();
		if (siteEditorDoc) {
			const fseFonts = Array.from(
				siteEditorDoc.querySelectorAll(fontSelector)
			);
			// Merge fonts, avoiding duplicates by ID
			const existingIds = new Set(maxiFonts.map(font => font.id));
			fseFonts.forEach(font => {
				if (!existingIds.has(font.id)) {
					maxiFonts.push(font);
				}
			});
		}

		if (!isEmpty(maxiFonts)) {
			maxiFonts.forEach(rawMaxiFont => {
				const maxiFont = rawMaxiFont.cloneNode(true);
				// Remove existing font link with same ID to avoid duplicates
				iframe.contentDocument.getElementById(maxiFont.id)?.remove();
				iframe.contentDocument.head.appendChild(maxiFont);
			});
		}
	}

	copyMaxiStylesToIframe(iframeDocument, iframe) {
		const maxiStyles = Array.from(
			document.querySelectorAll('div.maxi-blocks__styles')
		);
		if (!isEmpty(maxiStyles)) {
			maxiStyles.forEach(rawMaxiStyle => {
				const maxiStyle = rawMaxiStyle.cloneNode(true);
				const { id } = maxiStyle;
				iframeDocument.querySelector(`#${id}`)?.remove();
				maxiStyle.children[0].innerText =
					maxiStyle.children[0].innerText.replaceAll(
						' .edit-post-visual-editor',
						'.editor-styles-wrapper'
					);
				iframe.contentDocument.head.appendChild(maxiStyle);
			});
		}
	}

	copyMaxiVariablesToIframe(iframeDocument, iframe) {
		// Try to get SC variables from multiple sources
		// First check FSE iframe (for reusables/template parts in Site Editor)
		const siteEditorDoc = getSiteEditorIframe();
		let maxiVariables = siteEditorDoc?.querySelector(
			'#maxi-blocks-sc-vars-inline-css'
		);

		// Fall back to main document if not found in FSE iframe
		if (!maxiVariables) {
			maxiVariables = document.querySelector(
				'#maxi-blocks-sc-vars-inline-css'
			);
		}

		// Clone and append if found
		if (maxiVariables) {
			const clonedVariables = maxiVariables.cloneNode(true);
			iframeDocument
				.querySelector('#maxi-blocks-sc-vars-inline-css')
				?.remove();
			iframe.contentDocument.head.appendChild(clonedVariables);
		}
	}

	ensureMaxiStylesLoaded(iframeDocument, iframe) {
		const editStyles = iframeDocument.querySelector(
			'#maxi-blocks-block-editor-css'
		);
		const frontStyles = iframeDocument.querySelector(
			'#maxi-blocks-block-css'
		);

		if (!editStyles) {
			const rawEditStyles = document.querySelector(
				'#maxi-blocks-block-editor-css'
			);
			iframe.contentDocument.head.appendChild(
				rawEditStyles.cloneNode(true)
			);
		}

		if (!frontStyles) {
			const rawFrontStyles = document.querySelector(
				'#maxi-blocks-block-css'
			);
			if (rawFrontStyles) {
				iframe.contentDocument.head.appendChild(
					rawFrontStyles.cloneNode(true)
				);
			}
		}
	}

	getStyleTarget(isSiteEditor, iframe) {
		// No caching - just return the target directly
		if (isSiteEditor) {
			const target = getSiteEditorIframe();
			return target || document;
		}
		return iframe?.contentDocument || document;
	}

	generateStyleContent(
		uniqueID,
		stylesObj,
		currentBreakpoint,
		breakpoints,
		isBreakpointChange,
		isBlockStyleChange,
		forceGenerate,
		iframe,
		isSiteEditor
	) {
		let styleContent;
		let styles;

		// Ensure we always have a valid block style
		const blockStyle = this.props.attributes?.blockStyle || 'light';

		const originVersion = this.props.attributes?.['maxi-version-origin'];
		const currentVersion = this.props.attributes?.['maxi-version-current'];
		const isOriginVersionBelow156 = originVersion
			? compareVersions(originVersion, '1.5.6') < 0
			: false;
		const isCurrentVersionAtLeast201 = currentVersion
			? compareVersions(currentVersion, '2.0.1') >= 0
			: false;

		// Apply the copyGeneralToXL function to stylesObj only if this.props.baseBreakpoint is 'xxl',
		// the current version is less than 2.0.1, and the origin version is below 1.5.6
		const updatedStylesObj =
			this.props.baseBreakpoint === 'xxl' &&
			!isCurrentVersionAtLeast201 &&
			isOriginVersionBelow156
				? this.copyGeneralToXL(stylesObj)
				: stylesObj;

		if (isBlockStyleChange || forceGenerate) {
			const cssCache =
				!forceGenerate &&
				select('maxiBlocks/styles').getCSSCache(uniqueID);

			if (cssCache) {
				styleContent = cssCache[currentBreakpoint];
				const previousBlockStyle =
					blockStyle === 'light' ? 'dark' : 'light';
				const previousBlockStyleRegex = new RegExp(
					`--maxi-${previousBlockStyle}-`,
					'g'
				);
				styleContent = styleContent?.replace(
					previousBlockStyleRegex,
					`--maxi-${blockStyle}-`
				);
			}

			styles = this.generateStyles(
				updatedStylesObj,
				breakpoints,
				uniqueID
			);
			styleContent = styleGenerator(
				styles,
				!!iframe,
				isSiteEditor,
				currentBreakpoint
			);
		} else if (!isBreakpointChange || currentBreakpoint === 'xxl') {
			styles = this.generateStyles(
				updatedStylesObj,
				breakpoints,
				uniqueID
			);
			styleContent = styleGenerator(
				styles,
				!!iframe,
				isSiteEditor,
				currentBreakpoint
			);
		}

		if (styles) {
			dispatch('maxiBlocks/styles').saveCSSCache(
				uniqueID,
				styles,
				!!iframe,
				isSiteEditor
			);
		}

		// Add !important to white-space: nowrap
		if (styleContent) {
			styleContent = styleContent.replace(
				WHITE_SPACE_REGEX,
				'white-space: nowrap !important'
			);
		}

		return styleContent;
	}

	// Helper method to generate styles
	generateStyles(stylesObj, breakpoints, uniqueID) {
		const styles = styleResolver({
			styles: stylesObj,
			remove: false,
			breakpoints: breakpoints || this.getBreakpoints,
			uniqueID,
		});

		return styles;
	}

	removeStyles() {
		if (this.isPatternsPreview || this.templateModal) return;

		const { uniqueID } = this.props.attributes;

		// BULLETPROOF CLEANUP - Remove from ALL possible documents using GlobalStyleManager
		const documentsToClean = [
			document, // Main document
		];

		// Add documents from FSE contexts if they exist
		try {
			const templateViewDocument = getTemplateViewIframe(uniqueID);
			if (templateViewDocument) {
				documentsToClean.push(templateViewDocument);
			}
		} catch (e) {
			// Ignore document access errors
		}

		try {
			const siteEditorDocument = getSiteEditorIframe();
			if (siteEditorDocument) {
				documentsToClean.push(siteEditorDocument);
			}
		} catch (e) {
			// Ignore document access errors
		}

		try {
			const previewIframe = document.querySelector(
				'.block-editor-block-preview__container iframe'
			);
			if (previewIframe?.contentDocument) {
				documentsToClean.push(previewIframe.contentDocument);
			}
		} catch (e) {
			// Ignore iframe access errors
		}

		try {
			const editorIframe = document.querySelector(
				'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
			);
			if (editorIframe?.contentDocument) {
				documentsToClean.push(editorIframe.contentDocument);
			}
		} catch (e) {
			// Ignore iframe access errors
		}

		// Remove block styles from all documents using GlobalStyleManager
		documentsToClean.forEach(doc => {
			if (doc && typeof doc.getElementById === 'function') {
				removeBlockStyles(uniqueID, doc);
			}
		});

		// Legacy cleanup: Also remove any old individual style elements with this ID
		const legacyStyleId = `maxi-blocks__styles--${uniqueID}`;
		try {
			const allStyleElements = document.querySelectorAll(
				`#${legacyStyleId}`
			);
			allStyleElements.forEach(el => {
				if (el && el.parentNode) {
					el.remove();
				}
			});
		} catch (e) {
			// Ignore query errors
		}
	}

	/**
	 * Checks if any parent node of the given React ref has the specified class.
	 *
	 * @param {React.RefObject} ref       - The React ref to the starting element.
	 * @param {string}          className - The class name to look for.
	 * @returns {boolean} - True if any parent has the class, otherwise false.
	 */
	// eslint-disable-next-line class-methods-use-this
	hasParentWithClass(ref, className) {
		let parent = ref.current ? ref.current.parentNode : null;
		while (parent) {
			if (parent.classList && parent.classList.contains(className)) {
				return true;
			}
			parent = parent.parentNode;
		}
		return false;
	}

	// eslint-disable-next-line class-methods-use-this
	findParentWithClass(element, className) {
		let currentElement = element;
		while (
			currentElement &&
			!currentElement.classList.contains(className)
		) {
			currentElement = currentElement.parentElement;
		}
		return currentElement;
	}

	/**
	 * Hides Gutenberg's popover when the Maxi block is selected.
	 */
	hideGutenbergPopover() {
		if (this.isPatternsPreview || this.templateModal) return;

		if (this.props.isSelected && !this.popoverStyles) {
			// Use requestAnimationFrame to ensure the popover is in the DOM
			// This handles timing changes in WordPress 6.9 RC2
			requestAnimationFrame(() => {
				if (!this.props.isSelected || this.popoverStyles) return;

				this.popoverStyles = document.createElement('style');
				this.popoverStyles.innerHTML = `
					.block-editor-block-popover {
						display: none !important;
					}
				`;
				this.popoverStyles.id = 'maxi-blocks-hide-popover-styles';
				document.head.appendChild(this.popoverStyles);
			});
		} else if (!this.props.isSelected && this.popoverStyles) {
			this.popoverStyles.remove();
			this.popoverStyles = null;
		}
	}

	updateResponsiveClasses(iframe, currentBreakpoint) {
		const target = iframe?.contentDocument?.body || document.body;

		const editorWrapper = target.classList.contains('editor-styles-wrapper')
			? target
			: target.querySelector('.editor-styles-wrapper');
		if (editorWrapper) {
			editorWrapper.setAttribute(
				'maxi-blocks-responsive',
				currentBreakpoint
			);
		}
	}

	copyGeneralToXL(obj) {
		const copyToXL = innerObj => {
			for (const key in innerObj) {
				if (typeof innerObj[key] === 'object') {
					if (
						'general' in innerObj[key] &&
						!('xl' in innerObj[key])
					) {
						innerObj[key].xl = { ...innerObj[key].general };
					} else {
						copyToXL(innerObj[key]);
					}
				}
			}
		};

		const newObj = JSON.parse(JSON.stringify(obj));
		copyToXL(newObj);
		return newObj;
	}

	/**
	 * Check if an element is still in the DOM
	 * @param {Element} element - Element to check
	 * @returns {boolean} True if element is in DOM
	 */
	isElementInDOM(element) {
		return element && element.isConnected && document.contains(element);
	}

	// Returns responsive preview elements if present
	// Use currentBreakpoint param when available to avoid DOM timing issues
	getPreviewElements(parentElement, currentBreakpoint = null) {
		// If currentBreakpoint is provided, use it directly instead of querying DOM
		// This prevents timing issues where DOM classes haven't updated yet
		if (currentBreakpoint) {
			const breakpointMap = {
				xxl: 'desktop',
				xl: 'desktop',
				l: 'desktop',
				m: 'tablet',
				s: 'mobile',
				xs: 'mobile',
			};
			const previewType = breakpointMap[currentBreakpoint] || 'desktop';

			// Check if parentElement itself has the preview class
			const parentHasClass = parentElement?.classList?.contains(
				`is-${previewType}-preview`
			);

			// Query for the specific preview element based on current breakpoint
			let previewElement = parentElement.querySelector(
				`.is-${previewType}-preview`
			);

			// If not found as child, check if parentElement itself is the preview element
			if (!previewElement && parentHasClass) {
				previewElement = parentElement;
			}

			// FALLBACK: If the expected preview class isn't found yet (WordPress timing issue),
			// look for ANY preview element and use that, since we know the correct type from currentBreakpoint
			if (!previewElement) {
				previewElement =
					parentElement.querySelector('.is-mobile-preview') ||
					parentElement.querySelector('.is-tablet-preview') ||
					parentElement.querySelector('.is-desktop-preview');
			}

			return {
				tabletPreview: previewType === 'tablet' ? previewElement : null,
				mobilePreview: previewType === 'mobile' ? previewElement : null,
				desktopPreview:
					previewType === 'desktop' ? previewElement : null,
				isPreview: !!previewElement,
			};
		}

		// Fallback to DOM query when currentBreakpoint is not provided
		const tabletPreview = parentElement.querySelector('.is-tablet-preview');
		const mobilePreview = parentElement.querySelector('.is-mobile-preview');
		const desktopPreview = parentElement.querySelector(
			'.is-desktop-preview'
		);
		return {
			tabletPreview,
			mobilePreview,
			desktopPreview,
			isPreview: !!tabletPreview || !!mobilePreview || !!desktopPreview,
		};
	}

	// Add new method for FSE iframe styles
	addMaxiFSEIframeStyles() {
		// Get the FSE iframe
		const fseIframe = document.querySelector(
			'iframe.edit-site-visual-editor__editor-canvas'
		);

		if (!fseIframe || !fseIframe.contentDocument) return;

		// Check if the iframe-specific style already exists
		const existingIframeStyle = fseIframe.contentDocument.getElementById(
			'maxi-blocks-fse-iframe-styles'
		);

		if (!existingIframeStyle) {
			// Create the style element
			const iframeStyles =
				fseIframe.contentDocument.createElement('style');
			iframeStyles.id = 'maxi-blocks-fse-iframe-styles';

			// Add iframe-specific CSS
			iframeStyles.textContent = `
				.block-editor-iframe__html {
					overflow-x: hidden;
				}
			`;

			// Append style to iframe's head
			fseIframe.contentDocument.head.appendChild(iframeStyles);
		}

		// Ensure SC variables are copied to FSE iframe
		// This is crucial for reusables and template parts
		const scVarsFromMain = document.querySelector(
			'#maxi-blocks-sc-vars-inline-css'
		);

		if (scVarsFromMain) {
			const existingSCVars = fseIframe.contentDocument.getElementById(
				'maxi-blocks-sc-vars-inline-css'
			);

			// Check if SC vars need to be updated (content changed)
			if (
				!existingSCVars ||
				existingSCVars.innerHTML !== scVarsFromMain.innerHTML
			) {
				// Remove existing and add updated version
				existingSCVars?.remove();
				const clonedSCVars = scVarsFromMain.cloneNode(true);
				fseIframe.contentDocument.head.appendChild(clonedSCVars);
			}
		}

		// Ensure SC fonts are copied to FSE iframe
		// This is crucial for font rendering in reusable blocks and template parts
		const fontSelector =
			'link[rel="stylesheet"][id*="maxi-blocks-styles-font"]';
		const scFontsFromMain = Array.from(
			document.querySelectorAll(fontSelector)
		);

		if (!isEmpty(scFontsFromMain)) {
			scFontsFromMain.forEach(fontLink => {
				const existingFont = fseIframe.contentDocument.getElementById(
					fontLink.id
				);

				// Check if font needs to be updated
				if (!existingFont || existingFont.href !== fontLink.href) {
					existingFont?.remove();
					const clonedFont = fontLink.cloneNode(true);
					fseIframe.contentDocument.head.appendChild(clonedFont);
				}
			});
		}
	}

	// Call this method in componentDidMount
	setupFSEIframeObserver() {
		// Only create observer if it doesn't exist yet
		if (!this.fseIframeObserver) {
			this.fseIframeObserver = new MutationObserver(mutations => {
				for (const mutation of mutations) {
					if (mutation.type === 'childList') {
						const fseIframes = document.querySelectorAll(
							'iframe.edit-site-visual-editor__editor-canvas'
						);
						if (fseIframes.length > 0) {
							// Clear any existing FSE iframe timeout
							if (this.fseIframeTimeout) {
								clearTimeout(this.fseIframeTimeout);
							}

							// Wait for iframe to fully load
							this.fseIframeTimeout = setTimeout(() => {
								this.fseIframeTimeout = null;
								this.addMaxiFSEIframeStyles();
							}, 500);
						}
					}
				}
			});

			// Observe the document body for when iframes get added/removed
			this.fseIframeObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	}
}

export default MaxiBlockComponent;
