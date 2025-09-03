/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ContentLoader } from '@components';

const SuspendedBlock = ({ onMountBlock, clientId }) => {
	useEffect(() => onMountBlock(), [onMountBlock]);

	const { getBlocks } = useSelect(select => {
		const { getBlocks } = select('core/block-editor');
		return { getBlocks };
	}, []);

	const getAllMaxiBlocks = blocks => {
		return blocks.reduce((maxiBlocks, block) => {
			if (block.name.includes('maxi-blocks')) {
				maxiBlocks.push(block);
			}

			if (block.innerBlocks?.length) {
				maxiBlocks.push(...getAllMaxiBlocks(block.innerBlocks));
			}

			return maxiBlocks;
		}, []);
	};

	const allBlocks = getBlocks();
	const maxiBlocks = getAllMaxiBlocks(allBlocks);

	const shouldShowLoader = maxiBlocks.some(block => {
		return block.clientId === clientId;
	});

	if (shouldShowLoader) {
		return <ContentLoader cloud={false} />;
	}

	return null;
};

const withMaxiLoader = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			if (!ownProps) return null;
			const {
				clientId,
				attributes: { uniqueID },
			} = ownProps;

			const { canBlockRender, isPageLoaded } = useSelect(select => {
				const maxiBlocksSelect = select('maxiBlocks');
				return {
					canBlockRender: maxiBlocksSelect.canBlockRender,
					isPageLoaded: maxiBlocksSelect.getIsPageLoaded(),
				};
			}, []);

			const [hasBeenConsolidated, setHasBeenConsolidated] =
				useState(false);

			const [canRender, setCanRender] = useState(
				canBlockRender(uniqueID, clientId)
			);

			// Only log for specific problematic blocks
			const shouldLog =
				uniqueID === 'text-maxi-9ffa918d-u' ||
				uniqueID === 'group-maxi-220cd5ba-u';

			// Track loading start time
			const [loadingStartTime] = useState(() => {
				if (shouldLog && !canBlockRender(uniqueID, clientId)) {
					console.log(
						`🔄 [LOADER-${uniqueID}] Block loading started (showing loader)`
					);
					return performance.now();
				}
				return null;
			});

			useEffect(() => {
				if (canRender && hasBeenConsolidated) return;

				if (shouldLog) {
					console.log(
						`🔍 [LOADER-${uniqueID}] Checking render conditions - isPageLoaded: ${isPageLoaded}, canBlockRender: ${canBlockRender(
							uniqueID,
							clientId
						)}`
					);

					// If conditions are met, start aggressive monitoring to catch the delay
					if (canBlockRender(uniqueID, clientId) && isPageLoaded) {
						console.log(
							`🚨 [LOADER-${uniqueID}] CONDITIONS MET! React should render now. Starting aggressive monitoring...`
						);

						// Monitor every 100ms to catch exactly when React renders
						let checkCount = 0;
						const aggressiveMonitor = setInterval(() => {
							checkCount++;
							console.log(
								`🔍 [LOADER-${uniqueID}] Aggressive check ${checkCount}: Still waiting for React render at ${performance.now()}`
							);

							if (checkCount >= 600) {
								// Stop after 60 seconds (600 * 100ms)
								clearInterval(aggressiveMonitor);
								console.log(
									`🚨 [LOADER-${uniqueID}] Gave up aggressive monitoring after 60 seconds`
								);
							}
						}, 100);

						// Clear the monitor when component renders
						window[`clearMonitor_${uniqueID}`] = () => {
							clearInterval(aggressiveMonitor);
							console.log(
								`✅ [LOADER-${uniqueID}] Aggressive monitoring cleared - component rendered!`
							);
						};
					}
				}

				const checkRender = () => {
					const canRenderNow = canBlockRender(uniqueID, clientId);

					if (shouldLog) {
						console.log(
							`🔄 [LOADER-${uniqueID}] checkRender polling at ${performance
								.now()
								.toFixed(
									2
								)}ms - canBlockRender: ${canRenderNow}`
						);
					}

					if (canRenderNow) {
						if (shouldLog && loadingStartTime) {
							const loadingEndTime = performance.now();
							console.log(
								`✅ [LOADER-${uniqueID}] Block loading completed (hiding loader): ${(
									loadingEndTime - loadingStartTime
								).toFixed(2)}ms`
							);
						}
						setCanRender(true);
						setHasBeenConsolidated(true);
					} else {
						if (shouldLog) {
							console.log(
								`⏳ [LOADER-${uniqueID}] Still waiting, will check again in 100ms`
							);
						}
						setTimeout(checkRender, 100);
					}
				};

				checkRender();
			}, [
				canRender,
				hasBeenConsolidated,
				canBlockRender,
				uniqueID,
				clientId,
				shouldLog,
				loadingStartTime,
				isPageLoaded,
			]);

			const onMountBlock = useCallback(() => {
				if (shouldLog && loadingStartTime) {
					const loadingEndTime = performance.now();
					console.log(
						`🚀 [LOADER-${uniqueID}] Block mounted (onMountBlock triggered): ${(
							loadingEndTime - loadingStartTime
						).toFixed(2)}ms`
					);

					// Start monitoring main thread during the freeze
					let monitorCount = 0;
					const monitorInterval = setInterval(() => {
						monitorCount += 1;
						const elapsed = (
							performance.now() - loadingStartTime
						).toFixed(2);
						console.log(
							`⏰ [MONITOR-${uniqueID}] Main thread check ${monitorCount}: ${elapsed}ms elapsed`
						);

						// Log memory usage and React fiber info
						if (window.performance && window.performance.memory) {
							const { memory } = window.performance;
							console.log(
								`💾 [MONITOR-${uniqueID}] Memory - Used: ${(
									memory.usedJSHeapSize /
									1024 /
									1024
								).toFixed(1)}MB, Limit: ${(
									memory.jsHeapSizeLimit /
									1024 /
									1024
								).toFixed(1)}MB`
							);
						}

						// Check if React is busy with other renders
						const reactFiberNodes = document.querySelectorAll(
							'[data-reactroot], [data-react-helmet]'
						).length;
						console.log(
							`⚛️ [MONITOR-${uniqueID}] React nodes in DOM: ${reactFiberNodes}, Current time: ${new Date().toISOString()}`
						);

						// If we've been waiting too long and isPageLoaded is still false, force it to true
						if (monitorCount === 2 && !isPageLoaded) {
							// After 10 seconds
							console.log(
								`🚨 [MONITOR-${uniqueID}] Forcing isPageLoaded to true after 10 seconds of waiting`
							);
							const { dispatch } = wp.data;
							dispatch('maxiBlocks').setIsPageLoaded(true);
						}

						// Stop monitoring after 2 minutes or when component renders
						if (monitorCount >= 24) {
							// 24 * 5 seconds = 2 minutes
							clearInterval(monitorInterval);
						}
					}, 5000); // Log every 5 seconds

					// Store interval ID to clear it when component renders
					setTimeout(() => {
						clearInterval(monitorInterval);
					}, 120000); // Clear after 2 minutes max
				}

				// Log immediately before state changes
				if (shouldLog) {
					console.log(
						`🔧 [LOADER-${uniqueID}] About to set state - hasBeenConsolidated=true, canRender=true at ${performance.now()}`
					);
				}

				setHasBeenConsolidated(true);
				setCanRender(true);

				// Log immediately after state changes and schedule periodic checks
				if (shouldLog) {
					console.log(
						`✅ [LOADER-${uniqueID}] State set complete at: ${performance.now()}`
					);

					// Schedule checks to see when component actually renders
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 100ms after state change - checking if rendered`
							),
						100
					);
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 1 second after state change`
							),
						1000
					);
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 5 seconds after state change`
							),
						5000
					);
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 10 seconds after state change`
							),
						10000
					);
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 30 seconds after state change`
							),
						30000
					);
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 60 seconds after state change`
							),
						60000
					);
					setTimeout(
						() =>
							console.log(
								`⏱️ [LOADER-${uniqueID}] 90 seconds after state change`
							),
						90000
					);
				}
			}, [shouldLog, loadingStartTime, uniqueID]);

			if (canRender && hasBeenConsolidated) {
				if (shouldLog && loadingStartTime) {
					const renderStartTime = performance.now();
					console.log(
						`🎯 [LOADER-${uniqueID}] FINALLY RENDERING! React decided to render at: ${renderStartTime} (total loading time): ${(
							renderStartTime - loadingStartTime
						).toFixed(2)}ms`
					);
					console.log(
						`🔚 [MONITOR-${uniqueID}] Component is rendering - freeze ended`
					);
				}

				if (shouldLog) {
					console.log(
						`🚀 [LOADER-${uniqueID}] Creating WrappedComponent now...`
					);

					// Clear the aggressive monitor
					if (window[`clearMonitor_${uniqueID}`]) {
						window[`clearMonitor_${uniqueID}`]();
						delete window[`clearMonitor_${uniqueID}`];
					}
				}

				return <WrappedComponent {...ownProps} />;
			}

			return (
				<SuspendedBlock
					onMountBlock={onMountBlock}
					clientId={clientId}
				/>
			);
		}),
	'withMaxiLoader'
);

export default withMaxiLoader;
