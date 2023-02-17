import { getBlockData } from '../../attributes';
import getTransformTransitionData from './getTransformTransitionData';
import transitionDefault from './transitionDefault';

const getTransitionData = (name, selectors) => ({
	...(getBlockData(name)?.transition || transitionDefault),
	transform: getTransformTransitionData(selectors),
});

export default getTransitionData;
