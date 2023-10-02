import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import debounce from '../utils/debounce'
import { useNotes } from "@/contexts/Notes/NoteProvider";
import { useCurrentNote } from "@/contexts/Notes/CurrentNoteProvider";

const DELAY_SAVE_MILLI = 500

export function DatabasePlugin() {
  const [editor] = useLexicalComposerContext();
  const { notesService } = useNotes()
  const { currentNote } = useCurrentNote()

  const saveContent = useCallback((content: string) => {
    if (!currentNote) return
    notesService.updateNote({
      ...currentNote,
      content
    })
  }, [currentNote])

  const debouncedSaveContent = debounce(saveContent, DELAY_SAVE_MILLI);

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Don't update if nothing has changed
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return

        const serializedState = JSON.stringify(editorState)
        debouncedSaveContent(serializedState)
      },
    );

    /**
     * Note that editor.registerUpdateListener() returns a callback to remove the update listener again. To avoid memory leaks, we use this returned callback for the cleanup function of useEffect.
     */
  }, [debouncedSaveContent, editor]);

  /**
   * As this plugin shouldn’t render any decoration or toolbar, we simply return null at the very end of the component.
   */
  return null;
}