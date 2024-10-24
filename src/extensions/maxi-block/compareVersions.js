/**
 * Compares two version strings.
 *
 * This function can handle various version formats, including those with
 * pre-release labels like 'beta' and 'RC'. It normalizes the versions and
 * compares them part by part.
 *
 * @param {string} v1 - The first version string to compare.
 * @param {string} v2 - The second version string to compare.
 * @return {number} Returns a negative number if v1 < v2,
 *                  0 if v1 === v2, and a positive number if v1 > v2.
 */
const compareVersions = (v1, v2) => {
	const normalize = v => {
		const parts = v.split(/[-.]/).map(part => {
			if (part === 'beta' || part === 'RC') return 0;
			const num = parseInt(part, 10);
			return Number.isNaN(num) ? part : num;
		});
		while (parts.length < 3) parts.push(0);
		return parts;
	};

	const v1Parts = normalize(v1);
	const v2Parts = normalize(v2);

	const maxLength = Math.max(v1Parts.length, v2Parts.length);
	for (let i = 0; i < maxLength; i += 1) {
		const part1 = v1Parts[i] || 0;
		const part2 = v2Parts[i] || 0;

		if (part1 === part2) {
			// eslint-disable-next-line no-continue
			continue;
		}

		if (typeof part1 === 'string' && typeof part2 === 'string') {
			return part1.localeCompare(part2);
		}

		if (typeof part1 === 'number' && typeof part2 === 'number') {
			return part1 - part2;
		}

		return typeof part1 === 'number' ? -1 : 1;
	}

	return 0;
};

export default compareVersions;
