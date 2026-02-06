const splitPath = path =>
	String(path || '')
		.split('.')
		.map(segment => segment.trim())
		.filter(Boolean);

const getValue = (obj, path) => {
	const segments = splitPath(path);
	let current = obj;
	for (const segment of segments) {
		if (!current || typeof current !== 'object') return undefined;
		current = current[segment];
	}
	return current;
};

const setValue = (obj, path, value) => {
	const segments = splitPath(path);
	if (!segments.length) return obj;
	const root = { ...(obj || {}) };
	let current = root;
	for (let i = 0; i < segments.length - 1; i += 1) {
		const segment = segments[i];
		current[segment] = { ...(current[segment] || {}) };
		current = current[segment];
	}
	current[segments[segments.length - 1]] = value;
	return root;
};

const removeValue = (obj, path) => {
	const segments = splitPath(path);
	if (!segments.length) return obj;
	const root = { ...(obj || {}) };
	let current = root;
	for (let i = 0; i < segments.length - 1; i += 1) {
		const segment = segments[i];
		if (!current[segment] || typeof current[segment] !== 'object') {
			return root;
		}
		current[segment] = { ...current[segment] };
		current = current[segment];
	}
	delete current[segments[segments.length - 1]];
	return root;
};

export const applyPatchToAttributes = (attributes, patch = []) => {
	let next = { ...(attributes || {}) };

	for (const op of patch) {
		switch (op.op) {
			case 'set':
				next = setValue(next, op.path, op.value);
				break;
			case 'reset':
				if (op.value === null || op.value === undefined) {
					next = removeValue(next, op.path);
				} else {
					next = setValue(next, op.path, op.value);
				}
				break;
			case 'toggle': {
				const current = Boolean(getValue(next, op.path));
				next = setValue(next, op.path, !current);
				break;
			}
			case 'increment': {
				const current = Number(getValue(next, op.path)) || 0;
				const amount = Number(op.amount) || 0;
				next = setValue(next, op.path, current + amount);
				break;
			}
			case 'merge': {
				const current = getValue(next, op.path) || {};
				const merged = { ...(current || {}), ...(op.value || {}) };
				next = setValue(next, op.path, merged);
				break;
			}
			case 'add': {
				const current = getValue(next, op.path);
				const arr = Array.isArray(current) ? current.slice() : [];
				if (!arr.includes(op.value)) {
					arr.push(op.value);
				}
				next = setValue(next, op.path, arr);
				break;
			}
			case 'remove': {
				const current = getValue(next, op.path);
				const arr = Array.isArray(current) ? current.slice() : [];
				next = setValue(
					next,
					op.path,
					arr.filter(item => item !== op.value)
				);
				break;
			}
			default:
				break;
		}
	}

	return next;
};

export default applyPatchToAttributes;
