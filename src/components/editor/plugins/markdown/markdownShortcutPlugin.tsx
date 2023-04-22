/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// import { TRANSFORMERS } from '@lexical/markdown'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import * as React from 'react'

import { TRANSFORMERS } from './markdownTransformers'

export default function MarkdownPlugin(): JSX.Element {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
}
