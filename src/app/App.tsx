import { useEffect, useMemo, useRef, useState } from "react";
import { authService } from "@/services/authService";
import { cardService } from "@/services/cardService";
import { useFlashcards } from "@/hooks/useFlashcards";
import { AuthPage } from "@/features/auth/AuthPage";
import { LandingPage } from "@/features/landing/LandingPage";
import type {
  Card,
  CreateCardInput,
  AiGenerationRequest,
  AiGenerationResult,
  AiWordExplanation,
  ReviewQuality,
  UpdateCardInput,
} from "@/types/flashcards";
import { ApiError } from "@/lib/httpClient";
import { Sidebar, Header } from "@/app/layout/Sidebar";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { StatisticsPage } from "@/features/statistics/StatisticsPage";
import { CollectionsPage } from "@/features/collections/CollectionsPage";
import { CardsView } from "@/features/cards/CardsView";
import { ReviewView } from "@/features/cards/ReviewView";
import { AddCardModal } from "@/features/cards/AddCardModal";
import { AiGeneratorModal } from "@/features/cards/AiGeneratorModal";
import { GenerationResultModal } from "@/features/cards/GenerationResultModal";
import { ExplainWordModal } from "@/features/cards/ExplainWordModal";
import { CategoryModal } from "@/features/collections/CategoryModal";
import { LanguageCode } from "@/common/constants/constants";
import { EditCategoryModal } from "@/features/collections/EditCategoryModal";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { userService } from "@/services/userService";

type View =
  | "overview"
  | "statistics"
  | "collections"
  | "cards"
  | "review"
  | "profile";
type AuthMode = "signin" | "signup";
type WordExplanationContext = {
  word: string;
  sentence: string;
  categoryId: string;
  sourceLanguage: string;
  targetLanguage: string;
};

