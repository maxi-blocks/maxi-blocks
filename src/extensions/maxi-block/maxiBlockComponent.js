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
import { globalCleanupManager } from './relationCleanupManager';
import { addBlockStyles, removeBlockStyles } from './globalStyleManager';
import updateRelationsRemotely from '@extensions/relations/updateRelationsRemotely';
import getIsUniqueCustomLabelRepeated from './getIsUniqueCustomLabelRepeated';
import { removeBlockFromColumns } from '@extensions/repeater';
import processRelations from '@extensions/relations/processRelations';
import compareVersions from './compareVersions';

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

		// Initialize store management FIRST (before any store calls)
		this.storeSelectors = new Map(); // Cache selectors to avoid recreating

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

		// Track all relation instances for proper cleanup
		this.allRelationInstances = new Set();
		this.popoverStyles = null;
		this.isPatternsPreview = false;

		const previewIframes = getSiteEditorPreviewIframes();

		const blockName = this.safeSelect(
			'core/block-editor',
			'getBlockName',
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
		this.safeDispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Block successfully registered

		// Init
		this.updateLastInsertedBlocks();
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		this.getCurrentBlockStyle();
		this.setMaxiAttributes();
		this.setRelations();

		// Add block to store
		this.safeDispatch('maxiBlocks/blocks').addBlock(
			newUniqueID,
			clientId,
			this.rootSlot
		);

		// In case the blockRoot has been saved on the store, we get it back. It will avoid 2 situations:
		// 1. Adding again the root and having a React error
		// 2. Will request `displayStyles` without re-rendering the styles, which speeds up the process
		this.rootSlot = this.safeSelect(
			'maxiBlocks/blocks',
			'getBlockRoot',
			newUniqueID
		);
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
		const blocksIBRelations = this.safeSelect(
			'maxiBlocks/relations',
			'receiveBlockUnderRelationClientIDs',
			this.props.attributes.uniqueID
		);

		if (!isEmpty(blocksIBRelations)) {
			const { clientId, attributes, deviceType } = this.props;

			blocksIBRelations.forEach(({ clientId: relationClientId }) => {
				const blockMaxiVersionCurrent = this.safeSelect(
					'core/block-editor',
					'getBlockAttributes',
					relationClientId
				)?.['maxi-version-current'];

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
			const block = this.safeSelect(
				'core/block-editor',
				'getBlock',
				this.props.clientId
			);
			const idPairs = collectIDs(
				this.props.attributes,
				block && Array.isArray(block.innerBlocks)
					? block.innerBlocks
					: []
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

		// Log relations processing time

		// Step 4: Load settings directly from injected window.maxiSettings

		// Get settings directly from window - no async resolver needed
		// const settings = window.maxiSettings || {};

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

		// Ensures rendering when breakpoint changes - but only if this block has responsive styles
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
		if (this.isPatternsPreview || this.templateModal) return false;
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

		if (!shouldDisplayStyles) {
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

		// Gets the differences between the previous and current attributes
		const diffAttributes = diff(
			prevProps.attributes,
			this.props.attributes
		);

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

			// If there's a relation affecting this concrete block, check if is necessary
			// to update it's content to keep the coherence and the good UX

			const blocksIBRelations = select(
				'maxiBlocks/relations'
			).receiveBlockUnderRelationClientIDs(uniqueID);

			if (!isEmpty(blocksIBRelations))
				blocksIBRelations.forEach(({ clientId }) =>
					updateRelationsRemotely({
						blockTriggerClientId: clientId,
						blockTargetClientId: this.props.clientId,
						blockAttributes: this.props.attributes,
						breakpoint: this.props.deviceType,
					})
				);
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

		// Disconnect FSE observer if present
		if (this.fseIframeObserver) {
			this.disconnectTrackedObserver(this.fseIframeObserver);
			this.fseIframeObserver = null;
		}

		// Remove temporary popover-hiding styles if still injected
		if (this.popoverStyles) {
			this.popoverStyles.remove();
			this.popoverStyles = null;
		}

		// Clear Map and Set collections
		if (this.storeSelectors) {
			this.storeSelectors.clear();
			this.storeSelectors = null;
		}

		if (this.allRelationInstances) {
			this.allRelationInstances.clear();
			this.allRelationInstances = null;
		}

		// Clean up relation instances
		if (this.relationInstances) {
			try {
				this.safeCleanupRelationInstances(this.relationInstances);
			} catch (error) {
				console.error(
					'MaxiBlocks: Failed to cleanup relation instances on unmount:',
					error
				);
			}
			this.relationInstances = null;
		}

		if (this.previousRelationInstances) {
			this.previousRelationInstances = null;
		}

		// Clear DOM references
		this.rootSlot = null;
		this.editorIframe = null;
		this.templateModal = null;
		this.previousIframeContent = null;
		this.blockRef = null;

		// No cleanup needed for disabled data structures

		// No cleanup needed since we disabled all caching structures

		// Clear font cache references
		if (this.fontCache) {
			this.fontCache = null;
		}
		if (this.areFontsLoaded) {
			this.areFontsLoaded.current = false;
		}

		const keepStylesOnEditor = !!this.safeSelect(
			'core/block-editor',
			'getBlock',
			this.props.clientId
		);
		const keepStylesOnCloning =
			Array.from(document.getElementsByClassName(uniqueID)).length > 1;

		// Check for editor states that indicate temporary unmounting
		const isDragging =
			this.safeSelect('core/block-editor', 'isDraggingBlocks') || false;
		const isTyping =
			this.safeSelect('core/block-editor', 'isTyping') || false;
		const isMultiSelecting =
			this.safeSelect('core/block-editor', 'isMultiSelecting') || false;

		// IMPORTANT: Check if block still exists in the full block tree
		// During React reconciliation, getBlock might return null temporarily
		// but the block is actually being remounted, not removed
		const allBlocks =
			this.safeSelect('core/block-editor', 'getBlocks') || [];

		// Helper function to recursively collect all clientIds from block tree
		const collectAllClientIds = blocks => {
			const ids = [];
			const traverse = blockList => {
				if (!blockList || !Array.isArray(blockList)) return;
				for (const block of blockList) {
					if (block && block.clientId) {
						ids.push(block.clientId);
					}
					if (
						block &&
						block.innerBlocks &&
						Array.isArray(block.innerBlocks)
					) {
						traverse(block.innerBlocks);
					}
				}
			};
			traverse(blocks);
			return ids;
		};

		const blockExistsInTree = this.checkBlockInTree(
			allBlocks,
			this.props.clientId
		);

		// Enhanced logic: Don't remove styles during temporary editor states
		const isTemporaryUnmount = isDragging || isTyping || isMultiSelecting;

		// Additional check: If block tree is being modified, delay cleanup
		const isBlockTreeModifying =
			this.safeSelect('core/block-editor', 'isBlockBeingInserted') ||
			false;

		const isBlockBeingRemoved =
			!keepStylesOnEditor &&
			!keepStylesOnCloning &&
			!blockExistsInTree &&
			!isTemporaryUnmount &&
			!isBlockTreeModifying;

		// Only clean up non-style resources
		if (isBlockBeingRemoved) {
			const { clientId } = this.props;

			// Use microtask for store updates to avoid blocking
			queueMicrotask(() => {
				// Only clean up store data, not styles
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
					// NOTE: Not removing CSS cache to prevent style loss
				};
				batchedDispatch();

				if (this.props.repeaterStatus) {
					this.handleRepeaterCleanup();
				}
			});
		}

		if (this.maxiBlockWillUnmount) {
			this.maxiBlockWillUnmount(isBlockBeingRemoved);
		}
	}

	// Helper method to recursively check if block exists in tree
	checkBlockInTree(blocks, targetClientId) {
		if (!blocks || !Array.isArray(blocks)) {
			return false;
		}

		for (const block of blocks) {
			if (block.clientId === targetClientId) {
				return true;
			}

			// Recursively check inner blocks
			if (block.innerBlocks && block.innerBlocks.length > 0) {
				if (this.checkBlockInTree(block.innerBlocks, targetClientId)) {
					return true;
				}
			}
		}

		return false;
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

			const postEditor = this.getCachedElement(
				'.edit-post-visual-editor',
				document.body
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

		const isSiteEditor = getIsSiteEditor();

		const imageName = isSiteEditor
			? 'pattern-preview.jpg'
			: 'pattern-preview-edit.jpg';

		const defaultImgPath = `/wp-content/plugins/maxi-blocks/img/${imageName}`;
		const linkElement = this.getCachedElement('#maxi-blocks-block-css');
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
					this.disconnectTrackedObserver(observer);
					this.previewTimeouts.delete(iframe);
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

				this.disconnectTrackedObserver(observer);
			};

			// SIMPLIFIED: No tracking of existing observers since previewObservers is disabled
			// Create a new observer for this iframe
			const observer = this.createTrackedMutationObserver(
				(mutationsList, observer) => {
					mutationsList.forEach(mutation =>
						replaceIframeWithImage(mutation.target, observer)
					);
				},
				`preview-${iframe.src || 'unknown'}`
			);

			// SIMPLIFIED: No tracking per iframe since previewObservers is disabled

			observer.observe(iframe, {
				attributes: true,
				childList: true,
				subtree: true,
			});
		});
	}

	// This function saves the last inserted blocks' clientIds, so we can use them
	// to update IB relations.
	// OPTIMIZED: Use static cache to prevent excessive calls during page load
	updateLastInsertedBlocks() {
		if (this.isPatternsPreview || this.templateModal) return;
		const { clientId } = this.props;

		// Use a static cache shared across all instances to prevent redundant updates
		if (!MaxiBlockComponent._lastInsertedBlocksCache) {
			MaxiBlockComponent._lastInsertedBlocksCache = {
				lastUpdate: 0,
				processing: false,
			};
		}

		const cache = MaxiBlockComponent._lastInsertedBlocksCache;
		const now = Date.now();

		// Throttle: only update once per 100ms to prevent excessive calls during page load
		if (now - cache.lastUpdate < 100 || cache.processing) {
			return;
		}

		cache.processing = true;

		// Use Sets for O(1) lookup instead of array spread and includes
		const lastInsertedSet = new Set(
			this.safeSelect('maxiBlocks/blocks', 'getLastInsertedBlocks') || []
		);
		const blockClientIdsSet = new Set(
			this.safeSelect('maxiBlocks/blocks', 'getBlockClientIds') || []
		);

		// Only proceed if this clientId is not already tracked
		if (
			!lastInsertedSet.has(clientId) &&
			!blockClientIdsSet.has(clientId)
		) {
			const allClientIds = this.safeSelect(
				'core/block-editor',
				'getClientIdsWithDescendants'
			);

			// Only update if we actually got client IDs
			if (allClientIds && allClientIds.length > 0) {
				this.safeDispatch('maxiBlocks/blocks').saveLastInsertedBlocks(
					allClientIds
				);
				this.safeDispatch('maxiBlocks/blocks').saveBlockClientIds(
					allClientIds
				);

				cache.lastUpdate = now;
			}
		}

		cache.processing = false;
	}

	uniqueIDChecker(idToCheck) {
		if (this.isPatternsPreview || this.templateModal) return idToCheck;

		// Check if this block was recently processed by paste detection
		// If so, skip processing to prevent interference and style loss
		if (
			typeof window !== 'undefined' &&
			window.maxiBlocksPasteDetection &&
			window.maxiBlocksPasteDetection.isRecentlyProcessedByPaste(
				this.props.clientId
			)
		) {
			return idToCheck;
		}

		const { clientId, name: blockName, attributes } = this.props;
		const { customLabel } = attributes;

		const isNewBlock = this.safeSelect(
			'maxiBlocks/blocks',
			'getIsNewBlock',
			this.props.attributes.uniqueID
		);

		// OPTIMIZED: Use Set for O(1) lookup instead of array.includes O(n)
		const lastInsertedBlocks =
			this.safeSelect('maxiBlocks/blocks', 'getLastInsertedBlocks') || [];
		const lastInsertedSet = new Set(lastInsertedBlocks);
		const isInLastInserted = lastInsertedSet.has(this.props.clientId);
		const isBlockCopied = !isNewBlock && isInLastInserted;
		// UniqueID validation completed

		if (isBlockCopied || !getIsIDTrulyUnique(idToCheck)) {
			const newUniqueID = uniqueIDGenerator({
				blockName,
			});

			// New uniqueID generated

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
		const shouldGenerateNewStyles =
			!isBreakpointChange || this.props.deviceType === 'xxl';

		if (shouldGenerateNewStyles) {
			obj = this.getStylesObject || {};

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
				// DEFENSIVE: Clean up previous instances with comprehensive error handling
				if (this.relationInstances) {
					try {
						this.safeCleanupRelationInstances(
							this.relationInstances
						);
					} catch (error) {
						console.error(
							'MaxiBlocks: CRITICAL - Failed to cleanup relation instances:',
							error
						);
						// Force cleanup even if error occurred
						this.forceCleanupRelationInstances();
					} finally {
						// Always nullify reference regardless of cleanup success
						this.relationInstances = null;
					}
				}

				try {
					this.relationInstances =
						this.createTrackedRelationInstances(
							customDataRelations
						);
				} catch (error) {
					console.warn(
						'MaxiBlocks: Relation instances creation failed:',
						error
					);
					this.relationInstances = null;
				}
			}

			if (this.relationInstances) {
				this.relationInstances.forEach(relationInstance => {
					if (
						relationInstance &&
						typeof relationInstance.setIsPreview === 'function'
					) {
						try {
							relationInstance.setIsPreview(isRelationsPreview);
						} catch (error) {
							console.warn(
								'MaxiBlocks: Relation setIsPreview failed:',
								error
							);
						}
					}
				});
			}

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
				// DEFENSIVE: Clean up instances when not in preview mode
				if (this.relationInstances) {
					try {
						this.safeCleanupRelationInstances(
							this.relationInstances
						);
					} catch (error) {
						console.error(
							'MaxiBlocks: CRITICAL - Failed to cleanup relation instances (non-preview):',
							error
						);
						this.forceCleanupRelationInstances();
					} finally {
						this.relationInstances = null;
					}
				}
			}

			// DEFENSIVE: Clean up previous instances before updating (with comprehensive safety checks)
			if (
				this.previousRelationInstances &&
				this.previousRelationInstances !== this.relationInstances
			) {
				try {
					this.safeCleanupRelationInstances(
						this.previousRelationInstances
					);
				} catch (error) {
					console.error(
						'MaxiBlocks: CRITICAL - Failed to cleanup previous relation instances:',
						error
					);
					this.forceCleanupRelationInstances();
				} finally {
					this.previousRelationInstances = null;
				}
			}

			// Update previous reference (shallow copy to avoid reference issues)
			this.previousRelationInstances = this.relationInstances
				? [...this.relationInstances]
				: null;
		}
	}

	injectStyles(
		uniqueID,
		stylesObj,
		currentBreakpoint,
		breakpoints,
		isSiteEditor,
		isBreakpointChange,
		isBlockStyleChange,
		iframe
	) {
		if (iframe?.contentDocument?.body) {
			this.handleIframeStyles(iframe, currentBreakpoint);
		}

		const target = this.getStyleTarget(isSiteEditor, iframe);

		// Only generate new styles if it's not a breakpoint change or if it's a breakpoint change to XXL
		if (!isBreakpointChange || currentBreakpoint === 'xxl') {
			const styleContent = this.generateStyleContent(
				uniqueID,
				stylesObj,
				currentBreakpoint,
				breakpoints,
				isBreakpointChange,
				isBlockStyleChange,
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
		const maxiFonts = Array.from(
			document.querySelectorAll(
				'link[rel="stylesheet"][id*="maxi-blocks-styles-font"]'
			)
		);
		if (!isEmpty(maxiFonts)) {
			maxiFonts.forEach(rawMaxiFont => {
				const maxiFont = rawMaxiFont.cloneNode(true);
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
		const maxiVariables = document
			.querySelector('#maxi-blocks-sc-vars-inline-css')
			?.cloneNode(true);
		if (maxiVariables) {
			iframeDocument
				.querySelector('#maxi-blocks-sc-vars-inline-css')
				?.remove();
			iframe.contentDocument.head.appendChild(maxiVariables);
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

		if (isBlockStyleChange) {
			const cssCache = select('maxiBlocks/styles').getCSSCache(uniqueID);

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
			styleContent = styleGenerator(styles, !!iframe, isSiteEditor);
		} else if (!isBreakpointChange || currentBreakpoint === 'xxl') {
			styles = this.generateStyles(
				updatedStylesObj,
				breakpoints,
				uniqueID
			);
			styleContent = styleGenerator(styles, !!iframe, isSiteEditor);
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
			this.popoverStyles = document.createElement('style');
			this.popoverStyles.innerHTML = `
				.block-editor-block-popover {
					display: none !important;
				}
			`;
			this.popoverStyles.id = 'maxi-blocks-hide-popover-styles';
			document.head.appendChild(this.popoverStyles);
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

	// REMOVED: Cache cleanup methods that referenced uninitialized properties
	// The memoizedValues and cacheAccessOrder properties are no longer initialized (disabled in constructor)
	// so these methods would throw errors if called. Since caching is disabled, cleanup is not needed.

	/**
	 * Create a MutationObserver (simplified - no tracking since caching is disabled)
	 * @param {Function} callback     - Observer callback function
	 * @param {string}   [observerId] - Optional ID for the observer (for backward compatibility)
	 * @returns {MutationObserver} The created observer
	 */
	createTrackedMutationObserver(callback, observerId = null) {
		const observer = new MutationObserver(callback);

		// SIMPLIFIED: No tracking since mutationObservers Set is disabled
		// Observer cleanup is now handled manually where needed

		// If this is a preview observer, add ID for debugging
		if (observerId) {
			observer._maxiId = observerId;
		}

		return observer;
	}

	/**
	 * Disconnect a MutationObserver (simplified - no tracking removal since caching is disabled)
	 * @param {MutationObserver} observer - Observer to disconnect
	 */
	disconnectTrackedObserver(observer) {
		if (observer && typeof observer.disconnect === 'function') {
			observer.disconnect();
			// SIMPLIFIED: No tracking removal since mutationObservers and previewObservers are disabled
		}
	}

	// REMOVED: cleanupAllObservers method that referenced disabled mutationObservers and previewObservers
	// Since these collections are disabled, this method would throw errors if called

	/**
	 * Get a DOM element with caching and validation
	 * @param {string}           selector             - CSS selector
	 * @param {Document|Element} [context=document]   - Search context
	 * @param {boolean}          [forceRefresh=false] - Force refresh of cached element
	 * @returns {Element|null} The found element or null
	 */
	getCachedElement(selector, context = document, forceRefresh = false) {
		// SIMPLIFIED: No caching since domQueryCache is disabled
		// Always query fresh element to avoid memory accumulation
		return context.querySelector(selector);
	}

	/**
	 * Check if an element is still in the DOM
	 * @param {Element} element - Element to check
	 * @returns {boolean} True if element is in DOM
	 */
	isElementInDOM(element) {
		return element && element.isConnected && document.contains(element);
	}

	/**
	 * Safe selector that tracks subscriptions for cleanup
	 * @param {string} storeName    - Store name (e.g., 'core/block-editor')
	 * @param {string} selectorName - Selector name (e.g., 'getBlockName')
	 * @param {...any} args         - Selector arguments
	 * @returns {*} Selector result
	 */
	safeSelect(storeName, selectorName, ...args) {
		// Guard against calls after cleanup
		if (!this.storeSelectors) {
			return undefined;
		}

		const key = `${storeName}/${selectorName}`;

		// Get or create cached selector
		if (!this.storeSelectors.has(key)) {
			try {
				const store = select(storeName);
				if (!store || typeof store[selectorName] !== 'function') {
					// Do NOT cache null - allow future re-attempts when store becomes available
					return undefined;
				}
				// Only cache when we have a valid callable function
				this.storeSelectors.set(key, store[selectorName]);
			} catch (error) {
				console.warn(`Failed to access selector ${key}:`, error);
				// Do NOT cache null on exception - allow future re-attempts
				return undefined;
			}
		}

		const selector = this.storeSelectors.get(key);
		if (!selector) {
			return undefined;
		}

		try {
			// eslint-disable-next-line consistent-return
			return selector(...args);
		} catch (error) {
			console.warn(`Selector ${key} threw an error:`, error);
			return undefined;
		}
	}

	/**
	 * Safe dispatch that tracks actions for cleanup
	 * @param {string} storeName - Store name (e.g., 'core/block-editor')
	 * @returns {Object} Store actions
	 */
	safeDispatch(storeName) {
		return dispatch(storeName);
	}

	/**
	 * Create tracked relation instances with automatic cleanup
	 * @param {Array} customDataRelations - Relations data
	 * @returns {Array|null} Relation instances
	 */
	createTrackedRelationInstances(customDataRelations) {
		if (!customDataRelations || !Array.isArray(customDataRelations)) {
			return null;
		}

		try {
			const instances = processRelations(customDataRelations);

			if (instances && Array.isArray(instances)) {
				// Track each instance for cleanup with validation
				instances.forEach(instance => {
					if (instance && typeof instance === 'object') {
						this.allRelationInstances.add(instance);
					}
				});
				return instances.filter(
					instance => instance && typeof instance === 'object'
				);
			}
		} catch (error) {
			console.warn('MaxiBlocks: processRelations failed:', error);
		}

		return null;
	}

	/**
	 * DEFENSIVE: Safe cleanup of relation instances with comprehensive error handling
	 * Now integrates with enhanced cleanup manager for better performance and monitoring
	 * @param {Array} instances - Relation instances to clean up
	 */
	safeCleanupRelationInstances(instances) {
		if (!instances || !Array.isArray(instances)) {
			console.warn(
				'MaxiBlocks: Invalid instances passed to cleanup:',
				instances
			);
			return;
		}

		// Use the statically imported cleanup manager
		if (!this.cleanupManager) {
			this.cleanupManager = globalCleanupManager;
		}

		this.performEnhancedCleanup(instances);
	}

	/**
	 * Enhanced cleanup using the cleanup manager
	 * @param {Array} instances - Relation instances to clean up
	 */
	performEnhancedCleanup(instances) {
		// Check for memory leaks first
		const suspiciousInstances =
			this.cleanupManager.detectMemoryLeaks(instances);

		if (suspiciousInstances.length > 0) {
			console.warn(
				`MaxiBlocks: Detected ${suspiciousInstances.length} potentially leaked instances`
			);

			// Schedule high priority cleanup for suspicious instances
			suspiciousInstances.forEach((instance, index) => {
				this.cleanupManager.scheduleInstanceCleanup(
					instance,
					index,
					3 // HIGH priority (CLEANUP_PRIORITY.HIGH from relationCleanupManager.js)
				);
			});
		}

		// For large numbers of instances, use batch cleanup
		if (instances.length > 10) {
			this.cleanupManager.scheduleBatchCleanup(instances, 2); // NORMAL priority
		} else {
			// For small numbers, schedule individual cleanups
			instances.forEach((instance, index) => {
				if (instance && typeof instance === 'object') {
					this.cleanupManager.scheduleInstanceCleanup(
						instance,
						index,
						2
					); // NORMAL priority
				}
			});
		}
	}

	/**
	 * Force cleanup a single instance by nullifying all possible references
	 * @param {Object} instance - Instance to force cleanup
	 * @param {number} index    - Instance index for logging
	 */
	forceCleanupSingleInstance(instance, index) {
		console.warn(`MaxiBlocks: Force cleaning instance ${index}`);

		// Nullify all possible properties that could hold references
		const propertiesToNullify = [
			'observer',
			'element',
			'target',
			'removeRelationSubscriber',
			'removePreviousStylesAndTransitions',
			'cleanup',
			'subscription',
			'mutationObserver',
			'eventListeners',
			'styleElement',
			'targetElement',
		];

		propertiesToNullify.forEach(prop => {
			try {
				if (instance[prop]) {
					// Try to call disconnect/remove methods if they exist
					if (typeof instance[prop].disconnect === 'function') {
						instance[prop].disconnect();
					}
					if (typeof instance[prop].remove === 'function') {
						instance[prop].remove();
					}
					instance[prop] = null;
				}
			} catch (error) {
				// Silently continue - this is force cleanup
			}
		});

		// Remove from all tracking sets
		try {
			if (this.allRelationInstances) {
				this.allRelationInstances.delete(instance);
			}
		} catch (error) {
			// Silently continue
		}
	}

	/**
	 * EMERGENCY: Force cleanup all relation instances when normal cleanup fails
	 */
	forceCleanupRelationInstances() {
		console.warn(
			'MaxiBlocks: EMERGENCY - Force cleaning all relation instances'
		);

		// Use enhanced cleanup manager if available
		if (this.cleanupManager) {
			// Schedule critical priority cleanup for all instances
			if (this.allRelationInstances) {
				const instances = Array.from(this.allRelationInstances);
				this.cleanupManager.scheduleBatchCleanup(instances, 4); // CRITICAL priority
			}
		}

		// Clear all tracking sets
		try {
			if (this.allRelationInstances) {
				this.allRelationInstances.forEach(instance => {
					try {
						this.forceCleanupSingleInstance(instance, 'force');
					} catch (error) {
						// Silently continue with force cleanup
					}
				});
				this.allRelationInstances.clear();
			}
		} catch (error) {
			console.error('MaxiBlocks: Even force cleanup failed:', error);
		}

		// Nullify all instance references
		this.relationInstances = null;
		this.previousRelationInstances = null;
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
		// Only proceed if we're in FSE
		if (!getIsSiteEditor()) return;

		// Get the FSE iframe
		const fseIframe = this.getCachedElement(
			'iframe.edit-site-visual-editor__editor-canvas'
		);

		if (!fseIframe || !fseIframe.contentDocument) {
			return;
		}

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

		// Always copy/update Maxi CSS variables to FSE iframe
		// This ensures variables are available even if they weren't ready
		// during initial iframe creation
		this.copyMaxiCSSVariablesToIframe(fseIframe);
	}

	/**
	 * Copy MaxiBlocks CSS variables to FSE iframe
	 * @param {HTMLIFrameElement} fseIframe - FSE iframe element
	 */
	copyMaxiCSSVariablesToIframe(fseIframe) {
		if (!fseIframe || !fseIframe.contentDocument) return;

		// Copy style card CSS variables from main document
		const maxiVariables = document.querySelector(
			'#maxi-blocks-sc-vars-inline-css'
		);
		if (maxiVariables) {
			// Remove old version if exists
			fseIframe.contentDocument
				.querySelector('#maxi-blocks-sc-vars-inline-css')
				?.remove();

			// Clone and append to iframe
			const clonedVariables = maxiVariables.cloneNode(true);
			fseIframe.contentDocument.head.appendChild(clonedVariables);
		}

		// Load fonts into FSE iframe
		loadFonts(getPageFonts(), true, fseIframe.contentDocument);

		// Copy font stylesheet links to FSE iframe
		const maxiFonts = Array.from(
			document.querySelectorAll(
				'link[rel="stylesheet"][id*="maxi-blocks-styles-font"]'
			)
		);
		if (maxiFonts.length > 0) {
			maxiFonts.forEach(rawMaxiFont => {
				// Check if this font link already exists in iframe
				const fontId = rawMaxiFont.id;
				if (!fseIframe.contentDocument.querySelector(`#${fontId}`)) {
					const maxiFont = rawMaxiFont.cloneNode(true);
					fseIframe.contentDocument.head.appendChild(maxiFont);
				}
			});
		}

		// Check if spinners are already added
		const existingSpinners = fseIframe.contentDocument.getElementById(
			'maxi-blocks-fse-spinners'
		);

		if (!existingSpinners) {
			// Create style element for spinner animations
			const spinnersStyle =
				fseIframe.contentDocument.createElement('style');
			spinnersStyle.id = 'maxi-blocks-fse-spinners';

			// Add essential CSS variables and spinner animations for loaders
			spinnersStyle.textContent = `
				:root {
					--maxi-primary-color: #2c8a46; /* Fresh lime green */
				}
				.maxi-puff-loader span {
					height: 40px !important;
					width: 40px !important;
				}
				@keyframes react-spinners-PuffLoader-puff-1 {
					0% { transform: scale(0); }
					100% { transform: scale(1); }
				}
				@keyframes react-spinners-PuffLoader-puff-2 {
					0% { opacity: 1; }
					100% { opacity: 0; }
				}
			`;

			fseIframe.contentDocument.head.appendChild(spinnersStyle);
		}
	}

	// Call this method in componentDidMount
	setupFSEIframeObserver() {
		// Clean up existing observer if it exists
		if (this.fseIframeObserver) {
			this.disconnectTrackedObserver(this.fseIframeObserver);
			this.fseIframeObserver = null;
		}

		// Create a new tracked FSE observer
		this.fseIframeObserver = this.createTrackedMutationObserver(
			mutations => {
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
			},
			'fse-iframe-observer'
		);

		// Observe the document body for when iframes get added/removed
		this.fseIframeObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}

export default MaxiBlockComponent;
