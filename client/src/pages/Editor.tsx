import { useState } from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { Toolbar } from '@/components/editor/Toolbar';
import { BlockPalette } from '@/components/editor/BlockPalette';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { StyleEditor } from '@/components/editor/StyleEditor';
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Editor() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <EditorProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Toolbar />
        <div className="flex-1 flex overflow-hidden relative">
          {/* Desktop: Always visible sidebars */}
          <div className="hidden lg:block">
            <BlockPalette />
          </div>

          {/* Mobile/Tablet: Sheet-based sidebars */}
          <div className="lg:hidden absolute top-2 left-2 z-10">
            <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 bg-background"
                  data-testid="button-toggle-left-sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <BlockPalette />
              </SheetContent>
            </Sheet>
          </div>

          <EditorCanvas />

          {/* Desktop: Always visible sidebars */}
          <div className="hidden lg:block">
            <StyleEditor />
          </div>

          {/* Mobile/Tablet: Sheet-based sidebars */}
          <div className="lg:hidden absolute top-2 right-2 z-10">
            <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 bg-background"
                  data-testid="button-toggle-right-sidebar"
                >
                  <PanelRight className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <StyleEditor />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}
