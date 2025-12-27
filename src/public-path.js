/* eslint-disable camelcase */
/* global maxiBlocksMain */
/**
 * Dynamically set the webpack public path so that lazy-loaded chunks
 * can be found by the browser when running in WordPress.
 */
if (window.maxiBlocksMain && window.maxiBlocksMain.pluginBuildUrl) {
	__webpack_public_path__ = window.maxiBlocksMain.pluginBuildUrl;
}
