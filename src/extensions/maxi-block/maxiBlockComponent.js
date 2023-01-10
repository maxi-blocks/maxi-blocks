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
import { uniqueIDGenerator, getBlockData } from '../attributes';
import getHoverStatus from '../relations/getHoverStatus';
import { getStylesWrapperId } from './utils';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep, isNil } from 'lodash';

/**
 * Style Component
 */
const StyleComponent = ({ stylesObj, blockBreakpoints, isIframe = false }) => {
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

	const styleContent = styleGenerator(styles, isIframe);

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

		const { attributes } = this.props;
		const { uniqueID } = attributes;

		this.currentBreakpoint =
			select('maxiBlocks').receiveMaxiDeviceType() || 'general';
		// eslint-disable-next-line react/no-unused-class-component-methods
		this.blockRef = createRef();
		this.typography = getGroupAttributes(attributes, 'typography');

		dispatch('maxiBlocks').removeDeprecatedBlock(uniqueID);

		// Init
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		if (!isEmpty(this.typography)) this.loadFonts();
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

		if (this.maxiBlockDidMount) this.maxiBlockDidMount();

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
		// When duplicating Gutenberg creates a copy of the current copied block twice, making the first keep the same uniqueID and second
		// has a different one. The original block is removed so componentWillUnmount method is triggered, and as its uniqueID coincide with
		// the first copied block, on removing the styles the copied block appears naked. That's why we check if there's more than one block
		// with same uniqueID
		if (
			Array.from(
				document.getElementsByClassName(this.props.attributes.uniqueID)
			).length <= 1
		) {
			const obj = this.getStylesObject;
			styleResolver(obj, true);
			this.removeStyles();
		}

		dispatch('maxiBlocks/customData').removeCustomData(
			this.props.attributes.uniqueID
		);

		this.removeUnmountedBlockFromRelations(
			this.props.attributes.uniqueID,
			select('core/block-editor').getBlocks()
		);

		if (this.maxiBlockWillUnmount) this.maxiBlockWillUnmount();
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
		if (getIsUniqueIDRepeated(idToCheck)) {
			const newUniqueID = uniqueIDGenerator(this.props.name);
			this.props.attributes.uniqueID = newUniqueID;
			this.props.attributes.customLabel = getCustomLabel(
				this.props.attributes.customLabel,
				this.props.attributes.uniqueID
			);

			/**
			 * Each svg icon content svg tag has unique class name, which should be changed
			 * when the block is duplicated.
			 */
			if (this.props.name === 'maxi-blocks/svg-icon-maxi') {
				const svgClass =
					this.props.attributes.content.match(
						/ class="(.+?(?=))"/
					)?.[1];
				if (svgClass) {
					const newContent = this.props.attributes.content.replaceAll(
						svgClass.match(/__(\d)/)[0],
						`__${newUniqueID.match(/-(\d+)$/).pop()}`
					);
					this.props.attributes.content = newContent;
				}
			}

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
		const response = getAllFonts(this.typography, 'custom-formats');

		if (!isEmpty(response)) loadFonts(response);
	}

	updateRelationHoverStatus() {
		const { name, attributes } = this.props;

		const updateRelationHoverStatusRecursive = (
			blockName,
			blockAttributes,
			blocksToCheck
		) => {
			const { uniqueID } = blockAttributes;

			blocksToCheck.forEach(
				({
					clientId,
					attributes: currentBlockAttributes,
					innerBlocks,
				}) => {
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

					if (!isEmpty(innerBlocks))
						updateRelationHoverStatusRecursive(
							blockName,
							blockAttributes,
							innerBlocks
						);
				}
			);
		};

		updateRelationHoverStatusRecursive(
			name,
			attributes,
			select('core/block-editor').getBlocks()
		);
	}

	removeUnmountedBlockFromRelations(uniqueID, blocksToCheck) {
		if (getIsUniqueIDRepeated(uniqueID, 0)) return;

		blocksToCheck.forEach(({ clientId, attributes, innerBlocks }) => {
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
				}
			}

			if (!isEmpty(innerBlocks))
				this.removeUnmountedBlockFromRelations(uniqueID, innerBlocks);
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
			let wrapper = document.querySelector(
				`#${getStylesWrapperId(uniqueID)}`
			);

			if (!wrapper) {
				wrapper = document.createElement('div');
				wrapper.id = getStylesWrapperId(uniqueID);
				wrapper.classList.add('maxi-blocks__styles');
				document.head.appendChild(wrapper);
			}

			render(
				<StyleComponent
					uniqueID={uniqueID}
					stylesObj={obj}
					currentBreakpoint={this.currentBreakpoint}
					blockBreakpoints={breakpoints}
				/>,
				wrapper
			);

			// Since WP 5.9 Gutenberg includes the responsive into iframes, so need to add the styles there also
			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);

			if (iframe) {
				const iframeDocument = iframe.contentDocument;

				if (iframeDocument.head) {
					let iframeWrapper = iframeDocument.querySelector(
						`#${getStylesWrapperId(uniqueID)}`
					);

					if (!iframeWrapper) {
						iframeWrapper = iframeDocument.createElement('div');
						iframeWrapper.id = getStylesWrapperId(uniqueID);
						iframeWrapper.classList.add('maxi-blocks__styles');
						iframeDocument.head.appendChild(iframeWrapper);
					}

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
		document
			.getElementById(getStylesWrapperId(this.props.attributes.uniqueID))
			.remove();
	}
}

export default MaxiBlockComponent;
