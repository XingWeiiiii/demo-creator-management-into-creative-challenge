import { useState, useMemo } from "react";
import { Check, ChevronDown, Search, X, Users, Zap } from "lucide-react";
import { mockCreators, CREATOR_TAGS, formatNumber, type Creator } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";

type AssignMode = "auto" | "manual";

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function CreatorPoolPicker({ selectedIds, onChange }: Props) {
  const [mode, setMode] = useState<AssignMode>("auto");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return mockCreators.filter((c) => {
      const matchSearch = !search || c.handle.toLowerCase().includes(search.toLowerCase());
      const matchTags = selectedTags.length === 0 || selectedTags.some((t) => c.tags.includes(t));
      return matchSearch && matchTags;
    });
  }, [search, selectedTags]);

  const selectedCreators = mockCreators.filter((c) => selectedIds.includes(c.id));

  const toggleCreator = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const selectAllFiltered = () => {
    const allFilteredIds = filtered.map((c) => c.id);
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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">达人分配方式</h3>
        <p className="text-sm text-muted-foreground mt-0.5">选择由系统自动匹配达人，或从你的达人池中手动挑选</p>
      </div>

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
          <p className="font-medium text-sm">系统智能分配</p>
          <p className="text-xs text-muted-foreground mt-1">根据 Brief 内容自动匹配最合适的达人，无需手动选择</p>
          {mode === "auto" && (
            <Badge variant="secondary" className="mt-2 text-[10px]">推荐</Badge>
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
          <p className="font-medium text-sm">从达人池选择</p>
          <p className="text-xs text-muted-foreground mt-1">从你管理的达人中手动挑选，支持按标签筛选</p>
          {mode === "manual" && selectedCreators.length > 0 && (
            <Badge variant="secondary" className="mt-2 text-[10px]">已选 {selectedCreators.length} 人</Badge>
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
                  <button onClick={() => toggleCreator(c.id)} className="ml-0.5 hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={clearAll} className="text-sm text-destructive hover:underline px-2">
                清除全部
              </button>
            </div>
          )}

          {/* Toggle dropdown */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-secondary transition-colors w-full justify-center"
          >
            <Users className="w-4 h-4" />
            {selectedCreators.length === 0 ? "点击选择达人" : "继续选择"}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="border rounded-lg bg-card shadow-lg overflow-hidden">
              <div className="p-3 border-b space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索达人名称..."
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CREATOR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>共 {filtered.length} 位达人</span>
                  <button onClick={selectAllFiltered} className="text-primary hover:underline text-xs">
                    全选当前筛选结果
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {filtered.map((creator) => {
                  const isSelected = selectedIds.includes(creator.id);
                  return (
                    <button
                      key={creator.id}
                      onClick={() => toggleCreator(creator.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors ${
                        isSelected ? "bg-accent/50" : ""
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
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
                        <div className="text-xs text-muted-foreground">粉丝 {formatNumber(creator.followers)}</div>
                        <div className="text-xs text-muted-foreground">互动率 {creator.engagement}%</div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">无匹配达人</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}