export default function App() {
  const [view, setView] = useState<View>("overview");
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [generationResult, setGenerationResult] =
    useState<AiGenerationResult | null>(null);
  const [showCategory, setShowCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [mobileNav, setMobileNav] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [wordExplanationContext, setWordExplanationContext] =
    useState<WordExplanationContext | null>(null);
  const [wordExplanation, setWordExplanation] =
    useState<AiWordExplanation | null>(null);
  const [wordExplanationLoading, setWordExplanationLoading] = useState(false);
  const [wordExplanationError, setWordExplanationError] = useState<
    string | null
  >(null);
  const [wordCardAdded, setWordCardAdded] = useState(false);
  const explanationRequestId = useRef(0);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    createdAt: string;
  } | null>(null);
  const [browseMode, setBrowseMode] = useState(false);

  const {
    categories,
    cards,
    categoryDueCounts,
    reviewStats,
    createCategory,
    createCard,
    updateCard,
    deleteCard,
    bulkDeleteCards,
    reviewCard,
    loadCardsByCategory,
    generateCardsFromAi,
    updateCategory,
    deleteCategory,
    browsedCards,
    browseLoading,
    loadAllCardsByCategory,
    browseSortBy,
    browseSortOrder,
    setBrowseSort,
  } = useFlashcards(authenticated);
  const dueCards = cards.filter(
    (card) =>
      card.nextReviewDate && new Date(card.nextReviewDate) <= new Date(),
  );

  const sourceCards = browseMode ? browsedCards : cards;

  const visibleCards = useMemo(
    () =>
      sourceCards.filter((card) =>
        `${card.word} ${card.translation}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [sourceCards, search],
  );

  const handleAuthenticated = () => setAuthenticated(true);
  const handleLogout = () => {
    explanationRequestId.current += 1;
    authService.logout();
    setAuthenticated(false);
    setUser(null);
    setWordExplanationContext(null);
    setWordExplanation(null);
    setWordExplanationLoading(false);
  };

  const requestWordExplanation = async (
    context: WordExplanationContext,
  ) => {
    const requestId = ++explanationRequestId.current;
    setWordExplanationLoading(true);
    setWordExplanationError(null);
    setWordExplanation(null);

    try {
      const result = await cardService.explainWord({
        word: context.word,
        sentence: context.sentence,
        sourceLanguage: context.sourceLanguage,
        targetLanguage: context.targetLanguage,
      });
      if (requestId === explanationRequestId.current) {
        setWordExplanation(result);
      }
    } catch (cause) {
      if (requestId !== explanationRequestId.current) return;
      if (cause instanceof ApiError && cause.status === 401) {
        handleLogout();
        return;
      }

      if (cause instanceof ApiError && cause.status === 400) {
        setWordExplanationError(
          "The selected word or sentence is invalid. Please select a word and try again.",
        );
      } else if (cause instanceof ApiError && cause.status === 429) {
        setWordExplanationError(
          "The AI request limit has been reached. Please try again later.",
        );
      } else {
        setWordExplanationError(
          "The AI explanation is temporarily unavailable. Please try again.",
        );
      }
    } finally {
      if (requestId === explanationRequestId.current) {
        setWordExplanationLoading(false);
      }
    }
  };

  const explainSelectedWord = (word: string, sentence: string) => {
    const category = categories.find(
      (item) => item.id === activeCategory && item.id !== "all",
    );
    if (!category) return;

    const context = {
      word,
      sentence,
      categoryId: category.id,
      sourceLanguage: category.sourceLanguage,
      targetLanguage: category.targetLanguage,
    };
    setWordExplanationContext(context);
    void requestWordExplanation(context);
  };

  const closeWordExplanation = () => {
    explanationRequestId.current += 1;
    setWordExplanationContext(null);
    setWordExplanation(null);
    setWordExplanationError(null);
    setWordExplanationLoading(false);
  };

  const saveExplainedWord = async (
    input: CreateCardInput,
  ) => {
    await createCard(input);
    closeWordExplanation();
    setWordCardAdded(true);
  };

  useEffect(() => {
    if (!wordCardAdded) return;
    const timeout = window.setTimeout(() => setWordCardAdded(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [wordCardAdded]);

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

  useEffect(() => {
    if (browseMode && activeCategory) {
      void loadAllCardsByCategory(activeCategory);
    }
  }, [
    browseSortBy,
    browseSortOrder,
    browseMode,
    activeCategory,
    loadAllCardsByCategory,
  ]);

  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategory(categoryId);
    setBrowseMode(false);
    setView("cards");
    await loadCardsByCategory(categoryId);
  };

  const removeCategory = async (id: string) => {
    await deleteCategory(id);
    setEditingCategoryId(null);
    if (activeCategory === id) {
      setActiveCategory("all");
      setView("cards");
      await loadCardsByCategory("all");
    }
  };

  const handleBrowseAll = async (categoryId: string) => {
    setBrowseMode(true);
    setView("cards");
    await loadAllCardsByCategory(categoryId);
  };

  const addCard = async (input: CreateCardInput) => {
    await createCard(input);
    setShowAdd(false);
    setView("cards");
  };

  const saveCard = async (id: string, input: UpdateCardInput) => {
    await updateCard(id, input);
    setEditingCard(null);
  };

  const addCategory = async (
    name: string,
    sourceLanguage: string,
    targetLanguage: string,
  ) => {
    await createCategory(name, sourceLanguage, targetLanguage);
    setShowCategory(false);
  };

  const generateCards = async (request: AiGenerationRequest) => {
    const result = await generateCardsFromAi(request);
    setShowAiGenerator(false);
    setGenerationResult(result);
    return result;
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
    if (authMode) {
      return (
        <AuthPage
          key={authMode}
          initialMode={authMode}
          onAuthenticated={handleAuthenticated}
          onBackToHome={() => setAuthMode(null)}
        />
      );
    }

    return (
      <LandingPage
        onGetStarted={() => setAuthMode("signup")}
        onSignIn={() => setAuthMode("signin")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#17211d]">
      <Sidebar
        user={user}
        categories={categories}
        categoryDueCounts={categoryDueCounts}
        view={view}
        activeCategory={activeCategory}
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
            <DashboardPage
              userName={user?.email?.split("@")[0] ?? ""}
              categories={categories}
              categoryDueCounts={categoryDueCounts}
              dueCount={dueCards.length}
              onReview={() => setView("review")}
              onViewCollections={() => setView("collections")}
              onSelectCategory={handleCategoryChange}
              onAddCollection={() => setShowCategory(true)}
            />
          )}
          {view === "statistics" && (
            <StatisticsPage
              dueCount={dueCards.length}
              stats={reviewStats}
            />
          )}
          {view === "collections" && (
            <CollectionsPage
              categories={categories}
              categoryDueCounts={categoryDueCounts}
              onAddCollection={() => setShowCategory(true)}
              onSelectCollection={handleCategoryChange}
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
              onEditCard={setEditingCard}
              onExplainWord={explainSelectedWord}
              onDeleteCard={deleteCard}
              onDeleteCards={bulkDeleteCards}
              onRate={reviewCard}
              browseMode={browseMode}
              browseLoading={browseLoading}
              onBrowseAll={() => handleBrowseAll(activeCategory)}
              onStudyMode={() => setBrowseMode(false)}
              browseSortBy={browseSortBy}
              browseSortOrder={browseSortOrder}
              onBrowseSort={setBrowseSort}
            />
          )}
          {view === "review" && (
            <ReviewView
              cards={dueCards}
              onComplete={reviewCard}
              onEditCard={setEditingCard}
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
      {editingCard && (
        <AddCardModal
          categories={categories.slice(1)}
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onAdd={addCard}
          onSave={saveCard}
        />
      )}
      {wordExplanationContext && (
        <ExplainWordModal
          explanation={wordExplanation}
          loading={wordExplanationLoading}
          error={wordExplanationError}
          categoryId={wordExplanationContext.categoryId}
          sourceLanguage={wordExplanationContext.sourceLanguage}
          targetLanguage={wordExplanationContext.targetLanguage}
          onClose={closeWordExplanation}
          onRetry={() => void requestWordExplanation(wordExplanationContext)}
          onSave={saveExplainedWord}
          onUnauthorized={handleLogout}
        />
      )}
      {wordCardAdded && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] rounded-xl bg-[#eaf5ec] px-4 py-3 text-sm font-semibold text-[#34744e] shadow-lg"
        >
          Word added to your dictionary.
          <button
            type="button"
            onClick={() => setWordCardAdded(false)}
            className="ml-3 text-[#508566] hover:text-[#26352d]"
            aria-label="Dismiss confirmation"
          >
            ×
          </button>
        </div>
      )}
      {showAiGenerator && (
        <AiGeneratorModal
          categories={categories.slice(1)}
          activeCategory={activeCategory}
          onClose={() => setShowAiGenerator(false)}
          onGenerate={generateCards}
        />
      )}
      {generationResult && (
        <GenerationResultModal
          result={generationResult}
          onClose={() => setGenerationResult(null)}
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
          onDelete={removeCategory}
        />
      )}
    </div>
  );
}
