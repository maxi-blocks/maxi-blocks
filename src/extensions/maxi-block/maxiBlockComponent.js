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
import { dispatch, resolveSelect, select, useSelect } from '@wordpress/data';
import { Component, createRef, createRoot, render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getAttributesValue,
	getBlockStyle,
	getDefaultAttribute,
	getGroupAttributes,
	uniqueIDGenerator,
} from '../attributes';
import {
	entityRecordsWrapper,
	getHasScrollEffects,
	getHasVideo,
	getParallaxLayers,
	getRelations,
	styleGenerator,
	styleResolver,
} from '../styles';
import getWinBreakpoint from '../dom/getWinBreakpoint';
import {
	getIsSiteEditor,
	getSiteEditorIframe,
	getTemplatePartChooseList,
	getTemplateViewIframe,
} from '../fse';
import { updateSCOnEditor } from '../style-cards';
import getBreakpoints from '../styles/helpers/getBreakpoints';
import { getAllFonts, loadFonts } from '../text/fonts';
import getCustomLabel from './getCustomLabel';
import getIsUniqueIDRepeated from './getIsUniqueIDRepeated';
import propagateNewUniqueID from './propagateNewUniqueID';
import propsObjectCleaner from './propsObjectCleaner';
import removeUnmountedBlockFromRelations from './removeUnmountedBlockFromRelations';
import uniqueIDStructureChecker from './uniqueIDStructureChecker';
import updateRelationHoverStatus from './updateRelationHoverStatus';
import updateReusableBlockSize from './updateReusableBlockSize';
import { getStylesWrapperId } from './utils';

/**
 * External dependencies
 */
