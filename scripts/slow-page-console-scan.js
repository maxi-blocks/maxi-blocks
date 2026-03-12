/*
 * Paste this entire file into the Chrome DevTools console on the slow page.
 *
 * It starts a 20 second scan immediately and exposes:
 * - __slowPageScan.start({ durationMs: 30000, trackAttributes: true })
 * - __slowPageScan.stop()
 * - __slowPageScan.lastReport
 */

(() => {
	const DEFAULTS = {
		durationMs: 20000,
		memorySampleMs: 1000,
		frameJankMs: 50,
		topItems: 12,
		trackAttributes: false,
	};

	const SUPPORTED_ENTRY_TYPES = Array.isArray(
		window.PerformanceObserver?.supportedEntryTypes
	)
		? window.PerformanceObserver.supportedEntryTypes
		: [];

	function round(value, digits = 1) {
		if (!Number.isFinite(value)) {
			return null;
		}

		const factor = 10 ** digits;
		return Math.round(value * factor) / factor;
	}

	function formatBytes(bytes) {
		if (!Number.isFinite(bytes) || bytes < 0) {
			return 'n/a';
		}

		if (bytes < 1024) {
			return `${bytes} B`;
		}

		const units = ['KB', 'MB', 'GB', 'TB'];
		let value = bytes / 1024;
		let unitIndex = 0;

		while (value >= 1024 && unitIndex < units.length - 1) {
			value /= 1024;
			unitIndex += 1;
		}

		return `${round(value, 2)} ${units[unitIndex]}`;
	}

	function safeArray(value) {
		return Array.isArray(value) ? value : [];
	}

	function toArray(listLike) {
		return Array.prototype.slice.call(listLike || []);
	}

	function getElementLabel(element) {
		if (!element || !element.tagName) {
			return '(unknown)';
		}

		const tag = element.tagName.toLowerCase();
		const id = element.id ? `#${element.id}` : '';
		const className =
			typeof element.className === 'string' && element.className.trim()
				? `.${element.className.trim().split(/\s+/).slice(0, 3).join('.')}`
				: '';

		return `${tag}${id}${className}`;
	}

	function getMutationLabel(node, parentNode) {
		if (node && node.nodeType === Node.ELEMENT_NODE) {
			return getElementLabel(node);
		}

		if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
			return `${getElementLabel(parentNode)} > text`;
		}

		return '(unknown)';
	}

	function getTopMapEntries(map, limit) {
		return Array.from(map.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([name, count]) => ({ name, count }));
	}

	function getTextNodeCount(root) {
		if (!root || !document.createTreeWalker) {
			return 0;
		}

		let count = 0;
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
			acceptNode(node) {
				return node.nodeValue && node.nodeValue.trim()
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP;
			},
		});

		while (walker.nextNode()) {
			count += 1;
		}

		return count;
	}

	function getMaxDepth(root) {
		if (!root) {
			return { maxDepth: 0, deepestNode: '(none)' };
		}

		let maxDepth = 1;
		let deepestNode = getElementLabel(root);
		const stack = [{ node: root, depth: 1 }];

		while (stack.length) {
			const current = stack.pop();
			const children = current.node.children;

			if (current.depth > maxDepth) {
				maxDepth = current.depth;
				deepestNode = getElementLabel(current.node);
			}

			for (let index = children.length - 1; index >= 0; index -= 1) {
				stack.push({
					node: children[index],
					depth: current.depth + 1,
				});
			}
		}

		return { maxDepth, deepestNode };
	}

	function getStylesheetStats() {
		const stylesheets = toArray(document.styleSheets);
		let accessibleRules = 0;
		let blockedRules = 0;

		stylesheets.forEach(sheet => {
			try {
				accessibleRules += sheet.cssRules ? sheet.cssRules.length : 0;
			} catch (error) {
				blockedRules += 1;
			}
		});

		return {
			stylesheetCount: stylesheets.length,
			accessibleRules,
			crossOriginStylesheets: blockedRules,
		};
	}

	function getDomSnapshot(topItems) {
		const allElements = document.getElementsByTagName('*');
		const tagCounts = new Map();
		let inlineScriptChars = 0;
		let inlineStyleChars = 0;
		let imageCount = 0;
		let iframeCount = 0;
		let videoCount = 0;

		for (let index = 0; index < allElements.length; index += 1) {
			const element = allElements[index];
			const tagName = element.tagName.toLowerCase();

			tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1);

			if (tagName === 'script' && !element.src) {
				inlineScriptChars += element.textContent?.length || 0;
			}

			if (tagName === 'style') {
				inlineStyleChars += element.textContent?.length || 0;
			}

			if (tagName === 'img') {
				imageCount += 1;
			}

			if (tagName === 'iframe') {
				iframeCount += 1;
			}

			if (tagName === 'video') {
				videoCount += 1;
			}
		}

		const bodyChildren = document.body
			? toArray(document.body.children)
					.map(child => ({
						element: getElementLabel(child),
						descendants: child.getElementsByTagName('*').length,
					}))
					.sort((a, b) => b.descendants - a.descendants)
					.slice(0, topItems)
			: [];

		const depth = getMaxDepth(document.body || document.documentElement);
		const stylesheetStats = getStylesheetStats();

		return {
			elementCount: allElements.length,
			textNodeCount: getTextNodeCount(document.body || document.documentElement),
			maxDepth: depth.maxDepth,
			deepestNode: depth.deepestNode,
			topTags: getTopMapEntries(tagCounts, topItems),
			bodyChildren,
			imageCount,
			iframeCount,
			videoCount,
			scriptCount: document.scripts.length,
			inlineScriptChars,
			inlineStyleChars,
			stylesheetCount: stylesheetStats.stylesheetCount,
			accessibleCssRules: stylesheetStats.accessibleRules,
			crossOriginStylesheets: stylesheetStats.crossOriginStylesheets,
		};
	}

	function getPerformanceMemory() {
		if (!performance.memory) {
			return null;
		}

		return {
			usedJSHeapSize: performance.memory.usedJSHeapSize,
			totalJSHeapSize: performance.memory.totalJSHeapSize,
			jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
		};
	}

	async function getUserAgentMemory() {
		if (typeof performance.measureUserAgentSpecificMemory !== 'function') {
			return null;
		}

		try {
			const result = await performance.measureUserAgentSpecificMemory();
			return {
				bytes: result.bytes,
				breakdown: safeArray(result.breakdown)
					.map(entry => ({
						bytes: entry.bytes,
						types: safeArray(entry.types).join(', ') || '(unknown)',
						attribution: safeArray(entry.attribution)
							.map(item => item?.scope || item?.url || '(unknown)')
							.join(', '),
					}))
					.sort((a, b) => b.bytes - a.bytes)
					.slice(0, 8),
			};
		} catch (error) {
			return {
				error: error.message,
			};
		}
	}

	function sanitizeResourceEntry(entry) {
		return {
			name: entry.name,
			initiatorType: entry.initiatorType || '(unknown)',
			duration: round(entry.duration, 1) || 0,
			transferSize: entry.transferSize || 0,
			decodedBodySize: entry.decodedBodySize || 0,
			encodedBodySize: entry.encodedBodySize || 0,
			startTime: round(entry.startTime, 1) || 0,
			nextHopProtocol: entry.nextHopProtocol || '',
		};
	}

	function summarizeResources(entries, topItems) {
		const byType = new Map();
		const byOrigin = new Map();
		let totalTransferSize = 0;
		let totalDecodedSize = 0;

		entries.forEach(entry => {
			const type = entry.initiatorType || '(unknown)';
			const origin = (() => {
				try {
					return new URL(entry.name, location.href).origin;
				} catch (error) {
					return '(invalid url)';
				}
			})();
			const transferSize = entry.transferSize || 0;
			const decodedBodySize = entry.decodedBodySize || 0;

			totalTransferSize += transferSize;
			totalDecodedSize += decodedBodySize;

			if (!byType.has(type)) {
				byType.set(type, {
					type,
					count: 0,
					transferSize: 0,
					decodedBodySize: 0,
					maxDuration: 0,
				});
			}

			if (!byOrigin.has(origin)) {
				byOrigin.set(origin, {
					origin,
					count: 0,
					transferSize: 0,
					decodedBodySize: 0,
				});
			}

			const typeBucket = byType.get(type);
			typeBucket.count += 1;
			typeBucket.transferSize += transferSize;
			typeBucket.decodedBodySize += decodedBodySize;
			typeBucket.maxDuration = Math.max(typeBucket.maxDuration, entry.duration || 0);

			const originBucket = byOrigin.get(origin);
			originBucket.count += 1;
			originBucket.transferSize += transferSize;
			originBucket.decodedBodySize += decodedBodySize;
		});

		return {
			count: entries.length,
			totalTransferSize,
			totalDecodedSize,
			byType: Array.from(byType.values())
				.sort((a, b) => b.transferSize - a.transferSize || b.count - a.count)
				.slice(0, topItems)
				.map(item => ({
					type: item.type,
					count: item.count,
					transferSize: formatBytes(item.transferSize),
					decodedBodySize: formatBytes(item.decodedBodySize),
					maxDurationMs: round(item.maxDuration, 1),
				})),
			byOrigin: Array.from(byOrigin.values())
				.sort((a, b) => b.transferSize - a.transferSize || b.count - a.count)
				.slice(0, topItems)
				.map(item => ({
					origin: item.origin,
					count: item.count,
					transferSize: formatBytes(item.transferSize),
					decodedBodySize: formatBytes(item.decodedBodySize),
				})),
			largest: entries
				.slice()
				.sort(
					(a, b) =>
						(b.transferSize || b.decodedBodySize || 0) -
						(a.transferSize || a.decodedBodySize || 0)
				)
				.slice(0, topItems)
				.map(item => ({
					type: item.initiatorType || '(unknown)',
					transferSize: formatBytes(item.transferSize || 0),
					decodedBodySize: formatBytes(item.decodedBodySize || 0),
					durationMs: round(item.duration || 0, 1),
					name: item.name,
				})),
		};
	}

	function summarizeLongTasks(longTasks, topItems) {
		const totalBlockingTime = longTasks.reduce(
			(total, entry) => total + Math.max(0, entry.duration - 50),
			0
		);

		return {
			count: longTasks.length,
			totalBlockingTime: round(totalBlockingTime, 1) || 0,
			worstDuration: round(
				Math.max(0, ...longTasks.map(entry => entry.duration)),
				1
			) || 0,
			top: longTasks
				.slice()
				.sort((a, b) => b.duration - a.duration)
				.slice(0, topItems)
				.map(entry => ({
					startMs: round(entry.startTime, 1),
					durationMs: round(entry.duration, 1),
					attribution: entry.attribution || '(unknown)',
				})),
		};
	}

	function summarizeMutations(mutationStats, topItems) {
		return {
			records: mutationStats.records,
			addedNodes: mutationStats.addedNodes,
			removedNodes: mutationStats.removedNodes,
			attributeChanges: mutationStats.attributeChanges,
			characterDataChanges: mutationStats.characterDataChanges,
			topRoots: getTopMapEntries(mutationStats.roots, topItems).map(entry => ({
				root: entry.name,
				changes: entry.count,
			})),
		};
	}

	function summarizeFrames(frameSamples, frameJankMs) {
		if (!frameSamples.length) {
			return {
				frameCount: 0,
				avgFrameMs: null,
				worstFrameMs: null,
				jankyFrames: 0,
				jankyFrameRatio: null,
				estimatedFps: null,
			};
		}

		const total = frameSamples.reduce((sum, sample) => sum + sample, 0);
		const jankyFrames = frameSamples.filter(
			sample => sample > frameJankMs
		).length;
		const avgFrameMs = total / frameSamples.length;

		return {
			frameCount: frameSamples.length,
			avgFrameMs: round(avgFrameMs, 2),
			worstFrameMs: round(Math.max(...frameSamples), 2),
			jankyFrames,
			jankyFrameRatio: round(jankyFrames / frameSamples.length, 3),
			estimatedFps: avgFrameMs ? round(1000 / avgFrameMs, 1) : null,
		};
	}

	function getNavigationSummary(lastLcp, clsValue) {
		const navigationEntry = performance.getEntriesByType('navigation')[0];
		const paintEntries = performance.getEntriesByType('paint');
		const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
		const firstContentfulPaint = paintEntries.find(
			entry => entry.name === 'first-contentful-paint'
		);

		if (!navigationEntry) {
			return {
				firstPaintMs: firstPaint ? round(firstPaint.startTime, 1) : null,
				firstContentfulPaintMs: firstContentfulPaint
					? round(firstContentfulPaint.startTime, 1)
					: null,
				largestContentfulPaintMs: lastLcp
					? round(lastLcp.startTime, 1)
					: null,
				cumulativeLayoutShift: round(clsValue, 4) || 0,
			};
		}

		return {
			redirectMs: round(navigationEntry.redirectEnd - navigationEntry.redirectStart),
			dnsMs: round(navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart),
			connectMs: round(navigationEntry.connectEnd - navigationEntry.connectStart),
			requestMs: round(navigationEntry.responseStart - navigationEntry.requestStart),
			responseMs: round(navigationEntry.responseEnd - navigationEntry.responseStart),
			domInteractiveMs: round(navigationEntry.domInteractive),
			domContentLoadedMs: round(navigationEntry.domContentLoadedEventEnd),
			loadEventMs: round(navigationEntry.loadEventEnd),
			firstPaintMs: firstPaint ? round(firstPaint.startTime, 1) : null,
			firstContentfulPaintMs: firstContentfulPaint
				? round(firstContentfulPaint.startTime, 1)
				: null,
			largestContentfulPaintMs: lastLcp ? round(lastLcp.startTime, 1) : null,
			cumulativeLayoutShift: round(clsValue, 4) || 0,
			transferSize: formatBytes(navigationEntry.transferSize || 0),
			decodedBodySize: formatBytes(navigationEntry.decodedBodySize || 0),
		};
	}

	function buildFindings(report) {
		const findings = [];
		const heapDelta = report.memory.deltaUsedJSHeapSize;
		const usedHeap = report.memory.endUsedJSHeapSize;
		const totalBlockingTime = report.longTasks.totalBlockingTime;
		const domCount = report.dom.end.elementCount;
		const domGrowth = report.dom.deltaElements;
		const resourceSummary = report.resources.all;
		const liveResourceSummary = report.resources.live;
		const jankRatio = report.frames.jankyFrameRatio || 0;

		if (usedHeap >= 1024 * 1024 * 500) {
			findings.push({
				severity: 'high',
				area: 'memory',
				message: `JS heap is very high at ${formatBytes(usedHeap)}.`,
			});
		}

		if (heapDelta >= 1024 * 1024 * 100) {
			findings.push({
				severity: 'high',
				area: 'memory',
				message: `Heap grew by ${formatBytes(heapDelta)} during the scan window.`,
			});
		}

		if (domCount >= 8000) {
			findings.push({
				severity: 'high',
				area: 'dom',
				message: `DOM is large with ${domCount.toLocaleString()} elements.`,
			});
		}

		if (domGrowth >= 1000) {
			findings.push({
				severity: 'medium',
				area: 'dom',
				message: `DOM grew by ${domGrowth.toLocaleString()} elements during the scan.`,
			});
		}

		if (totalBlockingTime >= 500) {
			findings.push({
				severity: 'high',
				area: 'main-thread',
				message: `Long tasks caused ${totalBlockingTime} ms of total blocking time.`,
			});
		}

		if (jankRatio >= 0.15) {
			findings.push({
				severity: 'medium',
				area: 'rendering',
				message: `About ${round(jankRatio * 100, 1)}% of frames were janky during the scan.`,
			});
		}

		if (resourceSummary.totalTransferSize >= 1024 * 1024 * 6) {
			findings.push({
				severity: 'medium',
				area: 'network',
				message: `Loaded resources total ${formatBytes(
					resourceSummary.totalTransferSize
				)} transferred.`,
			});
		}

		if (liveResourceSummary.totalTransferSize >= 1024 * 1024 * 2) {
			findings.push({
				severity: 'medium',
				area: 'network',
				message: `The page still transferred ${formatBytes(
					liveResourceSummary.totalTransferSize
				)} during the scan window.`,
			});
		}

		if (report.mutations.addedNodes + report.mutations.removedNodes >= 2000) {
			findings.push({
				severity: 'medium',
				area: 'dom-churn',
				message: `High DOM churn detected: ${
					report.mutations.addedNodes + report.mutations.removedNodes
				} nodes added or removed.`,
			});
		}

		if (!findings.length) {
			findings.push({
				severity: 'info',
				area: 'summary',
				message:
					'No single obvious bottleneck crossed the built-in thresholds. Check the detailed tables below.',
			});
		}

		return findings;
	}

	function printReport(report) {
		console.group('%c[SlowPageScan] Summary', 'color:#c0392b;font-weight:bold;');
		console.table([
			{
				url: report.url,
				durationMs: report.durationMs,
				readyState: report.readyState,
				startHeap: formatBytes(report.memory.startUsedJSHeapSize),
				endHeap: formatBytes(report.memory.endUsedJSHeapSize),
				heapDelta: formatBytes(report.memory.deltaUsedJSHeapSize),
				startElements: report.dom.start.elementCount,
				endElements: report.dom.end.elementCount,
				domDelta: report.dom.deltaElements,
				longTasks: report.longTasks.count,
				totalBlockingMs: report.longTasks.totalBlockingTime,
				jankyFrames: report.frames.jankyFrames,
				estimatedFps: report.frames.estimatedFps,
			},
		]);
		console.table(report.findings);
		console.groupEnd();

		console.group('%c[SlowPageScan] Navigation', 'color:#2980b9;font-weight:bold;');
		console.table([report.navigation]);
		console.groupEnd();

		console.group('%c[SlowPageScan] DOM', 'color:#16a085;font-weight:bold;');
		console.table([
			{
				startElements: report.dom.start.elementCount,
				endElements: report.dom.end.elementCount,
				deltaElements: report.dom.deltaElements,
				startTextNodes: report.dom.start.textNodeCount,
				endTextNodes: report.dom.end.textNodeCount,
				maxDepth: report.dom.end.maxDepth,
				deepestNode: report.dom.end.deepestNode,
				scripts: report.dom.end.scriptCount,
				stylesheets: report.dom.end.stylesheetCount,
				images: report.dom.end.imageCount,
				iframes: report.dom.end.iframeCount,
				videos: report.dom.end.videoCount,
			},
		]);
		console.table(report.dom.end.topTags);
		console.table(report.dom.end.bodyChildren);
		console.groupEnd();

		console.group('%c[SlowPageScan] Memory', 'color:#8e44ad;font-weight:bold;');
		console.table(report.memory.samples);
		if (report.memory.userAgent.start || report.memory.userAgent.end) {
			console.table([
				{
					startTotal: report.memory.userAgent.start?.bytes
						? formatBytes(report.memory.userAgent.start.bytes)
						: report.memory.userAgent.start?.error || 'n/a',
					endTotal: report.memory.userAgent.end?.bytes
						? formatBytes(report.memory.userAgent.end.bytes)
						: report.memory.userAgent.end?.error || 'n/a',
				},
			]);
		}
		if (safeArray(report.memory.userAgent.end?.breakdown).length) {
			console.table(
				report.memory.userAgent.end.breakdown.map(entry => ({
					bytes: formatBytes(entry.bytes),
					types: entry.types,
					attribution: entry.attribution,
				}))
			);
		}
		console.groupEnd();

		console.group('%c[SlowPageScan] Long Tasks', 'color:#d35400;font-weight:bold;');
		console.table([
			{
				count: report.longTasks.count,
				totalBlockingTimeMs: report.longTasks.totalBlockingTime,
				worstDurationMs: report.longTasks.worstDuration,
			},
		]);
		console.table(report.longTasks.top);
		console.groupEnd();

		console.group('%c[SlowPageScan] Mutations', 'color:#7f8c8d;font-weight:bold;');
		console.table([
			{
				records: report.mutations.records,
				addedNodes: report.mutations.addedNodes,
				removedNodes: report.mutations.removedNodes,
				attributeChanges: report.mutations.attributeChanges,
				characterDataChanges: report.mutations.characterDataChanges,
			},
		]);
		console.table(report.mutations.topRoots);
		console.groupEnd();

		console.group('%c[SlowPageScan] Resources', 'color:#27ae60;font-weight:bold;');
		console.table([
			{
				totalResources: report.resources.all.count,
				totalTransferSize: formatBytes(report.resources.all.totalTransferSize),
				totalDecodedSize: formatBytes(report.resources.all.totalDecodedSize),
				liveResources: report.resources.live.count,
				liveTransferSize: formatBytes(report.resources.live.totalTransferSize),
			},
		]);
		console.table(report.resources.all.byType);
		console.table(report.resources.all.byOrigin);
		console.table(report.resources.all.largest);
		if (report.resources.live.count) {
			console.table(report.resources.live.largest);
		}
		console.groupEnd();

		console.log(
			'%c[SlowPageScan] Report saved to window.__slowPageScan.lastReport',
			'color:#2c3e50;font-weight:bold;'
		);
	}

	function createApi() {
		const api = window.__slowPageScan || {};
		let currentRun = null;

		function stop(reason = 'manual') {
			if (!currentRun) {
				return Promise.resolve(null);
			}

			return currentRun.stop(reason);
		}

		function start(userOptions = {}) {
			if (currentRun) {
				currentRun.stop('restarted');
			}

			const options = { ...DEFAULTS, ...userOptions };
			const startedAt = performance.now();
			const startedAtIso = new Date().toISOString();
			const liveResources = [];
			const longTasks = [];
			const frameSamples = [];
			const mutationStats = {
				records: 0,
				addedNodes: 0,
				removedNodes: 0,
				attributeChanges: 0,
				characterDataChanges: 0,
				roots: new Map(),
			};
			const memorySamples = [];
			let lastLcp = null;
			let clsValue = 0;
			let timeoutId = null;
			let memoryIntervalId = null;
			let rafId = null;
			let lastFrameTime = null;
			let finished = false;

			const allResourcesAtStart = performance
				.getEntriesByType('resource')
				.map(sanitizeResourceEntry);
			const domAtStart = getDomSnapshot(options.topItems);
			const jsMemoryAtStart = getPerformanceMemory();
			const userAgentMemoryStartPromise = getUserAgentMemory();

			if (typeof performance.setResourceTimingBufferSize === 'function') {
				performance.setResourceTimingBufferSize(
					Math.max(5000, allResourcesAtStart.length + 1000)
				);
			}

			function captureMemorySample(label) {
				const memory = getPerformanceMemory();

				if (!memory) {
					return;
				}

				memorySamples.push({
					label,
					atMs: round(performance.now() - startedAt, 1),
					usedJSHeapSize: memory.usedJSHeapSize,
					totalJSHeapSize: memory.totalJSHeapSize,
					jsHeapSizeLimit: memory.jsHeapSizeLimit,
					usedJSHeapSizeLabel: formatBytes(memory.usedJSHeapSize),
					totalJSHeapSizeLabel: formatBytes(memory.totalJSHeapSize),
				});
			}

			function rememberMutation(label) {
				mutationStats.roots.set(label, (mutationStats.roots.get(label) || 0) + 1);
			}

			function observeEntryType(entryType, callback) {
				if (
					!window.PerformanceObserver ||
					!SUPPORTED_ENTRY_TYPES.includes(entryType)
				) {
					return null;
				}

				try {
					const observer = new PerformanceObserver(list => {
						list.getEntries().forEach(callback);
					});

					observer.observe({ type: entryType, buffered: true });
					return observer;
				} catch (error) {
					return null;
				}
			}

			const longTaskObserver = observeEntryType('longtask', entry => {
				longTasks.push({
					startTime: entry.startTime,
					duration: entry.duration,
					attribution: safeArray(entry.attribution)
						.map(item =>
							[
								item.name,
								item.containerType,
								item.containerName,
								item.containerId,
								item.containerSrc,
							]
								.filter(Boolean)
								.join(' ')
						)
						.filter(Boolean)
						.join(' | '),
				});
			});

			const resourceObserver = observeEntryType('resource', entry => {
				if (entry.startTime < startedAt) {
					return;
				}

				liveResources.push(sanitizeResourceEntry(entry));
			});

			const layoutShiftObserver = observeEntryType('layout-shift', entry => {
				if (!entry.hadRecentInput) {
					clsValue += entry.value || 0;
				}
			});

			const lcpObserver = observeEntryType(
				'largest-contentful-paint',
				entry => {
					lastLcp = entry;
				}
			);

			const mutationObserver =
				window.MutationObserver && document.documentElement
					? new MutationObserver(records => {
							mutationStats.records += records.length;

							records.forEach(record => {
								if (record.type === 'childList') {
									mutationStats.addedNodes += record.addedNodes.length;
									mutationStats.removedNodes += record.removedNodes.length;

									toArray(record.addedNodes).forEach(node => {
										rememberMutation(
											getMutationLabel(node, record.target)
										);
									});
									toArray(record.removedNodes).forEach(node => {
										rememberMutation(
											getMutationLabel(node, record.target)
										);
									});
								}

								if (record.type === 'attributes') {
									mutationStats.attributeChanges += 1;
									rememberMutation(getElementLabel(record.target));
								}

								if (record.type === 'characterData') {
									mutationStats.characterDataChanges += 1;
									rememberMutation(getMutationLabel(record.target, record.target.parentNode));
								}
							});
					  })
					: null;

			if (mutationObserver) {
				mutationObserver.observe(document.documentElement, {
					subtree: true,
					childList: true,
					characterData: true,
					attributes: Boolean(options.trackAttributes),
				});
			}

			function trackFrames(timestamp) {
				if (finished) {
					return;
				}

				if (lastFrameTime !== null) {
					frameSamples.push(timestamp - lastFrameTime);
				}

				lastFrameTime = timestamp;
				rafId = requestAnimationFrame(trackFrames);
			}

			function cleanup() {
				finished = true;

				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				if (memoryIntervalId) {
					clearInterval(memoryIntervalId);
				}

				if (rafId) {
					cancelAnimationFrame(rafId);
				}

				safeArray([
					longTaskObserver,
					resourceObserver,
					layoutShiftObserver,
					lcpObserver,
					mutationObserver,
				]).forEach(observer => {
					try {
						observer.disconnect();
					} catch (error) {
						// Ignore observer cleanup failures.
					}
				});
			}

			captureMemorySample('start');
			memoryIntervalId = window.setInterval(() => {
				captureMemorySample('sample');
			}, options.memorySampleMs);
			rafId = requestAnimationFrame(trackFrames);

			let finishRun;
			const done = new Promise(resolve => {
				finishRun = async reason => {
					if (finished) {
						return;
					}

					cleanup();
					captureMemorySample(reason === 'duration-complete' ? 'end' : 'stop');

					const allResourcesAtEnd = performance
						.getEntriesByType('resource')
						.map(sanitizeResourceEntry);
					const domAtEnd = getDomSnapshot(options.topItems);
					const jsMemoryAtEnd = getPerformanceMemory();
					const [userAgentMemoryStart, userAgentMemoryEnd] = await Promise.all([
						userAgentMemoryStartPromise,
						getUserAgentMemory(),
					]);

					const report = {
						reason,
						url: location.href,
						title: document.title,
						readyState: document.readyState,
						startedAt: startedAtIso,
						durationMs: round(performance.now() - startedAt, 1),
						navigation: getNavigationSummary(lastLcp, clsValue),
						dom: {
							start: domAtStart,
							end: domAtEnd,
							deltaElements:
								(domAtEnd.elementCount || 0) - (domAtStart.elementCount || 0),
							deltaTextNodes:
								(domAtEnd.textNodeCount || 0) -
								(domAtStart.textNodeCount || 0),
						},
						memory: {
							startUsedJSHeapSize: jsMemoryAtStart?.usedJSHeapSize ?? null,
							endUsedJSHeapSize: jsMemoryAtEnd?.usedJSHeapSize ?? null,
							deltaUsedJSHeapSize:
								(jsMemoryAtEnd?.usedJSHeapSize ?? 0) -
								(jsMemoryAtStart?.usedJSHeapSize ?? 0),
							samples: memorySamples.map(sample => ({
								label: sample.label,
								atMs: sample.atMs,
								usedJSHeapSize: sample.usedJSHeapSizeLabel,
								totalJSHeapSize: sample.totalJSHeapSizeLabel,
								jsHeapSizeLimit: formatBytes(sample.jsHeapSizeLimit),
							})),
							userAgent: {
								start: userAgentMemoryStart,
								end: userAgentMemoryEnd,
							},
						},
						longTasks: summarizeLongTasks(longTasks, options.topItems),
						frames: summarizeFrames(
							frameSamples,
							options.frameJankMs
						),
						mutations: summarizeMutations(mutationStats, options.topItems),
						resources: {
							all: summarizeResources(allResourcesAtEnd, options.topItems),
							live: summarizeResources(liveResources, options.topItems),
							initialEntryCount: allResourcesAtStart.length,
							finalEntryCount: allResourcesAtEnd.length,
						},
						options,
					};

					report.findings = buildFindings(report);
					api.lastReport = report;
					printReport(report);

					if (currentRun === runState) {
						currentRun = null;
						api.currentRun = null;
						api.done = null;
					}

					resolve(report);
				};

				timeoutId = window.setTimeout(() => {
					finishRun('duration-complete');
				}, options.durationMs);
			});

			const runState = {
				options,
				done,
				stop: reason => finishRun(reason),
			};
			currentRun = runState;

			console.log(
				`[SlowPageScan] Running for ${Math.round(
					options.durationMs / 1000
				)}s. Interact with the page now, then check the tables when it finishes.`
			);

			api.currentRun = runState;
			api.stop = stop;
			api.start = start;
			api.done = done;
			api.snapshot = () => ({
				url: location.href,
				title: document.title,
				readyState: document.readyState,
				dom: getDomSnapshot(options.topItems),
				memory: getPerformanceMemory(),
				resources: summarizeResources(
					performance.getEntriesByType('resource').map(sanitizeResourceEntry),
					options.topItems
				),
			});

			return runState;
		}

		api.start = start;
		api.stop = stop;
		api.lastReport = api.lastReport || null;
		api.currentRun = currentRun;

		return api;
	}

	const api = createApi();
	window.__slowPageScan = api;
	api.start();
})();
