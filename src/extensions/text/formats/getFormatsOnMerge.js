import { isEmpty, merge } from 'lodash';

const getFormatsOnMerge = (firstBlock, secondBlock) => {
	const { content: firstContent, 'custom-formats': firstCustomFormats } =
		firstBlock;
	const { content: secondContent, 'custom-formats': secondCustomFormats } =
		secondBlock;

	if (isEmpty(firstCustomFormats) || isEmpty(secondCustomFormats)) {
		const newCustomFormats = merge(firstCustomFormats, secondCustomFormats);

		return {
			content: firstContent.concat(secondContent),
			...(!isEmpty(newCustomFormats) && {
				'custom-formats': newCustomFormats,
			}),
		};
	}

	let newSecondContent = secondContent;

	const getNewCustomFormatEntry = oldKey => {
		if (!(oldKey in firstCustomFormats)) return oldKey;

		const num = parseInt(
			oldKey.replace('maxi-text-block__custom-format--', '')
		);
		const tempKey = oldKey.replace(num, num + 1);
		const newKey = getNewCustomFormatEntry(tempKey);

		return newKey;
	};

	Object.entries(secondCustomFormats).forEach(([key, val]) => {
		const newKey = getNewCustomFormatEntry(key);

		secondCustomFormats[newKey] = val;

		const replaceRegExp = new RegExp(key, 'g');
		newSecondContent = newSecondContent.replace(replaceRegExp, newKey);

		if (key !== newKey) delete secondCustomFormats[key];
	});

	const newCustomFormats = merge(firstCustomFormats, secondCustomFormats);

	return {
		content: firstContent.concat(newSecondContent),
		...(!isEmpty(newCustomFormats) && {
			'custom-formats': newCustomFormats,
		}),
	};
};

export default getFormatsOnMerge;
