import { isObject, compact, uniq } from 'lodash';
import { getIsValid } from './utils';

const getPropsFromChildren = items => {
	const response = [];
	const excludedEntries = [
		'children',
		'clientId',
		'onChange',
		'items',
		'breakpoint',
		'inputsArray',
		'minMaxSettings',
	];

	const getProps = item => {
		if (!isObject(item)) return;
		if ('props' in item) {
			if ('content' in item) getProps(item.content);
			if ('children' in item.props) getProps(item.props.children);
			if ('items' in item.props) getProps(item.props.items);

			Object.entries(item.props).forEach(([key, val]) => {
				if (!excludedEntries.includes(key) && isObject(val))
					Object.keys(val).forEach(subKey => response.push(subKey));
				else if (
					!excludedEntries.includes(key) &&
					getIsValid(val, true)
				)
					!response.includes(key) && response.push(key);
			});
		} else
			Object.values(item).forEach(val => isObject(val) && getProps(val));
	};

	Object.values(items).forEach(val => getProps(val));

	console.log(compact(uniq(response)));

	return compact(uniq(response));
};

export default getPropsFromChildren;
