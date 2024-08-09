/**
 * Internal dependencies
 */
import path from 'path';

/**
 * Number of iterations to perform for each action.
 */
export const ITERATIONS = 5;

/**
 * Directory where the results will be stored.
 */
export const RESULTS_FILE_DIR = path.join(__dirname, '../../bin');

/**
 * Patterns to test
 */
export const PATTERNS = [
	/**
	 * Simple patterns
	 */
	'HOL-PRO-95',
	'ANL-PRO-09',
	'NML-PRO-18',
	'PIL-PRO-164',
	'SML-PRO-61',
	'SML-38',

	/**
	 * DC/CL/IB
	 */
	'PBGL-PRO-60',
	'PBGL-PRO-97',
	'WCL-PRO-01',
	'PBGL-PRO-12',
	'WCL-PRO-06',

	/**
	 * IB
	 */
	'PIL-PRO-75',
	'PIL-PRO-82',
	'PIL-PRO-83',
	'PIL-PRO-118',
	'HOL-PRO-133',
	'SML-PRO-137',
	'PTML-PRO-77',

	/**
	 * Complex patterns
	 */
	'HOL-PRO-62',
	'SML-PRO-134',
	'PFL-PRO-62',
	'HOL-PRO-53',
	'HOL-PRO-47',
	'SML-PRO-162',

	/**
	 * Pages
	 */
	'DSP-PRO-01',
	'GMP-PRO-01',
	'NGOP-PRO-02',
	'HEP-PRO-05',
	'GDSP-PRO-01',
	'CSPY-PRO-01',
];
