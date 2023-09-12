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
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import Toolbar from "@/pages/notes/Lexical/components/Toolbar";
import LocalStoragePlugin from "@/pages/notes/Lexical/plugins/LocalStoragePlugin";
import CodeHighlightPlugin from '@/pages/notes/Lexical/plugins/CodeHighlightPlugin';
import { initialConfig } from "./constants";
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

const handleChange = (editorState: EditorState) => {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
  });
}

export const Editor = () => {
  // we retrieved the content from local storage in the Editor component
  const content = localStorage.getItem(initialConfig.namespace);


  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editorState: content,
        nodes: [...initialConfig.nodes!],
        onError: (error: Error) => {
          throw error;
        },
      }}
    >
      <div className="w-full p-0 overflow-hidden">
        <Toolbar editable/>
        <RichTextPlugin
          contentEditable={<ContentEditable className="bg-white w-full p-3 overflow-auto max-h-[20rem]"/>}
          placeholder={<p className="absolute top-0 left-0">Hello</p>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CodeHighlightPlugin/>
        <OnChangePlugin onChange={handleChange}/>
        <HistoryPlugin/>
        <LocalStoragePlugin namespace={initialConfig.namespace}/>
        <ListPlugin/>
        <HorizontalRulePlugin/>
        <TabIndentationPlugin/>
        <CheckListPlugin/>
      </div>
      {/* {false && <TreeViewPlugin />} */}
    </LexicalComposer>
  )
}

export default Editor;