import { diff } from 'deep-object-diff';
import { isEmpty, isEqual, isFunction, isNil } from 'lodash';

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
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: attributes,
		});

		this.isReusable = false;
		this.rootSlot = null;
		this.blockRef = createRef();
		this.typography = getGroupAttributes(attributes, 'typography');
		this.isPreviewBlock = !!getTemplatePartChooseList();

		dispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Init
		this.uniqueIDChecker(uniqueID);
		this.getCurrentBlockStyle();
		this.setMaxiAttributes();
	}

	componentDidMount() {
		const { receiveMaxiSettings } = resolveSelect('maxiBlocks');
		receiveMaxiSettings()
			.then(settings => {
				const { attributes } = this.props;
				const maxiVersion = settings.maxi_version;

				if (
					maxiVersion !== attributes[getAttributeKey({ key: '_mvc' })]
				)
					attributes[getAttributeKey({ key: '_mvc' })] = maxiVersion;

				if (!attributes[getAttributeKey({ key: '_mvo' })])
					attributes[getAttributeKey({ key: '_mvo' })] = maxiVersion;
			})
			.catch(() => console.error('Maxi Blocks: Could not load settings'));

		// Check if the block is reusable
		this.isReusable =
			this.blockRef.current.parentNode.classList.contains('is-reusable');

		if (this.isReusable) {
			const uniqueID = getAttributesValue({
				target: '_uid',
				props: this.props.attributes,
			});

			this.widthObserver = updateReusableBlockSize(
				this.blockRef.current,
				uniqueID,
				this.props.clientId
			);
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
				const blockStyle = getAttributesValue({
					target: '_bs',
					props: this.props.attributes,
				});

				this.setState({
					oldSC: SC,
					scValues: select(
						'maxiBlocks/style-cards'
					).receiveStyleCardValue(
						this.scProps.scElements,
						blockStyle,
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
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: this.props.attributes,
		});
		if (
			!document.querySelector(`#maxi-blocks__styles--${uniqueID}`) ||
			isNil(select('maxiBlocks/styles').getBlockStyles(uniqueID))
		)
			return false;

		// If baseBreakpoint changes, render styles
		if (this.props.baseBreakpoint !== prevProps.baseBreakpoint)
			return false;

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
		// Check if the modified attribute is related with hover status,
		// and in that case we update the other blocks IB relation
		const diffAttributes = diff(
			prevProps.attributes,
			this.props.attributes
		);
		if (Object.keys(diffAttributes).some(key => key.includes('.h')))
			updateRelationHoverStatus(this.props.name, this.props.attributes);

		if (!shouldDisplayStyles) this.displayStyles();

		if (this.maxiBlockDidUpdate)
			this.maxiBlockDidUpdate(prevProps, prevState, shouldDisplayStyles);
	}

	componentWillUnmount() {
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: this.props.attributes,
		});

		// If it's site editor, when swapping from pages we need to keep the styles
		// On post editor, when entering to `code editor` page, we need to keep the styles
		let keepStylesOnEditor = false;
		entityRecordsWrapper(({ key: id, name }) => {
			const { getEditedEntityRecord } = select('core');

			const { blocks } = getEditedEntityRecord('postType', name, id);

			const getName = block => {
				const { attributes, innerBlocks } = block;

				const blockUniqueID = getAttributesValue({
					target: '_uid',
					props: attributes,
				});

				if (blockUniqueID === uniqueID) return true;

				if (innerBlocks.length)
					return innerBlocks.some(block => getName(block));

				return false;
			};

			keepStylesOnEditor ||= blocks?.some(block => getName(block));
		}, true);

		// When duplicating Gutenberg creates a copy of the current copied block twice, making the first keep the same uniqueID and second
		// has a different one. The original block is removed so componentWillUnmount method is triggered, and as its uniqueID coincide with
		// the first copied block, on removing the styles the copied block appears naked. That's why we check if there's more than one block
		// with same uniqueID
		const keepStylesOnCloning =
			Array.from(document.getElementsByClassName(uniqueID)).length > 1;

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
			dispatch('maxiBlocks/customData').removeCustomData(uniqueID);

			// IB
			removeUnmountedBlockFromRelations(this.props.attributes._uid);
		}

		if (this.maxiBlockWillUnmount)
			this.maxiBlockWillUnmount(isBlockBeingRemoved);
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
				'_mvc' in this.props.attributes
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
		const [uniqueID, bgLayers, relationsRaw] = getAttributesValue({
			target: ['_uid', 'b_ly', '_r'],
			props: this.props.attributes,
		});

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
		const { clientId, attributes } = this.props;
		const blockStyle = getAttributesValue({
			target: '_bs',
			props: attributes,
		});

		const newBlockStyle = getBlockStyle(clientId);

		if (blockStyle !== newBlockStyle) {
			this.props.attributes._bs = newBlockStyle;

			return true;
		}

		return false;
	}

	uniqueIDChecker(idToCheck) {
		const { clientId, name: blockName } = this.props;

		if (
			getIsUniqueIDRepeated(idToCheck) ||
			!uniqueIDStructureChecker(idToCheck, clientId)
		) {
			const [bgLayers, customLabel] = getAttributesValue({
				target: ['b_ly', '_cl'],
				props: this.props.attributes,
			});

			const newUniqueID = uniqueIDGenerator({
				blockName,
				diff: 1,
				clientId,
			});

			propagateNewUniqueID(idToCheck, newUniqueID, bgLayers);

			this.props.attributes._uid = newUniqueID;
			this.props.attributes._cl = getCustomLabel(
				customLabel,
				newUniqueID
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

		const response = getAllFonts(this.typography, '_cf');
		if (isEmpty(response)) return;

		loadFonts(response, true, target);
		this.areFontsLoaded.current = true;
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles(rawUniqueID) {
		const obj = this.getStylesObject;
		const breakpoints = this.getBreakpoints;

		const oldUniqueID = getAttributesValue({
			target: '_uid',
			props: this.props.attributes,
		});
		const uniqueID = rawUniqueID ?? oldUniqueID;

		// When duplicating, need to change the obj target for the new uniqueID
		if (!obj[uniqueID] && !!obj[oldUniqueID]) {
			obj[uniqueID] = obj[oldUniqueID];

			delete obj[oldUniqueID];
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

			if (wrapper) {
				// check if createRoot is available (since React 18)
				if (typeof createRoot === 'function') {
					if (isNil(this.rootSlot))
						this.rootSlot = createRoot(wrapper);
					this.rootSlot.render(
						<StyleComponent
							uniqueID={uniqueID}
							stylesObj={obj}
							currentBreakpoint={this.props.deviceType}
							blockBreakpoints={breakpoints}
							isSiteEditor={isSiteEditor}
						/>
					);
				} else {
					// for React 17 and below
					render(
						<StyleComponent
							uniqueID={uniqueID}
							stylesObj={obj}
							currentBreakpoint={this.props.deviceType}
							blockBreakpoints={breakpoints}
							isSiteEditor={isSiteEditor}
						/>,
						wrapper
					);
				}
			}

			// Since WP 5.9 Gutenberg includes the responsive into iframes, so need to add the styles there also
			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]:not(.edit-site-visual-editor__editor-canvas)'
			);

			if (iframe) {
				const iframeDocument = iframe.contentDocument;

				if (iframeDocument.head) {
					const iframeWrapper = getStylesWrapper(iframeDocument.head);

					// check if createRoot is available (since React 18)
					if (typeof createRoot === 'function') {
						if (isNil(this.rootSlot))
							this.rootSlot = createRoot(wrapper);

						this.rootSlot.render(
							<StyleComponent
								uniqueID={uniqueID}
								stylesObj={obj}
								currentBreakpoint={this.props.deviceType}
								blockBreakpoints={breakpoints}
								isSiteEditor={isSiteEditor}
							/>
						);
					} else {
						// for React 17 and below
						render(
							<StyleComponent
								uniqueID={uniqueID}
								stylesObj={obj}
								currentBreakpoint={this.props.deviceType}
								blockBreakpoints={breakpoints}
								isIframe
							/>,
							iframeWrapper
						);
					}
				}
			}
		}
	}

	removeStyles() {
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: this.props.attributes,
		});

		const templateViewIframe = getTemplateViewIframe(uniqueID);
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
			.getElementById(getStylesWrapperId(uniqueID))
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
