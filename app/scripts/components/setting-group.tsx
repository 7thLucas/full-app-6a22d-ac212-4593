import { cn } from "~/lib/utils";

interface SettingGroupProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * SettingGroup — a clean segmented pill control for a single script setting.
 * Wraps gracefully on small screens.
 */
export function SettingGroup({
  label,
  options,
  value,
  onChange,
  disabled,
}: SettingGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-transparent text-white shadow-sm"
                  : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB] hover:bg-[#FAFAFA]",
              )}
              style={active ? { background: "var(--primary)" } : undefined}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
