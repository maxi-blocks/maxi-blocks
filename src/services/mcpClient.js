export const MCP_NAMESPACE = 'mcp/v1/';

const ensureTrailingSlash = value => (value.endsWith('/') ? value : `${value}/`);

export const getWordPressApiRoot = () => {
	if (typeof window === 'undefined') {
		return '';
	}

	if (window.wpApiSettings?.root) {
		return window.wpApiSettings.root;
	}

	const apiLink = document.querySelector('link[rel="https://api.w.org/"]');
	if (apiLink?.href) {
		return apiLink.href;
	}

	const { origin, pathname } = window.location;
	const basePath = pathname.includes('/wp-admin/')
		? pathname.split('/wp-admin/')[0]
		: '';

	return `${origin}${basePath}/wp-json/`;
};

export const getMcpBaseUrl = () => {
	const apiRoot = getWordPressApiRoot();
	if (!apiRoot) {
		return '';
	}

	return `${ensureTrailingSlash(apiRoot)}${MCP_NAMESPACE}`;
};

export const createMcpClient = ({ baseUrl = getMcpBaseUrl(), token } = {}) => {
	const trimmedBaseUrl = baseUrl ? ensureTrailingSlash(baseUrl) : '';

	const buildHeaders = () => {
		const headers = { 'Content-Type': 'application/json' };

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		return headers;
	};

	const getAbilities = async () => {
		if (!trimmedBaseUrl) {
			const error = new Error('Missing MCP base URL');
			error.code = 'missing_base_url';
			throw error;
		}

		try {
			const response = await fetch(`${trimmedBaseUrl}abilities`, {
				method: 'GET',
				headers: buildHeaders(),
			});

			if (!response.ok) {
				const error = new Error('MCP request failed');
				error.status = response.status;
				if (response.status === 401 || response.status === 403) {
					error.code = 'unauthorized';
				} else {
					error.code = 'http_error';
				}
				throw error;
			}

			const data = await response.json();
			const abilities = Array.isArray(data)
				? data
				: data?.abilities || data?.data || [];

			return Array.isArray(abilities) ? abilities : [];
		} catch (error) {
			if (error?.code) {
				throw error;
			}

			const networkError = new Error(error?.message || 'MCP unreachable');
			networkError.code = 'unreachable';
			throw networkError;
		}
	};

	return { getAbilities };
};
