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

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../styles/utils';

import styleResolver from '../styles/stylesResolver';
// import customDataResolver from '../custom-data/customDataResolver';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, isObject } from 'lodash';

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
		// this.fixProps();
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
		const { breakpoints } = this.props.attributes;

		return JSON.parse(breakpoints);
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
	 * In case some object has been modified and an old block has a prop that doesn't correspond
	 * with that object, this should help. It can grow with different handlers/helpers to fix errors.
	 */
	fixProps() {
		Object.entries(this.props.attributes).forEach(([key, value]) => {
			let obj;
			try {
				obj = JSON.parse(value);
			} catch (error) {
				return;
			}

			if (!isObject(obj)) return;

			const defaultObj = JSON.parse(
				getDefaultProp(this.props.clientId, key)
			);

			const objKeys = Object.keys(obj).sort();
			const defaultObjKeys = Object.keys(defaultObj).sort();
			if (JSON.stringify(objKeys) !== JSON.stringify(defaultObjKeys)) {
				const newObject = this.generalToDesktop(obj, defaultObj);
				this.props.setAttributes({ [key]: JSON.stringify(newObject) });
				this.props.attributes[key] = JSON.stringify(newObject);
			}
		});
	}

	generalToDesktop(obj, defaultObj) {
		if (obj.hasOwnProperty('general') && !obj.hasOwnProperty('desktop'))
			defaultObj.desktop = obj.general;

		return defaultObj;
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
