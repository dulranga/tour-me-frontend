import * as React from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import { Input } from '#/components/ui/input'
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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, ...rest } = field

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept={accept}
                onChange={(event) =>
                  onChange(event.target.files?.[0] ?? null)
                }
                {...rest}
              />
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
