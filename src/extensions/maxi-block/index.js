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
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	styleResolver,
	styleGenerator,
	getGroupAttributes,
	getBlockStyle,
} from '../styles';
import getBreakpoints from '../styles/helpers/getBreakpoints';
import { loadFonts } from '../text/fonts';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, isEqual, cloneDeep } from 'lodash';

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

		this.uniqueIDChecker(uniqueID);
		this.getDefaultBlockStyle(blockStyle, clientId);

		// Font loader
		this.typography = getGroupAttributes(attributes, 'typography');
		if (!isEmpty(this.typography)) this.loadFonts();

		this.displayStyles();

		this.getParentStyle();

		this.blockRef = createRef();
	}

	// Just for debugging!
	// eslint-disable-next-line react/sort-comp
	difference(obj1, obj2) {
		Object.keys(obj1).forEach(key => {
			if (obj1[key] !== obj2[key])
				// eslint-disable-next-line no-console
				console.log(
					`The block is rendering due to changes on this prop: ${key}.`,
					`Old prop was: ${obj1[key]}.`,
					`New prop is: ${obj2[key]}`
				);
		});
	}

	componentDidMount() {
		if (this.maxiBlockDidMount) this.maxiBlockDidMount();
	}

	/**
	 * Prevents rendering
	 */
	shouldComponentUpdate(nextProps, nextState) {
		// Change `parentBlockStyle` before updating
		const { blockStyle } = this.props.attributes;

		if (blockStyle === 'maxi-parent') {
			const changedStyle = this.getParentStyle();

			if (changedStyle) return true;
		}

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

			if (!isEqual(oldAttributes, newAttributes) && false)
				// Just for debugging 👍
				this.difference(oldAttributes, newAttributes);

			return !isEqual(oldAttributes, newAttributes);
		}

		if (this.shouldMaxiBlockUpdate) this.shouldMaxiBlockUpdate();

		return !isEqual(nextProps.attributes, this.props.attributes);
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

		if (this.maxiBlockGetSnapshotBeforeUpdate)
			this.maxiBlockGetSnapshotBeforeUpdate();

		return isEqual(prevProps.attributes, this.props.attributes);
	}

	componentDidUpdate(prevProps, prevState, shouldDisplayStyles) {
		if (!shouldDisplayStyles) this.displayStyles();

		if (this.maxiBlockDidUpdate) this.maxiBlockDidUpdate();
	}

	componentWillUnmount() {
		const obj = this.getStylesObject;

		styleResolver(obj, true);

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

	// eslint-disable-next-line class-methods-use-this
	get getCustomData() {
		return null;
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
			const newUniqueId = uniqueId(
				idToCheck.replace(idToCheck.match(/(\d+)(?!.*\d)/)[0], '')
			);

			this.uniqueIDChecker(newUniqueId);

			this.props.setAttributes({ uniqueID: newUniqueId });
		}
	}

	loadFonts() {
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
	displayStyles() {
		const obj = this.getStylesObject;
		const breakpoints = this.getBreakpoints;
		const customData = this.getCustomData;
		const { uniqueID } = this.props.attributes;

		const styles = styleResolver(uniqueID, obj, false, breakpoints);
		dispatch('maxiBlocks/customData').updateCustomData(customData);

		if (document.body.classList.contains('maxi-blocks--active')) {
			let wrapper = document.querySelector(
				`#maxi-blocks__styles--${uniqueID}`
			);
			if (!wrapper) {
				wrapper = document.createElement('div');
				wrapper.id = `maxi-blocks__styles--${uniqueID}`;
				document.head.appendChild(wrapper);
			}

			render(<style>{styleGenerator(styles)}</style>, wrapper);
		}
	}
}

export default MaxiBlockComponent;
