/**
 * Maxi Blocks Block component extension
 *
 * @todo Comment properly
 * @todo Transform to functional component or HOC
 * @todo Integrate `formatValue` into it
 */

/**
 * Disabled some ESLint rules; this file needs to be cleaned
 */
/* eslint-disable class-methods-use-this */

/**
 * WordPress dependencies
 */
import { Component, render, createRef } from '@wordpress/element';
import { dispatch, resolveSelect, select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	entityRecordsWrapper,
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
import getCustomLabel from './getCustomLabel';
import { loadFonts, getAllFonts } from '../text/fonts';
import goThroughMaxiBlocks from './goThroughMaxiBlocks';
import uniqueIDStructureChecker from './uniqueIDStructureChecker';
import {
	getIsSiteEditor,
	getSiteEditorIframe,
	getTemplatePartChooseList,
	getTemplateViewIframe,
} from '../fse';
import { updateSCOnEditor } from '../style-cards';
import getWinBreakpoint from '../dom/getWinBreakpoint';
import { uniqueIDGenerator, getBlockData } from '../attributes';
import getHoverStatus from '../relations/getHoverStatus';
import { getStylesWrapperId } from './utils';
import getLastChangedBlocks from './getLastChangedBlocks';

/**
 * External dependencies
 */
import {
	cloneDeep,
	isEmpty,
	isEqual,
	isFunction,
	isNil,
	isArray,
} from 'lodash';

/**
 * Style Component
 */
const StyleComponent = ({
	stylesObj,
	blockBreakpoints,
	isIframe = false,
	isSiteEditor = false,
}) => {
	const { breakpoints } = useSelect(select => {
		const { receiveMaxiBreakpoints } = select('maxiBlocks');

		const breakpoints = receiveMaxiBreakpoints();

		return { breakpoints };
	});

	const getBreakpoints = () => {
		const areBreakpointsLoaded =
			!isEmpty(blockBreakpoints) &&
			Object.values(blockBreakpoints).every(blockValue => !!blockValue);

		return areBreakpointsLoaded ? blockBreakpoints : breakpoints;
	};

	const styles = styleResolver(stylesObj, false, getBreakpoints());

	const styleContent = styleGenerator(styles, isIframe, isSiteEditor);

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

		const { attributes } = this.props;
		const { uniqueID } = attributes;

		this.isReusable = false;
		this.currentBreakpoint =
			select('maxiBlocks').receiveMaxiDeviceType() || 'general';
		// eslint-disable-next-line react/no-unused-class-component-methods
		this.blockRef = createRef();
		this.typography = getGroupAttributes(attributes, 'typography');
		this.isPreviewBlock = !!getTemplatePartChooseList();

		dispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Init
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		this.loadFonts();
		this.getCurrentBlockStyle();
		this.displayStyles(newUniqueID);

		this.maxiAttributes = this.getMaxiAttributes();

		this.setMaxiAttributes();
	}

	componentDidMount() {
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

		if (
			this.blockRef.current.parentNode.classList.contains('is-reusable')
		) {
			this.updateBlockSize();
		}

		if (this.maxiBlockDidMount) this.maxiBlockDidMount();

		this.loadFonts();
		this.displayStyles();

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
					).receiveStyleCardValue(
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
					this.propsObjectCleaner(this.props),
					this.propsObjectCleaner(nextProps)
				)
			);

		return !isEqual(
			this.propsObjectCleaner(this.props),
			this.propsObjectCleaner(nextProps)
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

		// If baseBreakpoint changes, render styles
		if (this.props.baseBreakpoint !== prevProps.baseBreakpoint)
			return false;

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
		this.updateRelationHoverStatus();

		// Even when not rendering, on breakpoint stage change
		// re-render the styles
		const breakpoint = select('maxiBlocks').receiveMaxiDeviceType();

		if (!shouldDisplayStyles || breakpoint !== this.currentBreakpoint) {
			this.currentBreakpoint = breakpoint;
			this.displayStyles();
		}

		if (this.maxiBlockDidUpdate)
			this.maxiBlockDidUpdate(prevProps, prevState, shouldDisplayStyles);
	}

	componentWillUnmount() {
		// If it's site editor, when swapping from pages we need to keep the styles
		// On post editor, when entering to `code editor` page, we need to keep the styles
		let keepStylesOnEditor = false;
		entityRecordsWrapper(({ key: id, name }) => {
			const { getEditedEntityRecord } = select('core');

			const { blocks } = getEditedEntityRecord('postType', name, id);

			const getName = block => {
				const {
					attributes: { uniqueID },
					innerBlocks,
				} = block;

				if (uniqueID === this.props.attributes.uniqueID) return true;

				if (innerBlocks.length)
					return innerBlocks.some(block => getName(block));

				return false;
			};

			keepStylesOnEditor ||= blocks.some(block => getName(block));
		}, true);

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
			// Styles
			const obj = this.getStylesObject;
			styleResolver(obj, true);
			this.removeStyles();

			// Custom data
			dispatch('maxiBlocks/customData').removeCustomData(
				this.props.attributes.uniqueID
			);

			// IB
			this.removeUnmountedBlockFromRelations(
				this.props.attributes.uniqueID
			);
		}

		if (this.maxiBlockWillUnmount)
			this.maxiBlockWillUnmount(isBlockBeingRemoved);
	}

	getMaxiAttributes() {
		return null;
	}

	setMaxiAttributes() {
		if (!this.maxiAttributes) return;

		Object.entries(this.maxiAttributes).forEach(([key, value]) => {
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
			'background-layers': bgLayers,
			relations: relationsRaw,
		} = this.props.attributes;

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

	// This is a fix for wrong width of reusable blocks on backend only.
	// This makes reusable blocks container full width and inserts element
	// that mirrors the block on the same level as reusable container.
	// The size of the clone if observed to get the width of the real block.
	updateBlockSize() {
		this.isReusable = true;
		this.blockRef.current.parentNode.dataset.containsMaxiBlock = true;
		const sizeElement = document.createElement('div');
		sizeElement.classList.add(
			this.props.attributes.uniqueID,
			'maxi-block',
			'maxi-block--backend'
		);
		sizeElement.id = `maxi-block-size-checker-${this.props.clientId}`;
		sizeElement.style =
			'top: 0 !important; height: 0 !important;  min-height: 0 !important; padding: 0 !important; margin: 0 !important';
		this.blockRef.current.parentNode.insertAdjacentElement(
			'afterend',
			sizeElement
		);
		this.widthObserver = new ResizeObserver(entries => {
			this.blockRef.current.style.width = `${entries[0].contentRect.width}px`;
		});
		this.widthObserver.observe(sizeElement);
	}

	// Removes non-necessary entries of props object for comparison
	propsObjectCleaner(props) {
		const newProps = cloneDeep(props);
		const entriesToRemove = [
			'maxiSetAttributes',
			'insertInlineStyles',
			'cleanInlineStyles',
			'context',
		];

		entriesToRemove.forEach(entry => {
			delete newProps[entry];
		});

		// Transform objects into strings to compare easier
		Object.entries(newProps).forEach(([key, value]) => {
			if (typeof value === 'object')
				newProps[key] = JSON.stringify(value);
		});

		return newProps;
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

			this.propagateNewUniqueID(idToCheck, newUniqueID);

			this.props.attributes.uniqueID = newUniqueID;
			this.props.attributes.customLabel = getCustomLabel(
				this.props.attributes.customLabel,
				this.props.attributes.uniqueID
			);

			if (this.maxiBlockDidChangeUniqueID)
				this.maxiBlockDidChangeUniqueID(newUniqueID);

			return newUniqueID;
		}

		// This code can be removed after migrating #3474
		if (isEmpty(this.props.attributes.customLabel)) {
			const label = idToCheck.replace('-maxi-', '_');
			this.props.attributes.customLabel =
				label.charAt(0).toUpperCase() + label.slice(1);
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

	propagateNewUniqueID(oldUniqueID, newUniqueID) {
		const updateRelations = () => {
			const blockAttributesUpdate = {};
			const lastChangedBlocks = getLastChangedBlocks();

			if (isEmpty(lastChangedBlocks)) return;

			const updateNewUniqueID = block => {
				const {
					attributes = {},
					innerBlocks: rawInnerBlocks = [],
					clientId,
				} = block;

				if (
					'relations' in attributes &&
					!isEmpty(attributes.relations)
				) {
					const { relations } = attributes;

					const newRelations = cloneDeep(relations).map(relation => {
						const { uniqueID } = relation;

						if (uniqueID === oldUniqueID) {
							relation.uniqueID = newUniqueID;
						}

						return relation;
					});

					if (!isEqual(relations, newRelations) && clientId)
						blockAttributesUpdate[clientId] = {
							relations: newRelations,
						};
				}

				if (!isEmpty(rawInnerBlocks)) {
					const innerBlocks = isArray(rawInnerBlocks)
						? rawInnerBlocks
						: Object.values(rawInnerBlocks);

					innerBlocks.forEach(innerBlock => {
						updateNewUniqueID(innerBlock);
					});
				}
			};

			lastChangedBlocks.forEach(block => updateNewUniqueID(block));

			if (!isEmpty(blockAttributesUpdate)) {
				const {
					__unstableMarkNextChangeAsNotPersistent:
						markNextChangeAsNotPersistent,
					updateBlockAttributes,
				} = dispatch('core/block-editor');

				Object.entries(blockAttributesUpdate).forEach(
					([clientId, attributes]) => {
						markNextChangeAsNotPersistent();
						updateBlockAttributes(clientId, attributes);
					}
				);
			}
		};

		updateRelations();
	}

	updateRelationHoverStatus() {
		const { name: blockName, attributes: blockAttributes } = this.props;
		const { uniqueID } = blockAttributes;

		goThroughMaxiBlocks(
			({ clientId, attributes: currentBlockAttributes, innerBlocks }) => {
				const { relations, uniqueID: blockUniqueID } =
					currentBlockAttributes;

				if (uniqueID !== blockUniqueID && !isEmpty(relations)) {
					const newRelations = relations.map(relation => {
						const {
							attributes: relationAttributes,
							settings: settingName,
							uniqueID: relationUniqueID,
						} = relation;

						if (!settingName || uniqueID !== relationUniqueID)
							return relation;

						const { effects } = relation;

						if (!('hoverStatus' in effects)) return relation;

						const blockData = getBlockData(blockName);

						if (!blockData?.interactionBuilderSettings)
							return relation;

						const { hoverProp } = Object.values(
							blockData.interactionBuilderSettings
						)
							.flat()
							.find(({ label }) => label === settingName);

						return {
							...relation,
							effects: {
								...effects,
								hoverStatus: getHoverStatus(
									hoverProp,
									blockAttributes,
									relationAttributes
								),
							},
						};
					});

					if (!isEqual(relations, newRelations))
						dispatch('core/block-editor').updateBlockAttributes(
							clientId,
							{ relations: newRelations }
						);
				}
			}
		);
	}

	removeUnmountedBlockFromRelations(uniqueID) {
		const { isDraggingBlocks } = select('core/block-editor');

		const isDragging = isDraggingBlocks();

		if (!isDragging)
			goThroughMaxiBlocks(({ clientId, attributes }) => {
				const { relations, uniqueID: blockUniqueID } = attributes;

				if (uniqueID !== blockUniqueID && !isEmpty(relations)) {
					const filteredRelations = relations.filter(
						({ uniqueID: relationUniqueID }) =>
							relationUniqueID !== uniqueID
					);

					if (!isEqual(relations, filteredRelations)) {
						const { updateBlockAttributes } =
							dispatch('core/block-editor');

						updateBlockAttributes(clientId, {
							relations: filteredRelations,
						});

						return true;
					}
				}

				return false;
			});
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles(rawUniqueID) {
		const obj = this.getStylesObject;
		const breakpoints = this.getBreakpoints;

		const uniqueID = rawUniqueID ?? this.props.attributes.uniqueID;

		// When duplicating, need to change the obj target for the new uniqueID
		if (!obj[uniqueID] && !!obj[this.props.attributes.uniqueID]) {
			obj[uniqueID] = obj[this.props.attributes.uniqueID];

			delete obj[this.props.attributes.uniqueID];
		}

		const customData = this.getCustomData;
		dispatch('maxiBlocks/customData').updateCustomData(customData);

		if (document.body.classList.contains('maxi-blocks--active')) {
			const getStylesWrapper = (element, onCreateWrapper) => {
				const wrapperId = getStylesWrapperId(uniqueID);

				let wrapper = element.querySelector(`#${wrapperId}`);

				if (!wrapper) {
					wrapper = document.createElement('div');
					wrapper.id = wrapperId;
					wrapper.classList.add('maxi-blocks__styles');
					element.appendChild(wrapper);

					if (isFunction(onCreateWrapper)) onCreateWrapper(wrapper);
				}

				return wrapper;
			};

			let wrapper;

			const isSiteEditor = getIsSiteEditor();
			if (isSiteEditor) {
				// for full site editor (FSE)
				const siteEditorIframe = getSiteEditorIframe();

				if (this.isPreviewBlock) {
					const templateViewIframe = getTemplateViewIframe(uniqueID);
					if (templateViewIframe) {
						const iframeHead = Array.from(
							templateViewIframe.querySelectorAll('head')
						).pop();

						const iframeBody = Array.from(
							templateViewIframe.querySelectorAll('body')
						).pop();

						iframeBody.classList.add('maxi-blocks--active');
						iframeBody.setAttribute(
							'maxi-blocks-responsive',
							getWinBreakpoint(iframeBody.offsetWidth)
						);

						wrapper = getStylesWrapper(iframeHead, () => {
							if (
								!templateViewIframe.getElementById(
									'maxi-blocks-sc-vars-inline-css'
								)
							) {
								const SC = select(
									'maxiBlocks/style-cards'
								).receiveMaxiActiveStyleCard();
								if (SC) {
									updateSCOnEditor(
										SC.value,
										templateViewIframe
									);
								}
							}
						});
					}
				} else if (siteEditorIframe) {
					// Iframe on creation generates head, then gutenberg generates their own head
					// and in some moment we have two heads, so we need to add styles only to second head(gutenberg one)
					const iframeHead = Array.from(
						siteEditorIframe.querySelectorAll('head')
					).pop();

					if (isEmpty(iframeHead.childNodes)) return;

					wrapper = getStylesWrapper(iframeHead);
				}
			} else {
				wrapper = getStylesWrapper(document.head);
			}

			if (wrapper)
				render(
					<StyleComponent
						uniqueID={uniqueID}
						stylesObj={obj}
						currentBreakpoint={this.currentBreakpoint}
						blockBreakpoints={breakpoints}
						isSiteEditor={isSiteEditor}
					/>,
					wrapper
				);

			// Since WP 5.9 Gutenberg includes the responsive into iframes, so need to add the styles there also
			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
			);

			if (iframe) {
				const iframeDocument = iframe.contentDocument;

				if (iframeDocument.head) {
					const iframeWrapper = getStylesWrapper(iframeDocument.head);

					render(
						<StyleComponent
							uniqueID={uniqueID}
							stylesObj={obj}
							currentBreakpoint={this.currentBreakpoint}
							blockBreakpoints={breakpoints}
							isIframe
						/>,
						iframeWrapper
					);
				}
			}
		}
	}

	removeStyles() {
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

		const getEditorElement = () =>
			templateViewIframe ||
			siteEditorIframe ||
			previewIframe ||
			iframe ||
			document;

		getEditorElement()
			.getElementById(getStylesWrapperId(this.props.attributes.uniqueID))
			?.remove();

		if (this.isReusable) {
			this.widthObserver.disconnect();
			getEditorElement()
				.getElementById(
					`maxi-block-size-checker-${this.props.clientId}`
				)
				?.remove();
		}
	}
}

export default MaxiBlockComponent;
