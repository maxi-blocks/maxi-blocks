(() => {
	const DURATION_MS = 30000;
	const TOP_ITEMS = 8;

	const round = (value, digits = 1) => {
		if (!Number.isFinite(value)) return null;
		const factor = 10 ** digits;
		return Math.round(value * factor) / factor;
	};

	const toMB = bytes =>
		Number.isFinite(bytes) ? round(bytes / (1024 * 1024), 1) : null;

	const heapUsed = () => performance.memory?.usedJSHeapSize ?? null;

	const topEntries = (map, limit) =>
		Array.from(map.values())
			.sort((a, b) => b.totalMs - a.totalMs)
			.slice(0, limit)
			.map(item => ({
				label: item.label,
				count: item.count,
				totalMs: round(item.totalMs, 1),
				avgMs: item.count ? round(item.totalMs / item.count, 2) : 0,
				worstMs: round(item.worstMs, 1),
			}));

	const recordDuration = (map, label, duration) => {
		if (!Number.isFinite(duration)) return;
		const current = map.get(label) || {
			label,
			count: 0,
			totalMs: 0,
			worstMs: 0,
		};
		current.count += 1;
		current.totalMs += duration;
		current.worstMs = Math.max(current.worstMs, duration);
		map.set(label, current);
	};

	const perfRoot = {
		totals: {},
		counts: {},
		logScheduled: true,
	};

	const previousPerfFlag =
		window.__MAXI_PROFILE_MAXI_BLOCKS__ === undefined
			? null
			: window.__MAXI_PROFILE_MAXI_BLOCKS__;
	const previousPerfCounters =
		window.__maxiBlocksPerfCounters__ === undefined
			? null
			: window.__maxiBlocksPerfCounters__;

	window.__MAXI_PROFILE_MAXI_BLOCKS__ = true;
	window.__maxiBlocksPerfCounters__ = perfRoot;

	const start = performance.now();
	const startHeap = heapUsed();
	const heapSamples = [];
	const longTasks = [];
	const slowEvents = [];
	const callbackDurations = new Map();
	const dispatchCounts = new Map();
	const frames = [];
	let lastFrame = null;
	let rafId = null;
	let heapTimer = null;
	let longTaskObserver = null;
	let eventObserver = null;

	const sampleHeap = () => {
		const used = heapUsed();
		if (used === null) return;
		heapSamples.push({
			t: Math.round(performance.now() - start),
			usedMB: toMB(used),
		});
	};

	const wrapMethod = (target, name, label) => {
		if (!target || typeof target[name] !== 'function') return () => {};
		const original = target[name];
		target[name] = function wrappedMethod(...args) {
			const startedAt = performance.now();
			try {
				return original.apply(this, args);
			} finally {
				recordDuration(
					callbackDurations,
					label,
					performance.now() - startedAt
				);
				dispatchCounts.set(label, (dispatchCounts.get(label) || 0) + 1);
			}
		};
		return () => {
			target[name] = original;
		};
	};

	const restoreFns = [];
	restoreFns.push(
		wrapMethod(
			window.wp?.data?.dispatch?.('maxiBlocks/styles'),
			'saveRawCSSCache',
			'saveRawCSSCache'
		)
	);
	restoreFns.push(
		wrapMethod(
			window.wp?.data?.dispatch?.('maxiBlocks/customData'),
			'updateCustomData',
			'updateCustomData'
		)
	);
	restoreFns.push(
		wrapMethod(
			window.wp?.data?.dispatch?.('core/block-editor'),
			'updateBlockAttributes',
			'updateBlockAttributes'
		)
	);

	const supportedEntryTypes = Array.isArray(
		window.PerformanceObserver?.supportedEntryTypes
	)
		? window.PerformanceObserver.supportedEntryTypes
		: [];

	if (
		window.PerformanceObserver &&
		supportedEntryTypes.includes('longtask')
	) {
		longTaskObserver = new PerformanceObserver(list => {
			list.getEntries().forEach(entry => {
				longTasks.push({
					start: round(entry.startTime, 1),
					duration: round(entry.duration, 1),
				});
			});
		});
		longTaskObserver.observe({ type: 'longtask', buffered: true });
	}

	if (window.PerformanceObserver && supportedEntryTypes.includes('event')) {
		try {
			eventObserver = new PerformanceObserver(list => {
				list.getEntries().forEach(entry => {
					slowEvents.push({
						name: entry.name,
						duration: round(entry.duration, 1),
					});
					recordDuration(
						callbackDurations,
						`event:${entry.name}`,
						entry.duration
					);
				});
			});
			eventObserver.observe({
				type: 'event',
				buffered: true,
				durationThreshold: 16,
			});
		} catch (error) {
			eventObserver = null;
		}
	}

	const tick = now => {
		if (lastFrame !== null) {
			frames.push(now - lastFrame);
		}
		lastFrame = now;
		rafId = requestAnimationFrame(tick);
	};

	sampleHeap();
	heapTimer = setInterval(sampleHeap, 1000);
	rafId = requestAnimationFrame(tick);

	const stop = () => {
		if (rafId) cancelAnimationFrame(rafId);
		if (heapTimer) clearInterval(heapTimer);
		if (longTaskObserver) longTaskObserver.disconnect();
		if (eventObserver) eventObserver.disconnect();
		sampleHeap();
		restoreFns.reverse().forEach(fn => fn());

		if (previousPerfFlag === null) {
			delete window.__MAXI_PROFILE_MAXI_BLOCKS__;
		} else {
			window.__MAXI_PROFILE_MAXI_BLOCKS__ = previousPerfFlag;
		}

		if (previousPerfCounters === null) {
			delete window.__maxiBlocksPerfCounters__;
		} else {
			window.__maxiBlocksPerfCounters__ = previousPerfCounters;
		}

		const end = performance.now();
		const endHeap = heapUsed();
		const totalBlockingMs = longTasks.reduce(
			(sum, task) => sum + Math.max(0, task.duration - 50),
			0
		);
		const avgFrameMs = frames.length
			? frames.reduce((sum, value) => sum + value, 0) / frames.length
			: 0;

		const perfLabels = Object.keys(perfRoot.totals)
			.map(label => {
				const totalMs = perfRoot.totals[label] || 0;
				const count = perfRoot.counts[label] || 0;
				return {
					label,
					totalMs: round(totalMs, 1),
					count,
					avgMs: count ? round(totalMs / count, 2) : 0,
				};
			})
			.sort((a, b) => b.totalMs - a.totalMs)
			.slice(0, TOP_ITEMS);

		const report = {
			summary: {
				durationMs: Math.round(end - start),
				heapStartMB: toMB(startHeap),
				heapEndMB: toMB(endHeap),
				heapDeltaMB:
					startHeap !== null && endHeap !== null
						? round((endHeap - startHeap) / (1024 * 1024), 1)
						: null,
				longTaskCount: longTasks.length,
				totalBlockingMs: round(totalBlockingMs, 1),
				worstLongTaskMs: longTasks.length
					? Math.max(...longTasks.map(task => task.duration))
					: 0,
				estimatedFPS: avgFrameMs ? round(1000 / avgFrameMs, 1) : 0,
				jankyFrames: frames.filter(value => value > 50).length,
				maxiBlocksInDom: document.querySelectorAll('.maxi-block').length,
				saveRawCSSCacheCalls:
					dispatchCounts.get('saveRawCSSCache') || 0,
				updateCustomDataCalls:
					dispatchCounts.get('updateCustomData') || 0,
				updateBlockAttributesCalls:
					dispatchCounts.get('updateBlockAttributes') || 0,
			},
			topPerfLabels: perfLabels,
			topCallbackCosts: topEntries(callbackDurations, TOP_ITEMS),
			longTasks: longTasks
				.slice()
				.sort((a, b) => b.duration - a.duration)
				.slice(0, TOP_ITEMS),
			slowEvents: slowEvents
				.slice()
				.sort((a, b) => b.duration - a.duration)
				.slice(0, TOP_ITEMS),
			heapSamples,
		};

		window.__maxiSimpleReport = report;

		console.log('Maxi simple scan summary:');
		console.log(report.summary);
		console.table(report.topPerfLabels);
		console.table(report.topCallbackCosts);
		console.table(report.longTasks);
		console.table(report.slowEvents);
		console.log('Full report saved to window.__maxiSimpleReport');

		return report;
	};

	console.log(
		'Maxi simple scan started. Use the page now for 30 seconds. The report will print automatically.'
	);

	setTimeout(stop, DURATION_MS);
})();
