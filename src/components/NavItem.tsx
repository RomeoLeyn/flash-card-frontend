type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  count?: number;
  accent?: boolean;
  onClick: () => void;
};

export function NavItem({ icon, label, active, count, accent, onClick }: NavItemProps) {
  return (
    <button onClick={onClick} className={`side-link w-full ${active ? 'side-link-active' : ''}`}>
      <span className={accent ? 'text-[#d59042]' : ''}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span className={`ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-bold ${accent ? 'bg-[#fff0d9] text-[#c37b2d]' : 'bg-[#eff3ef] text-[#7b8b82]'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
