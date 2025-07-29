import { useEffect, useMemo, useState } from "react"
import {
    Select as SelectUI,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Option = {
    value: string
    text: string
    exist?: boolean
}

type SelectProps = {
    options: Option[]
    placeholder?: string
    className?: string
    fullWidth?: boolean
    isMulti?: boolean
    value?: string | string[]
    searchable?: boolean
    onChange: (val: string | string[]) => void
} & Omit<React.ComponentProps<typeof SelectUI>, "value" | "onValueChange">

export function Select({
    options,
    placeholder,
    className,
    fullWidth,
    isMulti = false,
    searchable = false,
    value,
    onChange,
    ...props
}: SelectProps) {
    const [multiValue, setMultiValue] = useState<string[]>(
        Array.isArray(value) ? value : []
    )

    const [search, setSearch] = useState("")

    useEffect(() => {
        if (isMulti && Array.isArray(value)) {
            setMultiValue(value)
        }
    }, [value, isMulti])

    const handleChange = (val: string) => {
        if (isMulti) {
            let newValue: string[]
            if (multiValue.includes(val)) {
                newValue = multiValue.filter((v) => v !== val)
            } else {
                newValue = [...multiValue, val]
            }
            setMultiValue(newValue)
            onChange(newValue)
        } else {
            onChange(val)
        }
    }

    const filteredOptions = useMemo(() => {
        return options.filter((o) =>
            o.text.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, options])

    return (
        <SelectUI
            {...props}
            value={isMulti ? undefined : (value as string)}
            onValueChange={handleChange}
        >
            <SelectTrigger className={cn(fullWidth ? "w-full" : "w-auto", className)}>
                <SelectValue
                    placeholder={placeholder}
                    {...(isMulti && {
                        children:
                            multiValue.length > 0
                                ? multiValue
                                      .map((val) => {
                                          const found = options.find((o) => o.value === val)
                                          return found?.text || val
                                      })
                                      .join(", ")
                                : placeholder,
                    })}
                />
            </SelectTrigger>
            <SelectContent className="max-h-[60vh]">
                {searchable && (
                    <div className="px-3 py-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-1 text-sm border rounded-md outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                )}
                <SelectGroup>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((v) => (
                            <SelectItem
                                key={v.value}
                                value={v.value}
                                onClick={(e) => {
                                    if (isMulti) {
                                        e.preventDefault()
                                        handleChange(v.value)
                                    }
                                }}
                                className={cn(
                                    isMulti && multiValue.includes(v.value) && "bg-accent text-accent-foreground",
                                    v.exist && "text-blue-500"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {isMulti && (
                                        <input
                                            type="checkbox"
                                            checked={multiValue.includes(v.value)}
                                            readOnly
                                            className="pointer-events-none"
                                        />
                                    )}
                                    {v.text}
                                </div>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            No results found.
                        </div>
                    )}
                </SelectGroup>
            </SelectContent>
        </SelectUI>
    )
}