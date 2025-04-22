// Details Summary Generator Tool

import { globSync } from 'glob';
import fs    from 'fs';
import path  from 'path';
import slash from 'slash';

// <details>
//    <summary>Clickable Title</summary>
//    <header>This is content text above the subitems.</header>
//    <p>These are some details.</p>
//    <p>These are some details.</p>
// </details>

const sourceFolder = path.normalize(slash(process.argv[2]));
const outputFile =   path.normalize(slash(process.argv[3]));
const files =        globSync(sourceFolder + '/**/*.html').map(slash).sort();

const intro = () => {
   console.log('[Details Summary Generator Tool]');
   console.log('source:   ', sourceFolder);
   console.log('output:   ', outputFile);
   console.log('templates:', files.length);
   };

const processFile = (filePath, index) => {
   const pathInfo =     path.parse(filePath);
   const isParentNode = pathInfo.base === '+summary-header.html';
   const isLast =       index === files.length - 1;
   const sectionCode =  isParentNode ? path.basename(pathInfo.dir) : pathInfo.name;  //ex: "2-tax-policy"
   const id =           sectionCode.slice(sectionCode.indexOf('-') + 1);  //ex: "tax-policy"
   const sourceDepth =  sourceFolder.split('/').length;
   const fileDepth =    filePath.split('/').length;
   const calcPops =     (file) => Math.max(0, fileDepth - file.split('/').length);  //levels to unnest
   const pops =         isLast ? fileDepth - sourceDepth - 1 : calcPops(files[index + 1]);
   const sectionBase =  (isParentNode ? pathInfo.dir : filePath).slice(sourceFolder.length + 1);  //ex: "3-domestic/2-tax-policy"
   const sectonNumber = sectionBase.split('/').map(section => section.split('-')[0]).join('.');  //ex: "3.2"
   const html = fs.readFileSync(filePath, 'utf-8')
      .replace('<details>', `<details id=${id}>`)
      .replace('<summary>', `<summary>${sectonNumber}: `)
      .replace('</details>', isParentNode ? '' : '</details>') +
      '</details>\n'.repeat(pops);
   return html;
   };

const processFiles = () => {
   fs.writeFileSync(outputFile, files.map(processFile).join('\n'));
   };

intro();
processFiles();
console.log('Done.\n');
