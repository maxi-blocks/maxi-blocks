/*
 * Paste this entire file into the Chrome DevTools console on a heavy editor page.
 *
 * It exposes:
 * - __maxiEditorBench.start({ durationMs: 30000 })
 * - __maxiEditorBench.stop()
 * - __maxiEditorBench.lastReport
 * - __maxiEditorBench.save('before')
 * - __maxiEditorBench.load('before')
 * - __maxiEditorBench.compare(beforeReport, afterReport)
 *
 * Recommended flow:
 * 1. Hard refresh the editor page.
 * 2. Paste this file.
 * 3. Run the same interaction flow for each test window.
 * 4. Compare reports with __maxiEditorBench.compare(a, b)
 */

(() => {
	const DEFAULTS = {
		durationMs: 30000,
		heapSampleMs: 1000,
		frameJankMs: 50,
		topItems: 10,
		eventDurationThreshold: 16,
	};

	const STORAGE_KEY = '__maxiEditorBenchReports__';
	const api = window.__maxiEditorBench || {};
	let activeRun = null;

	function round(value, digits = 1) {
		if (!Number.isFinite(value)) {
			return null;
		}

		const factor = 10 ** digits;
		return Math.round(value * factor) / factor;
	}

	function formatMB(bytes) {
		if (!Number.isFinite(bytes) || bytes < 0) {
			return null;
		}

		return round(bytes / (1024 * 1024), 1);
	}

	function getHeapUsedBytes() {
		return performance.memory?.usedJSHeapSize ?? null;
	}

	function getStyleCacheEntryCount() {
		const cache =
			window.wp?.data?.select?.('maxiBlocks/styles')?.getCSSCache?.();
		if (!cache) {
			return null;
		}

		if (typeof cache.size === 'number') {
			return cache.size;
		}

		if (typeof cache === 'object') {
			return Object.keys(cache).length;
		}

		return null;
	}

	function getTrackedBlockCount() {
		const blocks =
			window.wp?.data?.select?.('maxiBlocks/blocks')?.getBlocks?.();
		if (blocks && typeof blocks === 'object') {
			return Object.keys(blocks).length;
		}

		return document.querySelectorAll('.maxi-block').length;
	}

	function getDomSnapshot() {
		return {
			elementCount: document.getElementsByTagName('*').length,
			maxiBlockCount: document.querySelectorAll('.maxi-block').length,
			relationStyleTags: document.querySelectorAll(
				'style[id^="relations--"]'
			).length,
			tempStyleTags: document.querySelectorAll(
				'style[id*="maxi-temp"]'
			).length,
			inlineMaxiStyleTags: document.querySelectorAll(
				'div.maxi-blocks__styles style'
			).length,
			styleCacheEntries: getStyleCacheEntryCount(),
			trackedBlocks: getTrackedBlockCount(),
		};
	}

	function incrementMap(map, key, amount = 1) {
		map.set(key, (map.get(key) || 0) + amount);
	}

	function recordDuration(map, key, duration) {
		if (!Number.isFinite(duration)) {
			return;
		}

		const current =
			map.get(key) || {
				label: key,
				count: 0,
				totalMs: 0,
				worstMs: 0,
			};

		current.count += 1;
		current.totalMs += duration;
		current.worstMs = Math.max(current.worstMs, duration);

		map.set(key, current);
	}

	function topCountEntries(map, limit) {
		return Array.from(map.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([name, count]) => ({ name, count }));
	}

	function topDurationEntries(map, limit) {
		return Array.from(map.values())
			.sort((a, b) => b.totalMs - a.totalMs)
			.slice(0, limit)
			.map(item => ({
				label: item.label,
				count: item.count,
				totalMs: round(item.totalMs, 1),
				avgMs: item.count ? round(item.totalMs / item.count, 2) : 0,
				worstMs: round(item.worstMs, 1),
			}));
	}

	function getDurationBucket(map, key) {
		const bucket = map.get(key);
		return {
			count: bucket?.count || 0,
			totalMs: round(bucket?.totalMs || 0, 1),
			worstMs: round(bucket?.worstMs || 0, 1),
		};
	}

	function wrapMethod(target, name, beforeCall, afterCall) {
		if (!target || typeof target[name] !== 'function') {
			return () => {};
		}

		const original = target[name];

		target[name] = function wrappedMethod(...args) {
			if (typeof beforeCall === 'function') {
				try {
					beforeCall(args, this);
				} catch (error) {
					// Ignore instrumentation failures.
				}
			}

			const start = performance.now();

			try {
				return original.apply(this, args);
			} finally {
				if (typeof afterCall === 'function') {
					try {
						afterCall(args, this, performance.now() - start);
					} catch (error) {
						// Ignore instrumentation failures.
					}
				}
			}
		};

		return () => {
			target[name] = original;
		};
	}

	function buildPerfSummary(counters, topItems) {
		const perfEntries = Object.keys(counters.totals)
			.map(label => {
				const totalMs = counters.totals[label] || 0;
				const count = counters.counts[label] || 0;

				return {
					label,
					totalMs: round(totalMs, 1),
					count,
					avgMs: count ? round(totalMs / count, 2) : 0,
				};
			})
			.sort((a, b) => b.totalMs - a.totalMs);

		return {
			perfLabels: perfEntries,
			topPerfLabels: perfEntries.slice(0, topItems),
		};
	}

	function createRun(options = {}) {
		const config = { ...DEFAULTS, ...options };
		const baseline = getDomSnapshot();
		const restoreFns = [];
		const longTasks = [];
		const slowEvents = [];
		const gcEvents = [];
		const fetches = [];
		const frames = [];
		const heapSamples = [];
		const eventAdds = new Map();
		const eventRemoves = new Map();
		const dispatchCounts = new Map();
		const callbackDurations = new Map();
		const perfRoot = {
			totals: {},
			counts: {},
			logScheduled: true,
		};
		const supportedEntryTypes = Array.isArray(
			window.PerformanceObserver?.supportedEntryTypes
		)
			? window.PerformanceObserver.supportedEntryTypes
			: [];
		const startWallTime = Date.now();

		const originalSetTimeout =
			typeof window.setTimeout === 'function'
				? window.setTimeout.bind(window)
				: null;
		const originalClearTimeout =
			typeof window.clearTimeout === 'function'
				? window.clearTimeout.bind(window)
				: null;
		const originalSetInterval =
			typeof window.setInterval === 'function'
				? window.setInterval.bind(window)
				: null;
		const originalClearInterval =
			typeof window.clearInterval === 'function'
				? window.clearInterval.bind(window)
				: null;
		const originalRequestAnimationFrame =
			typeof window.requestAnimationFrame === 'function'
				? window.requestAnimationFrame.bind(window)
				: null;
		const originalCancelAnimationFrame =
			typeof window.cancelAnimationFrame === 'function'
				? window.cancelAnimationFrame.bind(window)
				: null;
		const originalQueueMicrotask =
			typeof window.queueMicrotask === 'function'
				? window.queueMicrotask.bind(window)
				: null;
		const originalFetch =
			typeof window.fetch === 'function' ? window.fetch.bind(window) : null;

		const state = {
			config,
			baseline,
			restoreFns,
			startWallTime,
			startedAt: performance.now(),
			startHeapBytes: getHeapUsedBytes(),
			longTasks,
			slowEvents,
			gcEvents,
			fetches,
			frames,
			heapSamples,
			eventAdds,
			eventRemoves,
			dispatchCounts,
			callbackDurations,
			lastFrameAt: null,
			mutationObserversCreated: 0,
			mutationObserversDisconnected: 0,
			intervalsCreated: 0,
			intervalsCleared: 0,
			timeoutsCreated: 0,
			timeoutsCleared: 0,
			activeIntervals: new Set(),
			activeTimeouts: new Set(),
			restorePerfFlag:
				window.__MAXI_PROFILE_MAXI_BLOCKS__ === undefined
					? null
					: window.__MAXI_PROFILE_MAXI_BLOCKS__,
			restorePerfCounters:
				window.__maxiBlocksPerfCounters__ === undefined
					? null
					: window.__maxiBlocksPerfCounters__,
			longTaskObserver: null,
			eventTimingObserver: null,
			gcObserver: null,
			heapTimer: null,
			rafId: null,
			stopTimer: null,
			stopped: false,
			perfRoot,
			originalSetTimeout,
			originalClearTimeout,
			originalSetInterval,
			originalClearInterval,
			originalRequestAnimationFrame,
			originalCancelAnimationFrame,
			originalQueueMicrotask,
			originalFetch,
		};

		function sampleHeap() {
			const usedBytes = getHeapUsedBytes();
			if (usedBytes === null) {
				return;
			}

			heapSamples.push({
				t: Math.round(performance.now() - state.startedAt),
				usedMB: formatMB(usedBytes),
			});
		}

		function trackDispatch(name, duration) {
			incrementMap(dispatchCounts, name);
			recordDuration(callbackDurations, `dispatch:${name}`, duration);
		}

		window.__MAXI_PROFILE_MAXI_BLOCKS__ = true;
		window.__maxiBlocksPerfCounters__ = perfRoot;

		if (
			window.PerformanceObserver &&
			supportedEntryTypes.includes('longtask')
		) {
			state.longTaskObserver = new PerformanceObserver(list => {
				list.getEntries().forEach(entry => {
					longTasks.push({
						start: round(entry.startTime, 1),
						duration: round(entry.duration, 1),
					});
				});
			});

			state.longTaskObserver.observe({
				type: 'longtask',
				buffered: true,
			});
		}

		if (
			window.PerformanceObserver &&
			supportedEntryTypes.includes('event')
		) {
			try {
				state.eventTimingObserver = new PerformanceObserver(list => {
					list.getEntries().forEach(entry => {
						slowEvents.push({
							name: entry.name,
							duration: round(entry.duration, 1),
							start: round(entry.startTime, 1),
							interactionId: entry.interactionId || 0,
						});
						recordDuration(
							callbackDurations,
							'eventTiming',
							entry.duration
						);
					});
				});

				state.eventTimingObserver.observe({
					type: 'event',
					buffered: true,
					durationThreshold: config.eventDurationThreshold,
				});
			} catch (error) {
				state.eventTimingObserver = null;
			}
		}

		if (window.PerformanceObserver && supportedEntryTypes.includes('gc')) {
			try {
				state.gcObserver = new PerformanceObserver(list => {
					list.getEntries().forEach(entry => {
						gcEvents.push({
							start: round(entry.startTime, 1),
							duration: round(entry.duration, 1),
							kind: entry.kind ?? null,
						});
						recordDuration(callbackDurations, 'gc', entry.duration);
					});
				});

				state.gcObserver.observe({
					type: 'gc',
					buffered: true,
				});
			} catch (error) {
				state.gcObserver = null;
			}
		}

		const tick = now => {
			if (state.lastFrameAt !== null) {
				frames.push(now - state.lastFrameAt);
			}

			state.lastFrameAt = now;

			if (state.originalRequestAnimationFrame) {
				state.rafId = state.originalRequestAnimationFrame(tick);
			}
		};

		sampleHeap();

		if (state.originalSetInterval) {
			state.heapTimer = state.originalSetInterval(
				sampleHeap,
				config.heapSampleMs
			);
		}

		if (state.originalRequestAnimationFrame) {
			state.rafId = state.originalRequestAnimationFrame(tick);
		}

		const stylesDispatch = window.wp?.data?.dispatch?.('maxiBlocks/styles');
		const customDataDispatch =
			window.wp?.data?.dispatch?.('maxiBlocks/customData');
		const blockEditorDispatch =
			window.wp?.data?.dispatch?.('core/block-editor');

		restoreFns.push(
			wrapMethod(
				stylesDispatch,
				'saveRawCSSCache',
				null,
				(args, ctx, duration) => {
					trackDispatch('saveRawCSSCache', duration);
				}
			)
		);
		restoreFns.push(
			wrapMethod(
				stylesDispatch,
				'removeCSSCache',
				null,
				(args, ctx, duration) => {
					trackDispatch('removeCSSCache', duration);
				}
			)
		);
		restoreFns.push(
			wrapMethod(
				customDataDispatch,
				'updateCustomData',
				null,
				(args, ctx, duration) => {
					trackDispatch('updateCustomData', duration);
				}
			)
		);
		restoreFns.push(
			wrapMethod(
				blockEditorDispatch,
				'updateBlockAttributes',
				null,
				(args, ctx, duration) => {
					trackDispatch('updateBlockAttributes', duration);
				}
			)
		);

		if (typeof EventTarget !== 'undefined') {
			restoreFns.push(
				wrapMethod(EventTarget.prototype, 'addEventListener', ([type]) => {
					incrementMap(eventAdds, String(type || '(unknown)'));
				})
			);
			restoreFns.push(
				wrapMethod(
					EventTarget.prototype,
					'removeEventListener',
					([type]) => {
						incrementMap(eventRemoves, String(type || '(unknown)'));
					}
				)
			);
		}

		if (typeof MutationObserver === 'function') {
			const OriginalMutationObserver = window.MutationObserver;

			class WrappedMutationObserver extends OriginalMutationObserver {
				constructor(callback) {
					const wrappedCallback =
						typeof callback === 'function'
							? function wrappedObserverCallback(...args) {
									const startedAt = performance.now();
									try {
										return callback.apply(this, args);
									} finally {
										recordDuration(
											callbackDurations,
											'mutationObserver',
											performance.now() - startedAt
										);
									}
							  }
							: callback;

					super(wrappedCallback);
					state.mutationObserversCreated += 1;
				}

				disconnect() {
					state.mutationObserversDisconnected += 1;
					return super.disconnect();
				}
			}

			window.MutationObserver = WrappedMutationObserver;
			restoreFns.push(() => {
				window.MutationObserver = OriginalMutationObserver;
			});
		}

		if (state.originalSetTimeout && state.originalClearTimeout) {
			window.setTimeout = function wrappedSetTimeout(
				callback,
				delay,
				...args
			) {
				state.timeoutsCreated += 1;

				let timeoutId;
				const wrappedCallback =
					typeof callback === 'function'
						? function wrappedTimeoutCallback(...callbackArgs) {
								const startedAt = performance.now();
								try {
									return callback.apply(this, callbackArgs);
								} finally {
									recordDuration(
										callbackDurations,
										'timeout',
										performance.now() - startedAt
									);
									state.activeTimeouts.delete(timeoutId);
								}
						  }
						: callback;

				timeoutId = state.originalSetTimeout(
					wrappedCallback,
					delay,
					...args
				);
				state.activeTimeouts.add(timeoutId);

				return timeoutId;
			};

			window.clearTimeout = function wrappedClearTimeout(timeoutId) {
				if (state.activeTimeouts.has(timeoutId)) {
					state.activeTimeouts.delete(timeoutId);
					state.timeoutsCleared += 1;
				}

				return state.originalClearTimeout(timeoutId);
			};

			restoreFns.push(() => {
				window.setTimeout = state.originalSetTimeout;
				window.clearTimeout = state.originalClearTimeout;
			});
		}

		if (state.originalSetInterval && state.originalClearInterval) {
			window.setInterval = function wrappedSetInterval(
				callback,
				delay,
				...args
			) {
				const wrappedCallback =
					typeof callback === 'function'
						? function wrappedIntervalCallback(...callbackArgs) {
								const startedAt = performance.now();
								try {
									return callback.apply(this, callbackArgs);
								} finally {
									recordDuration(
										callbackDurations,
										'interval',
										performance.now() - startedAt
									);
								}
						  }
						: callback;

				const intervalId = state.originalSetInterval(
					wrappedCallback,
					delay,
					...args
				);
				state.intervalsCreated += 1;
				state.activeIntervals.add(intervalId);

				return intervalId;
			};

			window.clearInterval = function wrappedClearInterval(intervalId) {
				if (state.activeIntervals.has(intervalId)) {
					state.activeIntervals.delete(intervalId);
					state.intervalsCleared += 1;
				}

				return state.originalClearInterval(intervalId);
			};

			restoreFns.push(() => {
				window.setInterval = state.originalSetInterval;
				window.clearInterval = state.originalClearInterval;
			});
		}

		if (state.originalRequestAnimationFrame) {
			window.requestAnimationFrame =
				function wrappedRequestAnimationFrame(callback) {
					const wrappedCallback =
						typeof callback === 'function'
							? function wrappedRafCallback(timestamp) {
									const startedAt = performance.now();
									try {
										return callback(timestamp);
									} finally {
										recordDuration(
											callbackDurations,
											'rafCallback',
											performance.now() - startedAt
										);
									}
							  }
							: callback;

					return state.originalRequestAnimationFrame(wrappedCallback);
				};

			restoreFns.push(() => {
				window.requestAnimationFrame = state.originalRequestAnimationFrame;
			});
		}

		if (state.originalQueueMicrotask) {
			window.queueMicrotask = function wrappedQueueMicrotask(callback) {
				const wrappedCallback =
					typeof callback === 'function'
						? function wrappedMicrotaskCallback() {
								const startedAt = performance.now();
								try {
									return callback();
								} finally {
									recordDuration(
										callbackDurations,
										'microtask',
										performance.now() - startedAt
									);
								}
						  }
						: callback;

				return state.originalQueueMicrotask(wrappedCallback);
			};

			restoreFns.push(() => {
				window.queueMicrotask = state.originalQueueMicrotask;
			});
		}

		if (state.originalFetch) {
			window.fetch = function wrappedFetch(...args) {
				const startedAt = performance.now();
				const requestTarget =
					typeof args[0] === 'string'
						? args[0]
						: args[0]?.url || '(request)';

				return state.originalFetch(...args).then(
					response => {
						const duration = performance.now() - startedAt;
						recordDuration(callbackDurations, 'fetch', duration);
						fetches.push({
							url: requestTarget,
							durationMs: round(duration, 1),
							status: response?.status ?? null,
						});
						return response;
					},
					error => {
						const duration = performance.now() - startedAt;
						recordDuration(callbackDurations, 'fetch', duration);
						fetches.push({
							url: requestTarget,
							durationMs: round(duration, 1),
							status: 'error',
						});
						throw error;
					}
				);
			};

			restoreFns.push(() => {
				window.fetch = state.originalFetch;
			});
		}

		state.stop = reason => {
			if (state.stopped) {
				return api.lastReport;
			}

			state.stopped = true;

			if (state.stopTimer && state.originalClearTimeout) {
				state.originalClearTimeout(state.stopTimer);
				state.stopTimer = null;
			}

			if (state.rafId && state.originalCancelAnimationFrame) {
				state.originalCancelAnimationFrame(state.rafId);
				state.rafId = null;
			}

			if (state.heapTimer && state.originalClearInterval) {
				state.originalClearInterval(state.heapTimer);
				state.heapTimer = null;
			}

			if (state.longTaskObserver) {
				state.longTaskObserver.disconnect();
				state.longTaskObserver = null;
			}

			if (state.eventTimingObserver) {
				state.eventTimingObserver.disconnect();
				state.eventTimingObserver = null;
			}

			if (state.gcObserver) {
				state.gcObserver.disconnect();
				state.gcObserver = null;
			}

			sampleHeap();

			restoreFns.reverse().forEach(restore => {
				try {
					restore();
				} catch (error) {
					// Ignore restore failures.
				}
			});

			if (state.restorePerfFlag === null) {
				delete window.__MAXI_PROFILE_MAXI_BLOCKS__;
			} else {
				window.__MAXI_PROFILE_MAXI_BLOCKS__ = state.restorePerfFlag;
			}

			if (state.restorePerfCounters === null) {
				delete window.__maxiBlocksPerfCounters__;
			} else {
				window.__maxiBlocksPerfCounters__ = state.restorePerfCounters;
			}

			const endedAt = performance.now();
			const durationMs = Math.round(endedAt - state.startedAt);
			const endHeapBytes = getHeapUsedBytes();
			const finalDom = getDomSnapshot();
			const avgFrameMs = frames.length
				? frames.reduce((sum, value) => sum + value, 0) / frames.length
				: 0;
			const worstFrameMs = frames.length ? Math.max(...frames) : 0;
			const jankyFrames = frames.filter(
				value => value > config.frameJankMs
			).length;
			const totalBlockingMs = longTasks.reduce(
				(sum, task) => sum + Math.max(0, task.duration - 50),
				0
			);
			const perfSummary = buildPerfSummary(perfRoot, config.topItems);
			const timeoutStats = getDurationBucket(callbackDurations, 'timeout');
			const intervalStats = getDurationBucket(callbackDurations, 'interval');
			const rafStats = getDurationBucket(callbackDurations, 'rafCallback');
			const microtaskStats = getDurationBucket(
				callbackDurations,
				'microtask'
			);
			const observerStats = getDurationBucket(
				callbackDurations,
				'mutationObserver'
			);
			const fetchStats = getDurationBucket(callbackDurations, 'fetch');
			const eventTimingStats = getDurationBucket(
				callbackDurations,
				'eventTiming'
			);
			const gcStats = getDurationBucket(callbackDurations, 'gc');
			const startedAtIso = new Date(startWallTime).toISOString();
			const endedAtIso = new Date(startWallTime + durationMs).toISOString();

			const report = {
				meta: {
					reason: reason || 'manual-stop',
					durationMs,
					startedAtIso,
					endedAtIso,
				},
				summary: {
					heapStartMB: formatMB(state.startHeapBytes),
					heapEndMB: formatMB(endHeapBytes),
					heapDeltaMB:
						state.startHeapBytes !== null && endHeapBytes !== null
							? round(
									(endHeapBytes - state.startHeapBytes) /
										(1024 * 1024),
									1
							  )
							: null,
					longTaskCount: longTasks.length,
					worstLongTaskMs: longTasks.length
						? Math.max(...longTasks.map(task => task.duration))
						: 0,
					totalBlockingMs: round(totalBlockingMs, 1),
					avgFrameMs: round(avgFrameMs, 1),
					worstFrameMs: round(worstFrameMs, 1),
					estimatedFPS: avgFrameMs ? round(1000 / avgFrameMs, 1) : 0,
					jankyFrames,
					mutationObserversCreated: state.mutationObserversCreated,
					mutationObserversDisconnected:
						state.mutationObserversDisconnected,
					netMutationObservers:
						state.mutationObserversCreated -
						state.mutationObserversDisconnected,
					intervalsCreated: state.intervalsCreated,
					intervalsCleared: state.intervalsCleared,
					netIntervals:
						state.intervalsCreated - state.intervalsCleared,
					timeoutsCreated: state.timeoutsCreated,
					timeoutsCleared: state.timeoutsCleared,
					netTimeouts:
						state.timeoutsCreated - state.timeoutsCleared,
					timeoutCallbacks: timeoutStats.count,
					timeoutCallbackTotalMs: timeoutStats.totalMs,
					intervalCallbacks: intervalStats.count,
					intervalCallbackTotalMs: intervalStats.totalMs,
					rafCallbacks: rafStats.count,
					rafCallbackTotalMs: rafStats.totalMs,
					microtaskCallbacks: microtaskStats.count,
					microtaskCallbackTotalMs: microtaskStats.totalMs,
					mutationObserverCallbacks: observerStats.count,
					mutationObserverCallbackTotalMs: observerStats.totalMs,
					fetchCount: fetches.length,
					fetchTotalMs: fetchStats.totalMs,
					slowEventCount: slowEvents.length,
					slowEventTotalMs: eventTimingStats.totalMs,
					slowestEventMs: slowEvents.length
						? Math.max(...slowEvents.map(event => event.duration))
						: 0,
					gcCount: gcEvents.length,
					gcTotalMs: gcStats.totalMs,
					styleCacheEntriesStart: baseline.styleCacheEntries,
					styleCacheEntriesEnd: finalDom.styleCacheEntries,
					styleCacheEntriesDelta:
						baseline.styleCacheEntries !== null &&
						finalDom.styleCacheEntries !== null
							? finalDom.styleCacheEntries -
							  baseline.styleCacheEntries
							: null,
					relationStyleTagsStart: baseline.relationStyleTags,
					relationStyleTagsEnd: finalDom.relationStyleTags,
					relationStyleTagsDelta:
						finalDom.relationStyleTags -
						baseline.relationStyleTags,
					tempStyleTagsStart: baseline.tempStyleTags,
					tempStyleTagsEnd: finalDom.tempStyleTags,
					tempStyleTagsDelta:
						finalDom.tempStyleTags - baseline.tempStyleTags,
					maxiBlocksInDom: finalDom.maxiBlockCount,
					trackedBlocks: finalDom.trackedBlocks,
					saveRawCSSCacheCalls:
						dispatchCounts.get('saveRawCSSCache') || 0,
					removeCSSCacheCalls:
						dispatchCounts.get('removeCSSCache') || 0,
					updateCustomDataCalls:
						dispatchCounts.get('updateCustomData') || 0,
					updateBlockAttributesCalls:
						dispatchCounts.get('updateBlockAttributes') || 0,
				},
				baseline,
				finalDom,
				topPerfLabels: perfSummary.topPerfLabels,
				perfLabels: perfSummary.perfLabels,
				topCallbackCosts: topDurationEntries(
					callbackDurations,
					config.topItems
				),
				topEventAdds: topCountEntries(eventAdds, config.topItems),
				topEventRemoves: topCountEntries(eventRemoves, config.topItems),
				dispatchCounts: topCountEntries(dispatchCounts, config.topItems),
				heapSamples,
				longTasks: longTasks
					.slice()
					.sort((a, b) => b.duration - a.duration)
					.slice(0, config.topItems),
				slowEvents: slowEvents
					.slice()
					.sort((a, b) => b.duration - a.duration)
					.slice(0, config.topItems),
				gcEvents: gcEvents
					.slice()
					.sort((a, b) => b.duration - a.duration)
					.slice(0, config.topItems),
				fetches: fetches
					.slice()
					.sort((a, b) => b.durationMs - a.durationMs)
					.slice(0, config.topItems),
			};

			api.lastReport = report;
			activeRun = null;

			console.groupCollapsed(
				'%c[MaxiEditorBench] Report ready',
				'color:#0b6; font-weight:600;'
			);
			console.log(report);
			console.table(report.topPerfLabels);
			console.table(report.topCallbackCosts);
			console.table(report.dispatchCounts);
			console.table(report.slowEvents);
			console.groupEnd();

			return report;
		};

		if (state.originalSetTimeout) {
			state.stopTimer = state.originalSetTimeout(() => {
				state.stop('auto-stop');
			}, config.durationMs);
		}

		return state;
	}

	function pickComparisonValue(report, key) {
		if (!report || !report.summary) {
			return null;
		}

		return report.summary[key];
	}

	function compareReports(beforeReport, afterReport) {
		const keys = [
			'totalBlockingMs',
			'longTaskCount',
			'worstLongTaskMs',
			'heapEndMB',
			'heapDeltaMB',
			'avgFrameMs',
			'worstFrameMs',
			'jankyFrames',
			'mutationObserversCreated',
			'netMutationObservers',
			'intervalsCreated',
			'netIntervals',
			'timeoutsCreated',
			'netTimeouts',
			'intervalCallbackTotalMs',
			'timeoutCallbackTotalMs',
			'rafCallbackTotalMs',
			'mutationObserverCallbackTotalMs',
			'slowEventTotalMs',
			'gcTotalMs',
			'saveRawCSSCacheCalls',
			'updateCustomDataCalls',
			'updateBlockAttributesCalls',
			'relationStyleTagsEnd',
			'styleCacheEntriesEnd',
		];

		const comparison = keys.map(key => {
			const beforeValue = pickComparisonValue(beforeReport, key);
			const afterValue = pickComparisonValue(afterReport, key);

			return {
				metric: key,
				before: beforeValue,
				after: afterValue,
				delta:
					Number.isFinite(beforeValue) && Number.isFinite(afterValue)
						? round(afterValue - beforeValue, 1)
						: null,
			};
		});

		console.table(comparison);
		return comparison;
	}

	function readStoredReports() {
		try {
			const raw = window.localStorage?.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : {};
		} catch (error) {
			return {};
		}
	}

	function writeStoredReports(reports) {
		try {
			window.localStorage?.setItem(
				STORAGE_KEY,
				JSON.stringify(reports)
			);
			return true;
		} catch (error) {
			console.warn(
				'[MaxiEditorBench] Failed to persist reports.',
				error
			);
			return false;
		}
	}

	api.start = options => {
		if (activeRun) {
			console.warn(
				'[MaxiEditorBench] A run is already active. Stop it before starting another one.'
			);
			return activeRun;
		}

		activeRun = createRun(options);

		console.log(
			'[MaxiEditorBench] Started. Interact with the editor now, then wait for auto-stop or call __maxiEditorBench.stop().'
		);

		return activeRun;
	};

	api.stop = () => {
		if (!activeRun) {
			console.warn('[MaxiEditorBench] No active run.');
			return api.lastReport || null;
		}

		return activeRun.stop('manual-stop');
	};

	api.compare = compareReports;
	api.save = name => {
		if (!name || typeof name !== 'string') {
			console.warn(
				'[MaxiEditorBench] Provide a report name, for example save("before").'
			);
			return false;
		}

		if (!api.lastReport) {
			console.warn('[MaxiEditorBench] No report available to save.');
			return false;
		}

		const reports = readStoredReports();
		reports[name] = api.lastReport;
		return writeStoredReports(reports);
	};

	api.load = name => {
		const reports = readStoredReports();
		return reports[name] || null;
	};

	api.listSaved = () => Object.keys(readStoredReports());
	api.clearSaved = name => {
		const reports = readStoredReports();

		if (name) {
			delete reports[name];
		} else {
			Object.keys(reports).forEach(key => {
				delete reports[key];
			});
		}

		return writeStoredReports(reports);
	};

	api.help = `
__maxiEditorBench.start({ durationMs: 30000 })
__maxiEditorBench.stop()
__maxiEditorBench.lastReport
__maxiEditorBench.save('before')
__maxiEditorBench.load('before')
__maxiEditorBench.listSaved()
__maxiEditorBench.compare(beforeReport, afterReport)
	`.trim();

	window.__maxiEditorBench = api;

	console.log(
		'[MaxiEditorBench] Ready. Run __maxiEditorBench.start({ durationMs: 30000 })'
	);
})();
