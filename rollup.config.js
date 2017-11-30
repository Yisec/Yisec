import babel from 'rollup-plugin-babel';

export default {
    input: './lib/index.js',
    output: {
      file: './dist/yisec.js',
      format: 'umd',
      name: 'Yisec',
      banner: `/** Yisec is a web component frame **/`,
      sourcemap: true,
    },
    watch: {
      include: 'lib/**',
    },
    plugins: [
      babel({
        "babelrc": false, // 不使用babelrc配置文件
        "presets": [
            [
                "env",
                {
                    "modules": false,
                    "targets": {
                        "browsers": [
                            "last 2 versions",
                            "safari >= 7",
                            "ie >= 9"
                        ]
                    }
                }
            ]
        ],
        "plugins": [
            "syntax-dynamic-import",
            "transform-object-rest-spread",
            "transform-async-to-generator",
            "transform-decorators-legacy",
            "transform-class-properties",
            "external-helpers"
        ]
    }
    )
    ]
  }
