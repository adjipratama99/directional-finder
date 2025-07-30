import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export type Option = {
    value: string
    text: string
    exist?: boolean
}

type ComboBoxProps = {
    options?: Option[]
    placeholder?: string
    isModal?: boolean
    className?: string
    fullWidth?: boolean
    groupedOptions?: Record<string, Option[]>
    isMulti?: boolean
    value?: string | string[]
    onChange: (val: string | string[]) => void
    disabled?: boolean
}

export function Select({
    options = [],
    groupedOptions,
    placeholder = "Select",
    className,
    fullWidth,
    isMulti = false,
    value,
    onChange,
    isModal = false,
    disabled = false,
}: ComboBoxProps) {
    const [open, setOpen] = React.useState(false)
    const [multiValue, setMultiValue] = React.useState<string[]>(Array.isArray(value) ? value : [])

    React.useEffect(() => {
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
            if (value === val) {
                onChange("") // unselect
            } else {
                onChange(val)
                setOpen(false)
            }
        }
    }

    const displayText = React.useMemo(() => {
        // Bikin semua options jadi satu array flat
        const flatOptions: Option[] = (Array.isArray(options) && options.length)
            ? options
            : Object.values((groupedOptions as Record<string, Option[]>) ?? {}).flat() as Option[];
    
        if (isMulti) {
            if (multiValue.length === 0) return placeholder;
    
            return multiValue
                .map((val) => flatOptions.find((o) => o.value === val)?.text || val)
                .join(", ");
        } else {
            const selected = flatOptions.find((o) => o.value === value);
            return selected?.text || placeholder;
        }
    }, [multiValue, value, options, isMulti, placeholder]);
    

    return (
        <Popover open={open} onOpenChange={!disabled ? setOpen : () => {}} modal={isModal}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "justify-between max-w-auto",
                        fullWidth && "w-full",
                        className
                    )}
                >
                    <span
                        className={cn(
                            (isMulti ? multiValue.length === 0 : !value) && "text-muted-foreground",
                            disabled && "opacity-50"
                        )}
                    >
                        {displayText}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto">
                <Command>
                    <CommandInput placeholder="Search..." disabled={disabled} />
                    <CommandEmpty>No results found.</CommandEmpty>
                        {
                        options.length ?
                        <CommandGroup>
                            { options.map((option) => {
                                const isSelected = isMulti
                                    ? multiValue.includes(option.value)
                                    : value === option.value
                                return (
                                    <CommandItem
                                        key={option.value}
                                        disabled={disabled}
                                        onSelect={() => handleChange(option.value)}
                                        className={cn(option.exist && "text-blue-500")}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            {isMulti && (
                                                <input
                                                    type="checkbox"
                                                    readOnly
                                                    checked={isSelected}
                                                    className="pointer-events-none"
                                                />
                                            )}
                                            <span className="flex-1">{option.text}</span>
                                            {isSelected && !isMulti && (
                                                <Check className="ml-auto h-4 w-4" />
                                            )}
                                        </div>
                                    </CommandItem>
                                )
                            }) }
                        </CommandGroup>
                        :
                        groupedOptions &&
                            Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                                <CommandGroup key={groupName} heading={groupName}>
                                    {groupOptions.map((option) => {
                                        const isSelected = isMulti
                                            ? multiValue.includes(option.value)
                                            : value === option.value
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                disabled={disabled}
                                                onSelect={() => handleChange(option.value)}
                                                className={cn(option.exist && "text-blue-500")}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    {isMulti && (
                                                        <input
                                                            type="checkbox"
                                                            readOnly
                                                            checked={isSelected}
                                                            className="pointer-events-none"
                                                        />
                                                    )}
                                                    <span className="flex-1">{option.text}</span>
                                                    {isSelected && !isMulti && (
                                                        <Check className="ml-auto h-4 w-4" />
                                                    )}
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            ))
                    }
                </Command>
            </PopoverContent>
        </Popover>
    )
}