/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import MaxiStyleCardsEditorPopUp from '../style-cards';
import MaxiExportEditorPopUp from '../export';
import { Button, Icon } from '../../components';
import { setScreenSize } from '../../extensions/styles';
import { getIsSiteEditor, getSiteEditorIframeBody } from '../../extensions/fse';
import { goThroughMaxiBlocks } from '../../extensions/maxi-block';

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
} from '../../icons';

/**
 * Components
 */
const ResponsiveButton = ({
	baseBreakpoint,
	icon,
	tooltipValue,
	breakpoint,
	target,
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
				onClick={() =>
					setScreenSize(isBaseBreakpoint ? 'general' : target)
				}
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
							<svg
								className='maxi-tabs-control__notification'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 9 9'
							>
								<path
									fill='#ff4a17'
									d='M4.5 0H9v4.5A4.5 4.5 0 0 1 4.5 9 4.5 4.5 0 0 1 0 4.5 4.5 4.5 0 0 1 4.5 0Z'
								/>
							</svg>
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
	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

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

	// TODO: check if it can be reduced to avoid the amount of resources used (MVP)
	const onChangeNativeResponsive = useCallback(button => {
		button.addEventListener('click', e => {
			const { target } = e;
			const value = target.innerText;
			const maxiValue =
				(value === 'Desktop' && 'general') ||
				(value === 'Tablet' && 's') ||
				(value === 'Mobile' && 'xs');

			const editorWrapper =
				document.querySelector('.edit-post-visual-editor') ||
				document.querySelector('.edit-site-visual-editor') ||
				document.querySelector('.editor-visual-editor');

			editorWrapper.setAttribute('maxi-blocks-responsive', maxiValue);
			editorWrapper.removeAttribute('maxi-blocks-responsive-width');

			if (value === 'Desktop') editorWrapper.style.width = '';

			setMaxiDeviceType({
				deviceType: maxiValue,
				isGutenbergButton: true,
			});
		});
	});

	useEffect(() => {
		const previewButton = document.querySelector(
			'.block-editor-post-preview__button-toggle'
		);

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
							const node = document.querySelector(
								'.block-editor-post-preview__dropdown-content'
							);
							const repeatedNode = document.querySelector(
								'#maxi-blocks__responsive-toolbar'
							);

							if (node && !repeatedNode) {
								// Actions on default responsive values
								const responsiveButtons = Array.from(
									node.querySelectorAll(
										'.block-editor-post-preview__button-resize'
									)
								);

								responsiveButtons.forEach(
									onChangeNativeResponsive
								);
							}
						}
					}
				});
			};

			const observer = new MutationObserver(callback);

			observer.observe(previewButton, config);

			return () => observer.disconnect();
		}

		return () => {};
	});

	const addCloudLibrary = () => {
		let rootClientId;
		const isFSE = getIsSiteEditor();

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

		if (rootClientId || !isFSE) {
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
			/>
			<ResponsiveButton
				icon={xlMode}
				target='xl'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.xl}
			/>
			<ResponsiveButton
				icon={largeMode}
				target='l'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.l}
			/>
			<ResponsiveButton
				icon={mediumMode}
				target='m'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.m}
			/>
			<ResponsiveButton
				icon={smallMode}
				target='s'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.s}
			/>
			<ResponsiveButton
				icon={xsMode}
				target='xs'
				breakpoint={deviceType}
				baseBreakpoint={baseBreakpoint}
				breakpoints={breakpoints}
				tooltipValue={breakpoints.xs}
			/>
			<div className='action-buttons'>
				<Button
					className='action-buttons__button'
					aria-label={__('Template library', 'maxi-blocks')}
					onClick={() => addCloudLibrary()}
				>
					<Icon
						className='template-library-cloud-icon'
						icon={cloudLib}
					/>
					<span>{__('Template library', 'maxi-blocks')}</span>
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
