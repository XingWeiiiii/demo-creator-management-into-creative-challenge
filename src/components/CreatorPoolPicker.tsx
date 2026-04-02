import { useState } from "react";
import { Check, Users, Zap, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCreators, POOL_CATEGORIES, CUSTOM_TAGS, FOLLOWER_THRESHOLD, formatNumber } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";

type AssignMode = "auto" | "manual";
type PoolCategory = "all" | "collaborator";

const MIN_CREATOR_THRESHOLD = 5;

interface Props {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  poolCategory: PoolCategory;
  onPoolCategoryChange: (cat: PoolCategory) => void;
  videoType: "creator_post" | "creator_video";
  supplementWithSystem: boolean;
  onSupplementChange: (val: boolean) => void;
}

/** Count eligible creators for a given tag */
function getTagEligibleCount(tag: string, isCreatorVideo: boolean): { total: number; eligible: number } {
  const matched = mockCreators.filter((c) => c.tags.includes(tag));
  const eligible = isCreatorVideo
    ? matched.filter((c) => c.followers >= FOLLOWER_THRESHOLD)
    : matched;
  return { total: matched.length, eligible: eligible.length };
}

/** Count for pool categories */
function getPoolCategoryCount(cat: PoolCategory, isCreatorVideo: boolean): { total: number; eligible: number } {
  const matched = cat === "all" ? mockCreators : mockCreators.filter((c) => c.tags.includes("Collaborator"));
  const eligible = isCreatorVideo
    ? matched.filter((c) => c.followers >= FOLLOWER_THRESHOLD)
    : matched;
  return { total: matched.length, eligible: eligible.length };
}

export default function CreatorPoolPicker({ selectedTags, onTagsChange, poolCategory, onPoolCategoryChange, videoType }: Props) {
  const [mode, setMode] = useState<AssignMode>("auto");

  const isCreatorVideo = videoType === "creator_video";

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    );
  };

  const handleModeChange = (newMode: AssignMode) => {
    setMode(newMode);
    if (newMode === "auto") {
      onTagsChange([]);
      onPoolCategoryChange("all");
    }
  };

  const poolCount = getPoolCategoryCount(poolCategory, isCreatorVideo);

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
          {mode === "manual" && selectedTags.length > 0 && (
            <Badge variant="secondary" className="mt-2 text-[10px]">{selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}</Badge>
          )}
        </button>
      </div>

      {/* Manual mode content */}
      {mode === "manual" && (
        <div className="space-y-4 pt-1">
          {/* Pool category tabs */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Creator pool</p>
            <div className="flex gap-2">
              {POOL_CATEGORIES.map((cat) => {
                const counts = getPoolCategoryCount(cat.value as PoolCategory, isCreatorVideo);
                return (
                  <button
                    key={cat.value}
                    onClick={() => onPoolCategoryChange(cat.value as PoolCategory)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      poolCategory === cat.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="ml-1.5 text-xs opacity-75">
                      {counts.eligible}{isCreatorVideo && counts.eligible !== counts.total ? `/${counts.total}` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom tags with counts */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Filter by tags</p>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_TAGS.map((tag) => {
                const counts = getTagEligibleCount(tag, isCreatorVideo);
                const isSelected = selectedTags.includes(tag);
                if (counts.total === 0) return null;
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {tag}
                    <Badge variant={isSelected ? "default" : "secondary"} className="text-[10px] px-1.5 py-0 ml-0.5">
                      {counts.eligible}{isCreatorVideo && counts.eligible !== counts.total ? `/${counts.total}` : ""}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-foreground">{poolCount.eligible}</span>
                <span className="text-muted-foreground"> eligible creator{poolCount.eligible !== 1 ? "s" : ""}</span>
                {selectedTags.length > 0 && (
                  <span className="text-muted-foreground"> · filtered by {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}</span>
                )}
              </div>
              {selectedTags.length > 0 && (
                <button onClick={() => onTagsChange([])} className="text-xs text-destructive hover:underline">
                  Clear filters
                </button>
              )}
            </div>
            {isCreatorVideo && poolCount.eligible < poolCount.total && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {poolCount.total - poolCount.eligible} creator{poolCount.total - poolCount.eligible !== 1 ? "s" : ""} ineligible (below 50K followers)
              </p>
            )}
          </div>

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
