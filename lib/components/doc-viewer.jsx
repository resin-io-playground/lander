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

import React from 'react'
import {
  markdown
} from 'markdown'
import {
  Box,
  Link,
  Container
} from 'rendition'

export const name = 'DocViewer'

const JsonML = ({
  data
}) => {
  const html = markdown.renderJsonML(
    markdown.toHTMLTree([ 'markdown' ].concat(data)))
  return (<div dangerouslySetInnerHTML={{
    __html: html
  }}/>)
}

export const variants = (metadata, context, route) => {
  const combinations = []

  if (context.article) {
    combinations.push({
      title: context.article.content.title,
      date: context.article.content.published_at,
      author: context.article.content.author && context.article.content.author.handle,
      current: route.path,
      toc: context.toc,
      versions: context.versions || [],
      link: `${metadata.data.links.repository}/edit/master/${context.article.content.filename}`,
      jsonml: context.article.content.data
    })
  }

  return combinations
}

export const render = (props) => {
  const toc = props.toc.map((page, index) => {
    const url = `/${page.path.join('/')}`
    return (<li key={index}>
      <Link href={url}>{page.title}</Link>
    </li>)
  })

  const versions = props.versions.map((version, index) => {
    const url = `/${props.current.join('/')}/${version}`
    return (<li key={index}>
      <Link href={url}>{version}</Link>
    </li>)
  })

  return (
    <Box p={3}>
      <Container>
        <ul>{toc}</ul>
        {versions.length > 0 && versions}
        <Link href={props.link}>Edit on GitHub</Link>
        {props.date && props.author && (<p>Published on {props.date} by @{props.author}</p>)}
        <JsonML data={props.jsonml} />
      </Container>
    </Box>
  )
}
