import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import { transformFromAst } from 'babel-core';
import { jsonLoader } from './jsonLoader.js';

let id = 0;

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [jsonLoader],
      },
    ],
  },
};

function createAsset(filePath) {
  // 1. 获取文件的内容
  //    ast -> 抽象语法树
  let source = fs.readFileSync(filePath, { encoding: 'utf-8' });

  // initLoader
  const loaders = webpackConfig.module.rules;
  const loaderContext = {
    addDeps(dep) {
      console.log('addDeps:', dep);
    },
  };

  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      if (Array.isArray(use)) {
        use.reverse().forEach((fn) => {
          source = fn.call(loaderContext, source);
        });
      }
    }
  });

  // 2. 获取依赖关系
  const ast = parser.parse(source, { sourceType: 'module' });

  const deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });

  return {
    filePath,
    code,
    deps,
    mapping: {},
    id: id++,
  };
}

function createGraph() {
  const mainAsset = createAsset('./example/main.js');

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve('./example', relativePath));
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

const graph = createGraph();

function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' });
  const data = graph.map((asset) => {
    const { id, code, mapping } = asset;
    return {
      id,
      code,
      mapping,
    };
  });

  const code = ejs.render(template, { data });

  fs.writeFileSync('./dist/bundle.js', code);
}

build(graph);
