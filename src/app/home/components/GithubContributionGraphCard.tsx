import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import GitHubCalendar, { Props } from 'react-github-calendar';

const GithubContributionGraph = () => {
    const { theme } = useTheme();

  return <div className="flex flex-col justify-center h-full">
    <GitHubCalendar username="xthenuwara" year="last" colorScheme={theme == "light" ? "light" : "dark"}  />
  </div>;
};

export default GithubContributionGraph;
