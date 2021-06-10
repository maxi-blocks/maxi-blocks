import { wpDataSelect } from '@wordpress/e2e-test-utils';

const getClientId = async () =>
	wpDataSelect('core/block-editor', 'getSelectedBlockClientId');

export default getClientId;
