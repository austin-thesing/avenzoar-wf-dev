import { readdir, readFile, writeFile, mkdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { minify as minifyHTML } from "html-minifier-terser";
import { minify as cssoMinify } from "csso";
import { minify as minifyTerser } from "terser";

const DIST_DIR = "dist";
const SRC_DIR = "src";

interface BuildOptions {
  html: {
    collapseWhitespace: boolean;
    removeComments: boolean;
    minifyCSS: boolean;
    minifyJS: boolean;
    removeAttributeQuotes: boolean;
    removeEmptyAttributes: boolean;
  };
}

const htmlOptions: BuildOptions["html"] = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: false, // Keep quotes for Webflow compatibility
  removeEmptyAttributes: false, // Keep empty attrs for SVG/HTML compatibility
};

async function minifyJS(code: string): Promise<string> {
  const result = await minifyTerser(code, {
    compress: true,
    mangle: true,
    format: {
      comments: false,
    },
  });
  
  if (!result.code) {
    throw new Error("JS minification failed");
  }
  
  return result.code;
}

async function minifyCSS(code: string): Promise<string> {
  const result = cssoMinify(code, {
    restructure: true,
  });
  return result.css;
}

async function processHTMLFile(filePath: string, outputPath: string): Promise<void> {
  const content = await readFile(filePath, "utf-8");
  
  const minified = await minifyHTML(content, {
    ...htmlOptions,
    minifyCSS: true,
    minifyJS: true,
  });
  
  await writeFile(outputPath, minified, "utf-8");
  console.log(`✓ Minified HTML: ${basename(filePath)}`);
}

async function processCSSFile(filePath: string, outputPath: string): Promise<void> {
  const content = await readFile(filePath, "utf-8");
  const minified = await minifyCSS(content);
  
  await writeFile(outputPath, minified, "utf-8");
  console.log(`✓ Minified CSS: ${basename(filePath)}`);
}

async function processJSFile(filePath: string, outputPath: string): Promise<void> {
  const content = await readFile(filePath, "utf-8");
  const minified = await minifyJS(content);
  
  await writeFile(outputPath, minified, "utf-8");
  console.log(`✓ Minified JS: ${basename(filePath)}`);
}

async function build(): Promise<void> {
  console.log("Building production files...\n");
  
  // Create dist directory
  await mkdir(DIST_DIR, { recursive: true });
  await mkdir(join(DIST_DIR, SRC_DIR), { recursive: true });
  
  // Process HTML files from root
  const rootFiles = await readdir(".");
  for (const file of rootFiles) {
    const filePath = join(".", file);
    const stats = await stat(filePath);
    
    if (stats.isFile()) {
      const ext = extname(file).toLowerCase();
      
      if (ext === ".html") {
        await processHTMLFile(filePath, join(DIST_DIR, file));
      } else if (ext === ".css") {
        await processCSSFile(filePath, join(DIST_DIR, file));
      }
    }
  }
  
  // Process JS files from src/
  const srcFiles = await readdir(SRC_DIR);
  for (const file of srcFiles) {
    const filePath = join(SRC_DIR, file);
    const stats = await stat(filePath);
    
    if (stats.isFile() && extname(file).toLowerCase() === ".js") {
      await processJSFile(filePath, join(DIST_DIR, SRC_DIR, file));
    }
  }
  
  console.log("\n✓ Build complete! Files are in the 'dist' directory.");
}

build().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});

