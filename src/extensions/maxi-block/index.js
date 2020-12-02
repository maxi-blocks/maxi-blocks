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
const { select } = wp.data;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../styles/utils';

import styleResolver from '../styles/stylesResolver';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, isEqual, isObject } from 'lodash';

/**
 * Class
 */
class MaxiBlock extends Component {
	state = {
		styles: {},
		breakpoints: this.getBreakpoints,
	};

	constructor(...args) {
		super(...args);
		const { attributes, clientId } = this.props;
		const { uniqueID, blockStyle } = attributes;

		this.uniqueIDChecker(uniqueID);
		this.getDefaultBlockStyle(blockStyle, clientId);
		this.fixProps();
	}

	componentDidUpdate() {
		this.displayStyles();
	}

	componentWillUnmount() {
		this.removeStyle();
	}

	get getBreakpoints() {
		const { breakpoints } = this.props.attributes;

		return JSON.parse(breakpoints);
	}

	// eslint-disable-next-line class-methods-use-this
	get getObject() {
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
		const breakpoints = this.getBreakpoints;

		if (
			!isEqual(obj, this.state.styles) ||
			!isEqual(breakpoints, this.state.breakpoints)
		) {
			this.setState({
				styles: obj,
				breakpoints,
			});

			styleResolver(obj, breakpoints);
		}
	}

	removeStyle() {
		const obj = this.getObject;
		const breakpoints = this.getBreakpoints;

		styleResolver(obj, breakpoints, true);
	}
}

export default MaxiBlock;
