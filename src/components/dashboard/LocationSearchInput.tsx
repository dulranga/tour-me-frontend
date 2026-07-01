import { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '#/lib/utils'
import { isPointInSriLanka } from '#/lib/sriLanka'

interface LocationResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface LocationSearchInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (address: string, lat?: number, lng?: number) => void
}

export function LocationSearchInput({
  label,
  placeholder,
  value,
  onChange,
}: LocationSearchInputProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchResults = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=jsonv2&addressdetails=1&limit=5&countrycodes=lk`,
          {
            headers: {
              'User-Agent': 'TourMe-App/1.0 (contact@tourme.com)',
            },
          },
        )
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Nominatim search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 600),
    [],
  )

  useEffect(() => {
    if (query) {
      fetchResults(query)
    } else {
      setResults([])
    }
  }, [query, fetchResults])

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative group cursor-pointer">
            <Input
              placeholder={placeholder}
              value={query || value}
              onFocus={() => {
                if (query.length >= 3) setOpen(true)
              }}
              onChange={(e) => {
                const newValue = e.target.value
                setQuery(newValue)
                if (newValue.length >= 3) {
                  setOpen(true)
                }
              }}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronsUpDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              {results.length === 0 && !isLoading && query.length >= 3 && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  No results found.
                </div>
              )}
              {query.length < 3 && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  Please type at least 3 characters.
                </div>
              )}
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.place_id}
                    value={result.display_name}
                    onSelect={() => {
                      const lat = parseFloat(result.lat)
                      const lng = parseFloat(result.lon)

                      if (!isPointInSriLanka({ lat, lng })) {
                        toast.error('Please select a location within Sri Lanka.')
                        return
                      }

                      onChange(result.display_name, lat, lng)
                      setQuery(result.display_name)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === result.display_name
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <span className="truncate">{result.display_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
