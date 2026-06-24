import React, { useState, useEffect } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Heading, Tabs, toast } from "@medusajs/ui";
import { GridLayout } from "@medusajs/icons";
import {
  useStoreContent,
  useUpdateStoreContent,
} from "../../hooks/use-store-content";
import { StoreContent } from "../../lib/sdk";
import { HeroSection } from "../../components/HeroSection";
import { PromotionalBannersSection } from "../../components/PromotionalBannersSection";
import { StaticPagesSection } from "../../components/StaticPagesSection";

const StoreContentPage = () => {
  const { data, isLoading, isError } = useStoreContent();
  const updateMutation = useUpdateStoreContent();
  const [formState, setFormState] = useState<StoreContent | null>(null);

  useEffect(() => {
    if (data) {
      setFormState(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9e0000]"></div>
      </div>
    );
  }

  if (isError || !formState) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 border border-red-200 rounded-[4px] m-6">
        Error loading store content. Please try again.
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formState);
      toast.success("Store content saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save store content");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="flex w-full max-w-6xl flex-col gap-6 mx-auto p-4 md:p-6 font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e5e2e1] pb-4">
        <div>
          <Heading
            level="h1"
            className="text-2xl font-black text-[#1c1b1b] font-headline uppercase tracking-tight"
          >
            Store Content Management
          </Heading>
          <p className="text-sm text-[#5e3f3a]">
            Manage hero banners, promotional carousels, and static pages.
          </p>
        </div>
        <Button
          type="submit"
          isLoading={updateMutation.isPending}
          className="bg-[#9e0000] text-white font-bold uppercase rounded-[4px] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all px-6 py-2.5 shadow-md text-sm"
        >
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="flex w-full min-w-0 flex-col gap-4">
        <Tabs.List className="w-full min-w-0 overflow-x-auto">
          <Tabs.Trigger value="hero">Hero</Tabs.Trigger>
          <Tabs.Trigger value="banners">Promotional Banners</Tabs.Trigger>
          <Tabs.Trigger value="pages">Static Pages</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="hero" className="w-full min-w-0">
          <HeroSection
            value={formState.hero}
            onChange={(hero) => setFormState({ ...formState, hero })}
          />
        </Tabs.Content>
        <Tabs.Content value="banners" className="w-full min-w-0">
          <PromotionalBannersSection
            value={formState.promotionalBanners}
            onChange={(promotionalBanners) =>
              setFormState({ ...formState, promotionalBanners })
            }
          />
        </Tabs.Content>
        <Tabs.Content value="pages" className="w-full min-w-0">
          <StaticPagesSection
            value={formState.staticPages}
            onChange={(staticPages) =>
              setFormState({ ...formState, staticPages })
            }
          />
        </Tabs.Content>
      </Tabs>
    </form>
  );
};

export const config = defineRouteConfig({
  label: "Store Content",
  icon: GridLayout,
});

export default StoreContentPage;
