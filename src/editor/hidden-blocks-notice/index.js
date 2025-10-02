/**
 * WordPress dependencies
 */
import { subscribe, select, dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ignoreEmptyFields } from '@extensions/DC/constants';
import { getLastBreakpointAttribute } from '@extensions/styles';

const NOTICE_ID = 'maxi-blocks-hidden-blocks-notice';
const NO_CONTENT_TEXT = __('No content found', 'maxi-blocks');

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const stripHTML = value =>
	typeof value === 'string'
		? value
				.replace(/<[^>]*>/g, ' ')
				.replace(/&nbsp;/gi, ' ')
				.replace(/\s+/g, ' ')
				.trim()
		: '';

const noContentTextLower = stripHTML(NO_CONTENT_TEXT).toLowerCase();

const isDynamicContentEmpty = attributes => {
	const textContent = stripHTML(attributes?.['dc-content']).toLowerCase();

	if (!textContent) return true;

	if (!noContentTextLower) return !textContent.length;

	const pattern = new RegExp(`(?:${escapeRegExp(noContentTextLower)})`, 'g');
	const cleanedContent = textContent.replace(pattern, '').trim();

	return cleanedContent.length === 0;
};

const hasMediaContent = attributes => {
	const mediaURL = attributes?.['dc-media-url'];
	const mediaId = attributes?.['dc-media-id'];

	const hasURL =
		typeof mediaURL === 'string' ? mediaURL.trim().length > 0 : false;
	const hasId =
		typeof mediaId === 'number' ? !Number.isNaN(mediaId) : Boolean(mediaId);

	return hasURL || hasId;
};

const hasLoopItems = attributes => {
	const accumulator = attributes?.['dc-accumulator'];

	if (typeof accumulator === 'number') {
		return accumulator > 0;
	}

	return false;
};

const isHiddenDynamicBlock = block => {
	if (!block?.attributes || !block?.name?.startsWith('maxi-blocks/'))
		return false;

	const {
		attributes,
		attributes: {
			'dc-status': dcStatus,
			'dc-hide': dcHide,
			'dc-field': dcField,
		},
	} = block;

	if (!dcStatus || !dcHide) return false;

	if (ignoreEmptyFields.includes(dcField)) return false;

	const hasContent = !isDynamicContentEmpty(attributes);
	const hasMedia = hasMediaContent(attributes);
	const hasLoopContent = hasLoopItems(attributes);

	return !hasContent && !hasMedia && !hasLoopContent;
};

// (legacy helper removed)

// Hidden by display:none at current device
const isHiddenAtDevice = (attributes, deviceType) => {
	const display = getLastBreakpointAttribute({
		target: 'display',
		breakpoint: deviceType,
		attributes,
		forceSingle: true,
		isHover: false,
	});
	return display === 'none';
};

const collectHiddenClientIds = (blocks, deviceType, acc = []) => {
	blocks?.forEach(block => {
		const { clientId, name, attributes, innerBlocks } = block || {};
		const isMaxi = name?.startsWith?.('maxi-blocks/');
		if (isMaxi && attributes) {
			if (
				isHiddenDynamicBlock(block) ||
				isHiddenAtDevice(attributes, deviceType)
			) {
				if (clientId) acc.push(clientId);
			}
		}
		if (innerBlocks?.length)
			collectHiddenClientIds(innerBlocks, deviceType, acc);
	});
	return acc;
};

const computeHiddenSignature = (blocks, deviceType) => {
	const ids = collectHiddenClientIds(blocks, deviceType);
	return ids.length ? `${deviceType}|${ids.join('|')}` : '';
};

const noticeMessage = __(
	'This page contains hidden Maxi blocks. Open the Maxi tree to review them.',
	'maxi-blocks'
);

const removeNotice = () => {
	dispatch('core/notices').removeNotice(NOTICE_ID);
};

wp.domReady(() => {
	if (!document.body.classList.contains('maxi-blocks--active')) return;

	let lastHasHiddenBlocks = false;
	let lastHiddenSignature = '';
	let dismissedSignature = '';

	const { createNotice } = dispatch('core/notices');

	const evaluateHiddenBlocks = () => {
		const blocks = select('core/block-editor').getBlocks();
		const deviceType = select('maxiBlocks').receiveMaxiDeviceType?.();
		const signature = computeHiddenSignature(blocks, deviceType);
		const hasHiddenBlocks = Boolean(signature);

		if (hasHiddenBlocks === lastHasHiddenBlocks) return;

		lastHasHiddenBlocks = hasHiddenBlocks;
		lastHiddenSignature = signature;

		if (hasHiddenBlocks && signature !== dismissedSignature) {
			createNotice('warning', noticeMessage, {
				id: NOTICE_ID,
				isDismissible: false,
				actions: [
					{
						label: __('Dismiss', 'maxi-blocks'),
						onClick: () => {
							dismissedSignature = lastHiddenSignature;
							removeNotice();
						},
					},
				],
			});
		} else {
			removeNotice();
		}
	};

	// Evaluation wrapper (no extra hint UI)
	const wrappedEvaluate = evaluateHiddenBlocks;

	let scheduled = false;
	const unsubscribe = subscribe(() => {
		if (scheduled) return;
		scheduled = true;
		setTimeout(() => {
			scheduled = false;
			wrappedEvaluate();
		}, 0);
	});

	evaluateHiddenBlocks();

	window.addEventListener('beforeunload', () => {
		unsubscribe();
		removeNotice();
		// nothing else to cleanup
	});
	// Trigger wrapped evaluation once on load for visibility
	wrappedEvaluate();
});
