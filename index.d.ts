import { Options } from 'node-sass';
import { Plugin } from 'webpack';

declare namespace StylePlugin {
  type NODE_ENV = 'production' | 'development';
  type FileRule = string | string[] | { [key: string]: string };
  interface Config {
    sourceMap?: boolean;
    autoprefixer?: boolean;
    sass?: Options;
  }
}

declare class StylePlugin extends Plugin {
  constructor(
    file: StylePlugin.FileRule,
    mode?: StylePlugin.NODE_ENV | StylePlugin.Config
  );
  constructor(
    file: StylePlugin.FileRule,
    mode: StylePlugin.NODE_ENV,
    config?: StylePlugin.Config
  );
}

export = StylePlugin;