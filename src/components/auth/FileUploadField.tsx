import * as React from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { useState, useRef } from 'react'

import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'

type FileUploadFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  description?: string
  accept?: string
}

export default function FileUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  accept,
}: FileUploadFieldProps<TFieldValues>) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (
    e: React.DragEvent,
    onChange: (file: File | null) => void,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      onChange(file)
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    onChange(file)
  }

  const handleRemoveFile = (onChange: (file: File | null) => void) => {
    setSelectedFile(null)
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange } }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div
                  className={cn(
                    'relative flex items-center justify-center rounded-md border-2 border-dashed border-border-default bg-bg-elevated px-6 py-8 transition-colors',
                    isDragging && 'border-accent bg-accent/10 shadow-sm',
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, onChange)}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <svg
                      className={cn(
                        'h-8 w-8 transition-colors',
                        isDragging ? 'text-accent-teal' : 'text-text-muted',
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Drag and drop your file here
                      </p>
                      <p className="text-xs text-text-muted">
                        or click to browse
                      </p>
                    </div>
                  </div>
                  <Input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={(event) => handleInputChange(event, onChange)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between rounded-md border border-border-default bg-bg-elevated px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-accent-teal"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(onChange)}
                      className="ml-2 flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
