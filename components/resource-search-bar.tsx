"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ResourceSearchBarProps {
  onSearch: (search: string) => void;
  totalResources: number;
}

export function ResourceSearchBar({ onSearch, totalResources }: ResourceSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Rechercher dans les ressources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-12 border border-[#E73628] focus-visible:ring-[#4AAD33] focus-visible:ring-2 focus-visible:ring-offset-2"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#F4E63C]/20"
        >
          <Search className="h-4 w-4 text-[#E73628]" />
        </Button>
      </form>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold uppercase text-foreground">
          {totalResources} ressource{totalResources !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}