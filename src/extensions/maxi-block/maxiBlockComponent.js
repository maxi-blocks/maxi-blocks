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
import { Component, createRoot, createRef } from '@wordpress/element';
import {
	dispatch,
	resolveSelect,
	select,
	useDispatch,
	useSelect,
} from '@wordpress/data';

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
} from '../styles';
import getBreakpoints from '../styles/helpers/getBreakpoints';
import getIsIDTrulyUnique from './getIsIDTrulyUnique';
import getCustomLabel from './getCustomLabel';
import { loadFonts, getAllFonts } from '../text/fonts';
import {
	getIsSiteEditor,
	getSiteEditorIframe,
	getTemplatePartChooseList,
	getTemplateViewIframe,
	getSiteEditorPreviewIframes,
} from '../fse';
import { updateSCOnEditor } from '../style-cards';
import getWinBreakpoint from '../dom/getWinBreakpoint';
import getCurrentPreviewDeviceType from '../dom/getCurrentPreviewDeviceType';
import { getClientIdFromUniqueId, uniqueIDGenerator } from '../attributes';
import { getStylesWrapperId } from './utils';
import updateRelationHoverStatus from './updateRelationHoverStatus';
import propagateNewUniqueID from './propagateNewUniqueID';
import propsObjectCleaner from './propsObjectCleaner';
import updateRelationsRemotely from '../relations/updateRelationsRemotely';
import getIsUniqueCustomLabelRepeated from './getIsUniqueCustomLabelRepeated';
import { insertBlockIntoColumns, removeBlockFromColumns } from '../repeater';
import processRelations from '../relations/processRelations';

/**
 * External dependencies
 */
import {
	isArray,
	isEmpty,
	isEqual,
	isFunction,
	isNil,
	isObject,
	isString,
} from 'lodash';
import { diff } from 'deep-object-diff';

/**
 * Style Component
 */
