import { useMemo, useRef, useEffect } from 'react';
import { GripVertical, Copy, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import type { Block, Breakpoint, BlockType } from '@shared/schema';
import { getBlockTypeInfo, applyStylesToElement, createNewBlock } from '@/lib/blocks';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
}

export const BlockRenderer = ({ block, isSelected, onSelect }: BlockRendererProps) => {
  const { updateBlock, deleteBlock, duplicateBlock, moveBlock, addBlockToContainer, currentBreakpoint, mode } = useEditor();
  const blockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: mode === 'preview' });

  const blockInfo = getBlockTypeInfo(block.type);

  // Get the appropriate styles for the current breakpoint
  const currentStyles = useMemo(() => {
    const styles = { ...block.styles.desktop };
    
    if (currentBreakpoint === 'tablet' && block.styles.tablet) {
      Object.assign(styles, block.styles.tablet);
    } else if (currentBreakpoint === 'mobile' && block.styles.mobile) {
      Object.assign(styles, block.styles.mobile);
    }
    
    return styles;
  }, [block.styles, currentBreakpoint]);

  // Apply styles to the content element
  useEffect(() => {
    if (contentRef.current && currentStyles) {
      applyStylesToElement(contentRef.current, currentStyles);
    }
  }, [currentStyles]);

  const isEditMode = mode === 'edit';
  const showControls = isEditMode && isSelected;

  const renderContent = () => {
    if (block.type === 'section' || block.type === 'flex') {
      const handleAddToContainer = (blockType: BlockType) => {
        const newBlock = createNewBlock(blockType);
        addBlockToContainer(block.id, newBlock);
      };

      return (
        <div ref={contentRef as any} className="min-h-[120px] relative">
          {block.children && block.children.length > 0 ? (
            <div className={block.type === 'flex' ? 'flex gap-4' : 'space-y-3'}>
              {block.children.map((child) => (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[120px]">
              <div className="text-center py-8">
                <div className="text-muted-foreground text-sm mb-4">
                  Empty {block.type === 'flex' ? 'Flex Container' : 'Section'}
                </div>
                {isEditMode && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToContainer('section')}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Section
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToContainer('flex')}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Flex
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          {isEditMode && block.children && block.children.length > 0 && (
            <div className="flex gap-2 justify-center mt-4 pt-3 border-t border-dashed opacity-50 hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAddToContainer('section')}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Section
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAddToContainer('flex')}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Flex
              </Button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative group transition-all ${
        isSelected && isEditMode ? 'ring-2 ring-primary rounded-md' : ''
      } ${isEditMode ? 'hover:ring-1 hover:ring-border rounded-md' : ''}`}
      data-testid={`block-${block.type}-${block.id}`}
    >
      {showControls && (
        <div className="absolute -left-10 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 cursor-grab active:cursor-grabbing"
            data-testid={`button-drag-${block.id}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {showControls && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-card border rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          <span className="text-xs font-medium px-2 text-muted-foreground">{blockInfo.label}</span>
          <div className="h-4 w-px bg-border" />
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => moveBlock(block.id, 'up')}
            data-testid={`button-move-up-${block.id}`}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => moveBlock(block.id, 'down')}
            data-testid={`button-move-down-${block.id}`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => duplicateBlock(block.id)}
            data-testid={`button-duplicate-${block.id}`}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => deleteBlock(block.id)}
            data-testid={`button-delete-${block.id}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      <div className="py-1">{renderContent()}</div>
    </div>
  );
};
