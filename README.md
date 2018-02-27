# style-webpack-plugin

## Install

`npm install style-webpack-plugin --save-dev`

## Usage

```javascript
// webpack.config.js
import { join } from psth;

module.exports = {
    entry: './src/js/index.js',
    plugins: [
        new StylePlugin({
            './src/styles/index.scss': 'styles/index.css'
        }),
    ],
    module: {
      // babel, linter, etc
    },
    output: {
      path: path.join(__dirname, 'dist');,
      filename: 'index.js'
    }
  };
```

## Other Example

```javascript
// basic
new StylePlugin('./src/styles/index.scss');

// production ready
new StylePlugin('./src/styles/index.scss', process.env.NODE_ENV);

// multi files
new StylePlugin(['./src/styles/one.scss', './src/styles/two.sass'], process.env.NODE_ENV);

// a different output filename
new StylePlugin({ './src/styles/index.scss': 'bundle.css' }, process.env.NODE_ENV);

// with sass tuning
new StylePlugin('./src/styles/index.scss', process.env.NODE_ENV, {
    sass: {
        includePaths: [path.join(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets')]
    }
});

// with source maps + compressing - autoprefixing
new StylePlugin('./src/styles/index.scss', {
    sourceMap: true,
    sass: { outputStyle: 'compressed' },
    autoprefixer: false
});

```

## Reference

base on [sass-webpack-plugin](https://github.com/jalkoby/sass-webpack-plugin)
