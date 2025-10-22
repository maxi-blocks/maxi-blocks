/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, select, dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import MaxiStyleCardsEditorPopUp from '@editor/style-cards';
import MaxiExportEditorPopUp from '@editor/export';
import { Button, Icon } from '@components';
import { setScreenSize } from '@extensions/styles';
import {
	getIsSiteEditor,
	getSiteEditorIframeBody,
	getIsTemplatePart,
} from '@extensions/fse';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';

/**
 * Styles
 */
import './editor.scss';
import {
	xsMode,
	xlMode,
	xllMode,
	largeMode,
	mediumMode,
	smallMode,
	cloudLib,
	closeIcon,
	helpIcon,
} from '@maxi-icons';

/**
 * Components
 */
const ResponsiveButton = ({
	baseBreakpoint,
	icon,
	tooltipValue,
	breakpoint,
	target,
	updateNativeResponsiveState,
}) => {
	const isBaseBreakpoint = baseBreakpoint === target;

	const classes = classnames(
		'maxi-responsive-selector__button-wrapper',
		isBaseBreakpoint && 'maxi-responsive-selector__base'
	);

	const getIsPressed = () => {
		if (breakpoint === 'general') return baseBreakpoint === target;

		return breakpoint === target;
	};

	return (
		<div className={classes}>
			<Button
				className='maxi-responsive-selector__button-item'
				onClick={() => {
					const targetSize = isBaseBreakpoint ? 'general' : target;

					if (getIsTemplatePart()) setScreenSize(target);
					else setScreenSize(targetSize);

					// Update the native Gutenberg responsive selector
					if (updateNativeResponsiveState) {
						updateNativeResponsiveState(targetSize);
					}
				}}
				aria-pressed={getIsPressed()}
			>
				<div>
					{tooltipValue && (
						<div className='responsive-button-tooltip'>
							{tooltipValue}
						</div>
					)}
					{icon}
					{isBaseBreakpoint && (
						<>
							<div className='maxi-tabs-control__notification' />
							<div className='maxi-responsive-selector__button-current-size'>
								{__('Your size', 'maxi-blocks')}
							</div>
						</>
					)}
				</div>
			</Button>
		</div>
	);
};

