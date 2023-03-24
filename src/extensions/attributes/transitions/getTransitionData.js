import getBlockData from '../getBlockData';
import getTransformTransitionData from './getTransformTransitionData';
import transitionDefault from './transitionDefault';

const getTransitionData = (name, selectors, attributes) => ({
	...(getBlockData(name)?.transition || transitionDefault),
	transform: getTransformTransitionData(selectors, attributes),
});

export default getTransitionData;
