import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Filters {
  equipment: string[];
  minRating: number;
  showUnvalidated: boolean;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
  availableEquipment: { name: string; count: number }[];
  isAdmin?: boolean;
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  availableEquipment,
  isAdmin = false,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = React.useState<Filters>(filters);

  React.useEffect(() => { setLocalFilters(filters); }, [filters]);

  const toggleEquipment = (name: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(name)
        ? prev.equipment.filter((e) => e !== name)
        : [...prev.equipment, name],
    }));

  const handleApply = () => { onApplyFilters(localFilters); onClose(); };

  const handleReset = () => {
    const reset: Filters = { equipment: [], minRating: 0, showUnvalidated: false };
    setLocalFilters(reset);
    onApplyFilters(reset);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[70vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-lg">Filter</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-5">
          
          {/* Equipment */}
          <div>
            <h3 className="font-medium mb-3">Equipment</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableEquipment.map((eq) => (
                <div
                  key={eq.name}
                  onClick={() => toggleEquipment(eq.name)}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    localFilters.equipment.includes(eq.name)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Checkbox
                    id={eq.name}
                    checked={localFilters.equipment.includes(eq.name)}
                    onCheckedChange={() => toggleEquipment(eq.name)}
                  />
                  <Label htmlFor={eq.name} className="cursor-pointer text-sm">
                    {eq.name} ({eq.count})
                  </Label>
                </div>
              ))}
              {availableEquipment.length === 0 && (
                <p className="text-sm text-gray-400 col-span-2">Keine Spots geladen</p>
              )}
            </div>
          </div>

          {/* Min Rating */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Mindestbewertung</h3>
            <RadioGroup
              value={localFilters.minRating.toString()}
              onValueChange={(value: string) =>
                setLocalFilters((prev) => ({ ...prev, minRating: parseInt(value) }))
              }
              className="flex gap-3"
            >
              <div
                className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer ${
                  localFilters.minRating === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
                onClick={() => setLocalFilters(prev => ({ ...prev, minRating: 0 }))}
              >
                <RadioGroupItem value="0" id="rating-all" className="sr-only" />
                <Label htmlFor="rating-all" className="cursor-pointer text-sm">Alle</Label>
              </div>
              <div
                className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer ${
                  localFilters.minRating === 4 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
                onClick={() => setLocalFilters(prev => ({ ...prev, minRating: 4 }))}
              >
                <RadioGroupItem value="4" id="rating-4" className="sr-only" />
                <Label htmlFor="rating-4" className="cursor-pointer text-sm">⭐⭐⭐⭐+</Label>
              </div>
              <div
                className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer ${
                  localFilters.minRating === 5 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
                onClick={() => setLocalFilters(prev => ({ ...prev, minRating: 5 }))}
              >
                <RadioGroupItem value="5" id="rating-5" className="sr-only" />
                <Label htmlFor="rating-5" className="cursor-pointer text-sm">⭐⭐⭐⭐⭐</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Admin */}
          {isAdmin && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-unvalidated"
                  checked={localFilters.showUnvalidated}
                  onCheckedChange={(checked: boolean) =>
                    setLocalFilters((prev) => ({ ...prev, showUnvalidated: checked }))
                  }
                />
                <Label htmlFor="show-unvalidated" className="cursor-pointer">
                  Unvalidierte Spots anzeigen (Admin)
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">Zurücksetzen</Button>
          <Button onClick={handleApply} className="flex-1">Anwenden</Button>
        </div>
      </div>
    </>
  );
}
