interface CheckboxOption {
    label: string;
    value: string;
}

interface CheckboxGroupProps {
    className?: string;
    options: CheckboxOption[];
    value: string[];
    onChange?: (value: string[]) => void;
}

export function CheckboxGroup({ className,options, value, onChange }: CheckboxGroupProps) {
    const handleChange = (checked: boolean, optionValue: string) => {

        if(onChange) {
            if (checked) {
                onChange([...value, optionValue]);
            } else {
                onChange(value.filter(v => v !== optionValue));
            }
        }

    };

    return (
        <div className={`${className} box-flex gap24 fw-wrap`}>
            {options.map(opt => (
                <label key={opt.value} className="box-flex gap8">
                    <input
                        type="checkbox"
                        checked={value.includes(opt.value)}
                        onChange={(e) => handleChange(e.target.checked, opt.value)}
                    />
                    {opt.label}
                </label>

            ))}
        </div>
    );
}
