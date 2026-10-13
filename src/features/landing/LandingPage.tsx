import {
  ArrowRight,
  BrainCircuit,
  Check,
  Layers3,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type LandingPageProps = {
  onGetStarted: () => void;
  onSignIn: () => void;
};

const features = [
  {
    icon: Layers3,
    title: "Your words, your way",
    description:
      "Keep vocabulary organized in collections that make sense to you.",
  },
  {
    icon: RotateCcw,
    title: "Remember for longer",
    description:
      "Build a steady review habit with cards ready when you are.",
  },
  {
    icon: Sparkles,
    title: "Let AI lend a hand",
    description:
      "Create useful flashcards faster and spend more time learning.",
  },
];

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f6] text-[#17211d]">
      <header className="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#" className="flex items-center gap-3" aria-label="flesh home">
          <span className="brand-mark">
            <BrainCircuit size={19} strokeWidth={2.5} />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.04em]">
            flesh<span className="text-[#50a57a]">.</span>
          </span>
        </a>
        <button
          type="button"
          onClick={onSignIn}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#53635a] transition hover:bg-white hover:text-[#438960]"
        >
          Sign in
        </button>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:px-12 lg:pb-28 lg:pt-20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dce9de] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#548366] shadow-sm">
              <Sparkles size={14} />
              A calmer way to learn
            </div>
            <h1 className="mt-7 max-w-[650px] text-[clamp(2.9rem,7vw,5.25rem)] font-bold leading-[1.03] tracking-[-0.065em]">
              Make every
              <span className="block text-[#4e9e70]">new word</span>
              <span className="block">stick.</span>
            </h1>
            <p className="mt-6 max-w-[480px] text-base leading-7 text-[#738078] sm:text-lg sm:leading-8">
              Turn the things you want to learn into flashcards you’ll actually
              remember. Simple to start, satisfying to stick with.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="primary-button min-h-12 px-6 text-sm"
              >
                Create your free account
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={onSignIn}
                className="secondary-button min-h-12 px-6 text-sm"
              >
                I already have an account
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#89958d]">
              <Check size={14} className="text-[#4e9e70]" />
              Free to get started · Your learning, at your pace
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[490px] lg:ml-auto">
            <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full bg-[#e8f3e9] blur-3xl" />
            <div className="absolute -bottom-10 -left-8 h-48 w-48 rounded-full bg-[#eef2e9] blur-3xl" />
            <div className="relative rounded-[30px] border border-[#e1e9e1] bg-white/80 p-4 shadow-[0_28px_80px_#284b3212] sm:p-6">
              <div className="flex items-center justify-between px-1 pb-5">
                <div>
                  <p className="eyebrow">A little progress, every day</p>
                  <p className="mt-2 text-sm font-bold text-[#304037]">
                    Your learning space
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e5f3e8] text-[#4e9e70]">
                  <BrainCircuit size={20} />
                </span>
              </div>
              <div className="rounded-[22px] border border-[#e2ebe3] bg-[#fbfdfb] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="language-tag">ENGLISH · SPANISH</span>
                  <span className="text-xs font-semibold text-[#9aa69d]">
                    01 / 12
                  </span>
                </div>
                <div className="flex min-h-[208px] flex-col items-center justify-center text-center">
                  <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#9aa69d]">
                    Today’s word
                  </p>
                  <p className="mt-4 text-4xl font-bold tracking-[-.05em] text-[#26372d]">
                    florecer
                  </p>
                  <p className="mt-3 text-sm text-[#849188]">
                    Tap a card to reveal its meaning
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 border-t border-[#e8eee8] pt-4 text-xs font-semibold text-[#568367]">
                  <RotateCcw size={14} />
                  Learn at your own pace
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ["12", "to review"],
                  ["08", "learned today"],
                  ["5 days", "your streak"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#e7ece7] bg-white px-3 py-3.5 text-center"
                  >
                    <p className="text-base font-bold tracking-tight text-[#3f7f59]">
                      {value}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-[#9aa69d]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -left-5 top-[42%] hidden items-center gap-2 rounded-2xl border border-[#e4ece4] bg-white px-4 py-3 text-xs font-semibold text-[#58685e] shadow-lg shadow-[#29442f12] sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#e5f3e8] text-[#4e9e70]">
                <Check size={16} />
              </span>
              One card at a time
            </div>
          </div>
        </section>

        <section className="border-t border-[#e7ece7] bg-white/55">
          <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <div className="max-w-[560px]">
              <p className="eyebrow">A better learning rhythm</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-.05em] sm:text-4xl">
                Small steps. Real progress.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#7b8880] sm:text-base">
                Everything you need to turn a few spare minutes into lasting
                knowledge.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className="rounded-[22px] border border-[#e4eae4] bg-[#fbfcfa] p-6"
                >
                  <span className="stat-icon stat-green">
                    <Icon />
                  </span>
                  <p className="mt-5 text-base font-bold tracking-[-.02em]">
                    <span className="mr-2 text-xs font-semibold text-[#9eaaa1]">
                      0{index + 1}
                    </span>
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#7b8880]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[24px] bg-[#edf6ee] px-6 py-7 text-center sm:flex-row sm:px-9 sm:text-left">
              <div>
                <h3 className="text-xl font-bold tracking-[-.04em]">
                  Ready to learn something new?
                </h3>
                <p className="mt-1 text-sm text-[#718078]">
                  Your first flashcards are just a few clicks away.
                </p>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="primary-button min-h-11 shrink-0 px-5"
              >
                Get started
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-6 text-xs text-[#98a39b] sm:px-8 lg:px-12">
        <span className="font-semibold tracking-[-.02em]">
          flesh<span className="text-[#50a57a]">.</span>
        </span>
        <span>Learn a little. Remember a lot.</span>
      </footer>
    </div>
  );
}
