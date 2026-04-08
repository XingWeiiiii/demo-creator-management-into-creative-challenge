import { useState, useMemo } from "react";
import { Check, Info, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { mockCreators, POOL_TAGS, FOLLOWER_THRESHOLD, formatNumber } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";

type AssignMode = "auto" | "list-boosted";

interface Props {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  videoType: "creator_post" | "creator_video";
  supplementWithSystem: boolean;
  onSupplementChange: (val: boolean) => void;
}

function getTagEligibleCount(tag: string, isCreatorVideo: boolean): { total: number; eligible: number } {
  const matched = tag === "All" ? mockCreators : mockCreators.filter((c) => c.tags.includes(tag));
  const eligible = isCreatorVideo
    ? matched.filter((c) => c.followers >= FOLLOWER_THRESHOLD)
    : matched;
  return { total: matched.length, eligible: eligible.length };
}

export default function CreatorPoolPicker({ selectedTags, onTagsChange, videoType, supplementWithSystem, onSupplementChange }: Props) {
  const [mode, setMode] = useState<AssignMode>("auto");

  const isCreatorVideo = videoType === "creator_video";

  const toggleTag = (tag: string) => {
    if (tag === "All") {
      onTagsChange(selectedTags.includes("All") ? [] : ["All"]);
      return;
    }
    const withoutAll = selectedTags.filter((t) => t !== "All");
    const newTags = withoutAll.includes(tag) ? withoutAll.filter((t) => t !== tag) : [...withoutAll, tag];
    onTagsChange(newTags);
  };

  const handleModeChange = (newMode: AssignMode) => {
    setMode(newMode);
    if (newMode === "auto") {
      onTagsChange([]);
    }
  };

  const selectedEligible = useMemo(() => {
    if (selectedTags.length === 0) return { total: 0, eligible: 0 };
    if (selectedTags.includes("All")) return getTagEligibleCount("All", isCreatorVideo);
    const ids = new Set<string>();
    const eligibleIds = new Set<string>();
    for (const tag of selectedTags) {
      const matched = mockCreators.filter((c) => c.tags.includes(tag));
      matched.forEach((c) => {
        ids.add(c.id);
        if (!isCreatorVideo || c.followers >= FOLLOWER_THRESHOLD) eligibleIds.add(c.id);
      });
    }
    return { total: ids.size, eligible: eligibleIds.size };
  }, [selectedTags, isCreatorVideo]);

  // Filter out tags with 0 creators (except All)
  const availableTags = POOL_TAGS.filter((tag) => {
    if (tag.value === "All") return true;
    return getTagEligibleCount(tag.value, false).total > 0;
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Creator assignment</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Choose how creators are matched to your brief</p>
      </div>

      {/* Tab-style mode switcher */}
      <div className="flex border rounded-lg overflow-hidden">
        <button
          onClick={() => handleModeChange("auto")}
          className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "auto"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:bg-secondary"
          }`}
        >
          Auto-assign
          {mode === "auto" && (
            <Badge variant="secondary" className="text-[10px] bg-primary-foreground/20 text-primary-foreground border-0">
              Recommended
            </Badge>
          )}
        </button>
        <button
          onClick={() => handleModeChange("list-boosted")}
          className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
            mode === "list-boosted"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:bg-secondary"
          }`}
        >
          List-boosted
        </button>
      </div>

      {/* Auto mode content */}
      {mode === "auto" && (
        <div className="border rounded-lg p-5 space-y-2">
          <p className="font-medium text-sm text-foreground">Auto-assign</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Matches your brief against creators who've worked with or mentioned your brand, past Content Suite collaborators, and a vetted network of creators in your vertical — giving you the highest chance of hitting your content volume target with diverse, high-quality posts.
          </p>
        </div>
      )}

      {/* List-boosted mode content */}
      {mode === "list-boosted" && (
        <div className="border rounded-lg p-5 space-y-5">
          {/* Explanation banner */}
          <div className="p-3 rounded-lg bg-accent/50 border border-accent">
            <p className="text-sm text-foreground">
              <span className="font-medium">Your selected lists are invited first.</span> Any remaining slots are filled automatically from a wider creator network.
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Best for brands with pre-approved creators, an internal creator program, or specific contractual requirements — where who creates the content matters as much as the content itself.
            </p>
            <p className="text-xs text-accent-foreground mt-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              For most campaigns, full auto reaches a broader, better-matched pool and delivers stronger results.
            </p>
          </div>

          {/* Creator Video eligibility notice */}
          {isCreatorVideo && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-300">Creator Video requires 50K+ followers</p>
                <p className="text-amber-700 dark:text-amber-400 mt-0.5">
                  Only creators with at least {formatNumber(FOLLOWER_THRESHOLD)} followers are eligible for Creator Video.
                </p>
              </div>
            </div>
          )}

          {/* Prioritize creator lists */}
          <div className="space-y-3">
            <div>
              <p className="font-medium text-sm text-foreground">Prioritize creator lists</p>
              <p className="text-xs text-muted-foreground mt-0.5">System samples your selected lists first, then fills remaining slots automatically</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Select lists to prioritize</p>
              <p className="text-xs text-muted-foreground mb-3">
                Lists are defined by <span className="font-semibold text-foreground">Creator Tags</span> — add and manage tags in{" "}
                <span className="text-primary cursor-pointer hover:underline">Creator Management → Content Suite</span>
              </p>
            </div>

            {/* Tag list as checkbox rows */}
            <div className="space-y-0 border rounded-lg overflow-hidden">
              {availableTags.map((tag) => {
                const counts = getTagEligibleCount(tag.value, isCreatorVideo);
                const isSelected = selectedTags.includes(tag.value);
                return (
                  <div
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                      isSelected
                        ? "bg-accent/30 border-primary/20"
                        : "bg-card hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleTag(tag.value)}
                      />
                      <span className="text-sm font-medium text-foreground">{tag.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {counts.eligible} creator{counts.eligible !== 1 ? "s" : ""}
                      {isCreatorVideo && counts.eligible !== counts.total && (
                        <span className="text-xs text-amber-600 ml-1">({counts.total} total)</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backfill toggle — always visible in list-boosted mode */}
          {selectedTags.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-foreground">Allow backfill if list underdelivers</p>
                  <p className="text-xs text-muted-foreground mt-0.5">System adds recommended creators if your list falls short</p>
                </div>
                <Switch
                  checked={supplementWithSystem}
                  onCheckedChange={onSupplementChange}
                />
              </div>

              {/* Status message */}
              {supplementWithSystem ? (
                <div className="p-3 rounded-lg bg-accent/30 border border-accent">
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0" />
                    Your lists will be sampled first. System creators fill any remaining slots to hit your delivery target.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Restricted to your selected lists only. No system backfill.
                  </p>
                  <p className="text-sm font-medium text-primary pl-6">
                    {selectedEligible.eligible} eligible creator{selectedEligible.eligible !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground pl-6">
                    Low pool size may reduce response rate and content volume.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
