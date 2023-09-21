import React from 'react';
import { $getRoot, $getSelection, EditorState, } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import Toolbar from "@/pages/notes/Lexical/components/Toolbar";
import LocalStoragePlugin from "@/pages/notes/Lexical/plugins/LocalStoragePlugin";
import CodeHighlightPlugin from '@/pages/notes/Lexical/plugins/CodeHighlightPlugin';
import { initialConfig } from "./editorConfig";
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import ImagesPlugin from "@/pages/notes/Lexical/plugins/ImagesPlugin";
import './index.css'

// Maybe use this in the future for something like shortcuts? "\eq" to "=" for example.
const handleChange = (editorState: EditorState) => {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
  })
}


export const Editor = () => {
  // we retrieved the content from local storage in the Editor component
  const content = localStorage.getItem(initialConfig.namespace);

  return (
    <div className="flex flex-col relative overflow-auto">
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editorState: content,
          nodes: [...initialConfig.nodes!],
        }}
      >

        <Toolbar/>
        <RichTextPlugin
          contentEditable={<ContentEditable id="editor-shell"
                                            className="bg-white px-24 py-14 h-full editor-shell"/>}
          placeholder={<p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">Write
            something...</p>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CodeHighlightPlugin/>
        <OnChangePlugin onChange={handleChange}/>
        <HistoryPlugin/>
        <LocalStoragePlugin namespace={initialConfig.namespace}/>
        <ListPlugin/>
        <HorizontalRulePlugin/>
        <TabIndentationPlugin/>
        <LinkPlugin/>
        <ImagesPlugin/>
        <CheckListPlugin/>

      </LexicalComposer>
    </div>
  )
}

export default Editor;