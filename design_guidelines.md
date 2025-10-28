# Design Guidelines: Advanced Block-Based Article Editor

## Design Approach

**Selected Framework**: Hybrid approach drawing from Linear (minimalist aesthetics, clean typography) + VS Code (editor interface patterns) + Notion (block-based interactions)

**Core Principle**: Minimalist interface that doesn't hide power. Every pixel serves a purpose, with advanced features accessible but not overwhelming.

---

## Typography System

**Primary Font**: Inter (via Google Fonts CDN)
- Interface Labels: 13px, weight 500
- Block Content: 15px, weight 400
- Headings in Editor: 14px, weight 600
- Code/Monospace: JetBrains Mono, 13px

**Type Hierarchy**:
- Panel Titles: 12px uppercase, weight 600, letter-spacing 0.5px
- Input Labels: 12px, weight 500
- Helper Text: 11px, weight 400, reduced opacity
- Button Text: 13px, weight 500

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16 exclusively
- Component padding: p-4
- Panel gaps: gap-3
- Section spacing: mb-6
- Tight spacing: gap-2
- Icon padding: p-2

**Editor Layout Structure**:

1. **Three-Column Layout** (Desktop):
   - Left Sidebar (280px fixed): Block library, categorized and searchable
   - Center Canvas (flex-1, max-w-4xl): Main editing area with blocks
   - Right Panel (320px fixed): Style editor and properties

2. **Responsive Breakdowns**:
   - Tablet: Two-column (hide left sidebar, show as overlay/drawer)
   - Mobile: Single column (both sidebars as bottom sheets/modals)

3. **Top Toolbar** (h-14, fixed):
   - Left: Logo/title, article name (editable inline)
   - Center: Mode toggle (Edit/Preview), breakpoint selector
   - Right: Undo/Redo, Export JSON, Settings

---

## Component Library

### Block Canvas Components

**Block Container**:
- Wrapper with 1px border (subtle, appears on hover)
- Hover state: Show mini toolbar (drag handle, block type, delete, duplicate)
- Selected state: 2px border, bright accent
- Drag handle: 6-dot grid icon, appears on left on hover
- Corner radius: rounded-md (6px)
- Padding: p-3 around content
- Margin between blocks: mb-3

**Block Types Visual Treatment**:
- Text Blocks: Minimal chrome, focus on content
- Media Blocks: Aspect ratio containers, upload drop zones with dashed borders
- Code Blocks: Dark theme inset, language badge in top-right
- Container Blocks (Flex/Section): Light background, dashed border in edit mode, nested depth indicated by subtle left border

**Empty States**:
- Canvas empty: Large centered illustration, "Click or drag blocks to start"
- Container empty: Dashed outline, "Drop blocks here" message

### Left Sidebar - Block Library

**Structure**:
- Search bar at top (h-10, rounded-lg, with icon)
- Categorized accordion sections (Text, Media, Code, Layout)
- Each category: Collapsed by default except Text

**Block Cards**:
- Compact cards (h-12, flex items-center)
- Icon (20px) + Label (13px)
- Hover: Slight background, cursor-grab
- Draggable: Show drag ghost with block preview

**Categories**:
- Visual separators between categories
- Category headers: Sticky, with collapse icon

### Right Panel - Style Editor

**Panel Header** (h-12):
- Block type badge + name
- Close button (collapse panel)

**Tab Navigation** (if block selected):
- Style, Content, Animation (horizontal tabs, underline indicator)

**Style Controls Layout**:
- Grouped sections with clear labels
- Collapsible accordions for: Typography, Spacing, Sizing, Colors, Borders, Effects, Layout
- Each section: Label (12px, weight 600) + controls below

**Input Types**:
1. **Number Inputs**: Compact (w-20), with unit selector (px, rem, %, vh, auto)
2. **Color Pickers**: Swatch preview + hex input, popover with full picker
3. **Dropdowns**: Clean selects with custom styling, 12px options
4. **Range Sliders**: For opacity, spacing, with numeric input alongside
5. **Toggle Switches**: For boolean properties (ON/OFF states clear)
6. **Icon Buttons**: For alignment (left/center/right), flex direction

