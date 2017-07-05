'use strict';
// @flow
const pluginTester = require('babel-plugin-tester');
const createBabylonOptions = require('babylon-options');
const {isFlowIdentifier} = require('./');

const babelOptions = {
  parserOpts: createBabylonOptions({
    stage: 0,
    plugins: ['flow', 'jsx'],
  }),
};

function plugin() {
  return {
    name: 'test-plugin',
    visitor: {
      Identifier(path, state) {
        if (path.node.name !== 'TEST') return;
        if (state.opts.flow !== isFlowIdentifier(path)) {
          throw path.buildCodeFrameError('Expected: ' + state.opts.flow);
        }
      }
    }
  };
};

pluginTester({
  plugin,
  babelOptions,
  pluginOptions: {
    flow: false,
  },
  tests: [
    {
      title: 'js identifier',
      code: 'TEST;',
    },
    {
      title: 'object property',
      code: 'obj.TEST;',
    },
    {
      title: 'function name',
      code: 'function TEST() {}',
    },
    {
      title: 'class name',
      code: 'class TEST {}',
    },
    {
      title: 'value default import',
      code: 'import TEST from "./module";',
    },
    {
      title: 'value named import',
      code: 'import { TEST } from "./module";',
    },
    {
      title: 'typeof',
      code: 'type A = typeof TEST;',
    },
  ]
});

pluginTester({
  plugin,
  babelOptions,
  pluginOptions: {
    flow: true,
  },
  tests: [
    {
      title: 'type alias',
      code: 'type TEST = number;',
    },
    {
      title: 'type param',
      code: 'type a<TEST> = number;',
    },
    {
      title: 'type reference',
      code: `
        type TEST = number;
        type b = TEST;
      `,
    },
    {
      title: 'type reference import',
      code: `
        import type TEST from './module';
        type b = TEST;
      `,
    },
  ]
});
