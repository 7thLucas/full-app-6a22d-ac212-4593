import { useConfigurables } from "~/modules/configurables";

/**
 * BrandMark — renders the app logo (if configured) + app name, both sourced
 * from configurables. Never hardcode the brand.
 */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { config, loading } = useConfigurables();

  const appName = config?.appName || "AnchorFlow";
  const logoUrl =
    config?.logoUrl && !config.logoUrl.startsWith("FILL_") ? config.logoUrl : "";

  return (
    <div className="flex items-center gap-2.5 select-none">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={appName}
          className="h-8 w-8 rounded-lg object-cover"
        />
      ) : (
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: "var(--primary)" }}
          aria-hidden
        >
          {(appName[0] ?? "A").toUpperCase()}
        </span>
      )}
      {!compact && (
        <span className="text-[17px] font-semibold tracking-tight text-[#111111]">
          {loading ? "…" : appName}
        </span>
      )}
    </div>
  );
}
