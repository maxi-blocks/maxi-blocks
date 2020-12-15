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
const { Component } = wp.element;
const { select, dispatch } = wp.data;

import styleResolver from '../styles/stylesResolver';

/**
 * External dependencies
 */
import { isEmpty, uniqueId } from 'lodash';

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
	}

	componentDidUpdate() {
		this.displayStyles();
	}

	componentWillUnmount() {
		const obj = this.getObject;
		const breakpoints = this.getBreakpoints;

		styleResolver(obj, breakpoints, true);

		dispatch('maxiBlocks/customData').removeCustomData(
			this.props.attributes.uniqueID
		);
	}

	get getBreakpoints() {
		return { ...this.props.attributes.breakpoints };
	}

	// eslint-disable-next-line class-methods-use-this
	get getObject() {
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
	 * Refresh the styles on Editor
	 */
	displayStyles() {
		const obj = this.getObject;
		const customData = this.getCustomData;
		const breakpoints = this.getBreakpoints;

		styleResolver(obj, breakpoints);
		dispatch('maxiBlocks/customData').updateCustomData(customData);
	}
}

export default MaxiBlock;
