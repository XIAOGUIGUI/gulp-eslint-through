'use strict'

const PluginError = require('plugin-error')
const { CLIEngine } = require('eslint')
const through = require('through2')
const {
   createIgnoreResult,
   filterResult,
   migrateOptions,
   transform
} = require('./util')
const { relative } = require('path')
const PLUGIN_NAME = 'gulp-eslint-through';
let results = []
/**
 * Append ESLint result to each file
 *
 * @param {(Object|String)} [options] - Configure rules, env, global, and other options for running ESLint
 * @returns {stream} gulp file stream
 */
function gulpEslint(options) {
   options = migrateOptions(options) || {}
   const linter = new CLIEngine(options)

   results = []
   return through.obj(function (file, enc, cb) {
      const filePath = relative(process.cwd(), file.path)

      if (file.isNull()) {
         cb(null, file)
         return
      }

      if (file.isStream()) {
         cb(new PluginError(PLUGIN_NAME, "gulp-eslint-through doesn't support vinyl files with Stream contents."))
         return
      }

      if (linter.isPathIgnored(filePath)) {
         if (linter.options.ignore && options.warnFileIgnored) {
            // Warn that gulp.src is needlessly reading files that ESLint ignores
            file.eslint = createIgnoreResult(file)
         }
         cb(null, file)
         return
      }

      let result

      try {
         result = linter.executeOnText(file.contents.toString(), filePath).results[0]
      } catch (e) {
         cb(new PluginError(PLUGIN_NAME, e))
         return
      }
      // Note: Fixes are applied as part of "executeOnText".
      // Any applied fix messages have been removed from the result.

      if (options.quiet) {
         // ignore warnings
         file.eslint = filterResult(result, options.quiet)
      } else {
         file.eslint = result
      }
      results.push(file.eslint)

      // Update the fixed output; otherwise, fixable messages are simply ignored.
      if (file.eslint.hasOwnProperty('output')) {
         file.contents = Buffer.from(file.eslint.output)
         file.eslint.fixed = true
      }
      cb(null, file)
    }, function (cb) {
      if (typeof options.results === 'function') {
        options.results(results)
      }
      cb()
   }).resume()
}
module.exports = gulpEslint
