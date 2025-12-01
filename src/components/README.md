# Components Structure - Cartify

Komponen diorganisir berdasarkan **functional domain** untuk reusability maksimal.

## 📂 Folder Structure

### 1. **`ui/`** - Generic UI Components
**Purpose:** Reusable presentational components (Design System)  
**Files:**
- `Button.tsx` - Primary, Secondary, Outline buttons
- `Input.tsx` - Text input dengan validation
- `Card.tsx` - Container card component
- `Badge.tsx` - Status badges (success, warning, danger)
- `ProgressBar.tsx` - Generic progress indicator
- `Modal.tsx` - Generic modal wrapper
- `Divider.tsx` - Section dividers
- `EmptyState.tsx` - Empty state illustrations
- `LoadingSpinner.tsx` - Loading animations
- `IconButton.tsx` - Icon-only buttons

---

### 2. **`budget/`** - Budget-Related Components
**Purpose:** Components khusus untuk budget tracking  
**Files:**
- `BudgetProgressBar.tsx` - Visual progress bar (spent vs limit)
- `BudgetIndicator.tsx` - Colored indicator (green/yellow/red)
- `BudgetSummaryCard.tsx` - Summary card (total, remaining)
- `BudgetSlider.tsx` - Interactive slider untuk set budget
- `OverBudgetAlert.tsx` - Alert banner saat over budget

---

### 3. **`shopping/`** - Shopping Session Components
**Purpose:** Components untuk shopping cart & items  
**Files:**
- `ShoppingItemCard.tsx` - Single item card di cart
- `ItemQuantitySelector.tsx` - +/- quantity buttons
- `PriceDisplay.tsx` - Formatted price display (Rp format)
- `CategoryTag.tsx` - Product category tags (future: Fase 2)
- `ItemList.tsx` - Scrollable list of items
- `CartSummary.tsx` - Bottom sheet summary (total items, total price)

---

### 4. **`voice/`** - Voice Input Components
**Purpose:** Voice recording & processing UI  
**Files:**
- `MicrophoneButton.tsx` - Large mic button dengan pulse animation
- `WaveformVisualizer.tsx` - Audio waveform animation saat recording
- `VoicePermissionPrompt.tsx` - Permission request UI
- `VoiceParsingResult.tsx` - Display hasil parsing (qty, name, price)
- `VoiceErrorFeedback.tsx` - Error state UI saat parsing gagal
- `VoiceCommandHint.tsx` - Tooltip/hint cara pakai voice command

---

### 5. **`history/`** - History & Analytics Components
**Purpose:** Components untuk history screens  
**Files:**
- `SessionCard.tsx` - Card untuk 1 shopping session
- `SessionListItem.tsx` - List item untuk history
- `DateRangePicker.tsx` - Date filter picker
- `SpendingChart.tsx` - Bar/line chart (future: Fase 4)
- `CategoryBreakdown.tsx` - Pie chart category spending (future)
- `InflationTracker.tsx` - Price trend tracker (future: Fase 4)

---

### 6. **`wrapper/`** - Layout Wrappers
**Purpose:** Screen layout utilities (already exists)  
**Files:**
- `ScreenWrapper.tsx` - SafeArea + KeyboardAvoidingView wrapper

---

## 🎨 Component Design Principles

### 1. **Atomic Design**
- **Atoms:** Button, Input, Badge, Divider
- **Molecules:** BudgetProgressBar, ItemQuantitySelector
- **Organisms:** ShoppingItemCard, SessionCard
- **Templates:** ScreenWrapper

### 2. **Prop Interface**
Setiap component harus punya clear TypeScript interface:
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

### 3. **Style Consistency**
- Gunakan Design System dari `/src/theme/colors.ts` & `typography.ts`
- Gunakan `responsive.ts` untuk responsive sizing
- Gunakan `layout.ts` constants untuk spacing

### 4. **Reusability**
- Component harus stateless jika memungkinkan
- Business logic ada di screens, bukan di component
- Use custom hooks (`/src/hooks/`) untuk shared logic

---

## 📝 Naming Convention
- Component files: `PascalCase.tsx`
- Props interface: `ComponentNameProps`
- Styles: `StyleSheet.create()` di bottom file atau external `styles.ts`
