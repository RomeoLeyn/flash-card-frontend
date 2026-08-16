import { useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";
import { useFlashcards } from "@/hooks/useFlashcards";
import { AuthPage } from "@/components/AuthPage";
import type { CreateCardInput, ReviewQuality } from "@/types/flashcards";
import { Sidebar, Header } from "@/components/Sidebar";
import { Overview } from "@/components/Overview";
import { CardsView } from "@/components/CardsView";
import { ReviewView } from "@/components/ReviewView";
import { AddCardModal } from "@/components/AddCardModal";
import { AiGeneratorModal } from "@/components/AiGeneratorModal";
import { CategoryModal } from "@/components/CategoryModal";
import { LanguageCode } from "./common/constants/constants";
import { EditCategoryModal } from "./components/EditCategoryModal";
import { ProfilePage } from "./pages/ProfilePage";
import { userService } from "./services/userService";

type View = "overview" | "cards" | "review" | "profile";

export default function App() {
  const [view, setView] = useState<View>("overview");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [mobileNav, setMobileNav] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [user, setUser] = useState<{
    id: string;
    email: string;
    createdAt: string;
  } | null>(null);

  const {
    categories,
    cards,
    categoryDueCounts,
    reviewStats,
    createCategory,
    createCard,
    reviewCard,
    loadCardsByCategory,
    generateCardsFromAi,
    updateCategory,
  } = useFlashcards(authenticated);
  const dueCards = cards.filter(
    (card) =>
      card.nextReviewDate && new Date(card.nextReviewDate) <= new Date(),
  );
  const visibleCards = useMemo(
    () =>
      cards.filter((card) =>
        `${card.word} ${card.translation}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [cards, search],
  );

  const handleAuthenticated = () => setAuthenticated(true);
  const handleLogout = () => {
    authService.logout();
    setAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (!authenticated) return;

    const loadUser = async () => {
      try {
        const profile = await authService.me();
        setUser(profile);
      } catch (error) {
        authService.logout();
        setAuthenticated(false);
      }
    };

    void loadUser();
  }, [authenticated]);

  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategory(categoryId);
    setView("cards");
    await loadCardsByCategory(categoryId);
  };

  const addCard = async (input: CreateCardInput) => {
    await createCard(input);
    setShowAdd(false);
    setView("cards");
  };

  const addCategory = async (
    name: string,
    sourceLanguage: string,
    targetLanguage: string,
  ) => {
    await createCategory(name, sourceLanguage, targetLanguage);
    setShowCategory(false);
  };

  const saveCategory = async (
    id: string,
    data: {
      name: string;
      sourceLanguage: LanguageCode;
      targetLanguage: LanguageCode;
    },
  ) => {
    await updateCategory(id, data);
    setEditingCategoryId(null);
  };

  const handleUpdateProfile = async (data: {
    email?: string;
    password?: string;
  }) => {
    const updated = await userService.update(data);
    setUser(updated);
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    await userService.changePassword(data);
  };

  const editingCategory = categories.find((c) => c.id === editingCategoryId);

  if (!authenticated) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#17211d]">
      <Sidebar
        user={user}
        categories={categories}
        cards={cards}
        categoryDueCounts={categoryDueCounts}
        view={view}
        activeCategory={activeCategory}
        dueCount={dueCards.length}
        mobileNav={mobileNav}
        onNavigate={setView}
        onSelectCategory={handleCategoryChange}
        onAddCategory={() => setShowCategory(true)}
        onCloseMobile={() => setMobileNav(false)}
      />
      <main className="min-h-screen lg:ml-[260px]">
        <Header
          view={view}
          search={search}
          onSearch={setSearch}
          onAddCard={() => setShowAdd(true)}
          onOpenMobileNav={() => setMobileNav(true)}
          onLogout={handleLogout}
        />
        <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {view === "overview" && (
            <Overview
              cards={cards}
              dueCount={dueCards.length}
              stats={reviewStats ?? undefined}
              onReview={() => setView("review")}
              onCards={() => setView("cards")}
            />
          )}
          {view === "cards" && (
            <CardsView
              cards={visibleCards}
              categories={categories}
              activeCategory={activeCategory}
              onCategory={handleCategoryChange}
              onAdd={() => setShowAdd(true)}
              onAddAi={() => setShowAiGenerator(true)}
              onEditCategory={() => setEditingCategoryId(activeCategory)}
              onRate={reviewCard}
            />
          )}
          {view === "review" && (
            <ReviewView
              cards={dueCards.length ? dueCards : cards.slice(0, 3)}
              onComplete={reviewCard}
            />
          )}
          {view === "profile" && (
            <ProfilePage
              user={user}
              cards={cards}
              categories={categories}
              reviewStats={reviewStats ?? undefined}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>
      {showAdd && (
        <AddCardModal
          categories={categories.slice(1)}
          activeCategory={activeCategory}
          onClose={() => setShowAdd(false)}
          onAdd={addCard}
        />
      )}
      {showAiGenerator && (
        <AiGeneratorModal
          categories={categories.slice(1)}
          activeCategory={activeCategory}
          onClose={() => setShowAiGenerator(false)}
          onGenerate={generateCardsFromAi}
        />
      )}
      {showCategory && (
        <CategoryModal
          onClose={() => setShowCategory(false)}
          onAdd={addCategory}
        />
      )}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategoryId(null)}
          onSave={saveCategory}
        />
      )}
    </div>
  );
}
