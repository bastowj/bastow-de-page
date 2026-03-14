import {
  GlobeAltIcon,
  CpuChipIcon,
  ServerStackIcon,
  CubeIcon,
  UsersIcon,
} from "@/lib/icons";

export function LabelBar() {
  return (
    <p className="label-bar">
      <span>
        <GlobeAltIcon className="label-bar-icon" /> Language
      </span>
      <span>
        <CpuChipIcon className="label-bar-icon" /> Tech
      </span>
      <span>
        <ServerStackIcon className="label-bar-icon" /> Infra
      </span>
      <span>
        <CubeIcon className="label-bar-icon" /> Product
      </span>
      <span>
        <UsersIcon className="label-bar-icon" /> Team
      </span>
    </p>
  );
}
