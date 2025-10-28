import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useEditor } from '@/context/EditorContext';
import { getBlockTypeInfo } from '@/lib/blocks';
import { GOOGLE_FONTS, SYSTEM_FONTS } from '@/lib/fonts';
import { PROGRAMMING_LANGUAGES } from '@/lib/blocks';
import type { StyleObject } from '@shared/schema';

export const StyleEditor = () => {
  const { blocks, selectedBlockId, updateBlock, currentBreakpoint, selectBlock } = useEditor();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['typography', 'spacing'])
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="w-[320px] border-l bg-sidebar flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground text-sm">
          <p>Select a block to edit its styles</p>
        </div>
      </div>
    );
  }

  const blockInfo = getBlockTypeInfo(selectedBlock.type);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const currentStyles = selectedBlock.styles[currentBreakpoint] || selectedBlock.styles.desktop || {};

  const updateStyle = (property: string, value: string) => {
    const newStyles = {
      ...selectedBlock.styles,
      [currentBreakpoint]: {
        ...currentStyles,
        [property]: value,
      },
    };
    updateBlock(selectedBlock.id, { styles: newStyles });
  };

  const isCodeBlock = selectedBlock.type === 'code';

  const StyleInput = ({
    label,
    property,
    type = 'text',
    options,
  }: {
    label: string;
    property: string;
    type?: 'text' | 'select' | 'color';
    options?: { value: string; label: string }[];
  }) => {
    const value = currentStyles[property] || '';

    if (type === 'select' && options) {
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Select value={String(value)} onValueChange={(v) => updateStyle(property, v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (type === 'color') {
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={String(value)}
              onChange={(e) => updateStyle(property, e.target.value)}
              className="h-8 w-12 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={String(value)}
              onChange={(e) => updateStyle(property, e.target.value)}
              className="h-8 flex-1 text-xs"
              placeholder="#000000"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{label}</Label>
        <Input
          type="text"
          value={String(value)}
          onChange={(e) => updateStyle(property, e.target.value)}
          className="h-8 text-xs"
          placeholder="auto"
        />
      </div>
    );
  };

  const StyleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const sectionKey = title.toLowerCase().replace(/\s+/g, '-');
    const isExpanded = expandedSections.has(sectionKey);

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover-elevate rounded-md">
          <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 py-2 space-y-3">{children}</CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="w-[320px] border-l bg-sidebar flex flex-col h-full">
      <div className="p-3 border-b flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground">
            Style Editor
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{blockInfo.label}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => selectBlock(null)}
          className="h-7 w-7"
          data-testid="button-close-style-editor"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="style" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b h-9">
          <TabsTrigger value="style" className="flex-1 text-xs" data-testid="tab-style">
            Style
          </TabsTrigger>
          <TabsTrigger value="content" className="flex-1 text-xs" data-testid="tab-content">
            Content
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="style" className="m-0 p-3 space-y-2">
            <StyleSection title="Typography">
              <StyleInput
                label="Font Family"
                property="fontFamily"
                type="select"
                options={[
                  ...SYSTEM_FONTS.map((f) => ({ value: f.value || f.name, label: f.name })),
                  ...GOOGLE_FONTS.map((f) => ({ value: f.name, label: f.name })),
                ]}
              />
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Font Size" property="fontSize" />
                <StyleInput label="Font Weight" property="fontWeight" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Line Height" property="lineHeight" />
                <StyleInput
                  label="Text Align"
                  property="textAlign"
                  type="select"
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' },
                  ]}
                />
              </div>
              <StyleInput label="Color" property="color" type="color" />
            </StyleSection>

            <StyleSection title="Spacing">
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Margin Top" property="marginTop" />
                <StyleInput label="Margin Bottom" property="marginBottom" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Margin Left" property="marginLeft" />
                <StyleInput label="Margin Right" property="marginRight" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Padding Top" property="paddingTop" />
                <StyleInput label="Padding Bottom" property="paddingBottom" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Padding Left" property="paddingLeft" />
                <StyleInput label="Padding Right" property="paddingRight" />
              </div>
            </StyleSection>

            <StyleSection title="Dimensions">
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Width" property="width" />
                <StyleInput label="Height" property="height" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Min Width" property="minWidth" />
                <StyleInput label="Min Height" property="minHeight" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StyleInput label="Max Width" property="maxWidth" />
                <StyleInput label="Max Height" property="maxHeight" />
              </div>
            </StyleSection>

            <StyleSection title="Background & Border">
              <StyleInput label="Background" property="backgroundColor" type="color" />
              <StyleInput label="Border Radius" property="borderRadius" />
              <StyleInput label="Border" property="border" />
            </StyleSection>

            {(selectedBlock.type === 'flex' || selectedBlock.type === 'section') && (
              <StyleSection title="Layout">
                <StyleInput
                  label="Display"
                  property="display"
                  type="select"
                  options={[
                    { value: 'block', label: 'Block' },
                    { value: 'flex', label: 'Flex' },
                    { value: 'grid', label: 'Grid' },
                  ]}
                />
                {currentStyles.display === 'flex' && (
                  <>
                    <StyleInput
                      label="Flex Direction"
                      property="flexDirection"
                      type="select"
                      options={[
                        { value: 'row', label: 'Row' },
                        { value: 'column', label: 'Column' },
                        { value: 'row-reverse', label: 'Row Reverse' },
                        { value: 'column-reverse', label: 'Column Reverse' },
                      ]}
                    />
                    <StyleInput
                      label="Justify Content"
                      property="justifyContent"
                      type="select"
                      options={[
                        { value: 'flex-start', label: 'Start' },
                        { value: 'center', label: 'Center' },
                        { value: 'flex-end', label: 'End' },
                        { value: 'space-between', label: 'Space Between' },
                        { value: 'space-around', label: 'Space Around' },
                      ]}
                    />
                    <StyleInput
                      label="Align Items"
                      property="alignItems"
                      type="select"
                      options={[
                        { value: 'flex-start', label: 'Start' },
                        { value: 'center', label: 'Center' },
                        { value: 'flex-end', label: 'End' },
                        { value: 'stretch', label: 'Stretch' },
                      ]}
                    />
                    <StyleInput label="Gap" property="gap" />
                  </>
                )}
              </StyleSection>
            )}
          </TabsContent>

          <TabsContent value="content" className="m-0 p-3 space-y-3">
            {isCodeBlock && typeof selectedBlock.content === 'object' && selectedBlock.content !== null && 'code' in selectedBlock.content && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Language</Label>
                  <Select
                    value={selectedBlock.content.language}
                    onValueChange={(value) => {
                      updateBlock(selectedBlock.id, {
                        content: { ...selectedBlock.content as any, language: value },
                      });
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-xs">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Code</Label>
                  <textarea
                    value={selectedBlock.content.code}
                    onChange={(e) => {
                      updateBlock(selectedBlock.id, {
                        content: { ...selectedBlock.content as any, code: e.target.value },
                      });
                    }}
                    className="w-full h-64 p-2 text-xs font-mono border rounded-md bg-background resize-none"
                    placeholder="Write your code here..."
                  />
                </div>
              </>
            )}

            {selectedBlock.type === 'image' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Image URL</Label>
                <Input
                  type="text"
                  value={typeof selectedBlock.content === 'string' ? selectedBlock.content : ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                  className="h-8 text-xs"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {selectedBlock.type === 'video' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Video URL</Label>
                <Input
                  type="text"
                  value={typeof selectedBlock.content === 'string' ? selectedBlock.content : ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                  className="h-8 text-xs"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {!isCodeBlock && selectedBlock.type !== 'image' && selectedBlock.type !== 'video' && (
              <div className="text-xs text-muted-foreground">
                Edit content directly in the canvas
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