const ResponsiveSelector = props => {
	const { className, isOpen, onClose } = props;

	const settingsRef = useRef(null);

	const { insertBlock } = useDispatch('core/block-editor');

	const {
		deviceType,
		breakpoints,
		baseBreakpoint,
		isListViewOpened,
		isInserterOpened,
	} = useSelect(select => {
		const {
			receiveMaxiDeviceType,
			receiveMaxiBreakpoints,
			receiveBaseBreakpoint,
		} = select('maxiBlocks');
		// Fallback logic for determining which selector to use
		let listViewOpenedSelector;
		let inserterOpenedSelector;
		if (select('core/editor')) {
			listViewOpenedSelector = select('core/editor').isListViewOpened;
			inserterOpenedSelector = select('core/editor').isInserterOpened;
		} else if (select('core/edit-post')) {
			listViewOpenedSelector = select('core/edit-post').isListViewOpened;
			inserterOpenedSelector = select('core/edit-post').isInserterOpened;
		} else if (select('core/edit-site')) {
			listViewOpenedSelector = select('core/edit-site').isListViewOpened;
			inserterOpenedSelector = select('core/edit-site').isInserterOpened;
		}

		const baseBreakpoint = receiveBaseBreakpoint();

		return {
			deviceType: receiveMaxiDeviceType(),
			breakpoints: receiveMaxiBreakpoints(),
			baseBreakpoint,
			isListViewOpened: listViewOpenedSelector
				? listViewOpenedSelector()
				: false,
			isInserterOpened: inserterOpenedSelector
				? inserterOpenedSelector()
				: false,
		};
	});

	useEffect(() => {
		const secondSidebar = document.querySelector(
			'.interface-interface-skeleton__secondary-sidebar'
		);

		if (secondSidebar && isOpen) secondSidebar.style.marginTop = '41px'; // the height Maxi topbar does

		return () => {
			if (secondSidebar) secondSidebar.style.marginTop = '0';
		};
	}, [isListViewOpened, isInserterOpened, isOpen]);

	// TODO: check if it can be reduced to avoid the amount of resources used (MVP)
	useEffect(() => {
		// Ensure the editor wrapper has the Maxi responsive attribute
		const editorWrapper =
			document.querySelector('.edit-post-visual-editor') ||
			document.querySelector('.edit-site-visual-editor') ||
			document.querySelector('.editor-visual-editor');

		[editorWrapper, getSiteEditorIframeBody()].forEach(wrapper => {
			if (
				wrapper &&
				!wrapper.getAttributeNames().includes('maxi-blocks-responsive')
			)
				wrapper.setAttribute('maxi-blocks-responsive', baseBreakpoint);
		});
	});

	// Function to update the native Gutenberg responsive selector state
	const updateNativeResponsiveState = useCallback(targetSize => {
		// Map MaxiBlocks breakpoints to Gutenberg device types
		const sizeToDeviceType = {
			general: 'Desktop',
			xxl: 'Desktop',
			xl: 'Desktop',
			l: 'Desktop',
			m: 'Tablet',
			s: 'Tablet',
			xs: 'Mobile',
		};
		const deviceType = sizeToDeviceType[targetSize];

		// Update Gutenberg's device type using the data store
		// This will cause React to re-render with the correct checkmark
		// Don't try to manipulate the DOM manually - let React handle it
		try {
			// For post editor
			if (select('core/editor')) {
				const { __experimentalSetPreviewDeviceType } =
					dispatch('core/editor');
				if (__experimentalSetPreviewDeviceType) {
					__experimentalSetPreviewDeviceType(deviceType);
				}
			}
		} catch (e) {
			// Silently fail if editor store not available
		}

		try {
			// For site editor
			if (select('core/edit-site')) {
				const { __experimentalSetPreviewDeviceType } =
					dispatch('core/edit-site');
				if (__experimentalSetPreviewDeviceType) {
					__experimentalSetPreviewDeviceType(deviceType);
				}
			}
		} catch (e) {
			// Silently fail if site editor store not available
		}
	}, []);

	// Track when native buttons are clicked to avoid conflicts
	const lastNativeClickRef = useRef(0);

	const onChangeNativeResponsive = useCallback(button => {
		button.addEventListener(
			'click',
			() => {
				// Record that a native button was just clicked
				lastNativeClickRef.current = Date.now();

				// Get all responsive buttons in order: Desktop, Tablet, Mobile
				const allButtons = Array.from(
					document.querySelectorAll(
						'button[role="menuitemradio"].components-menu-items-choice'
					)
				);

				// Find which button was clicked by index
				const buttonIndex = allButtons.indexOf(button);

				// Map button index to target size: 0=Desktop, 1=Tablet, 2=Mobile
				const targetSizes = ['general', 's', 'xs'];
				const targetSize = targetSizes[buttonIndex];

				if (targetSize) {
					// Just update MaxiBlocks state and let Gutenberg handle its own rendering
					// Don't prevent default - let Gutenberg's React handle the click naturally
					setScreenSize(targetSize);
				}
			},
			false
		);
	}, []);

	useEffect(() => {
		const previewButton =
			document.querySelector('.editor-preview-dropdown__toggle') ||
			document.querySelector('.block-editor-post-preview__button-toggle');

		let syncTimeout = null;

		if (previewButton) {
			const config = {
				attributes: true,
				childList: false,
				subtree: false,
			};

			const callback = mutationsList => {
				mutationsList.forEach(mutation => {
					if (mutation.type === 'attributes') {
						if (mutation.attributeName === 'aria-expanded') {
							const isExpanded =
								previewButton.getAttribute('aria-expanded') ===
								'true';

							// Cancel any pending sync
							if (syncTimeout) {
								clearTimeout(syncTimeout);
								syncTimeout = null;
							}

							const node =
								document.querySelector(
									'.components-dropdown-menu__menu'
								) ||
								document.querySelector(
									'.block-editor-post-preview__dropdown-content'
								);

							if (node && isExpanded) {
								// Actions on default responsive values
								const responsiveButtons =
									Array.from(
										node.querySelectorAll(
											'.components-menu-items-choice'
										)
									) ||
									Array.from(
										node.querySelectorAll(
											'.block-editor-post-preview__button-resize'
										)
									);

								// First attach click handlers
								responsiveButtons.forEach(
									onChangeNativeResponsive
								);

								// Don't sync immediately - wait and see if user clicks a button
								// Only sync if they didn't just click a native button
								syncTimeout = setTimeout(() => {
									const timeSinceLastClick =
										Date.now() - lastNativeClickRef.current;

									// Only sync if no button was clicked in the last 500ms
									if (timeSinceLastClick > 500) {
										updateNativeResponsiveState(deviceType);
									}
									syncTimeout = null;
								}, 150);
							}
						}
					}
				});
			};

			const observer = new MutationObserver(callback);
			observer.observe(previewButton, config);
			return () => {
				observer.disconnect();
				if (syncTimeout) {
					clearTimeout(syncTimeout);
				}
			};
		}

		return () => {};
	}, [deviceType, onChangeNativeResponsive, updateNativeResponsiveState]);

	const addCloudLibrary = () => {
		let rootClientId;
		const isFSE = getIsSiteEditor();

		// Check if we're in "Show Template" mode in post editor
		// This happens when the template editing is enabled in regular post editor
		const isTemplateMode =
			!isFSE &&
			select('core/editor')?.getRenderingMode?.() === 'template-locked';

		if (isFSE) {
			const postId = select('core/edit-site').getEditedPostId();
			const postType = select('core/edit-site').getEditedPostType();

			if (
				postType === 'wp_template' ||
				postType === 'wp_block' ||
				postType === 'wp_template_part'
			) {
				insertBlock(createBlock('maxi-blocks/maxi-cloud'));
			}

			if (postType && postId) {
				goThroughMaxiBlocks(block => {
					if (block.name === 'core/post-content') {
						rootClientId = block.clientId;
						return true;
					}
					return false;
				});
			}
		}

		// Handle template mode or FSE context
		if (isFSE || isTemplateMode) {
			// If we're in template mode, find the post-content block to insert into
			if (isTemplateMode && !rootClientId) {
				goThroughMaxiBlocks(block => {
					if (block.name === 'core/post-content') {
						rootClientId = block.clientId;
						return true;
					}
					return false;
				});
			}
		}

		if (rootClientId || (!isFSE && !isTemplateMode)) {
			insertBlock(
				createBlock('maxi-blocks/maxi-cloud'),
				undefined,
				rootClientId
			);
		}
	};

	const classes = classnames('maxi-responsive-selector', className);

	return (
		<div
			className={classes}
			style={{ display: isOpen ? 'flex' : 'none' }}
			ref={settingsRef}
		>
			<span className='maxi-responsive-selector__close' onClick={onClose}>
				<Icon icon={closeIcon} />
			</span>
			<ResponsiveButton
				icon={xllMode}
				target='xxl'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={`>${breakpoints.xl}`}
				updateNativeResponsiveState={updateNativeResponsiveState}
			/>
			<ResponsiveButton
				icon={xlMode}
				target='xl'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.xl}
				updateNativeResponsiveState={updateNativeResponsiveState}
			/>
			<ResponsiveButton
				icon={largeMode}
				target='l'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.l}
				updateNativeResponsiveState={updateNativeResponsiveState}
			/>
			<ResponsiveButton
				icon={mediumMode}
				target='m'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.m}
				updateNativeResponsiveState={updateNativeResponsiveState}
			/>
			<ResponsiveButton
				icon={smallMode}
				target='s'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.s}
				updateNativeResponsiveState={updateNativeResponsiveState}
			/>
			<ResponsiveButton
				icon={xsMode}
				target='xs'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.xs}
				updateNativeResponsiveState={updateNativeResponsiveState}
			/>
			<div className='action-buttons'>
				<Button
					className='action-buttons__button'
					aria-label={__('Cloud library', 'maxi-blocks')}
					onClick={() => addCloudLibrary()}
				>
					<Icon
						className='template-library-cloud-icon'
						icon={cloudLib}
					/>
					<span>{__('Cloud library', 'maxi-blocks')}</span>
				</Button>
			</div>
			<MaxiStyleCardsEditorPopUp ref={settingsRef} />
			<MaxiExportEditorPopUp ref={settingsRef} />
			<a
				href='https://maxiblocks.com/go/help-center'
				target='_blank'
				rel='noopener noreferrer'
				className='maxi-components-button components-button action-buttons__button'
			>
				<Icon className='toolbar-item__icon' icon={helpIcon} />{' '}
				{__('Help', 'maxi-blocks')}
			</a>
		</div>
	);
};

export default ResponsiveSelector;
