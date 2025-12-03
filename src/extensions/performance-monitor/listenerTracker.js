/**
 * Listener Tracker
 * Tracks event listeners, MutationObservers, and subscriptions
 *
 * @package
 */

import performanceMonitor from './index';

/**
 * Listener Tracker Class
 * Manages tracking of all event listeners and observers
 */
class ListenerTracker {
	constructor() {
		this.listeners = new Map();
		this.observers = new Map();
		this.subscriptions = new Map();
		this.nextId = 0;
	}

	/**
	 * Generate unique ID for tracking
	 *
	 * @returns {string} Unique ID
	 */
	generateId() {
		return `listener-${this.nextId++}`;
	}

	/**
	 * Track an event listener
	 *
	 * @param {string} target    - Target element/object description
	 * @param {string} eventType - Event type
	 * @param {string} context   - Context (component name, file, etc.)
	 * @returns {string} Listener ID
	 */
	trackEventListener(target, eventType, context = 'unknown') {
		if (!window.maxiDebugPerformance) return null;

		const id = this.generateId();
		const listenerData = {
			id,
			type: 'event_listener',
			target,
			eventType,
			context,
			timestamp: performance.now(),
			stack: new Error().stack,
		};

		this.listeners.set(id, listenerData);

		// Update metrics
		if (performanceMonitor.isEnabled()) {
			performanceMonitor.metrics.listeners.total++;
			performanceMonitor.metrics.listeners.eventListeners++;
			performanceMonitor.metrics.listeners.active.push(listenerData);
		}

		console.log(
			`%c[Listener Tracker] Added event listener: ${eventType} on ${target} (${context})`,
			'color: #2196F3;',
			JSON.stringify({ id, eventType, target, context })
		);

		return id;
	}

	/**
	 * Track a MutationObserver
	 *
	 * @param {string} target  - Target element description
	 * @param {Object} config  - Observer configuration
	 * @param {string} context - Context (component name, file, etc.)
	 * @returns {string} Observer ID
	 */
	trackMutationObserver(target, config, context = 'unknown') {
		if (!window.maxiDebugPerformance) return null;

		const id = this.generateId();
		const observerData = {
			id,
			type: 'mutation_observer',
			target,
			config,
			context,
			timestamp: performance.now(),
			stack: new Error().stack,
		};

		this.observers.set(id, observerData);

		// Update metrics
		if (performanceMonitor.isEnabled()) {
			performanceMonitor.metrics.listeners.total++;
			performanceMonitor.metrics.listeners.mutationObservers++;
			performanceMonitor.metrics.listeners.active.push(observerData);
		}

		console.log(
			`%c[Listener Tracker] Added MutationObserver on ${target} (${context})`,
			'color: #2196F3;',
			JSON.stringify({ id, target, config, context })
		);

		return id;
	}

	/**
	 * Track a WordPress data store subscription
	 *
	 * @param {string} store   - Store name
	 * @param {string} context - Context (component name, etc.)
	 * @returns {string} Subscription ID
	 */
	trackSubscription(store, context = 'unknown') {
		if (!window.maxiDebugPerformance) return null;

		const id = this.generateId();
		const subscriptionData = {
			id,
			type: 'subscription',
			store,
			context,
			timestamp: performance.now(),
			stack: new Error().stack,
		};

		this.subscriptions.set(id, subscriptionData);

		// Update metrics
		if (performanceMonitor.isEnabled()) {
			performanceMonitor.metrics.listeners.total++;
			performanceMonitor.metrics.listeners.subscriptions++;
			performanceMonitor.metrics.listeners.active.push(subscriptionData);
		}

		console.log(
			`%c[Listener Tracker] Added subscription to ${store} (${context})`,
			'color: #2196F3;',
			JSON.stringify({ id, store, context })
		);

		return id;
	}

	/**
	 * Remove tracked event listener
	 *
	 * @param {string} id - Listener ID
	 */
	removeEventListener(id) {
		if (!window.maxiDebugPerformance || !id) return;

		const listener = this.listeners.get(id);
		if (listener) {
			this.listeners.delete(id);

			// Update metrics
			if (performanceMonitor.isEnabled()) {
				performanceMonitor.metrics.listeners.total--;
				performanceMonitor.metrics.listeners.eventListeners--;
				performanceMonitor.metrics.listeners.active =
					performanceMonitor.metrics.listeners.active.filter(
						l => l.id !== id
					);
			}

			console.log(
				`%c[Listener Tracker] Removed event listener: ${listener.eventType} on ${listener.target} (${listener.context})`,
				'color: #4CAF50;',
				JSON.stringify({ id })
			);
		}
	}

