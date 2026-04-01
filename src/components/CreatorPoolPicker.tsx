import { useState, useMemo } from "react";
import { Check, ChevronDown, Search, X, Users, Zap, AlertTriangle } from "lucide-react";
import { mockCreators, POOL_CATEGORIES, CUSTOM_TAGS, FOLLOWER_THRESHOLD, formatNumber, type Creator } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";

type AssignMode = "auto" | "manual";
type PoolCategory = "all" | "collaborator";

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  videoType: "creator_post" | "creator_video";
}

export default function CreatorPoolPicker({ selectedIds, onChange, videoType }: Props) {
  const [mode, setMode] = useState<AssignMode>("auto");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [poolCategory, setPoolCategory] = useState<PoolCategory>("all");
  const [selectedCustomTags, setSelectedCustomTags] = useState<string[]>([]);

  const isCreatorVideo = videoType === "creator_video";

  const filtered = useMemo(() => {
    return mockCreators.filter((c) => {
      const matchSearch = !search || c.handle.toLowerCase().includes(search.toLowerCase());

      // Pool category filter
      let matchPool = true;
      if (poolCategory === "collaborator") {
        matchPool = c.tags.includes("Collaborator");
      }
      // "all" = all creators who mentioned the brand (no filter)

      // Custom tag filter
      const matchTags = selectedCustomTags.length === 0 || selectedCustomTags.some((t) => c.tags.includes(t));

      return matchSearch && matchPool && matchTags;
    });
  }, [search, poolCategory, selectedCustomTags]);

  const selectedCreators = mockCreators.filter((c) => selectedIds.includes(c.id));

  const isCreatorEligible = (creator: Creator) => {
    if (!isCreatorVideo) return true;
    return creator.followers >= FOLLOWER_THRESHOLD;
  };

  const toggleCreator = (creator: Creator) => {
    if (!isCreatorEligible(creator)) return;
    const id = creator.id;
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
  };

  const toggleCustomTag = (tag: string) => {
    setSelectedCustomTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const selectAllFiltered = () => {
    const eligible = filtered.filter(isCreatorEligible);
    const allFilteredIds = eligible.map((c) => c.id);
    const newIds = [...new Set([...selectedIds, ...allFilteredIds])];
    onChange(newIds);
  };

  const clearAll = () => onChange([]);

  const handleModeChange = (newMode: AssignMode) => {
    setMode(newMode);
    if (newMode === "auto") {
      onChange([]);
      setOpen(false);
    }
  };

  const ineligibleCount = isCreatorVideo ? filtered.filter((c) => !isCreatorEligible(c)).length : 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Creator assignment</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Choose to let the system auto-match creators or manually pick from your creator pool</p>
      </div>

      {/* Video type eligibility notice */}
      {isCreatorVideo && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-300">Creator Video requires 50K+ followers</p>
            <p className="text-amber-700 dark:text-amber-400 mt-0.5">
              Since Creator Video content is published on your TikTok Business Account (not the creator's), only creators with at least {formatNumber(FOLLOWER_THRESHOLD)} followers are eligible. Creators below this threshold will be greyed out.
            </p>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleModeChange("auto")}
          className={`relative border rounded-lg p-4 text-left transition-all ${
            mode === "auto"
              ? "border-primary ring-2 ring-ring bg-primary/5"
              : "hover:border-muted-foreground/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              mode === "auto" ? "border-primary" : "border-muted-foreground/30"
            }`}>
              {mode === "auto" && <div className="w-3 h-3 rounded-full bg-primary" />}
            </div>
          </div>
          <p className="font-medium text-sm">Auto-assign</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isCreatorVideo
              ? "System matches eligible creators (50K+ followers) based on your brief"
              : "System automatically matches the best creators based on your brief content"}
          </p>
          {mode === "auto" && (
            <Badge variant="secondary" className="mt-2 text-[10px]">Recommended</Badge>
          )}
        </button>

        <button
          onClick={() => handleModeChange("manual")}
          className={`relative border rounded-lg p-4 text-left transition-all ${
            mode === "manual"
              ? "border-primary ring-2 ring-ring bg-primary/5"
              : "hover:border-muted-foreground/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-foreground" />
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              mode === "manual" ? "border-primary" : "border-muted-foreground/30"
            }`}>
              {mode === "manual" && <div className="w-3 h-3 rounded-full bg-primary" />}
            </div>
          </div>
          <p className="font-medium text-sm">Pick from your pool</p>
          <p className="text-xs text-muted-foreground mt-1">Manually select from your managed creators, filterable by pool and tags</p>
          {mode === "manual" && selectedCreators.length > 0 && (
            <Badge variant="secondary" className="mt-2 text-[10px]">{selectedCreators.length} selected</Badge>
          )}
        </button>
      </div>

      {/* Manual mode content */}
      {mode === "manual" && (
        <div className="space-y-3 pt-1">
          {/* Selected creators display */}
          {selectedCreators.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCreators.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {c.handle[0].toUpperCase()}
                  </div>
                  {c.handle}
                  <button onClick={() => toggleCreator(c)} className="ml-0.5 hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={clearAll} className="text-sm text-destructive hover:underline px-2">
                Clear all
              </button>
            </div>
          )}

          {/* Toggle dropdown */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-secondary transition-colors w-full justify-center"
          >
            <Users className="w-4 h-4" />
            {selectedCreators.length === 0 ? "Select creators" : "Continue selecting"}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="border rounded-lg bg-card shadow-lg overflow-hidden">
              <div className="p-3 border-b space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search creators..."
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Pool category tabs */}
                <div className="flex gap-2">
                  {POOL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setPoolCategory(cat.value as PoolCategory)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        poolCategory === cat.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Custom tags */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Custom tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CUSTOM_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleCustomTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                          selectedCustomTags.includes(tag)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {filtered.length} creator{filtered.length !== 1 ? "s" : ""}
                    {isCreatorVideo && ineligibleCount > 0 && (
                      <span className="text-amber-600 dark:text-amber-400"> · {ineligibleCount} ineligible (below 50K)</span>
                    )}
                  </span>
                  <button onClick={selectAllFiltered} className="text-primary hover:underline text-xs">
                    Select all eligible
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {filtered.map((creator) => {
                  const isSelected = selectedIds.includes(creator.id);
                  const eligible = isCreatorEligible(creator);
                  return (
                    <button
                      key={creator.id}
                      onClick={() => toggleCreator(creator)}
                      disabled={!eligible}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        !eligible
                          ? "opacity-50 cursor-not-allowed bg-muted/30"
                          : isSelected
                            ? "bg-accent/50 hover:bg-accent/70"
                            : "hover:bg-secondary/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          !eligible
                            ? "border-muted-foreground/20"
                            : isSelected
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && eligible && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                        {creator.handle[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{creator.handle}</span>
                          <span className="text-xs text-muted-foreground">{creator.country}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {creator.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-xs ${!eligible ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`}>
                          {formatNumber(creator.followers)} followers
                        </div>
                        <div className="text-xs text-muted-foreground">{creator.engagement}% eng.</div>
                        {!eligible && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400">Below 50K</span>
                        )}
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">No matching creators</div>
                )}
              </div>
            </div>
          )}

          {/* Creator Post info */}
          {!isCreatorVideo && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
              Creator Post — no follower threshold. All creators in your pool are eligible.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
