const { select } = wp.data;

import * as defaults from './defaults/index';
import getStyleCardAttr from './defaults/style-card';

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false,
	clientId
) => {
	const response = {};

	// console.log('attributes ' +JSON.stringify(attributes));

	const { uniqueID } = attributes;

	const getBlockStyleAttribute = () => {
		// const { clientId } = props;
		const { getBlockAttributes, getBlockParents } = select(
			'core/block-editor'
		);
		const { blockStyle } = attributes;

		switch (blockStyle) {
			case 'maxi-light':
				return 'light';
			case 'maxi-dark':
				return 'dark';
			case 'maxi-parent': {
				return getBlockAttributes(
					getBlockParents(clientId)[0]
				).blockStyle.replace('maxi-', '');
			}
			default:
				return 'light';
		}
	};

	if (typeof target === 'string')
		Object.keys(defaults[`${target}${isHover ? 'Hover' : ''}`]).forEach(
			key => {
				if ((cleaned && attributes[`${prefix}${key}`]) || !cleaned) {
					const currentAttr = attributes[`${prefix}${key}`];
					if (
						typeof currentAttr === 'string' &&
						currentAttr.indexOf('styleCard') !== -1
					) {
						if (
							target === 'backgroundColor' &&
							typeof uniqueID === 'string' &&
							uniqueID.indexOf('button-maxi') !== -1
						) {
							response[`${prefix}${key}`] = getStyleCardAttr(
								'button-background-color',
								getBlockStyleAttribute(),
								false
							);
						} else {
							response[`${prefix}${key}`] = getStyleCardAttr(
								'background-1',
								getBlockStyleAttribute(),
								false
							);
						}
					} else
						response[`${prefix}${key}`] =
							attributes[`${prefix}${key}`];
				}
			}
		);
	else
		target.forEach(el => {
			Object.keys(defaults[`${el}${isHover ? 'Hover' : ''}`]).forEach(
				key => {
					if ((cleaned && attributes[`${prefix}${key}`]) || !cleaned)
						response[`${prefix}${key}`] =
							attributes[`${prefix}${key}`];
				}
			);
		});

	if (target === 'backgroundColor') {
		// response['background-color'] = '#eeeeee';
		// console.log('target: ' + target);
		// console.log('response: ' + JSON.stringify(response));
		// console.log('=======================================');
	}

	return response;
};

export default getGroupAttributes;
