/*
 * Copyright 2019 balena.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const url = require('url')
const path = require('path')
const generator = require('./generator')

const ROOT = path.resolve(__dirname, '..')
const DIRECTORY = path.relative(ROOT, path.dirname(__filename))
const DIST_DIRECTORY = path.relative(
  ROOT, process.env.LANDR_OUTPUT_DIRECTORY)
const TMP_DIRECTORY = '.tmp'
const DEPLOY_URL = process.env.LANDR_DEPLOY_URL

// Dynamically require the contract from the path
// that the Landr CLI passed to us.
const DATA = require(process.env.LANDR_CONTRACT_PATH)

/*
 * Calculate the site root and base path
 * if possible, in order to generate sitemap.xml.
 */
const siteUrl = DEPLOY_URL || DATA.links.homepage
const basePath = siteUrl
  ? new url.URL(siteUrl).pathname
  : null

// TODO: Use a real theme
const site = generator(DATA, require('../test/engine/test-theme.json'))
for (const routePath of Object.keys(site)) {
  console.log(`Generating route: ${routePath}`)
}

export default {
  siteRoot: siteUrl,
  basePath,
  paths: {
    root: ROOT,
    src: DIRECTORY,
    temp: TMP_DIRECTORY,
    dist: DIST_DIRECTORY,
    devDist: path.join(TMP_DIRECTORY, 'dev-server'),
    public: 'skeleton',
    buildArtifacts: path.join(TMP_DIRECTORY, 'artifacts')
  },

  getRoutes: async () => {
    const routes = []

    for (const [ uri, combination ] of Object.entries(site)) {
      routes.push({
        path: uri,
        template: path.join(DIRECTORY, 'renderer'),
        getData: () => {
          return {
            combination
          }
        }
      })
    }

    return routes
  },

  plugins: [
    require.resolve('react-static-plugin-styled-components'),
    require.resolve('react-static-plugin-reach-router'),

    /*
     * Generate a sitemap.xml file.
     */
    require.resolve('react-static-plugin-sitemap')

  ]
}