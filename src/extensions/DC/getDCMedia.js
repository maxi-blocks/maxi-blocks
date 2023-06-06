/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getDCEntity from './getDCEntity';

const getDCMedia = async dataRequest => {
	const data = await getDCEntity(dataRequest);

	const { dc_f: field } = dataRequest;

	if (!(field in data)) return null;

	const id = data[field];

	if (isNil(id)) return null;

	const { getMedia } = resolveSelect('core');
	const media = await getMedia(id);

	if (isNil(media)) return null;

	return {
		id,
		url: media.source_url,
		caption: media.caption?.rendered,
	};
};

export default getDCMedia;
