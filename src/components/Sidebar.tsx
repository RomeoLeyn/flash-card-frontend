import {
  BarChart3,
  BrainCircuit,
  Folder,
  Menu,
  Plus,
  Search,
  Settings2,
} from "lucide-react";
import type { Card, Category } from "@/types/flashcards";
import { NavItem } from "./NavItem";

type SidebarProps = {
  user: { id: string; email: string; createdAt: string } | null;
  categories: Category[];
  cards: Card[];
  categoryDueCounts: Record<string, number>;
  view: string;
  activeCategory: string;
  dueCount: number;
  mobileNav: boolean;
  onNavigate: (view: "overview" | "cards" | "review") => void;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  user,
  categories,
  cards,
  categoryDueCounts,
  view,
  activeCategory,
  dueCount,
  mobileNav,
  onNavigate,
  onSelectCategory,
  onAddCategory,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-[#dfe5df] bg-[#fbfcfa] px-5 py-6 transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="brand-mark">
            <BrainCircuit size={19} strokeWidth={2.5} />
          </div>
          <span className="text-[17px] font-bold tracking-[-0.04em]">
            flesh<span className="text-[#50a57a]">.</span>
          </span>
        </div>
        <div className="mt-10">
          <p className="eyebrow px-3">Workspace</p>
          <nav className="mt-3 space-y-1">
            <NavItem
              icon={<BarChart3 size={17} />}
              label="Overview"
              active={view === "overview"}
              onClick={() => {
                onNavigate("overview");
                onCloseMobile();
              }}
            />
          </nav>
        </div>
        <div className="mt-9">
          <div className="flex items-center justify-between px-3">
            <p className="eyebrow">Collections</p>
            <button
              onClick={onAddCategory}
              className="icon-button"
              aria-label="Add collection"
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="mt-3 space-y-1">
            {categories.slice(1).map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  onNavigate("cards");
                  onCloseMobile();
                }}
                className={`side-link w-full ${activeCategory === category.id && view === "cards" ? "side-link-active" : ""}`}
              >
                <Folder size={16} />
                <span className="truncate">{category.name}</span>
                <span className="ml-auto text-xs text-[#91a098]">
                  {categoryDueCounts[category.id] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#e5eae5] pt-5">
          <div className="avatar">AM</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.email?.split("@")[0] ?? "Guest"}
            </p>
            <p className="text-xs text-[#91a098]">Free workspace</p>
          </div>
          <Settings2 className="ml-auto text-[#9ba7a0]" size={17} />
        </div>
      </aside>
      {mobileNav && (
        <button
          className="fixed inset-0 z-20 bg-[#17211d]/20 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}

type HeaderProps = {
  view: string;
  search: string;
  onSearch: (value: string) => void;
  onAddCard: () => void;
  onOpenMobileNav: () => void;
  onLogout: () => void;
};

export function Header({
  view,
  search,
  onSearch,
  onAddCard,
  onOpenMobileNav,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e3e8e3] bg-[#fbfcfa]/80 px-5 backdrop-blur-md sm:px-8 lg:px-12">
      <div className="flex items-center gap-3">
        <button className="icon-button lg:hidden" onClick={onOpenMobileNav}>
          <Menu size={19} />
        </button>
        <div className="hidden items-center gap-2 text-sm text-[#839089] sm:flex">
          <span>Workspace</span>
          <span>›</span>
          <span className="font-medium text-[#17211d]">
            {view === "overview"
              ? "Overview"
              : view === "cards"
                ? "My cards"
                : "Review session"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-5">
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-2.5 text-[#9aa69f]"
            size={16}
          />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search cards..."
            className="h-10 w-52 rounded-xl border border-[#e0e7e1] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#79ba93]"
          />
        </div>
        <button className="hidden items-center gap-2 rounded-xl border border-[#dce5de] bg-white px-3 py-2 text-sm font-semibold text-[#506159] transition hover:border-[#a9cdb4] sm:flex">
          Help
        </button>
        <button onClick={onAddCard} className="primary-button">
          <Plus size={17} />
          <span className="hidden sm:inline">New card</span>
          <span className="sm:hidden">Add</span>
        </button>
        <button
          onClick={onLogout}
          className="hidden rounded-xl border border-[#dce5de] bg-white px-3 py-2 text-sm font-semibold text-[#506159] transition hover:border-[#a9cdb4] sm:inline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
