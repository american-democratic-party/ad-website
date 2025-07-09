// Details Summary Generator Tool

import { EOL } from 'node:os';
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
//
// Usage:
//    node details-summary-generator.js [source] [destination] [name]

const titleFilename = '+summary-header.html';
const cleanPath =     (folder) => slash(path.normalize(folder)).trim().replace(/\/$/, '');
const sourceFolder =  cleanPath(process.argv[2]);
const outputFolder =  cleanPath(process.argv[3]);
const outputName =    process.argv[4].trim().toLowerCase();
const files =         globSync(sourceFolder + '/**/*.html').map(slash).sort();
const tocFile =       `${outputFolder}/${outputName}-toc.html`;
const detailsFile =   `${outputFolder}/${outputName}-details.html`;
const toc =           [];

const intro = () => {
   console.info('[Details Summary Generator Tool]');
   console.info('source:   ', sourceFolder);
   console.info('toc:      ', tocFile);
   console.info('details:  ', detailsFile);
   console.info('templates:', files.length);
   };

const processFile = (filePath, index) => {
   const html =         fs.readFileSync(filePath, 'utf-8');
   const pathInfo =     path.parse(filePath);
   const isHeader =     (file) => file.endsWith(titleFilename);
   const isParentNode = isHeader(filePath);
   const isLast =       index === files.length - 1;
   const sourceDepth =  sourceFolder.split('/').length;
   const depth =        (file) => file.split('/').length - sourceDepth - (isHeader(file) ? 1 : 0);
   const fileDepth =    depth(filePath);
   const calcPops =     (nextFile) => Math.max(0, fileDepth - depth(nextFile));  //levels to unnest
   const pops =         isLast ? fileDepth - 1 : calcPops(files[index + 1]);
   const sectionCode =  isParentNode ? path.basename(pathInfo.dir) : pathInfo.name;  //ex: "5-tax-policy"
   const sectionBase =  (isParentNode ? pathInfo.dir : filePath).slice(sourceFolder.length + 1);  //ex: "3-domestic/5-tax-policy"
   const section = {
      id:    sectionCode.slice(sectionCode.indexOf('-') + 1),                         //ex: "tax-policy"
      depth: fileDepth,                                                               //ex: 1
      title: html.split('summary>')[1].slice(0, -2),                                  //ex: "Tax Policy"
      num:   sectionBase.split('/').map(section => section.split('-')[0]).join('.'),  //ex: "3.5"
      };
   toc.push(section);
   const details = html
      .replace('<details>', `<details id=${section.id}>`)
      .replace('<summary>', `<summary><b>${section.num}</b> `)
      .replace('</details>', isParentNode ? '' : '</details>').trim() +
      `${EOL}</details>`.repeat(pops) + EOL;
   return details;
   };

const processFiles = () => {
   fs.mkdirSync(outputFolder, { recursive: true });
   const header = `<!-- ${detailsFile} -->`;
   fs.writeFileSync(detailsFile, header + EOL + files.map(processFile).join(''));
   };

const saveToc = () => {
   const tocTitle = (section) => `<a href=#${section.id}>${section.title}</a>`;
   const tocItem = (section) =>
      `<li data-depth=${section.depth}><span>${section.num}</span>${tocTitle(section)}</li>`;
   const toText = (filename, lines) => `<!-- ${tocFile} -->${EOL}` + lines.join(EOL) + EOL;
   fs.writeFileSync(tocFile, toText(tocFile, toc.map(tocItem)));
   };

intro();
processFiles();
saveToc();
console.info('Done.\n');
