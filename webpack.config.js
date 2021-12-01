const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const config = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		fallback: {
			...defaultConfig.resolve.fallback,
			http: require.resolve('stream-http'),
			https: require.resolve('https-browserify'),
			url: require.resolve('url/'),
		},
	},
};

console.log(
	`
#     #                                                                         #     #
#  #  #  ######  #        ####    ####   #    #  ######      #####   ####       ##   ##    ##    #    #  #
#  #  #  #       #       #    #  #    #  ##  ##  #             #    #    #      # # # #   #  #    #  #   #
#  #  #  #####   #       #       #    #  # ## #  #####         #    #    #      #  #  #  #    #    ##    #
#  #  #  #       #       #       #    #  #    #  #             #    #    #      #     #  ######    ##    #
#  #  #  #       #       #    #  #    #  #    #  #             #    #    #      #     #  #    #   #  #   #
 ## ##   ######  ######   ####    ####   #    #  ######        #     ####       #     #  #    #  #    #  #

`
);

module.exports = config;
