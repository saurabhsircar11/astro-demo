import { getPageAST } from '../apps/web-engine-project/src/utils/contentProvider.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const ast = await getPageAST('globant-demo');
    console.log("METADATA:", JSON.stringify(ast.metadata, null, 2));
    console.log("BLOCKS:", JSON.stringify(ast.blocks, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
