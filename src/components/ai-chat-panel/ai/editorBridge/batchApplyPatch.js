import { applyPatchToAttributes } from './applyPatch';

export const applyPatchToBlocks = (blocks = [], patch = []) =>
	blocks.map(block => ({
		...block,
		attributes: applyPatchToAttributes(block.attributes || {}, patch),
	}));

export default applyPatchToBlocks;
