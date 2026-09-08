/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { extractCloudSearchQuery } from '../patternSearch';
import { executeCloudModalUiOps } from '../utils/aiCloudModalDriver';
import { insertMaxiCloudLibraryBlock } from '../utils/insertMaxiCloudLibraryBlock';

/**
 * Provides Cloud Library integration helpers for the AI chat panel.
 *
 * @param {Object}   args
 * @param {Function} args.setMessages           State setter for chat messages.
 * @param {Function} args.logAIDebug            Conditional debug logger.
 * @returns {{ getContentAreaClientId: Function, runCloudLibraryIntent: Function }}
 */
const useAiChatCloud = ({ setMessages, logAIDebug }) => {
	/**
	 * Returns the clientId of the `core/post-content` block when in FSE / block-template mode.
	 * In FSE mode, inserting without a rootClientId would land at the template root.
	 * Searches recursively because some themes nest post-content inside a group.
	 *
	 * @returns {string|undefined}
	 */
	const getContentAreaClientId = () => {
		const findPostContent = blocks => {
			for (const block of blocks) {
				if (block.name === 'core/post-content') return block.clientId;
				if (block.innerBlocks?.length) {
					const found = findPostContent(block.innerBlocks);
					if (found) return found;
				}
			}
			return undefined;
		};
		return findPostContent(select('core/block-editor').getBlocks());
	};

	/**
	 * Parses a natural-language message and drives the Cloud Library modal UI.
	 *
	 * @param {string} rawMsg User message.
	 * @returns {Promise<void>}
	 */
	const runCloudLibraryIntent = async rawMsg => {
		const query = extractCloudSearchQuery(rawMsg);
		const minLen = 2;
		const hint = query.length >= minLen ? query : '';
		const rawLower = String(rawMsg || '').toLowerCase();

		const usePlaygroundTab = /\bplayground\b/.test(rawLower);
		const useThemeTab = !usePlaygroundTab && /\btheme\b/.test(rawLower);
		const usePagesTab =
			!usePlaygroundTab &&
			!useThemeTab &&
			/\b(pages?)\b/.test(rawLower) &&
			!/\b(patterns?)\b/.test(rawLower);

		const costFilterValue = /\bfree\b/.test(rawLower)
			? 'free'
			: /\bpro\b/.test(rawLower)
				? 'pro'
				: null;

		const usePlaceholderImages =
			/\bplaceholder\b/.test(rawLower) ||
			/\bno.stock\b/.test(rawLower) ||
			/\bsave.disk\b/.test(rawLower);
		const useScStyles =
			/\bstyle.?card\b/.test(rawLower) ||
			/\bsc.styles?\b/.test(rawLower) ||
			/\bscs?\b/.test(rawLower);

		const lightDarkValue = /\b(dark)\b/i.test(rawLower)
			? 'dark'
			: /\b(light)\b/i.test(rawLower)
				? 'light'
				: null;

		const ops = [{ op: 'ensure_open' }];
		const hasAnyFilter =
			hint ||
			costFilterValue ||
			usePlaceholderImages ||
			useScStyles ||
			usePagesTab ||
			usePlaygroundTab ||
			useThemeTab;

		if (hasAnyFilter) {
			ops.push({ op: 'wait_ms', ms: 400 });

			if (usePlaygroundTab) {
				ops.push({ op: 'gutenberg_type', value: 'Playground' });
				ops.push({ op: 'wait_ms', ms: 500 });
			} else if (useThemeTab) {
				ops.push({ op: 'gutenberg_type', value: 'Theme' });
				ops.push({ op: 'wait_ms', ms: 500 });
			} else if (usePagesTab) {
				ops.push({ op: 'gutenberg_type', value: 'Pages' });
				ops.push({ op: 'wait_ms', ms: 500 });
			}

			if (costFilterValue) {
				ops.push({ op: 'cost_filter', value: costFilterValue, optional: true });
				ops.push({ op: 'wait_ms', ms: 300 });
			}

			if (usePlaceholderImages) ops.push({ op: 'placeholder_images', value: true, optional: true });
			if (useScStyles) ops.push({ op: 'use_sc_styles', value: true, optional: true });

			if (lightDarkValue) {
				ops.push({ op: 'light_dark', value: lightDarkValue });
				ops.push({ op: 'wait_ms', ms: 350 });
			}

			if (hint) {
				ops.push({ op: 'category_or_search', text: hint });
				ops.push({ op: 'wait_ms', ms: 1200 });
				ops.push({ op: 'click_first_insert' });
			}
		}

		const result = await executeCloudModalUiOps(ops, {
			insertCloudBlock: insertMaxiCloudLibraryBlock,
			logDebug: msg => logAIDebug(String(msg)),
		});

		if (result.outcome === 'zero_hits' && hint) {
			const followUp = [];
			if (lightDarkValue) {
				followUp.push(__('Try again without the light or dark filter', 'maxi-blocks'));
			}
			if (costFilterValue) {
				followUp.push(__('Try again without the free/pro filter', 'maxi-blocks'));
			}
			if (usePagesTab) {
				followUp.push(__('Try again under Patterns instead of Pages', 'maxi-blocks'));
			}
			followUp.push(__('Open Cloud Library to browse manually', 'maxi-blocks'));

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: sprintf(
						/* translators: %s: search keywords used in Cloud Library */
						__(
							'The Cloud Library returned no results for "%s" with the current filters. I closed the library. What would you like to do next?',
							'maxi-blocks'
						),
						hint
					),
					executed: false,
					options: followUp,
				},
			]);
			return;
		}

		setMessages(prev => [
			...prev,
			{
				role: 'assistant',
				content: result.ok
					? hint
						? sprintf(
								/* translators: %s: search keywords used in Cloud Library */
								__(
									'Opened the Cloud Library, searched for "%s", and inserted the first visible result.',
									'maxi-blocks'
								),
								hint
							)
						: __(
								'Opened the Cloud Library — use the modal search and filters, then insert a design.',
								'maxi-blocks'
							)
					: result.message ||
					  __(
							'Could not open or control the Cloud Library. Use the Cloud toolbar button.',
							'maxi-blocks'
					  ),
				executed: result.ok,
			},
		]);
	};

	return { getContentAreaClientId, runCloudLibraryIntent };
};

export default useAiChatCloud;
