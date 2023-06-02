import getBlockData from '../getBlockData';
import getTransformTransitionData from './getTransformTransitionData';
import transitionDefault from './transitionDefault';

const getTransitionData = (name, selectors, attributes) => ({
	...(getBlockData(name)?.transition || transitionDefault),
	tr: getTransformTransitionData(selectors, attributes),
});

export default getTransitionData;
