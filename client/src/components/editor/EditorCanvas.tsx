import { Plus } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { BlockRenderer } from './BlockRenderer';
import { Button } from '@/components/ui/button';
import { createNewBlock } from '@/lib/blocks';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const EditorCanvas = () => {
  const { blocks, selectedBlockId, selectBlock, addBlock, mode, reorderBlocks } = useEditor();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex);
      }
    }
  };

  const handleBlockSelect = (blockId: string) => {
    if (mode === 'edit') {
      selectBlock(blockId);
    }
  };

  const handleAddParagraph = () => {
    const block = createNewBlock('paragraph');
    addBlock(block);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-6">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Start Building Your Article</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Add blocks from the left sidebar to create your content. Choose from text, media, code,
              and layout blocks.
            </p>
            <Button onClick={handleAddParagraph} data-testid="button-add-first-paragraph">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Block
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3" data-testid="editor-canvas">
                {blocks.map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => handleBlockSelect(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
