import { getBlockPromptForBlockName, getBlockPromptForTarget } from './index';

export const buildBlockPrompt = ({ blockName, target } = {}) => {
	if (target) {
		const prompt = getBlockPromptForTarget(target);
		if (prompt) return prompt;
	}
	return getBlockPromptForBlockName(blockName);
};

export default buildBlockPrompt;

