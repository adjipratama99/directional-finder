import { useEffect, useState } from "react"
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
}

type SelectProps = {
    options: Option[]
    placeholder?: string
    className?: string
    fullWidth?: boolean
    isMulti?: boolean
    value?: string | string[]
    onChange: (val: string | string[]) => void
} & Omit<React.ComponentProps<typeof SelectUI>, "value" | "onValueChange">

export function Select({
    options,
    placeholder,
    className,
    fullWidth,
    isMulti = false,
    value,
    onChange,
    ...props
}: SelectProps) {
    const [multiValue, setMultiValue] = useState<string[]>(
        Array.isArray(value) ? value : []
    )

    // Sync internal state dengan props.value setiap value berubah
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
            <SelectContent className="max-h-[50vh]">
                <SelectGroup>
                    {options.map((v: { text: string, value: string, exist?: boolean }) => (
                        <SelectItem
                            key={v.value}
                            value={v.value}
                            onClick={(e) => {
                                if (isMulti) {
                                    e.preventDefault() // ⚠️ penting: biar menu gak ketutup
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
                    
                    ))}
                </SelectGroup>
            </SelectContent>
        </SelectUI>
    )
}
