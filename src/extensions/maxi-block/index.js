/**
 * Maxi Blocks Block component extension
 *
 * @todo Comment properly
 */

/**
 * Disabled some ESLint rules; this file needs to be cleaned
 */
/* eslint-disable no-prototype-builtins */
/* eslint-disable class-methods-use-this */

/**
 * WordPress dependencies
 */
const { Component, render } = wp.element;
const { select, dispatch } = wp.data;

/**
 * Internal dependencies
 */
import { styleResolver, styleGenerator } from '../styles';
import getBreakpoints from '../styles/helpers/getBreakpoints';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, cloneDeep, isObject, isArray } from 'lodash';

/**
 * Class
 */
class MaxiBlock extends Component {
	constructor(...args) {
		super(...args);

		const { attributes, clientId } = this.props;
		const { uniqueID, blockStyle } = attributes;

		this.uniqueIDChecker(uniqueID);
		this.getDefaultBlockStyle(blockStyle, clientId);
		// this.cloneObjects(attributes);
		this.displayStyles();
	}

	componentDidUpdate() {
		this.displayStyles();
	}

	componentWillUnmount() {
		const obj = this.getStylesObject;

		styleResolver(obj, true);

		dispatch('maxiBlocks/customData').removeCustomData(
			this.props.attributes.uniqueID
		);
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

		const blockRootClientId = select(
			'core/block-editor'
		).getBlockRootClientId(clientId);

		if (!blockRootClientId) res = 'maxi-light';
		else {
			const parentBlockStyle = select(
				'core/block-editor'
			).getBlockAttributes(blockRootClientId).blockStyle;

			if (parentBlockStyle === 'maxi-custom') res = 'maxi-custom';
			else res = 'maxi-parent';
		}

		this.props.setAttributes({ blockStyle: res });
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

	/**
	 * Is necessary to clone deep the objects if we don't want to modify
	 * the original one on the native Gutenberg store and to make changes into
	 * the other blocks.
	 *
	 * @param {obj} attributes	Block attributes
	 */
	cloneObjects(attributes) {
		Object.entries(attributes).forEach(
			([key, val]) =>
				(isObject(val) || isArray(val)) &&
				this.props.setAttributes({ [key]: cloneDeep(val) })
		);
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles() {
		const obj = this.getStylesObject;
		const breakpoints = this.getBreakpoints;
		const customData = this.getCustomData;

		const styles = styleResolver(obj, false, breakpoints);
		dispatch('maxiBlocks/customData').updateCustomData(customData);

		if (document.body.classList.contains('maxi-blocks--active')) {
			let wrapper = document.querySelector(
				`#maxi-blocks__styles--${this.props.attributes.uniqueID}`
			);
			if (!wrapper) {
				wrapper = document.createElement('div');
				wrapper.id = `maxi-blocks__styles--${this.props.attributes.uniqueID}`;
				document.head.appendChild(wrapper);
			}

			render(<style>{styleGenerator(styles)}</style>, wrapper);
		}
	}
}

export default MaxiBlock;
