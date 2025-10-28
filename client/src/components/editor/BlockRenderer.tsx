import { useMemo, useRef, useEffect } from 'react';
import { GripVertical, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Block, Breakpoint } from '@shared/schema';
import { getBlockTypeInfo, applyStylesToElement } from '@/lib/blocks';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/vs2015.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
}

export const BlockRenderer = ({ block, isSelected, onSelect }: BlockRendererProps) => {
  const { updateBlock, deleteBlock, duplicateBlock, moveBlock, currentBreakpoint, mode } = useEditor();
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

  const handleContentChange = (newContent: string | string[]) => {
    updateBlock(block.id, { content: newContent });
  };

  const handleTextInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    handleContentChange(text);
  };

  const handleListItemChange = (index: number, value: string) => {
    if (Array.isArray(block.content)) {
      const newList = [...block.content];
      newList[index] = value;
      handleContentChange(newList);
    }
  };

  const addListItem = () => {
    if (Array.isArray(block.content)) {
      handleContentChange([...block.content, 'New item']);
    }
  };

  const removeListItem = (index: number) => {
    if (Array.isArray(block.content)) {
      const newList = block.content.filter((_, i) => i !== index);
      handleContentChange(newList);
    }
  };

  const isEditMode = mode === 'edit';
  const showControls = isEditMode && isSelected;

  const renderContent = () => {
    const isTextBlock = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'paragraph', 'caption', 'quote'].includes(block.type);

    if (block.type === 'divider') {
      return <hr ref={contentRef as any} />;
    }

    if (block.type === 'code' && typeof block.content === 'object' && block.content !== null && 'code' in block.content) {
      const highlighted = useMemo(() => {
        try {
          return hljs.highlight(block.content.code, { language: block.content.language }).value;
        } catch {
          return block.content.code;
        }
      }, [block.content.code, block.content.language]);

      return (
        <div ref={contentRef as any} className="relative">
          <pre className="rounded-md overflow-x-auto" style={{ margin: 0 }}>
            <code
              className={`hljs language-${block.content.language}`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
          {isEditMode && (
            <div className="absolute top-2 right-2 text-xs bg-background/90 px-2 py-1 rounded">
              {block.content.language}
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'list' && Array.isArray(block.content)) {
      return (
        <ul ref={contentRef as any} style={{ listStyleType: 'disc' }}>
          {block.content.map((item, index) => (
            <li key={index} className="relative group">
              <div
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleListItemChange(index, e.currentTarget.textContent || '')}
                className={isEditMode ? 'outline-none focus:ring-1 ring-primary rounded px-1' : ''}
              >
                {item}
              </div>
              {isEditMode && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -right-8 top-0 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => removeListItem(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </li>
          ))}
          {isEditMode && (
            <li>
              <Button
                size="sm"
                variant="ghost"
                onClick={addListItem}
                className="h-6 text-xs mt-1"
              >
                + Add item
              </Button>
            </li>
          )}
        </ul>
      );
    }

    if (block.type === 'numbered-list' && Array.isArray(block.content)) {
      return (
        <ol ref={contentRef as any} style={{ listStyleType: 'decimal' }}>
          {block.content.map((item, index) => (
            <li key={index} className="relative group">
              <div
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleListItemChange(index, e.currentTarget.textContent || '')}
                className={isEditMode ? 'outline-none focus:ring-1 ring-primary rounded px-1' : ''}
              >
                {item}
              </div>
              {isEditMode && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -right-8 top-0 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => removeListItem(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </li>
          ))}
          {isEditMode && (
            <li>
              <Button
                size="sm"
                variant="ghost"
                onClick={addListItem}
                className="h-6 text-xs mt-1"
              >
                + Add item
              </Button>
            </li>
          )}
        </ol>
      );
    }

    if (block.type === 'image') {
      return (
        <div ref={contentRef as any} className="relative">
          {block.content && typeof block.content === 'string' ? (
            <img src={block.content} alt="Block image" className="w-full" />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Click to upload image
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'video') {
      return (
        <div ref={contentRef as any} className="relative">
          {block.content && typeof block.content === 'string' ? (
            <video src={block.content} controls className="w-full" />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Click to upload video
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'section' || block.type === 'flex') {
      return (
        <div ref={contentRef as any} className="min-h-[100px]">
          {block.children && block.children.length > 0 ? (
            block.children.map((child) => (
              <BlockRenderer
                key={child.id}
                block={child}
                isSelected={false}
                onSelect={() => {}}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              Drop blocks here
            </div>
          )}
        </div>
      );
    }

    if (isTextBlock) {
      return (
        <div
          ref={contentRef as any}
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onInput={handleTextInput}
          data-placeholder={`Enter ${blockInfo.label.toLowerCase()}...`}
          className={isEditMode ? 'outline-none focus:ring-1 ring-primary rounded-sm px-1' : ''}
        >
          {typeof block.content === 'string' ? block.content : ''}
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
