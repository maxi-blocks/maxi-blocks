import {
	selectorsGroup,
	categoriesGroup,
} from '../../blocks/group-maxi/custom-css';
import {
	selectorsButton,
	categoriesButton,
} from '../../blocks/button-maxi/custom-css';
import {
	selectorsColumn,
	categoriesColumn,
} from '../../blocks/column-maxi/custom-css';
import {
	selectorsContainer,
	categoriesContainer,
} from '../../blocks/container-maxi/custom-css';
import {
	selectorsDivider,
	categoriesDivider,
} from '../../blocks/divider-maxi/custom-css';
import {
	selectorsImage,
	categoriesImage,
} from '../../blocks/image-maxi/custom-css';
import { selectorsMap, categoriesMap } from '../../blocks/map-maxi/custom-css';
import {
	selectorsNumberCounter,
	categoriesNumberCounter,
} from '../../blocks/number-counter-maxi/custom-css';
import { selectorsRow, categoriesRow } from '../../blocks/row-maxi/custom-css';
import {
	selectorsSvgIcon,
	categoriesSvgIcon,
} from '../../blocks/svg-icon-maxi/custom-css';
import {
	selectorsText,
	categoriesText,
} from '../../blocks/text-maxi/custom-css';

const getBlockCategoriesAndSelectors = name => {
	switch (name) {
		case 'group':
			return {
				categories: categoriesGroup,
				selectors: selectorsGroup,
			};
		case 'button':
			return {
				categories: categoriesButton,
				selectors: selectorsButton,
			};
		case 'column':
			return {
				categories: categoriesColumn,
				selectors: selectorsColumn,
			};
		case 'container':
			return {
				categories: categoriesContainer,
				selectors: selectorsContainer,
			};
		case 'divider':
			return {
				categories: categoriesDivider,
				selectors: selectorsDivider,
			};
		case 'image':
			return {
				categories: categoriesImage,
				selectors: selectorsImage,
			};
		case 'map':
			return {
				categories: categoriesMap,
				selectors: selectorsMap,
			};
		case 'number-counter':
			return {
				categories: categoriesNumberCounter,
				selectors: selectorsNumberCounter,
			};
		case 'row':
			return {
				categories: categoriesRow,
				selectors: selectorsRow,
			};
		case 'svg-icon':
			return {
				categories: categoriesSvgIcon,
				selectors: selectorsSvgIcon,
			};
		case 'text':
			return {
				categories: categoriesText,
				selectors: selectorsText,
			};
		default:
			return {
				categories: [],
				selectors: {},
			};
	}
};

export default getBlockCategoriesAndSelectors;
