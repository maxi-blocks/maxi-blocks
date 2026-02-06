import SYSTEM_PROMPT from './system';
import STYLE_CARD_MAXI_PROMPT from './style-card';
import { getBlockPromptForBlockName, getBlockPromptForTarget } from './blocks';

const resolveScopePrompt = ({ scope, blockName, targetBlock } = {}) => {
	const normalizedScope = String(scope || '').toLowerCase();
	if (normalizedScope === 'global' || normalizedScope === 'style-card') {
		return STYLE_CARD_MAXI_PROMPT;
	}

	if (targetBlock) {
		const targetPrompt = getBlockPromptForTarget(targetBlock);
		if (targetPrompt) return targetPrompt;
	}

	return getBlockPromptForBlockName(blockName);
};

export const buildPromptContext = ({
	scope = 'page',
	blockName,
	targetBlock,
	extraContext = '',
} = {}) => {
	const scopePrompt = resolveScopePrompt({ scope, blockName, targetBlock });
	return [SYSTEM_PROMPT, scopePrompt, extraContext].filter(Boolean).join('\n\n');
};

export default buildPromptContext;

