import { useState } from "react";
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mockCreators, CREATOR_TAGS, formatNumber } from "@/data/mockCreators";
import { Badge } from "@/components/ui/badge";
import TopNav from "@/components/TopNav";

export default function Creators() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Mentions");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = mockCreators.filter(
    (c) => !search || c.handle.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Mentions") return b.mentions - a.mentions;
    if (sortBy === "Followers") return b.followers - a.followers;
    return b.totalViews - a.totalViews;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 border-r bg-card p-4 space-y-1 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm">Content Suite</span>
          </div>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary/20" />
            <span className="text-sm">yhTest</span>
            <ChevronDown className="w-3 h-3 ml-auto" />
          </div>
          <Link to="#" className="block px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-md">Content</Link>
          <div className="px-3 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md">Creators</div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-semibold">Creators</h1>
            <button className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
              Add creators
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Performance data of creators that mention your brand synced from Apr 1, 2022-Mar 29, 2026.
          </p>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by creator handle name"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-background"
              />
            </div>
            <select className="border rounded-md px-3 py-2 text-sm bg-background">
              <option>Creator tags: Please select</option>
            </select>
            <div className="flex items-center gap-1.5 text-sm">
              Sort by
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option>Mentions</option>
                <option>Followers</option>
                <option>Total views</option>
              </select>
            </div>
            <button className="p-2 border rounded-md hover:bg-secondary"><Filter className="w-4 h-4" /></button>
          </div>

          {/* Table */}
          <div className="border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="p-3 text-left w-8"><input type="checkbox" className="rounded" /></th>
                  <th className="p-3 text-left font-medium">Creator</th>
                  <th className="p-3 text-left font-medium">Authorization status</th>
                  <th className="p-3 text-left font-medium">Creator tags</th>
                  <th className="p-3 text-left font-medium">Videos</th>
                  <th className="p-3 text-right font-medium">Followers</th>
                  <th className="p-3 text-right font-medium">Mentions</th>
                  <th className="p-3 text-right font-medium">Total views</th>
                  <th className="p-3 text-right font-medium">Engagement</th>
                  <th className="p-3 text-right font-medium">Launched ads</th>
                  <th className="p-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c.id} className="border-b last:border-b-0 hover:bg-secondary/20">
                    <td className="p-3"><input type="checkbox" className="rounded" /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                          {c.handle[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{c.handle}</p>
                          <p className="text-xs text-muted-foreground">{c.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${c.authStatus === "authorized" ? "text-success" : "text-muted-foreground"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.authStatus === "authorized" ? "bg-success" : "bg-muted-foreground"}`} />
                        {c.authStatus === "authorized" ? "Account authorized" : "Unauthorized"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-10 rounded bg-muted" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right">{formatNumber(c.followers)}</td>
                    <td className="p-3 text-right">{c.mentions}</td>
                    <td className="p-3 text-right">{formatNumber(c.totalViews)}</td>
                    <td className="p-3 text-right">{c.engagement}%</td>
                    <td className="p-3 text-right">{c.launchedAds}</td>
                    <td className="p-3 text-right">
                      <button className="border rounded-md px-3 py-1 text-xs hover:bg-secondary">Add tags</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1 border rounded hover:bg-secondary disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 text-sm rounded border ${page === i + 1 ? "border-primary text-primary" : "hover:bg-secondary"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1 border rounded hover:bg-secondary disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
