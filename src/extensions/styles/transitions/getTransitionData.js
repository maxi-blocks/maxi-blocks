import * as blocksData from '../../../blocks/data';
import transitionDefault from './transitionDefault';

const getTransitionData = name =>
	Object.values(blocksData).find(
		({ name: blockName }) => blockName === name.replace('maxi-blocks/', '')
	)?.transition || transitionDefault;

export default getTransitionData;
