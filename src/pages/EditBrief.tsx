import { useState } from "react";
import { ArrowLeft, Minus, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import CreatorPoolPicker from "@/components/CreatorPoolPicker";
import TopNav from "@/components/TopNav";

export default function EditBrief() {
  const [videoGoal, setVideoGoal] = useState(20);
  const [projectName, setProjectName] = useState("永劫无间_US_2026-03");
  const [country, setCountry] = useState("United States of America");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("an online game");
  const [videoType, setVideoType] = useState<"creator_post" | "creator_video">("creator_post");
  const [creatorCategory, setCreatorCategory] = useState("Travel");
  const [creatorDesc, setCreatorDesc] = useState("");
  const [videoSuggestions, setVideoSuggestions] = useState("");
  const [reviewVideo, setReviewVideo] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [poolCategory, setPoolCategory] = useState<"all" | "collaborator">("all");
  const [supplementWithSystem, setSupplementWithSystem] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      <div className="flex-1 max-w-3xl mx-auto w-full py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 border rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-semibold">Edit brief</h1>
        </div>

        {/* Product */}
        <section className="bg-card rounded-lg border p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Product</h2>
            <p className="text-sm text-muted-foreground">
              Select an app and its OS versions to be included in your creator videos. A custom project brief will be generated for you based on your products.
            </p>
          </div>
          <div className="flex gap-3">
            <select className="border rounded-md px-3 py-2 text-sm bg-background">
              <option>App</option>
            </select>
            <select className="border rounded-md px-3 py-2 text-sm bg-background flex-1">
              <option>iOS: 永劫无间</option>
            </select>
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-card rounded-lg border p-6 space-y-5">
          <h2 className="text-lg font-semibold">Basic info</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Video quantity goal per set <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </label>
            <div className="flex items-center gap-0">
              <button onClick={() => setVideoGoal(Math.max(1, videoGoal - 1))} className="border rounded-l-md px-3 py-2 hover:bg-secondary">
                <Minus className="w-4 h-4" />
              </button>
              <input
                value={videoGoal}
                onChange={(e) => setVideoGoal(Number(e.target.value) || 0)}
                className="w-14 text-center border-y py-2 text-sm bg-background"
              />
              <button onClick={() => setVideoGoal(videoGoal + 1)} className="border rounded-r-md px-3 py-2 hover:bg-secondary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Select the number of free videos you'd like to receive in each video set. To help optimize your project performance, we might increase your video quantity goal in the future based on your video usage.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Project name</label>
            <div className="relative">
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.slice(0, 120))}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{projectName.length}/120</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Project country or region</label>
            <p className="text-xs text-muted-foreground">The country or region where the creators you will collaborate with are located.</p>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option>United States of America</option>
              <option>Japan</option>
              <option>United Kingdom</option>
              <option>Indonesia</option>
              <option>South Africa</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Project language</label>
            <p className="text-xs text-muted-foreground">The language used throughout your project brief and received videos.</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option>English</option>
              <option>Japanese</option>
              <option>Chinese</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Product description</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
              />
              <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">{description.length}/1000</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Product selling points</label>
            <p className="text-xs text-muted-foreground">Highlight the key features, benefits, and problems that your product solves, with a maximum of 5 points.</p>
          </div>
        </section>

        {/* Video Requirements */}
        <section className="bg-card rounded-lg border p-6 space-y-5">
          <h2 className="text-lg font-semibold">Video requirements</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Video type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setVideoType("creator_post")}
                className={`flex-1 border rounded-lg p-4 text-left transition-colors ${
                  videoType === "creator_post" ? "border-primary ring-2 ring-ring" : "hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">👤</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${videoType === "creator_post" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {videoType === "creator_post" && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                </div>
                <p className="font-medium text-sm">Creator post</p>
                <p className="text-xs text-muted-foreground mt-1">Publish ad creatives on the creator's account and turn high-performing videos into Spark Ads</p>
              </button>
              <button
                onClick={() => setVideoType("creator_video")}
                className={`flex-1 border rounded-lg p-4 text-left transition-colors ${
                  videoType === "creator_video" ? "border-primary ring-2 ring-ring" : "hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">🎬</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${videoType === "creator_video" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {videoType === "creator_video" && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                </div>
                <p className="font-medium text-sm">Creator video</p>
                <p className="text-xs text-muted-foreground mt-1">Launch videos on your TikTok Business Account or as TikTok in-feed ads.</p>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Creator category</label>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2">
              <Badge variant="secondary" className="gap-1">
                {creatorCategory} <button onClick={() => setCreatorCategory("")} className="hover:text-destructive"><span className="text-xs">×</span></button>
              </Badge>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Preferred creator description <span className="text-muted-foreground font-normal">· Optional</span></label>
            <div className="relative">
              <textarea
                value={creatorDesc}
                onChange={(e) => setCreatorDesc(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Enter details about the type of creator you're looking for."
                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
              />
              <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">{creatorDesc.length}/500</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Video suggestions <span className="text-muted-foreground font-normal">· Optional</span></label>
            <p className="text-xs text-muted-foreground">Provide suggestions for what you'd like to see in the video to creators.</p>
            <div className="relative">
              <textarea
                value={videoSuggestions}
                onChange={(e) => setVideoSuggestions(e.target.value.slice(0, 1000))}
                rows={3}
                placeholder="Enter guidelines and suggestions"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
              />
              <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">{videoSuggestions.length}/1000</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Do's and don'ts <span className="text-muted-foreground font-normal">· Optional</span></label>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium">Brand restrictions</p>
                <button className="text-sm text-primary hover:underline">View more ∨</button>
              </div>
              <div>
                <p className="text-sm font-medium">Must include:</p>
                <button className="text-sm text-primary hover:underline">+ Add</button>
              </div>
              <div>
                <p className="text-sm font-medium">Must avoid:</p>
                <button className="text-sm text-primary hover:underline">+ Add</button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Reference videos <span className="text-muted-foreground font-normal">· Optional</span></label>
            <p className="text-xs text-muted-foreground">Upload up to 5 videos to provide inspiration for creators. Videos must be under 100 MB.</p>
            <button className="border rounded-md px-4 py-2 text-sm hover:bg-secondary transition-colors">Upload</button>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Video assets <span className="text-muted-foreground font-normal">· Optional</span></label>
            <p className="text-xs text-muted-foreground">Acceptable file types: .mov, .mp4, .jpg, .png, .gif, .pdf</p>
            <button className="border rounded-md px-4 py-2 text-sm hover:bg-secondary transition-colors flex items-center gap-1">
              Upload <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </section>

        {/* Creator Pool - NEW FEATURE */}
        <section className="bg-card rounded-lg border p-6">
          <CreatorPoolPicker selectedTags={selectedTags} onTagsChange={setSelectedTags} poolCategory={poolCategory} onPoolCategoryChange={setPoolCategory} videoType={videoType} />
        </section>

        {/* Authorizations */}
        <section className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Authorizations</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium flex items-center gap-1">Ad authorization period <Info className="w-3.5 h-3.5 text-muted-foreground" /></p>
              <p className="text-sm text-muted-foreground">365 days</p>
            </div>
            <div>
              <p className="text-sm font-medium flex items-center gap-1">Creative AI remix authorization <Info className="w-3.5 h-3.5 text-muted-foreground" /></p>
              <p className="text-sm text-muted-foreground">Required</p>
            </div>
            <div>
              <p className="text-sm font-medium flex items-center gap-1">Anchor authorization <Info className="w-3.5 h-3.5 text-muted-foreground" /></p>
              <p className="text-sm text-muted-foreground">Required</p>
            </div>
          </div>
        </section>

        {/* Review Video */}
        <section className="bg-card rounded-lg border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-1">Review video <Info className="w-3.5 h-3.5 text-muted-foreground" /></h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                When toggled off, all videos will skip brand review, be posted on TikTok (withdrawal of the content on creator's behalf is not allowed), and be automatically synced to your creative library. When toggled on, unreviewed videos won't sync. Please review the videos promptly.
              </p>
            </div>
            <Switch checked={reviewVideo} onCheckedChange={setReviewVideo} />
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-between py-4">
          <button className="border rounded-md px-6 py-2 text-sm hover:bg-secondary transition-colors">Exit</button>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
          <button className="bg-primary text-primary-foreground rounded-md px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// Need to import this for the Upload button
import { ChevronDown } from "lucide-react";
