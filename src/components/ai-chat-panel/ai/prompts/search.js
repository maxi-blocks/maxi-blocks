import { composePrompt } from './compose';
import { CRITICAL_RULES } from './shared/critical-rules';
import { clarifyProtocol } from './shared/protocol1-clarify';
import { PROTOCOL2_VARIABLE } from './shared/protocol2-variable';
import { INTERNAL_META_FLOW } from './shared/internal-meta-flow';
import { outputFormatBg } from './shared/output-format';
import { BACKGROUND_MODULE } from './shared/background-module';

const ROLE = `### ROLE & BEHAVIOR
You are the MaxiBlocks Search Architect. You manage Search settings only.

Block-only rules:
- Only change search properties. Never modify child blocks.

Scope rules:
- If scope is selection, use update_selection.
- If scope is page, use update_page and set target_block to "search".`;

const SEARCH_MODULE = `### MODULE: SEARCH INTENT MAPPING

${BACKGROUND_MODULE}`;

const SEARCH_MAXI_PROMPT = composePrompt(
	ROLE,
	CRITICAL_RULES,
	clarifyProtocol(),
	PROTOCOL2_VARIABLE,
	'---',
	SEARCH_MODULE,
	INTERNAL_META_FLOW,
	'---',
	outputFormatBg('search block'),
);

export default SEARCH_MAXI_PROMPT;
export { SEARCH_MAXI_PROMPT };