	/**
	 * Remove tracked MutationObserver
	 *
	 * @param {string} id - Observer ID
	 */
	removeMutationObserver(id) {
		if (!window.maxiDebugPerformance || !id) return;

		const observer = this.observers.get(id);
		if (observer) {
			this.observers.delete(id);

			// Update metrics
			if (performanceMonitor.isEnabled()) {
				performanceMonitor.metrics.listeners.total--;
				performanceMonitor.metrics.listeners.mutationObservers--;
				performanceMonitor.metrics.listeners.active =
					performanceMonitor.metrics.listeners.active.filter(
						l => l.id !== id
					);
			}

			console.log(
				`%c[Listener Tracker] Removed MutationObserver on ${observer.target} (${observer.context})`,
				'color: #4CAF50;',
				JSON.stringify({ id })
			);
		}
	}

	/**
	 * Remove tracked subscription
	 *
	 * @param {string} id - Subscription ID
	 */
	removeSubscription(id) {
		if (!window.maxiDebugPerformance || !id) return;

		const subscription = this.subscriptions.get(id);
		if (subscription) {
			this.subscriptions.delete(id);

			// Update metrics
			if (performanceMonitor.isEnabled()) {
				performanceMonitor.metrics.listeners.total--;
				performanceMonitor.metrics.listeners.subscriptions--;
				performanceMonitor.metrics.listeners.active =
					performanceMonitor.metrics.listeners.active.filter(
						l => l.id !== id
					);
			}

			console.log(
				`%c[Listener Tracker] Removed subscription to ${subscription.store} (${subscription.context})`,
				'color: #4CAF50;',
				JSON.stringify({ id })
			);
		}
	}

	/**
	 * Get all active listeners
	 *
	 * @returns {Object} Active listeners summary
	 */
	getActiveListeners() {
		return {
			eventListeners: Array.from(this.listeners.values()),
			mutationObservers: Array.from(this.observers.values()),
			subscriptions: Array.from(this.subscriptions.values()),
			total:
				this.listeners.size +
				this.observers.size +
				this.subscriptions.size,
		};
	}

	/**
	 * Detect potential listener leaks
	 *
	 * @returns {Array} Array of potential leaks
	 */
	detectLeaks() {
		const leaks = [];
		const now = performance.now();

		// Check for long-lived listeners (> 5 minutes)
		const oldThreshold = 5 * 60 * 1000; // 5 minutes

		[...this.listeners.values()].forEach(listener => {
			if (now - listener.timestamp > oldThreshold) {
				leaks.push({
					type: 'old_event_listener',
					data: listener,
					age: now - listener.timestamp,
				});
			}
		});

		[...this.observers.values()].forEach(observer => {
			if (now - observer.timestamp > oldThreshold) {
				leaks.push({
					type: 'old_mutation_observer',
					data: observer,
					age: now - observer.timestamp,
				});
			}
		});

		return leaks;
	}

	/**
	 * Report listener status
	 */
	report() {
		const active = this.getActiveListeners();
		const leaks = this.detectLeaks();

		console.log(
			'%c=== Listener Tracker Report ===',
			'background: #9C27B0; color: white; font-weight: bold; padding: 4px 8px;'
		);
		console.log(`Total Active Listeners: ${active.total}`);
		console.log(`  Event Listeners: ${active.eventListeners.length}`);
		console.log(`  MutationObservers: ${active.mutationObservers.length}`);
		console.log(`  Subscriptions: ${active.subscriptions.length}`);
		console.log(`Potential Leaks: ${leaks.length}`);

		if (leaks.length > 0) {
			console.log(
				'%cPotential Leaks:',
				'color: #FF9800; font-weight: bold;'
			);
			leaks.forEach(leak => {
				console.log(
					`  [${leak.type}] ${leak.data.context} - Age: ${(
						leak.age /
						1000 /
						60
					).toFixed(2)} minutes`
				);
			});
		}

		console.log(
			'%c==============================',
			'background: #9C27B0; color: white; font-weight: bold; padding: 4px 8px;'
		);

		return { active, leaks };
	}
}

// Create singleton instance
const listenerTracker = new ListenerTracker();

export default listenerTracker;
