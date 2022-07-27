import { kebabCase } from 'lodash';

const normalizeLabel = label => {
	return kebabCase(label);
};

export default normalizeLabel;
