import { useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { blockTypesByCategory, getBlockTypeInfo, createNewBlock } from '@/lib/blocks';
import type { BlockType } from '@shared/schema';
import { useEditor } from '@/context/EditorContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const BlockPalette = () => {
  const { addBlock } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['text']));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleAddBlock = (type: BlockType) => {
    const block = createNewBlock(type);
    addBlock(block);
  };

  const filteredCategories = Object.entries(blockTypesByCategory).reduce((acc, [category, blocks]) => {
    const filtered = blocks.filter(block =>
      block.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof blockTypesByCategory[string]>);

  const categoryLabels: Record<string, string> = {
    text: 'Text',
    media: 'Media',
    code: 'Code',
    layout: 'Layout',
  };

  return (
    <div className="w-[280px] border-r bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground mb-3">
          Block Library
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocks..."
            className="pl-9 h-9 text-sm bg-background"
            data-testid="input-search-blocks"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {Object.entries(filteredCategories).map(([category, blocks]) => (
            <Collapsible
              key={category}
              open={expandedCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-medium text-sidebar-foreground hover-elevate rounded-md group">
                <span className="uppercase tracking-wide">{categoryLabels[category]}</span>
                {expandedCategories.has(category) ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {blocks.map((blockInfo) => {
                  const Icon = blockInfo.icon;
                  return (
                    <button
                      key={blockInfo.type}
                      onClick={() => handleAddBlock(blockInfo.type)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover-elevate active-elevate-2 text-left group transition-colors"
                      data-testid={`button-add-block-${blockInfo.type}`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent text-accent-foreground">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-sidebar-foreground">
                        {blockInfo.label}
                      </span>
                    </button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {Object.keys(filteredCategories).length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No blocks found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
