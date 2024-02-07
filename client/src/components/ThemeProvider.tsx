import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Mode } from "../types/themeType";

interface Props {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<Props> = ({ children }: Props) => {
  const { mode }: { mode: Mode } = useSelector(
    (state: RootState) => state.theme
  );
  return (
    <div className={mode}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
