/**
 * Maxi Blocks Block component extension
 *
 * @todo Comment properly
 * @todo Transform to functional component or HOC
 * @todo Integrate `formatValue` into it
 */

/**
 * WordPress dependencies
 */
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
	getHasScrollEffects,
	getHasVideo,
	getParallaxLayers,
	getRelations,
	styleGenerator,
	styleResolver,
} from '../styles';
import getBreakpoints from '../styles/helpers/getBreakpoints';
import getIsUniqueIDRepeated from './getIsUniqueIDRepeated';
import getIsUniqueStyleIDRepeated from './getIsUniqueStyleIDRepeated';
import getCustomLabel from './getCustomLabel';
import { loadFonts, getAllFonts } from '../text/fonts';
import {
	getIsSiteEditor,
	getSiteEditorIframe,
	getTemplatePartChooseList,
	getTemplateViewIframe,
	getTemplatePartTagName,
} from '../fse';
import { updateSCOnEditor } from '../style-cards';
import getWinBreakpoint from '../dom/getWinBreakpoint';
import { getClientIdFromUniqueId, uniqueIDGenerator } from '../attributes';
import { getStylesWrapperId } from './utils';
import updateRelationHoverStatus from './updateRelationHoverStatus';
import propagateNewUniqueID from './propagateNewUniqueID';
import updateReusableBlockSize from './updateReusableBlockSize';
import propsObjectCleaner from './propsObjectCleaner';
import updateRelationsRemotely from '../relations/updateRelationsRemotely';
import { LoopContext } from '../DC';

/**
 * External dependencies
 */
import { isEmpty, isEqual, isFunction, isNil } from 'lodash';
import { diff } from 'deep-object-diff';
import uniqueIDStructureChecker from './uniqueIDStructureChecker';
import generateStyleID from '../attributes/generateStyleID';

/**
 * Style Component
 */
