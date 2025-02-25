import { parse } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { replaceExt } from '../common/index.js';
import { compileCss } from './compile-css.js';
import { compileLess } from './compile-less.js';
import { consola } from '../common/logger.js';

async function compileFile(filePath: string) {
  const parsedPath = parse(filePath);

  try {
    if (parsedPath.ext === '.less') {
      const source = await compileLess(filePath);
      return await compileCss(source);
    }

    const source = readFileSync(filePath, 'utf-8');
    return await compileCss(source);
  } catch (err) {
    consola.error(`Compile style failed: ${filePath}`);
    throw err;
  }
}

export async function compileStyle(filePath: string) {
  const css = await compileFile(filePath);
  if (css.length) {
    writeFileSync(replaceExt(filePath, '.css'), css);
  }
}
