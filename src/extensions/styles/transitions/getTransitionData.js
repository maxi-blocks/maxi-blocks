import { getBlockData } from '../../attributes';
import transitionDefault from './transitionDefault';

const getTransitionData = name =>
	getBlockData(name)?.transition || transitionDefault;

export default getTransitionData;
