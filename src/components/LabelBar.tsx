import {
  GlobeAltIcon,
  CpuChipIcon,
  ServerStackIcon,
  CubeIcon,
  UsersIcon,
} from "@/lib/icons";

export function LabelBar() {
  const iconClass = "inline-block w-4 h-4 mr-1 text-muted";
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[theme(color.foreground-muted)]">
      <span>
        <GlobeAltIcon className={iconClass} /> Language
      </span>
      <span>
        <CpuChipIcon className={iconClass} /> Tech
      </span>
      <span>
        <ServerStackIcon className={iconClass} /> Infra
      </span>
      <span>
        <CubeIcon className={iconClass} /> Product
      </span>
      <span>
        <UsersIcon className={iconClass} /> Team
      </span>
    </p>
  );
}
