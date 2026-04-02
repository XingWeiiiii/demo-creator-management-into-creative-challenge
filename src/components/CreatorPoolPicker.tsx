import { useState, useMemo } from "react";
import { Check, Users, Zap, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCreators, POOL_TAGS, FOLLOWER_THRESHOLD, formatNumber } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";

type AssignMode = "auto" | "manual";

const MIN_CREATOR_THRESHOLD = 5;

interface Props {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  videoType: "creator_post" | "creator_video";
  supplementWithSystem: boolean;
  onSupplementChange: (val: boolean) => void;
}

/** Count eligible creators for a given tag. "All" means all creators. */
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
      // "All" is exclusive — selecting it clears others
      onTagsChange(selectedTags.includes("All") ? [] : ["All"]);
      return;
    }
    // Deselect "All" when picking specific tags
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

  // Compute total eligible based on selected tags
  const selectedEligible = useMemo(() => {
    if (selectedTags.length === 0) return { total: 0, eligible: 0 };
    if (selectedTags.includes("All")) return getTagEligibleCount("All", isCreatorVideo);
    // Union of creators across selected tags
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
              Since Creator Video content is published on your TikTok Business Account (not the creator's), only creators with at least {formatNumber(FOLLOWER_THRESHOLD)} followers are eligible. Creators below this threshold will be excluded.
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
          <p className="text-xs text-muted-foreground mt-1">Select creator tags from your pool to assign specific groups</p>
          {mode === "manual" && selectedTags.length > 0 && (
            <Badge variant="secondary" className="mt-2 text-[10px]">{selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}</Badge>
          )}
        </button>
      </div>

      {/* Manual mode content */}
      {mode === "manual" && (
        <div className="space-y-4 pt-1">
          {/* Unified tag selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Select from your creator pool</p>
            <div className="flex flex-wrap gap-2">
              {POOL_TAGS.map((tag) => {
                const counts = getTagEligibleCount(tag.value, isCreatorVideo);
                const isSelected = selectedTags.includes(tag.value);
                if (counts.total === 0 && tag.value !== "All") return null;
                return (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                    } ${tag.isSystem ? "font-medium" : ""}`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {tag.label}
                    <Badge variant={isSelected ? "default" : "secondary"} className="text-[10px] px-1.5 py-0 ml-0.5">
                      {counts.eligible}{isCreatorVideo && counts.eligible !== counts.total ? `/${counts.total}` : ""}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary with threshold logic */}
          {selectedTags.length > 0 && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-2.5">
              {selectedEligible.eligible >= MIN_CREATOR_THRESHOLD ? (
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Only your assigned creators will receive this brief.
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium">{selectedEligible.eligible}</span> eligible creator{selectedEligible.eligible !== 1 ? "s" : ""} across {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">
                      Based on your selection, estimated eligible creators (<span className="font-medium">{selectedEligible.eligible}</span>) may not fully cover your video needs. Would you like the system to assign additional creators to help fulfill the order?
                    </p>
                  </div>
                  <div className="space-y-2 pl-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={supplementWithSystem}
                        onCheckedChange={(checked) => onSupplementChange(checked === true)}
                      />
                      <span className="text-sm text-foreground">Yes, supplement with system-selected creators</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={!supplementWithSystem}
                        onCheckedChange={(checked) => onSupplementChange(checked !== true)}
                      />
                      <span className="text-sm text-foreground">No, only use my assigned creators</span>
                    </label>
                  </div>
                </div>
              )}
              {isCreatorVideo && selectedEligible.eligible < selectedEligible.total && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {selectedEligible.total - selectedEligible.eligible} creator{selectedEligible.total - selectedEligible.eligible !== 1 ? "s" : ""} ineligible (below 50K followers)
                </p>
              )}
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