const StyleComponent = ({
	uniqueID,
	blockStyle,
	stylesObj,
	blockBreakpoints,
	isIframe = false,
	isSiteEditor = false,
	isBreakpointChange,
	isBlockStyleChange,
	currentBreakpoint,
}) => {
	const { breakpoints } = useSelect(select => {
		const { receiveMaxiBreakpoints } = select('maxiBlocks');

		const breakpoints = receiveMaxiBreakpoints();

		return { breakpoints };
	});

	const { updateStyles, saveCSSCache, saveRawCSSCache } =
		useDispatch('maxiBlocks/styles');

	if (isBreakpointChange || isBlockStyleChange) {
		const cssCache = select('maxiBlocks/styles').getCSSCache(uniqueID);
		let styleContent = cssCache[currentBreakpoint];

		if (isBlockStyleChange) {
			const previousBlockStyle =
				blockStyle === 'light' ? 'dark' : 'light';

			const newCssCache = Object.entries(cssCache).reduce(
				(acc, [breakpoint, css]) => {
					acc[breakpoint] = css.replaceAll(
						`--maxi-${previousBlockStyle}-`,
						`--maxi-${blockStyle}-`
					);
					if (currentBreakpoint === breakpoint) {
						styleContent = acc[breakpoint];
					}
					return acc;
				},
				{}
			);

			const styles = select('maxiBlocks/styles').getBlockStyles(uniqueID);

			const newStyles = {
				[uniqueID]: {
					...styles,
					content: Object.entries(styles.content).reduce(
						(acc, [selector, props]) => {
							acc[selector] = Object.entries(props).reduce(
								(acc, [breakpoint, props]) => {
									acc[breakpoint] = Object.entries(
										props
									).reduce((acc, [prop, value]) => {
										acc[prop] = isString(value)
											? value.replaceAll(
													previousBlockStyle,
													blockStyle
											  )
											: value;
										return acc;
									}, {});
									return acc;
								},
								{}
							);
							return acc;
						},
						{}
					),
				},
			};

			updateStyles(uniqueID, newStyles);
			saveRawCSSCache(uniqueID, newCssCache);
		}

		return <style>{styleContent}</style>;
	}

	const getBreakpoints = () => {
		const areBreakpointsLoaded =
			!isEmpty(blockBreakpoints) &&
			Object.values(blockBreakpoints).every(blockValue => !!blockValue);

		return areBreakpointsLoaded ? blockBreakpoints : breakpoints;
	};

	const styles = styleResolver({
		styles: stylesObj,
		remove: false,
		breakpoints: getBreakpoints(),
		uniqueID,
	});

	const styleContent = styleGenerator(styles, isIframe, isSiteEditor);

	saveCSSCache(uniqueID, styles, isIframe, isSiteEditor);

	return <style>{styleContent}</style>;
};

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

		this.wrapperId = getStylesWrapperId(newUniqueID);
	}

	componentDidMount() {
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;
		// As we can't use a migrator to update relations as we don't have access to other blocks attributes,
		// setting this snippet here that should act the same way as a migrator
		const blocksIBRelations = select(
			'maxiBlocks/relations'
		).receiveBlockUnderRelationClientIDs(this.props.attributes.uniqueID);

		if (!isEmpty(blocksIBRelations))
			blocksIBRelations.forEach(({ clientId }) => {
				const maxiVersionCurrent =
					select('core/block-editor')?.getBlockAttributes(clientId)?.[
						'maxi-version-current'
					];

				if (maxiVersionCurrent) {
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
					].includes(maxiVersionCurrent);

					if (needUpdate)
						updateRelationsRemotely({
							blockTriggerClientId: clientId,
							blockTargetClientId: this.props.clientId,
							blockAttributes: this.props.attributes,
							breakpoint: this.props.deviceType,
						});
				}
			});

		// Migrate uniqueID for IB
		if (
			this.props.attributes.isFirstOnHierarchy &&
			this.props.attributes.legacyUniqueID
		) {
			const isRelationEligible = relation =>
				isObject(relation) &&
				'uniqueID' in relation &&
				!relation.uniqueID.endsWith('-u');

			// Function to collect all uniqueID and legacyUniqueID pairs from blocks within the hierarchy
			const collectIDs = (attributes, innerBlocks, idPairs = {}) => {
				const { uniqueID, legacyUniqueID } = attributes;

				if (uniqueID && legacyUniqueID) {
					idPairs[legacyUniqueID] = uniqueID;
				}

				if (isArray(innerBlocks)) {
					innerBlocks.forEach(block => {
						const { innerBlocks, attributes } = block;
						collectIDs(attributes, innerBlocks, idPairs);
					});
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

			if (isEmpty(idPairs)) return;
			// Function to replace relation.uniqueID with legacyUniqueID in each block's relations
			const replaceRelationIDs = (attributes, innerBlocks, clientId) => {
				const { relations } = attributes;

				if (isArray(relations)) {
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
					const { updateBlockAttributes } =
						dispatch('core/block-editor');
					updateBlockAttributes(clientId, {
						relations: newRelations,
					});
				}

				if (isArray(innerBlocks)) {
					innerBlocks.forEach(block => {
						const { innerBlocks, attributes, clientId } = block;
						replaceRelationIDs(attributes, innerBlocks, clientId);
					});
				}
			};

			// Replace relation.uniqueID with legacyUniqueID in all blocks
			replaceRelationIDs(
				this.props.attributes,
				block.innerBlocks,
				this.props.clientId
			);
		}

		const { receiveMaxiSettings } = resolveSelect('maxiBlocks');

		receiveMaxiSettings()
			.then(settings => {
				const { attributes } = this.props;
				const maxiVersion = settings.maxi_version;

				if (maxiVersion !== attributes['maxi-version-current'])
					attributes['maxi-version-current'] = maxiVersion;

				if (!attributes['maxi-version-origin'])
					attributes['maxi-version-origin'] = maxiVersion;
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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		) {
			return false;
		}

		// Force rendering the block when SC related values change
		if (this.scProps && this.state.oldSC) {
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

		const wasBreakpointChanged =
			this.props.deviceType !== nextProps.deviceType ||
			this.props.baseBreakpoint !== nextProps.baseBreakpoint;

		// Ensures rendering when selecting or unselecting
		if (
			this.props.isSelected !== nextProps.isSelected || // In case selecting/unselecting the block
			wasBreakpointChanged // In case of breakpoint change
		)
			return true;

		// Check changes on states
		if (!isEqual(this.state, nextState)) return true;

		if (this.shouldMaxiBlockUpdate)
			return (
				this.shouldMaxiBlockUpdate(
					this.props,
					nextProps,
					this.state,
					nextState
				) ||
				!isEqual(
					propsObjectCleaner(this.props),
					propsObjectCleaner(nextProps)
				)
			);

		return !isEqual(
			propsObjectCleaner(this.props),
			propsObjectCleaner(nextProps)
		);
	}

	/**
	 * Prevents styling
	 */
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return false;

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

		// If deviceType or baseBreakpoint changes, render styles
		const wasBreakpointChanged =
			this.props.deviceType !== prevProps.deviceType ||
			this.props.baseBreakpoint !== prevProps.baseBreakpoint;
		if (wasBreakpointChanged) return false;

		if (
			this.props.attributes.uniqueID !== prevProps.attributes.uniqueID &&
			!wasBreakpointChanged
		)
			return false;

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

		const { uniqueID } = this.props.attributes;

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

		this.hideGutenbergPopover();
		this.getCurrentBlockStyle();

		if (this.maxiBlockDidUpdate)
			this.maxiBlockDidUpdate(prevProps, prevState, shouldDisplayStyles);
	}

	componentWillUnmount() {
		// Return if it's a preview block
		if (
			this.isTemplatePartPreview ||
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

		// If it's site editor, when swapping from pages we need to keep the styles
		// On post editor, when entering to `code editor` page, we need to keep the styles
		const keepStylesOnEditor = !!select('core/block-editor').getBlock(
			this.props.clientId
		);

		// When duplicating Gutenberg creates a copy of the current copied block twice, making the first keep the same uniqueID and second
		// has a different one. The original block is removed so componentWillUnmount method is triggered, and as its uniqueID coincide with
		// the first copied block, on removing the styles the copied block appears naked. That's why we check if there's more than one block
		// with same uniqueID
		const keepStylesOnCloning =
			Array.from(
				document.getElementsByClassName(this.props.attributes.uniqueID)
			).length > 1;

		// Different cases:
		// 1. Swapping page on site editor or entering to `code editor` page on post editor
		// 2. Duplicating block
		const isBlockBeingRemoved = !keepStylesOnEditor && !keepStylesOnCloning;

		if (isBlockBeingRemoved) {
			const { clientId } = this.props;
			const { uniqueID } = this.props.attributes;

			// Styles
			const obj = this.getStylesObject;
			styleResolver({ styles: obj, remover: true });

			this.removeStyles();

			// Block
			dispatch('maxiBlocks/blocks').removeBlock(uniqueID, clientId);

			// Custom data
			dispatch('maxiBlocks/customData').removeCustomData(uniqueID);

			// IB
			dispatch('maxiBlocks/relations').removeBlockRelation(uniqueID);

			// CSSCache
			dispatch('maxiBlocks/styles').removeCSSCache(uniqueID);

			// Repeater
			if (this.props.repeaterStatus) {
				const { getBlockParentsByBlockName } =
					select('core/block-editor');
				const parentRows = getBlockParentsByBlockName(
					this.props.parentColumnClientId,
					'maxi-blocks/row-maxi'
				);

				const isRepeaterWasUndo = parentRows.every(
					parentRowClientId => {
						const parentRowAttributes =
							select('core/block-editor').getBlockAttributes(
								parentRowClientId
							);

						return !parentRowAttributes['repeater-status'];
					}
				);

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
		} else {
			const {
				getBlockOrder,
				getBlockAttributes,
				getBlockParentsByBlockName,
			} = select('core/block-editor');

			const innerBlocksPositions = this.props.getInnerBlocksPositions?.();

			// If repeater is turned on and block was moved
			// outwards, remove it from the columns
			if (
				this.props.repeaterStatus &&
				!innerBlocksPositions[[-1]].includes(
					getBlockParentsByBlockName(
						this.props.clientId,
						'maxi-blocks/column-maxi'
					)[0]
				)
			) {
				// Repeater
				removeBlockFromColumns(
					this.props.blockPositionFromColumn,
					this.props.parentColumnClientId,
					this.props.clientId,
					innerBlocksPositions,
					this.props.updateInnerBlocksPositions
				);
			}

			const parentRowClientId = getBlockParentsByBlockName(
				this.props.clientId,
				'maxi-blocks/row-maxi'
			).find(currentParentRowClientId => {
				const currentParentRowAttributes = getBlockAttributes(
					currentParentRowClientId
				);

				return currentParentRowAttributes['repeater-status'];
			});
			const parentRowAttributes = getBlockAttributes(parentRowClientId);

			// If repeater is turned on and block was moved
			// inwards, validate the structure
			if (
				parentRowAttributes?.['repeater-status'] &&
				(!this.props.repeaterStatus ||
					this.props.repeaterRowClientId !== parentRowClientId)
			) {
				const columnsClientIds = getBlockOrder(parentRowClientId);
				insertBlockIntoColumns(this.props.clientId, columnsClientIds);
			}
		}
		if (this.maxiBlockWillUnmount)
			this.maxiBlockWillUnmount(isBlockBeingRemoved);
	}

	getRootEl(iframe) {
		const { uniqueID } = this.props.attributes;

		const getStylesWrapper = (element, onCreateWrapper) => {
			let wrapper = element.querySelector(`#${this.wrapperId}`);

			if (!wrapper) {
				wrapper = document.createElement('div');
				wrapper.id = this.wrapperId;
				wrapper.classList.add('maxi-blocks__styles');
				element.appendChild(wrapper);

				if (isFunction(onCreateWrapper)) onCreateWrapper(wrapper);
			}

			return wrapper;
		};

		const getPreviewWrapper = (element, changeBreakpoint = true) => {
			const elementHead = Array.from(
				element.querySelectorAll('head')
			).pop();

			const elementBody = Array.from(
				element.querySelectorAll('body')
			).pop();

			elementBody.classList.add('maxi-blocks--active');

			if (changeBreakpoint) {
				const width =
					elementBody.querySelector('.is-root-container').offsetWidth;
				elementBody.setAttribute(
					'maxi-blocks-responsive',
					getWinBreakpoint(width)
				);
			}

			return getStylesWrapper(elementHead, () => {
				if (!element.getElementById('maxi-blocks-sc-vars-inline-css')) {
					const SC = select(
						'maxiBlocks/style-cards'
					).receiveMaxiActiveStyleCard();
					if (SC) {
						updateSCOnEditor(SC.value, null, element);
					}
				}
			});
		};

		let wrapper;
		let root = null;

		const isSiteEditor = getIsSiteEditor();

		if (isSiteEditor) {
			const siteEditorIframe = getSiteEditorIframe();

			if (this.isTemplatePartPreview) {
				const templateViewIframe = getTemplateViewIframe(uniqueID);
				if (templateViewIframe) {
					wrapper = getPreviewWrapper(templateViewIframe);
				}
			} else if (siteEditorIframe) {
				// Iframe on creation generates head, then gutenberg generates their own head
				// and in some moment we have two heads, so we need to add styles only to second head(gutenberg one)
				const iframeHead = Array.from(
					siteEditorIframe.querySelectorAll('head')
				).pop();

				wrapper = getStylesWrapper(iframeHead);
			}
		} else if (iframe) {
			wrapper = getPreviewWrapper(iframe.contentDocument, false);

			const currentPreviewDeviceType = getCurrentPreviewDeviceType();

			if (currentPreviewDeviceType !== 'Desktop')
				iframe.contentDocument.body.setAttribute(
					'maxi-blocks-responsive',
					document.querySelector('.is-tablet-preview') ? 's' : 'xs'
				);
			if (currentPreviewDeviceType === 'Tablet')
				iframe.contentDocument.body.setAttribute(
					'maxi-blocks-responsive',
					's'
				);
			if (!select('maxiBlocks').getIsIframeObserverSet()) {
				dispatch('maxiBlocks').setIsIframeObserverSet(true);
				const iframeObserver = new MutationObserver(() => {
					if (
						!iframe.contentDocument.body.classList.contains(
							'maxi-blocks--active'
						)
					) {
						iframe.contentDocument.body.classList.add(
							'maxi-blocks--active'
						);
					}
				});
				iframeObserver.observe(iframe.contentDocument.body, {
					attributes: true,
					attributeFilter: ['class'],
				});
			}
		} else {
			dispatch('maxiBlocks').setIsIframeObserverSet(false);
			wrapper = getStylesWrapper(document.head);
		}

		if (
			this.rootSlot &&
			wrapper?.parentElement.isSameNode(
				this.rootSlot._internalRoot?.containerInfo?.parentElement
			)
		)
			return this.rootSlot;

		if (!root && wrapper) {
			if (wrapper._reactRoot) {
				root = wrapper._reactRoot;
			} else {
				root = createRoot(wrapper);
				wrapper._reactRoot = root; // Store the created root for later use
			}
		}

		if (root) {
			dispatch('maxiBlocks/blocks').updateBlockStylesRoot(uniqueID, root);
		}

		return root;
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return null;
	}

	setMaxiAttributes() {
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return null;
		const {
			uniqueID,
			'dc-status': dcStatus,
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
				...(this.getMaxiCustomData && { ...this.getMaxiCustomData }),
				...(!hasDC &&
					contextLoop?.['cl-status'] && {
						context_loop: {
							[uniqueID]: contextLoop,
						},
					}),
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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;
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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return idToCheck;

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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

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

		loadFonts(response, true, target);
		this.areFontsLoaded.current = true;
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles(isBreakpointChange = false, isBlockStyleChange = false) {
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

		const { uniqueID } = this.props.attributes;

		const iframe = document.querySelector(
			'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
		);

		this.rootSlot = this.getRootEl(iframe);

		let obj;
		let breakpoints;
		let customDataRelations;

		if (!isBreakpointChange && !isBlockStyleChange) {
			obj = this.getStylesObject;
			breakpoints = this.getBreakpoints;

			// When duplicating, need to change the obj target for the new uniqueID
			if (!obj[uniqueID] && !!obj[this.props.attributes.uniqueID]) {
				obj[uniqueID] = obj[this.props.attributes.uniqueID];

				delete obj[this.props.attributes.uniqueID];
			}

			const customData = this.getCustomData;
			dispatch('maxiBlocks/customData').updateCustomData(customData);

			customDataRelations = customData?.[uniqueID]?.relations;
		}

		if (document.body.classList.contains('maxi-blocks--active')) {
			const isSiteEditor = getIsSiteEditor();

			if (
				this.rootSlot &&
				!this.isPatternsPreview &&
				!document.querySelector(
					'.editor-post-template__swap-template-modal'
				)
			) {
				const styleComponent = (
					<StyleComponent
						uniqueID={uniqueID}
						blockStyle={this.props.attributes.blockStyle}
						stylesObj={obj}
						currentBreakpoint={this.props.deviceType}
						blockBreakpoints={breakpoints}
						isSiteEditor={isSiteEditor}
						isBreakpointChange={isBreakpointChange}
						isBlockStyleChange={isBlockStyleChange}
						isPreview={this.isTemplatePartPreview}
						isIframe={!!iframe}
					/>
				);
				// Check if the root slot is still mounted before rendering
				if (
					this.rootSlot._internalRoot &&
					this.rootSlot._internalRoot.containerInfo
				) {
					this.rootSlot.render(styleComponent);
				}
			}

			if (customDataRelations) {
				const isRelationsPreview =
					this.props.attributes['relations-preview'];

				if (isRelationsPreview) {
					this.relationInstances =
						processRelations(customDataRelations);
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
						processRelations(
							this.relationInstances,
							'remove',
							removed
						);
						processRelations(this.relationInstances);
					}
				}

				if (!isRelationsPreview) {
					this.relationInstances = null;
				}

				this.previousRelationInstances = this.relationInstances;
			}
		}
	}

	removeStyles() {
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;
		// TODO: check if the code below is still necessary after this root unmount
		// TODO: check if there's an alternative to the setTimeout to `unmount` the rootSlot
		if (!this.isReusable && this.rootSlot)
			setTimeout(() => this.rootSlot.unmount(), 0);

		const templateViewIframe = getTemplateViewIframe(
			this.props.attributes.uniqueID
		);
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

		editorElement?.getElementById(this.wrapperId)?.remove();
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
		if (
			this.isPatternsPreview ||
			document.querySelector('.editor-post-template__swap-template-modal')
		)
			return;

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
}

export default MaxiBlockComponent;
