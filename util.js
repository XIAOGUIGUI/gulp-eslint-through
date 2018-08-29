'use strict'

const fancyLog = require('fancy-log')
const { CLIEngine } = require('eslint')

/**
 * Mimic the CLIEngine's createIgnoreResult function,
 * only without the ESLint CLI reference.
 *
 * @param {Object} file - file with a "path" property
 * @returns {Object} An ESLint report with an ignore warning
 */
exports.createIgnoreResult = file => {
   return {
      filePath: file.path,
      messages: [
         {
            fatal: false,
            severity: 1,
            message: file.path.includes('node_modules/')
               ? 'File ignored because it has a node_modules/** path'
               : 'File ignored because of .eslintignore file'
         }
      ],
      errorCount: 0,
      warningCount: 1
   }
}

/**
 * Create config helper to merge various config sources
 *
 * @param {Object} options - options to migrate
 * @returns {Object} migrated options
 */
exports.migrateOptions = function migrateOptions(options) {
   if (typeof options === 'string') {
      // basic config path overload: gulpEslint('path/to/config.json')
      options = {
         configFile: options
      }
   }

   return options
}

exports.filterResult = (result, filter) => {
   if (typeof filter !== 'function') {
      filter = isErrorMessage
   }
   const messages = result.messages.filter(filter, result)
   const newResult = {
      filePath: result.filePath,
      messages: messages,
      errorCount: messages.reduce(countErrorMessage, 0),
      warningCount: messages.reduce(countWarningMessage, 0),
      fixableErrorCount: messages.reduce(countFixableErrorMessage, 0),
      fixableWarningCount: messages.reduce(countFixableWarningMessage, 0)
   }

   if (result.output !== undefined) {
      newResult.output = result.output
   } else {
      newResult.source = result.source
   }

   return newResult
}
