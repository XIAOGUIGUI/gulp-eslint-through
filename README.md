# gulp-eslint-through

> A [gulp](https://gulpjs.com/) plugin by  through for [ESLint](https://eslint.org/)

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install gulp-eslint-through
```

## Usage

```javascript
const {src, task} = require('gulp');
const eslint = require('gulp-eslint-through');

task('default', () => {
    return src(['scripts/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
});
```

Or use the plugin API to do things like:

```javascript
gulp.src(['**/*.js','!node_modules/**'])
	.pipe(eslint({
		rules: {
			'my-custom-rule': 1,
			'strict': 2
		},
		globals: [
			'jQuery',
			'$'
		],
		envs: [
			'browser'
		]
	}))
```

## API

### eslint()

*No explicit configuration.* A `.eslintrc` file may be resolved relative to each linted file.

### eslint(options)
See [ESlint CLIEngine options](https://eslint.org/docs/developer-guide/nodejs-api#cliengine).

#### options.rules

Type: `Object`

Set [configuration](https://eslint.org/docs/user-guide/configuring#configuring-rules) of [rules](https://eslint.org/docs/rules/).

```javascript
{
	"rules":{
		"camelcase": 1,
		"comma-dangle": 2,
		"quotes": 0
	}
}
```

#### options.globals

Type: `Array`

Specify global variables to declare.

```javascript
{
	"globals":[
		"jQuery",
		"$"
	]
}
```

#### options.fix

Type: `Boolean`

This option instructs ESLint to try to fix as many issues as possible. The fixes are applied to the gulp stream. The fixed content can be saved to file using `gulp.dest` (See [example/fix.js](https://github.com/adametry/gulp-eslint/blob/master/example/fix.js)). Rules that are fixable can be found in ESLint's [rules list](https://eslint.org/docs/rules/).

When fixes are applied, a "fixed" property is set to `true` on the fixed file's ESLint result.

#### options.quiet

Type: `Boolean`

When `true`, this option will filter warning messages from ESLint results. This mimics the ESLint CLI [quiet option](https://eslint.org/docs/user-guide/command-line-interface#quiet).

Type: `function (message, index, list) { return Boolean(); }`

When provided a function, it will be used to filter ESLint result messages, removing any messages that do not return a `true` (or truthy) value.

#### options.envs

Type: `Array`

Specify a list of [environments](https://eslint.org/docs/user-guide/configuring#specifying-environments) to be applied.

#### options.rulePaths

Type: `Array`

This option allows you to specify additional directories from which to load rules files. This is useful when you have custom rules that aren't suitable for being bundled with ESLint. This option works much like the ESLint CLI's [rulesdir option](https://eslint.org/docs/user-guide/command-line-interface#rulesdir).

#### options.configFile

Type: `String`

Path to the ESLint rules configuration file. For more information, see the ESLint CLI [config option](https://eslint.org/docs/user-guide/command-line-interface#c-config) and [Using Configuration Files](https://eslint.org/docs/user-guide/configuring#using-configuration-files).

#### options.warnFileIgnored

Type: `Boolean`

When `true`, add a result warning when ESLint ignores a file. This can be used to file files that are needlessly being loaded by `gulp.src`. For example, since ESLint automatically ignores "node_modules" file paths and gulp.src does not, a gulp task may take seconds longer just reading files from the "node_modules" directory.

#### <a name="options.useEslintrc"></a>options.useEslintrc

Type: `Boolean`

When `false`, ESLint will not load [.eslintrc files](https://eslint.org/docs/user-guide/configuring#using-configuration-files).

### eslint(configFilePath)

Type: `String`

Shorthand for defining `options.configFile`.

### eslint(results)

Type: `function (result) {}`

Call a function for each ESLint file result. No returned value is expected. If an error is thrown, it will be wrapped in a Gulp PluginError and emitted from the stream.

```javascript
gulp.src(['**/*.js','!node_modules/**'])
	.pipe(eslint({
      results: (data) => {
        console.log(data)
      }
   }))
```

Type: `function (result) { }`

Call an asynchronous function for each ESLint file results. The callback must be called for the stream to finish. If a value is passed to the callback, it will be wrapped in a Gulp PluginError and emitted from the stream.




## Configuration

ESLint may be configured explicity by using any of the following plugin options: `config`, `rules`, `globals`, or `env`. If the [useEslintrc option](#useEslintrc) is not set to `false`, ESLint will attempt to resolve a file by the name of `.eslintrc` within the same directory as the file to be linted. If not found there, parent directories will be searched until `.eslintrc` is found or the directory root is reached.

## Ignore Files

ESLint will ignore files that do not have a `.js` file extension at the point of linting ([some plugins](https://github.com/contra/gulp-coffee) may change file extensions mid-stream). This avoids unintentional linting of non-JavaScript files.

ESLint will also detect an `.eslintignore` file at the cwd or a parent directory. See the [ESLint docs](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) to learn how to construct this file.

## Extensions

ESLint results are attached as an "eslint" property to the vinyl files that pass through a Gulp.js stream pipeline. This is available to streams that follow the initial `eslint` stream. The [eslint.result](#result) and [eslint.results](#results) methods are made available to support extensions and custom handling of ESLint results.

#### Gulp-Eslint Extensions:

* [gulp-eslint-if-fixed](https://github.com/lukeapage/gulp-eslint-if-fixed)
* [gulp-eslint-threshold](https://github.com/krmbkt/gulp-eslint-threshold)
