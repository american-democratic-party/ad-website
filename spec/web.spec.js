// ad-website
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { revWebAssets } from 'rev-web-assets';
import fs from 'node:fs';
import os from 'node:os';

////////////////////////////////////////////////////////////////////////////////
describe('The "docs" folder', () => {

   it('contains the correct files', () => {
      const actual = revWebAssets.readJustFiles('docs');
      const expected = [
         'CNAME',
         'app.js',
         'index.html',
         'robots.txt',
         'style.css',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('contains the correct "CNAME" file', () => {
      const actual =   fs.readFileSync('docs/CNAME', 'utf-8');
      const expected = 'american-democratic-party.org' + os.EOL;
      assertDeepStrictEqual(actual, expected);
      });

   it('contains the correct "robots.txt" file', () => {
      const actual =   fs.readFileSync('docs/robots.txt', 'utf-8');
      const expected = '# Allow bots' + os.EOL;
      assertDeepStrictEqual(actual, expected);
      });

   });
