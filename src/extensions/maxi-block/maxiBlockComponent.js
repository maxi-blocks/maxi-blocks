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
import { select, dispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	styleResolver,
	styleGenerator,
	getGroupAttributes,
	getBlockStyle,
	getParallaxLayers,
	getHasVideo,
	getHasScrollEffects,
} from '../styles';
import getBreakpoints from '../styles/helpers/getBreakpoints';
import { loadFonts } from '../text/fonts';
import uniqueIDGenerator from '../attributes/uniqueIDGenerator';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep, isNil } from 'lodash';

/**
 * Style Component
 */
const StyleComponent = ({
	uniqueID,
	stylesObj,
	currentBreakpoint,
	blockBreakpoints,
	isIframe = false,
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

	const styles = styleResolver(uniqueID, stylesObj, false, getBreakpoints());

	const styleContent = styleGenerator(
		styles,
		breakpoints && isEmpty(breakpoints) ? blockBreakpoints : breakpoints,
		currentBreakpoint,
		isIframe
	);

	return <style>{styleContent}</style>;
};

/**
 * Class
 */
class MaxiBlockComponent extends Component {
	propsToAvoidRendering = [];

	propsToAvoidStyling = [];

	constructor(...args) {
		super(...args);

		const { attributes, clientId } = this.props;
		const { uniqueID, blockStyle } = attributes;

		this.currentBreakpoint =
			select('maxiBlocks').receiveMaxiDeviceType() || 'general';
		this.blockRef = createRef();
		this.typography = getGroupAttributes(attributes, 'typography');

		// Init
		const newUniqueID = this.uniqueIDChecker(uniqueID);
		this.getDefaultBlockStyle(blockStyle, clientId);
		if (!isEmpty(this.typography)) this.loadFonts();
		this.getParentStyle();
		this.displayStyles(newUniqueID);
	}

	// Just for debugging!
	// eslint-disable-next-line react/sort-comp
	difference(obj1, obj2) {
		Object.keys(obj1).forEach(key => {
			if (obj1[key] !== obj2[key])
				// eslint-disable-next-line no-console
				console.warn(
					`The block is rendering due to changes on this prop: ${key}.`,
					`Old prop was: ${obj1[key]}.`,
					`New prop is: ${obj2[key]}`
				);
		});
	}

	componentDidMount() {
		if (!this.getBreakpoints.xxl) this.forceUpdate();

		if (this.maxiBlockDidMount) this.maxiBlockDidMount();
	}

	/**
	 * Prevents rendering
	 */
	shouldComponentUpdate(nextProps, nextState) {
		// Even when not rendering, on breakpoint stage change
		// re-render the styles
		const breakpoint = select('maxiBlocks').receiveMaxiDeviceType();

		if (breakpoint !== this.currentBreakpoint) {
			this.currentBreakpoint = breakpoint;
			this.displayStyles();
		}

		// Change `parentBlockStyle` before updating
		const { blockStyle } = this.props.attributes;

		if (blockStyle === 'maxi-parent') {
			const changedStyle = this.getParentStyle();

			if (changedStyle) {
				this.displayStyles(); // force rendering styles after changing parentBlockStyle
				return true;
			}
		}
		// Force rendering the block when SC related values change
		if (!isEqual(this.props.scValues, nextProps.scValues)) return true;

		// Ensures rendering when selecting or unselecting
		if (
			!this.props.isSelected ||
			this.props.isSelected !== nextProps.isSelected || // In case selecting/unselecting the block
			this.props.deviceType !== nextProps.deviceType // In case of breakpoint change
		)
			return true;

		// Check changes on states
		if (!isEqual(this.state, nextState)) return true;

		// Check changes on props
		if (!isEmpty(this.propsToAvoidRendering)) {
			const oldAttributes = cloneDeep(nextProps.attributes);
			const newAttributes = cloneDeep(this.props.attributes);

			this.propsToAvoidRendering.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			// eslint-disable-next-line no-constant-condition
			if (!isEqual(oldAttributes, newAttributes) && false)
				// Just for debugging 👍
				this.difference(oldAttributes, newAttributes);

			return !isEqual(oldAttributes, newAttributes);
		}

		if (this.shouldMaxiBlockUpdate) this.shouldMaxiBlockUpdate();

		return !isEqual(nextProps, this.props);
	}

	/**
	 * Prevents styling
	 */
	getSnapshotBeforeUpdate(prevProps) {
		if (!isEmpty(this.propsToAvoidStyling)) {
			const oldAttributes = cloneDeep(prevProps.attributes);
			const newAttributes = cloneDeep(this.props.attributes);

			this.propsToAvoidStyling.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			if (!isEqual(oldAttributes, newAttributes))
				this.difference(oldAttributes, newAttributes);

			if (this.maxiBlockGetSnapshotBeforeUpdate)
				this.maxiBlockGetSnapshotBeforeUpdate();

			return isEqual(oldAttributes, newAttributes);
		}

		// Force render styles when changing scValues
		if (!isEqual(prevProps.scValues, this.props.scValues)) return false;

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

		if (this.maxiBlockGetSnapshotBeforeUpdate)
			this.maxiBlockGetSnapshotBeforeUpdate();

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
		if (!shouldDisplayStyles) this.displayStyles();

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
			styleResolver('', obj, true);
		}

		dispatch('maxiBlocks/customData').removeCustomData(
			this.props.attributes.uniqueID
		);

		dispatch('maxiBlocks/text').removeFormatValue(this.props.clientId);

		if (this.maxiBlockWillUnmount) this.maxiBlockWillUnmount();
	}

	get getBreakpoints() {
		return getBreakpoints(this.props.attributes);
	}

	// eslint-disable-next-line class-methods-use-this
	get getStylesObject() {
		return null;
	}

	get getCustomData() {
		const { uniqueID, 'background-layers': bgLayers } =
			this.props.attributes;

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

		return {
			[uniqueID]: {
				...(!isEmpty(bgParallaxLayers) && {
					...{ parallax: bgParallaxLayers },
				}),
				...(hasVideo && { bg_video: true }),
				...(hasScrollEffects && { scroll_effects: true }),
				...(this.getMaxiCustomData && { ...this.getMaxiCustomData }),
			},
		};
	}

	getDefaultBlockStyle(blockStyle, clientId) {
		if (blockStyle) return;

		let res;

		const blockRootClientId =
			select('core/block-editor').getBlockRootClientId(clientId);

		if (!blockRootClientId) {
			res = 'maxi-light';
		} else if (
			select('core/block-editor')
				.getBlockName(blockRootClientId)
				.includes('maxi-blocks')
		) {
			select('core/block-editor').getBlockAttributes(blockRootClientId)
				.blockStyle === 'maxi-custom'
				? (res = 'maxi-custom')
				: (res = 'maxi-parent');
		} else {
			res = 'maxi-light';
		}

		// Kind of cheat. What it seeks is to don't generate an historical entity in the registry
		// that transforms in the necessity of clicking more than onces on undo button after pasting
		// any content on Text Maxi due to the `setAttributes` action that creates a record entity
		// on the historical registry 👍
		this.props.attributes.blockStyle = res;
	}

	uniqueIDChecker(idToCheck) {
		if (!isEmpty(document.getElementsByClassName(idToCheck))) {
			const newUniqueID = uniqueIDGenerator(idToCheck);

			this.props.attributes.uniqueID = newUniqueID;

			return newUniqueID;
		}

		return idToCheck;
	}

	loadFonts() {
		// Ensures Roboto is fully accessible from the editor
		loadFonts('Roboto');

		Object.entries(this.typography).forEach(([key, val]) => {
			if (key.includes('font-family')) loadFonts(val);
		});
	}

	getParentStyle() {
		const {
			clientId,
			attributes: { parentBlockStyle },
		} = this.props;

		const newParentStyle = getBlockStyle(clientId);
		if (parentBlockStyle !== newParentStyle) {
			this.props.attributes.parentBlockStyle = newParentStyle;

			return true;
		}

		return false;
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
				`#maxi-blocks__styles--${uniqueID}`
			);

			if (!wrapper) {
				wrapper = document.createElement('div');
				wrapper.id = `maxi-blocks__styles--${uniqueID}`;
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
						`#maxi-blocks__styles--${uniqueID}`
					);

					if (!iframeWrapper) {
						iframeWrapper = iframeDocument.createElement('div');
						iframeWrapper.id = `maxi-blocks__styles--${uniqueID}`;
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
}

export default MaxiBlockComponent;
