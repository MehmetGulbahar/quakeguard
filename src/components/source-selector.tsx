"use client"

import { Button } from "@/components/ui/button"

interface SourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export function SourceSelector({ selectedSource, onSourceChange }: SourceSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 h-8"
        variant={selectedSource === 'kandilli' ? 'default' : 'outline'}
        onClick={() => onSourceChange('kandilli')}
      >
        Kandilli
      </Button>
      <Button
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 h-8"
        variant={selectedSource === 'afad' ? 'default' : 'outline'}
        onClick={() => onSourceChange('afad')}
      >
        AFAD
      </Button>
      <Button
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 h-8"
        variant={selectedSource === 'usgs' ? 'default' : 'outline'}
        onClick={() => onSourceChange('usgs')}
      >
        USGS
      </Button>
      <Button
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 h-8"
        variant={selectedSource === 'geofon' ? 'default' : 'outline'}
        onClick={() => onSourceChange('geofon')}
      >
        GEOFON
      </Button>
      <Button
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 h-8"
        variant={selectedSource === 'emsc' ? 'default' : 'outline'}
        onClick={() => onSourceChange('emsc')}
      >
        EMSC
      </Button>
    </div>
  )
}