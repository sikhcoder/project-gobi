interface WelcomeBannerProps {
  tradition: string;
}

export function WelcomeBanner({ tradition }: WelcomeBannerProps) {
  return (
    <div className="bg-primary-pale border border-primary-light/50 rounded-xl p-5 mb-6">
      <span className="inline-block text-[10px] font-medium bg-primary text-white px-2 py-0.5 rounded-md mb-2">
        {tradition} wedding pack
      </span>
      <h2 className="text-base font-medium text-primary-dark mb-1">
        Your {tradition} wedding planning templates
      </h2>
      <p className="text-[13px] text-primary mb-4">
        Curated checklists, budgets, and vendor guides based on {tradition} wedding traditions.
        Every item includes context so you know why it matters.
      </p>
      <div className="flex gap-2">
        <button className="px-3.5 py-1.5 text-xs font-medium bg-primary text-white rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
          Apply to my wedding
        </button>
        <button className="px-3.5 py-1.5 text-xs font-medium border border-primary-light text-primary rounded-full cursor-pointer hover:bg-white transition-colors">
          Preview first
        </button>
      </div>
    </div>
  );
}
