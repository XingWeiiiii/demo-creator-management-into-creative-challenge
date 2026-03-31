import { useState, useMemo } from "react";
import { Check, ChevronDown, Search, X, Users } from "lucide-react";
import { mockCreators, CREATOR_TAGS, formatNumber, type Creator } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function CreatorPoolPicker({ selectedIds, onChange }: Props) {
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">达人池选择</h3>
          <p className="text-sm text-muted-foreground">从达人管理中选择达人，支持按标签筛选</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-secondary transition-colors"
        >
          <Users className="w-4 h-4" />
          选择达人
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

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

      {/* Dropdown panel */}
      {open && (
        <div className="border rounded-lg bg-card shadow-lg overflow-hidden">
          {/* Search + tag filters */}
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

          {/* Creator list */}
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
  );
}
