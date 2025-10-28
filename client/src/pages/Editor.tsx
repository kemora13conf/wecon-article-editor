import { EditorProvider } from '@/context/EditorContext';
import { Toolbar } from '@/components/editor/Toolbar';
import { BlockPalette } from '@/components/editor/BlockPalette';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { StyleEditor } from '@/components/editor/StyleEditor';

export default function Editor() {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <BlockPalette />
          <EditorCanvas />
          <StyleEditor />
        </div>
      </div>
    </EditorProvider>
  );
}
