class VariableAliasPlugin {
	constructor(aliasMap = {}) {
		this.aliasMap = aliasMap;
	}

	apply(compiler) {
		const pluginName = 'VariableAliasPlugin';
		compiler.hooks.thisCompilation.tap(pluginName, compilation => {
			const { Compilation, sources } = compiler.webpack;
			compilation.hooks.processAssets.tap(
				{
					name: pluginName,
					stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
				},
				assets => {
					Object.keys(assets).forEach(assetName => {
						if (!assetName.endsWith('.css') && !assetName.endsWith('.js')) {
							return;
						}

						const assetSource = compilation.getAsset(assetName).source.source().toString();
						const optimizedSource = Object.entries(this.aliasMap)
							.sort((a, b) => b[0].length - a[0].length)
							.reduce(
								(currentSource, [longName, shortName]) =>
									currentSource.replaceAll(longName, shortName),
								assetSource
							);

						if (optimizedSource !== assetSource) {
							compilation.updateAsset(
								assetName,
								new sources.RawSource(optimizedSource)
							);
						}
					});
				}
			);
		});
	}
}

module.exports = VariableAliasPlugin;
