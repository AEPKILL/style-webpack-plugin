import path from 'path';
import fs from 'fs';
import lodash from 'lodash';
import Processor from './processor';
import { processConfig, processFiles, addDep, wrapError } from './utils';

const EXCLUDE_PATTERN = /node_modules|bower_components/;

class StylePlugin {
  constructor(files, mode, config) {
    this.files = processFiles(files);
    this.options = processConfig(mode, config);
    this.lastStart = 0;
    this.dependMap = {};
  }

  ifNeedRebuild(file, timestamps) {
    if (!this.lastStart) {
      return true;
    }

    const dependencies = this.dependMap[file];

    for (const dep of dependencies) {
      const time = timestamps[dep];
      if (!time && time > this.lastStart) {
        return true;
      }
    }

    return false;
  }

  processFile(file, outFile, compilation) {
    const processor = new Processor(file, outFile, this.options);
    this.lastStart = +new Date();
    return processor
      .process()
      .then(([stats, asset, sourceMaps]) => {
        const includedFiles = stats.includedFiles
          .filter(file => !EXCLUDE_PATTERN.test(file))
          .map(file => path.normalize(file));

        compilation.assets[outFile] = asset;

        this.dependMap[file] = includedFiles;

        if (sourceMaps) {
          compilation.assets[`${outFile}.map`] = sourceMaps;
        }
      })
      .catch(error => {
        compilation.errors.push(wrapError(error));
      });
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const processQueue = [];

      for (const file of Object.keys(this.files)) {
        if (this.ifNeedRebuild(file, compilation.fileTimestamps)) {
          processQueue.push(
            this.processFile(file, this.files[file], compilation)
          );
        }
      }

      Promise.all(processQueue)
        .then(() => {
          callback();
        })
        .catch(() => {
          callback();
        });
    });

    compiler.plugin('after-emit', (compilation, callback) => {
      const dependencies = lodash
        .values(this.dependMap)
        .reduce((result, deps) => result.concat(deps), []);
      for (const dep of dependencies) {
        addDep(compilation.fileDependencies, dep);
      }
      callback();
    });
  }
}

export default StylePlugin;
