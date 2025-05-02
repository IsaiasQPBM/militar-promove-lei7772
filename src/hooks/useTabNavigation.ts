
import { useState } from "react";

export const useTabNavigation = (initialTab: string, tabList: string[]) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleNext = () => {
    const currentIndex = tabList.indexOf(activeTab);
    if (currentIndex < tabList.length - 1) {
      setActiveTab(tabList[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabList.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabList[currentIndex - 1]);
    }
  };

  const isFirstTab = activeTab === tabList[0];
  const isLastTab = activeTab === tabList[tabList.length - 1];

  return {
    activeTab,
    setActiveTab,
    handleNext,
    handlePrevious,
    isFirstTab,
    isLastTab
  };
};
