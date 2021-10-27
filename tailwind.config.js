const config = {
    mode: "jit",
    purge: {
        content: ["./src/**/*.{html,js,svelte,ts}"],
        enabled: true
    },

    theme: {
        extend: {}
    },
    corePlugins: {
        fontFamily: false,
    },
    plugins: []
};

module.exports = config;