const StyleComponent = ({
	uniqueID,
	stylesObj,
	blockBreakpoints,
	isIframe = false,
	isSiteEditor = false,
	isBreakpointChange,
	currentBreakpoint,
}) => {
	console.log('StyleComponent');
	console.log('stylesObj');
	console.log(stylesObj);
	const { breakpoints } = useSelect(select => {
		const { receiveMaxiBreakpoints } = select('maxiBlocks');

		const breakpoints = receiveMaxiBreakpoints();

		return { breakpoints };
	});

	const { saveCSSCache } = useDispatch('maxiBlocks/styles');

	if (isBreakpointChange) {
		const styleContent =
			select('maxiBlocks/styles').getCSSCache(uniqueID)[
				currentBreakpoint
			];

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
	});

	console.log('styles');
	console.log(styles);

	const styleContent = styleGenerator(styles, isIframe, isSiteEditor);

	console.log('styleContent');
	console.log(styleContent);

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
		};

		this.areFontsLoaded = createRef(false);

		const { clientId, attributes } = this.props;
		const { uniqueID, styleID } = attributes;

		this.isReusable = false;
		this.blockRef = createRef();
		this.typography = getGroupAttributes(attributes, 'typography');
		this.isTemplatePartPreview = !!getTemplatePartChooseList();

		dispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Init
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		this.uniqueStyleIDChecker(styleID);
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

		this.wrapperId = getStylesWrapperId(
			newUniqueID,
			getTemplatePartTagName(clientId)
		);
	}

	componentDidMount() {
		// As we can't use a migrator to update relations as we don't have access to other blocks attributes,
		// setting this snippet here that should act the same way as a migrator
		const blocksIBRelations = select(
			'maxiBlocks/relations'
		).receiveBlockUnderRelationClientIDs(this.props.attributes.uniqueID);

		if (!isEmpty(blocksIBRelations))
			blocksIBRelations.forEach(({ clientId }) => {
				const { 'maxi-version-current': maxiVersionCurrent } =
					select('core/block-editor').getBlockAttributes(clientId);

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
			});

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
			.catch(() => console.error('Maxi Blocks: Could not load settings'));

		// Check if the block is reusable
		this.isReusable =
			this.blockRef.current.parentNode.classList.contains('is-reusable');

		if (this.isReusable) {
			this.widthObserver = updateReusableBlockSize(
				this.blockRef.current,
				this.props.attributes.uniqueID,
				this.props.clientId
			);
		}

		if (this.maxiBlockDidMount) this.maxiBlockDidMount();

		this.loadFonts();

		// In case the `rootSlot` is defined, means the block was unmounted by reasons like swapping from
		// code editor to visual editor, so we can avoid re-rendering the styles again and avoid an
		// unnecessary amount of process and resources
		this.displayStyles(!!this.rootSlot);

		if (!this.getBreakpoints.xxl) this.forceUpdate();
	}

	/**
	 * Prevents rendering
	 */
	shouldComponentUpdate(nextProps, nextState) {
		// Force rendering the block when SC related values change
		if (this.scProps) {
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

		// Ensures rendering when selecting or unselecting
		if (
			this.props.isSelected !== nextProps.isSelected || // In case selecting/unselecting the block
			this.props.deviceType !== nextProps.deviceType || // In case of breakpoint change
			this.props.baseBreakpoint !== nextProps.baseBreakpoint // In case of baseBreakpoint change
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
		// Force render styles when changing state
		if (!isEqual(prevState, this.state)) return false;

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
		if (
			this.props.deviceType !== prevProps.deviceType ||
			this.props.baseBreakpoint !== prevProps.baseBreakpoint
		)
			return false;

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
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
					select('maxiBlocks/relations').receiveRelations(uniqueID)
						.length !== relations.length
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

		if (!shouldDisplayStyles)
			this.displayStyles(
				this.props.deviceType !== prevProps.deviceType ||
					this.props.baseBreakpoint !== prevProps.baseBreakpoint
			);

		if (this.maxiBlockDidUpdate)
			this.maxiBlockDidUpdate(prevProps, prevState, shouldDisplayStyles);
	}

	componentWillUnmount() {
		// Return if it's a preview block
		if (this.isTemplatePartPreview) return;

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
			const { uniqueID } = this.props.attributes;

			// Styles
			const obj = this.getStylesObject;
			styleResolver({ styles: obj, remover: true });
			this.removeStyles();

			// Block
			dispatch('maxiBlocks/blocks').removeBlock(uniqueID);

			// Custom data
			dispatch('maxiBlocks/customData').removeCustomData(uniqueID);

			// IB
			dispatch('maxiBlocks/relations').removeBlockRelation(uniqueID);

			// CSSCache
			dispatch('maxiBlocks/styles').removeCSSCache(uniqueID);
		}

		if (this.maxiBlockWillUnmount)
			this.maxiBlockWillUnmount(isBlockBeingRemoved);
	}

	getRootEl() {
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

		const getPreviewWrapper = element => {
			const elementHead = Array.from(
				element.querySelectorAll('head')
			).pop();

			const elementBody = Array.from(
				element.querySelectorAll('body')
			).pop();

			elementBody.classList.add('maxi-blocks--active');

			const width =
				elementBody.querySelector('.is-root-container').offsetWidth;
			elementBody.setAttribute(
				'maxi-blocks-responsive',
				getWinBreakpoint(width)
			);

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
		let root;

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
		} else wrapper = getStylesWrapper(document.head);

		if (
			this.rootSlot &&
			wrapper?.parentElement.isSameNode(
				this.rootSlot._internalRoot.containerInfo.parentElement
			)
		)
			return this.rootSlot;

		if (wrapper) root = createRoot(wrapper);

		dispatch('maxiBlocks/blocks').updateBlockStylesRoot(uniqueID, root);

		return root;
	}

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return null;
	}

	setMaxiAttributes() {
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
		const {
			uniqueID,
			'dc-status': dcStatus,
			'background-layers': bgLayers,
			relations: relationsRaw,
		} = this.props.attributes;

		const contextLoop = this.context?.contextLoop;

		const scroll = getGroupAttributes(
			this.props.attributes,
			'scroll',
			false,
			'',
			true
		);

		const bgParallaxLayers = getParallaxLayers(uniqueID, bgLayers);
		const hasVideo = getHasVideo(uniqueID, bgLayers);
		const hasScrollEffects = getHasScrollEffects(uniqueID, scroll);
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
				...(hasScrollEffects && { scroll_effects: true }),
				...(dcStatus &&
					contextLoop?.['cl-status'] && {
						dynamic_content: {
							[uniqueID]: contextLoop,
						},
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

	uniqueStyleIDChecker(styleIdToCheck) {
		if (getIsUniqueStyleIDRepeated(styleIdToCheck)) {
			const newUniqueStyleID = generateStyleID();

			this.props.attributes.styleID = newUniqueStyleID;
			return newUniqueStyleID;
		}
		return styleIdToCheck;
	}

	uniqueIDChecker(idToCheck) {
		const { clientId, name: blockName } = this.props;

		if (
			getIsUniqueIDRepeated(idToCheck) ||
			!uniqueIDStructureChecker(idToCheck, clientId)
		) {
			const newUniqueID = uniqueIDGenerator({
				blockName,
				diff: 1,
				clientId,
			});

			propagateNewUniqueID(
				idToCheck,
				newUniqueID,
				this.props.attributes['background-layers']
			);

			this.props.attributes.uniqueID = newUniqueID;
			this.props.attributes.customLabel = getCustomLabel(
				this.props.attributes.customLabel,
				this.props.attributes.uniqueID
			);

			if (this.maxiBlockDidChangeUniqueID)
				this.maxiBlockDidChangeUniqueID(newUniqueID);

			return newUniqueID;
		}

		return idToCheck;
	}

	loadFonts() {
		if (this.areFontsLoaded.current || isEmpty(this.typography)) return;

		const target = getIsSiteEditor() ? getSiteEditorIframe() : document;
		if (!target) return;

		const response = getAllFonts(this.typography, 'custom-formats');
		if (isEmpty(response)) return;

		loadFonts(response, true, target);
		this.areFontsLoaded.current = true;
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles(isBreakpointChange = false) {
		const { uniqueID } = this.props.attributes;

		this.rootSlot = this.getRootEl();

		let obj;
		let breakpoints;

		if (!isBreakpointChange) {
			obj = this.getStylesObject;
			breakpoints = this.getBreakpoints;

			// When duplicating, need to change the obj target for the new uniqueID
			if (!obj[uniqueID] && !!obj[this.props.attributes.uniqueID]) {
				obj[uniqueID] = obj[this.props.attributes.uniqueID];

				delete obj[this.props.attributes.uniqueID];
			}

			const customData = this.getCustomData;
			dispatch('maxiBlocks/customData').updateCustomData(customData);
		}

		if (document.body.classList.contains('maxi-blocks--active')) {
			const isSiteEditor = getIsSiteEditor();

			if (this.rootSlot) {
				const styleComponent = (
					<StyleComponent
						uniqueID={uniqueID}
						stylesObj={obj}
						currentBreakpoint={this.props.deviceType}
						blockBreakpoints={breakpoints}
						isSiteEditor={isSiteEditor}
						isBreakpointChange={isBreakpointChange}
						isPreview={this.isTemplatePartPreview}
					/>
				);

				this.rootSlot.render(styleComponent);
			}
		}
	}

	removeStyles() {
		// TODO: check if the code below is still necessary after this root unmount
		// TODO: check if there's an alternative to the setTimeout to `unmount` the rootSlot
		if (this.rootSlot) setTimeout(() => this.rootSlot.unmount(), 0);

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

		if (this.isReusable) {
			this.widthObserver.disconnect();
			editorElement
				?.getElementById(
					`maxi-block-size-checker-${this.props.clientId}`
				)
				?.remove();
		}
	}
}

MaxiBlockComponent.contextType = LoopContext;

export default MaxiBlockComponent;
