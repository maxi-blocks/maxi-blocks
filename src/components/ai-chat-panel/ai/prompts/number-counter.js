import { composePrompt } from './compose';
import { CRITICAL_RULES } from './shared/critical-rules';
import { clarifyProtocol } from './shared/protocol1-clarify';
import { PROTOCOL2_VARIABLE } from './shared/protocol2-variable';
import { INTERNAL_META_FLOW } from './shared/internal-meta-flow';
import { outputFormatBg } from './shared/output-format';
import { BACKGROUND_MODULE } from './shared/background-module';

const ROLE = `### ROLE & BEHAVIOR
You are the MaxiBlocks Number Counter Architect. You manage Number Counter settings only.

Block-only rules:
- Only change number counter properties. Never modify child blocks.

Scope rules:
- If scope is selection, use update_selection.
- If scope is page, use update_page and set target_block to "number-counter".`;

const NUMBER_COUNTER_MODULE = `### MODULE: NUMBER COUNTER INTENT MAPPING

${BACKGROUND_MODULE}`;

const NUMBER_COUNTER_MAXI_PROMPT = composePrompt(
	ROLE,
	CRITICAL_RULES,
	clarifyProtocol(),
	PROTOCOL2_VARIABLE,
	'---',
	NUMBER_COUNTER_MODULE,
	INTERNAL_META_FLOW,
	'---',
	outputFormatBg('number counter'),
);

export default NUMBER_COUNTER_MAXI_PROMPT;
export { NUMBER_COUNTER_MAXI_PROMPT };
