"use client"

import { Button } from "@/components/ui/button"

interface SourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export function SourceSelector({ selectedSource, onSourceChange }: SourceSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={selectedSource === 'kandilli' ? 'default' : 'outline'}
        onClick={() => onSourceChange('kandilli')}
      >
        Kandilli
      </Button>
      <Button
        variant={selectedSource === 'afad' ? 'default' : 'outline'}
        onClick={() => onSourceChange('afad')}
      >
        AFAD
      </Button>
      <Button
        variant={selectedSource === 'usgs' ? 'default' : 'outline'}
        onClick={() => onSourceChange('usgs')}
      >
        USGS
      </Button>
    </div>
  )
}