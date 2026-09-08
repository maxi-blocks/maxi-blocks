const noopComponent = () => null;

let proxy;
proxy = new Proxy(
	{ __esModule: true },
	{
		get: (_target, prop) => {
			if (prop === '__esModule') return true;
			if (prop === 'default') return proxy;

			return noopComponent;
		},
	}
);

module.exports = proxy;

