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
import { dispatch, resolveSelect, select } from '@wordpress/data';

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
import updateRelationsRemotely from '@extensions/relations/updateRelationsRemotely';
import getIsUniqueCustomLabelRepeated from './getIsUniqueCustomLabelRepeated';
import { removeBlockFromColumns } from '@extensions/repeater';
import processRelations from '@extensions/relations/processRelations';
import compareVersions from './compareVersions';

/**
 * External dependencies
 */
import _, { isArray, isEmpty, isEqual, isNil, isObject } from 'lodash';
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

		this.state = {
			oldSC: {},
			scValues: {},
			showLoader: false,
		};

		this.areFontsLoaded = createRef(false);

		const { clientId, attributes } = this.props;
		const { uniqueID } = attributes;

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

		if (
			previewIframes.length > 0 &&
			(!blockName ||
				document.querySelector(
					'.editor-post-template__swap-template-modal'
				))
		) {
			this.isPatternsPreview = true;
			this.showPreviewImage(previewIframes);
			return;
		}

		if (this.isPatternsPreview) return;

		dispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Init
		this.updateLastInsertedBlocks();
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		this.getCurrentBlockStyle();
		this.setMaxiAttributes();
		this.setRelations();

		// Add block to store
		dispatch('maxiBlocks/blocks').addBlock(
			newUniqueID,
			clientId,
			this.rootSlot
		);

		// In case the blockRoot has been saved on the store, we get it back. It will avoid 2 situations:
		// 1. Adding again the root and having a React error
		// 2. Will request `displayStyles` without re-rendering the styles, which speeds up the process
		this.rootSlot = select('maxiBlocks/blocks').getBlockRoot(newUniqueID);
		// Cache DOM references
		this.editorIframe = null;
		this.templateModal = null;
		this.updateDOMReferences();

		// Cache frequently accessed values
		this.memoizedValues = new Map();

		// Debounce expensive operations
		this.debouncedDisplayStyles = _.debounce(this.displayStyles, 150);

		// Set maximum cache size and initialize cache timestamp
		this.MAX_CACHE_SIZE = 10000;
		this.CACHE_CLEANUP_INTERVAL = 600000; // 600 seconds
		this.lastCacheCleanup = Date.now();
	}

	updateDOMReferences() {
		if (!this.editorIframe) {
			this.editorIframe = document.querySelector(
				'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
			);
		}
		if (!this.templateModal) {
			this.templateModal = document.querySelector(
				'.editor-post-template__swap-template-modal'
			);
		}
	}

	componentDidMount() {
		this.updateDOMReferences();

		const { uniqueID, isFirstOnHierarchy, legacyUniqueID } =
			this.props.attributes;

		if (this.isPatternsPreview || this.templateModal) return;

		// Add FSE iframe styles if we're in the site editor
		if (getIsSiteEditor()) {
			this.addMaxiFSEIframeStyles();

			// Set up an observer to handle iframe reloads
			this.setupFSEIframeObserver();
		}

		const blocksIBRelations = select(
			'maxiBlocks/relations'
		).receiveBlockUnderRelationClientIDs(uniqueID);

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

		const { receiveMaxiSettings } = resolveSelect('maxiBlocks');

		receiveMaxiSettings()
			.then(settings => {
				const maxiVersion = settings.maxi_version;
				const { updateBlockAttributes } = dispatch('core/block-editor');
				const {
					'maxi-version-current': maxiVersionCurrent,
					'maxi-version-origin': maxiVersionOrigin,
				} = this.props.attributes;

				// Only update if we have a valid version from settings
				if (maxiVersion) {
					const updates = {};

					// Update current version if different
					if (maxiVersion !== maxiVersionCurrent) {
						updates['maxi-version-current'] = maxiVersion;
					}

					// Set origin version if not set
					if (!maxiVersionOrigin) {
						updates['maxi-version-origin'] = maxiVersion;
					}

					// Only dispatch if we have updates
					if (Object.keys(updates).length > 0) {
						updateBlockAttributes(this.props.clientId, updates);
					}
				}
			})
			.catch(error =>
				console.error('MaxiBlocks: Could not load settings', error)
			);

		// Check if the block is reusable
		this.isReusable = this.hasParentWithClass(this.blockRef, 'is-reusable');

		if (this.maxiBlockDidMount) this.maxiBlockDidMount();

		this.loadFonts();

		// In case the `rootSlot` is defined, means the block was unmounted by reasons like swapping from
		// code editor to visual editor, so we can avoid re-rendering the styles again and avoid an
		// unnecessary amount of process and resources
		this?.displayStyles(!!this?.rootSlot);

		if (!this.getBreakpoints.xxl) this.forceUpdate();
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

		// For render styles when there's no <style> element for the block
		// Normally happens when duplicate the block
		if (
			!document.querySelector(
				`#maxi-blocks__styles--${this.props.attributes.uniqueID}`
			) ||
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

		if (this.isPatternsPreview || this.templateModal) return;
		const { uniqueID } = this.props.attributes;

		if (!shouldDisplayStyles) {
			!this.isReusable &&
				this.displayStyles(
					this.props.deviceType !== prevProps.deviceType ||
						(this.props.baseBreakpoint !==
							prevProps.baseBreakpoint &&
							!!prevProps.baseBreakpoint),
					this.props.attributes.blockStyle !==
						prevProps.attributes.blockStyle
				);
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

		// Return early checks
		if (
			this.isTemplatePartPreview ||
			this.isPatternsPreview ||
			this.templateModal
		)
			return;

		// Clean up the FSE iframe observer if it exists
		if (this.fseIframeObserver) {
			this.fseIframeObserver.disconnect();
			this.fseIframeObserver = null;
		}

		// Clear memoization and debounced functions
		this.memoizedValues?.clear();
		this.debouncedDisplayStyles?.cancel();

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
				const fragment = document.createDocumentFragment();
				styleResolver({
					styles: obj,
					remover: true,
					optimized: true,
					fragment,
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

	handleResponsivePreview(editorWrapper) {
		const { tabletPreview, mobilePreview } =
			this.getPreviewElements(editorWrapper);
		const previewTarget = tabletPreview ?? mobilePreview;
		const postEditor = document?.body?.querySelector(
			'.edit-post-visual-editor'
		);
		const responsiveWidth = postEditor.getAttribute(
			'maxi-blocks-responsive-width'
		);
		const isMaxiPreview = postEditor.getAttribute('is-maxi-preview');

		if (isMaxiPreview) {
			previewTarget.style.width = `${responsiveWidth}px`;
			previewTarget.style.boxSizing = 'content-box';
		}
	}

	handleIframeStyles(iframe, currentBreakpoint) {
		const iframeDocument = iframe.contentDocument;
		const editorWrapper = iframeDocument.body;
		const { isPreview } = this.getPreviewElements(editorWrapper);

		if (isPreview) {
			this.handleResponsivePreview(editorWrapper);
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

	getOrCreateStyleElement(target, uniqueID) {
		const styleId = `maxi-blocks__styles--${uniqueID}`;
		let styleElement = target.getElementById(styleId);

		if (!styleElement) {
			styleElement = target.createElement('style');
			styleElement.id = styleId;
			target.head.appendChild(styleElement);
		}

		return styleElement;
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
		const timeouts = {};

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

		previewIframes.forEach(iframe => {
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
				clearTimeout(timeouts[iframe]);
				timeouts[iframe] = setTimeout(() => {
					observer.disconnect();
					delete timeouts[iframe];
				}, disconnectTimeout);

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

		const isBlockCopied =
			!select('maxiBlocks/blocks').getIsNewBlock(
				this.props.attributes.uniqueID
			) &&
			select('maxiBlocks/blocks')
				.getLastInsertedBlocks()
				.includes(this.props.clientId);

		if (isBlockCopied || !getIsIDTrulyUnique(idToCheck)) {
			const newUniqueID = uniqueIDGenerator({
				blockName,
			});

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
		if (this.isPatternsPreview || this.templateModal) return;

		const typographyToCheck = Object.fromEntries(
			Object.entries(this.typography).filter(
				([key, value]) => value !== undefined
			)
		);

		if (
			this.areFontsLoaded.current ||
			(isEmpty(typographyToCheck) && !this.paginationTypographyStatus)
		)
			return;

		const target = getIsSiteEditor() ? getSiteEditorIframe() : document;
		if (!target) return;

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
		} else response = getAllFonts(this.typography, 'custom-formats');
		if (isEmpty(response)) return;

		// Clear font cache after loading
		if (this.fontCache) {
			this.fontCache = null;
		}

		// Debounce font loading to prevent multiple loads
		if (this.fontLoadTimeout) {
			clearTimeout(this.fontLoadTimeout);
		}

		this.fontLoadTimeout = setTimeout(() => {
			loadFonts(response, true, target);
			this.areFontsLoaded.current = true;
			this.fontLoadTimeout = null;
		}, 300);
	}

	/**
	 * Refresh the styles on the Editor
	 */
	displayStyles(isBreakpointChange = false, isBlockStyleChange = false) {
		// Update references if they're null
		this.updateDOMReferences();

		if (this.isPatternsPreview || this.templateModal) return;

		const { uniqueID } = this.props.attributes;
		const isSiteEditor = getIsSiteEditor();
		const breakpoints = this.getBreakpoints;
		let obj;
		let customDataRelations;

		// Generate new styles if it's not a breakpoint change or if it's XXL breakpoint
		const shouldGenerateNewStyles =
			!isBreakpointChange || this.props.deviceType === 'xxl';

		if (shouldGenerateNewStyles) {
			obj = this.getStylesObject;

			// When duplicating, need to change the obj target for the new uniqueID
			if (!obj[uniqueID] && !!obj[this.props.attributes.uniqueID]) {
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
		const styleElement = this.getOrCreateStyleElement(target, uniqueID);

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
			this.updateStyleElement(styleElement, styleContent);
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
		const { isPreview } = this.getPreviewElements(editorWrapper);

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
		const cacheKey = `styleTarget-${isSiteEditor}-${!!iframe}`;

		this.cleanupCache();

		if (this.memoizedValues.has(cacheKey)) {
			return this.memoizedValues.get(cacheKey);
		}

		const target = isSiteEditor
			? getSiteEditorIframe()
			: iframe?.contentDocument || document;

		this.memoizedValues.set(cacheKey, target);
		return target;
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

	updateStyleElement(styleElement, styleContent) {
		if (styleElement.textContent !== styleContent) {
			styleElement.textContent = styleContent;
		}
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

		const templateViewIframe = getTemplateViewIframe(uniqueID);
		const siteEditorIframe = getSiteEditorIframe();
		const previewIframe = document.querySelector(
			'.block-editor-block-preview__container iframe'
		);
		const iframe = document.querySelector(
			'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
		);

		const editorElement =
			templateViewIframe ||
			siteEditorIframe ||
			previewIframe ||
			iframe ||
			document;

		if (
			!editorElement ||
			typeof editorElement?.getElementById !== 'function'
		)
			return;

		const styleElement = editorElement.getElementById(
			`maxi-blocks__styles--${uniqueID}`
		);
		if (styleElement) {
			styleElement.remove();
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

	// Add cache management methods
	cleanupCache() {
		const now = Date.now();

		// Only cleanup if enough time has passed AND cache is too large
		if (
			this.memoizedValues.size > this.MAX_CACHE_SIZE &&
			now - this.lastCacheCleanup >= this.CACHE_CLEANUP_INTERVAL
		) {
			// Convert to array for sorting
			const entries = Array.from(this.memoizedValues.entries());

			// Keep only the most recent entries
			const entriesToKeep = entries.slice(
				-Math.floor(this.MAX_CACHE_SIZE * 0.8)
			); // Keep 80% of max size

			// Clear and rebuild cache
			this.memoizedValues.clear();
			entriesToKeep.forEach(([key, value]) => {
				this.memoizedValues.set(key, value);
			});

			this.lastCacheCleanup = now;
		}
	}

	// Returns responsive preview elements if present
	getPreviewElements(parentElement) {
		const tabletPreview = parentElement.querySelector('.is-tablet-preview');
		const mobilePreview = parentElement.querySelector('.is-mobile-preview');
		return {
			tabletPreview,
			mobilePreview,
			isPreview: !!tabletPreview || !!mobilePreview,
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
							// Wait for iframe to fully load
							setTimeout(() => {
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
