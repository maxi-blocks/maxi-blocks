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
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable prefer-rest-params */
/* eslint-disable react/sort-comp */

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { dispatch, select, subscribe } = wp.data;

/**
 * Internal dependencies
 */
import { ResponsiveStylesResolver, BackEndResponsiveStyles } from '../styles';
import { getDefaultProp } from '../styles/utils';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, isEqual, isNil, isObject } from 'lodash';

/**
 * Class
 */
class MaxiBlock extends Component {
	state = {
		styles: {},
		updating: false,
		breakpoints: this.getBreakpoints,
	};

	constructor() {
		super(...arguments);
		this.uniqueIDChecker(this.props.attributes.uniqueID);
		this.fixProps();
	}

	componentDidMount() {
		this.displayStyles();
		this.saveProps();
	}

	componentDidUpdate() {
		this.displayStyles();

		if (!select('core/editor').isSavingPost() && this.state.updating) {
			this.setState({
				updating: false,
			});
			this.saveProps();
		}
	}

	componentWillUnmount() {
		this.removeStyle();
		this.removeCustomData();
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
	 * Fix preview displays
	 */
	saveProps() {
		const unsubscribe = subscribe(() => {
			const isSavingPost = select('core/editor').isSavingPost();
			const isPreviewing = select('core/editor').isPreviewingPost();

			if (isSavingPost && !isPreviewing && !this.state.updating) {
				this.setState({
					updating: true,
				});
				unsubscribe();

				dispatch('maxiBlocks').saveMaxiStyles(this.getMeta, true);
				dispatch('maxiBlocks').saveMaxiCustomData(
					this.getCustomData,
					true
				);
			}
		});
	}

	get getMeta() {
		const meta = select('maxiBlocks').receiveMaxiStyles();

		switch (typeof meta) {
			case 'string':
				if (!isEmpty(meta)) return JSON.parse(meta);
				return {};
			case 'object':
				return meta;
			case 'undefined':
				return {};
			default:
				return {};
		}
	}

	get getCustomData() {
		const customData = select('maxiBlocks').receiveMaxiCustomData();

		switch (typeof customData) {
			case 'string':
				if (!isEmpty(customData)) return JSON.parse(customData);
				return {};
			case 'object':
				return customData;
			case 'undefined':
				return {};
			default:
				return {};
		}
	}

	get getBreakpoints() {
		const { breakpoints } = this.props.attributes;

		return JSON.parse(breakpoints);
	}

	get getObject() {
		return null;
	}

	metaValue() {
		const obj = this.getObject;
		const breakpoints = this.getBreakpoints;

		if (
			isEqual(obj, this.state.styles) &&
			isEqual(breakpoints, this.state.breakpoints)
		)
			return null;

		const meta = this.getMeta;

		this.setState({
			styles: obj,
			breakpoints,
		});

		return new ResponsiveStylesResolver(obj, meta, breakpoints);
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles() {
		const newMeta = this.metaValue();

		if (isNil(newMeta)) return;
		this.saveMeta(newMeta);
	}

	removeStyle(target = this.props.attributes.uniqueID) {
		const cleanMeta = { ...this.getMeta };
		Object.keys(this.getMeta).forEach(key => {
			if (key.indexOf(target) >= 0) delete cleanMeta[key];
		});

		this.saveMeta(cleanMeta);
	}

	removeCustomData(uniqueID = this.props.attributes.uniqueID) {
		let newCustomData = this.getCustomData;
		if (newCustomData.hasOwnProperty(uniqueID)) {
			delete newCustomData[uniqueID];
		}

		dispatch('maxiBlocks').saveMaxiCustomData(newCustomData, true);
	}

	saveMeta(newMeta) {
		dispatch('maxiBlocks')
			.saveMaxiStyles(newMeta)
			.then(new BackEndResponsiveStyles(newMeta));
	}
}

export default MaxiBlock;