**Breakpoint Selector**:
- Three buttons (Mobile/Tablet/Desktop) at top of Style panel
- Active breakpoint highlighted
- Badge showing inherited/custom styles per breakpoint

**Property Grid**:
- Two-column layout for compact properties (e.g., margin-left, margin-right side by side)
- Four-column for box model (top, right, bottom, left in grid)
- Gap: gap-2 between inputs

### Toolbar & Navigation

**Main Toolbar**:
- Background: Subtle elevated surface
- Border bottom: 1px
- Icons: 18px, with tooltips on hover
- Button groups separated by subtle dividers

**Mode Toggle**:
- Segmented control design (Edit | Preview)
- Active state: Filled background
- Smooth transition between modes

**Action Buttons**:
- Primary: Export JSON (filled, accent)
- Secondary: Undo/Redo (ghost buttons, icon-only)
- Danger: Clear All (ghost, red on hover)

### Modals & Overlays

**Media Upload Modal**:
- Drag-and-drop zone (large, dashed border)
- OR file browser button
- Preview thumbnails for uploaded items
- URL input option for external media

**Code Block Settings**:
- Language selector dropdown (searchable)
- Theme toggle (light/dark for code preview)
- Line numbers toggle
- Copy button in preview mode

**Export Modal**:
- JSON preview (syntax highlighted, read-only)
- Copy to clipboard button
- Download as file button
- Beautiful formatted JSON with proper indentation

---

## Interaction Patterns

**Drag and Drop**:
- Smooth animation (200ms ease-out) when reordering
- Drop zones: 2px dashed accent line appears between blocks
- Ghost preview follows cursor with slight opacity
- Snap to valid drop zones

**Block Selection**:
- Single click: Select block, show style panel
- Double click on text: Enter inline editing mode
- Click outside: Deselect

**Inline Editing**:
- Text blocks: Click to edit, contentEditable with clean cursor
- No borders in edit mode, just cursor
- ESC to exit editing

**Hover States**:
- Blocks: Subtle border appears
- Buttons: Background brightness shift
- Inputs: Border accent
- All transitions: 150ms ease

**Animations** (use sparingly):
- Panel slide-ins: 250ms ease-out
- Block add/remove: 200ms scale + fade
- No continuous animations
- Prefer instant feedback over decorative motion

---

## Visual Hierarchy & Depth

**Elevation System**:
- Canvas: Base level (white/light background)
- Sidebars: +1 elevation (subtle shadow or darker background)
- Toolbar: +2 elevation (stronger shadow, sticky)
- Modals: +3 elevation (overlay + strong shadow)
- Tooltips: +4 elevation

**Focus States**:
- Keyboard navigation: 2px outline, accent, offset 2px
- All interactive elements must have visible focus

---

## Accessibility

**Keyboard Navigation**:
- Tab through all controls
- Arrow keys to navigate between blocks
- CMD/CTRL+C/V for copy/paste blocks
- Delete key to remove selected block
- CMD/CTRL+Z for undo

**Screen Reader Support**:
- All controls labeled with aria-labels
- Block type announced when selected
- Live regions for dynamic updates (block added/removed)

**Color Contrast**:
- Text on backgrounds: Minimum 4.5:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Focus indicators: High contrast

---

## Responsive Behavior

**Desktop (1280px+)**:
- Three-column layout active
- All panels visible
- Comfortable spacing

**Tablet (768px - 1279px)**:
- Left sidebar collapses to floating drawer
- Two-column: Canvas + Right panel
- Toggle button for block library

**Mobile (<768px)**:
- Single column canvas
- Bottom sheet for style controls
- Floating action button for block library
- Simplified toolbar (essential actions only)

---

## No Images Required

This is a tool/application interface - no hero images or marketing imagery needed. All visuals are functional UI elements, icons, and user-generated content within blocks.