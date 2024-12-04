import React, { createContext, useContext, useState, ReactNode } from "react";
import logo from "../access/Images/logo2.png";

import { RiMenuFold3Line, RiMenuFold4Line } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";
// Định kiểu cho SidebarContext
type SidebarContextType = { expanded: boolean };
const SidebarContext = createContext<SidebarContextType>({ expanded: true });
interface SidebarUserProps {
  children: ReactNode;
}
const SidebarUser: React.FC<SidebarUserProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside className="h-screen ">
      <nav className="h-full flex flex-col bg-[#083b10] shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center h-[120px] border-b border-neutral-700">
          <img
            src={logo}
            alt=""
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-slate-600"
          >
            {expanded ? (
              <RiMenuFold3Line size={30} />
            ) : (
              <RiMenuFold4Line size={30} />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 pt-4">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
};
interface SidebarItemProps {
  icon?: ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active,
  onClick,
  children,
}) => {
  const { expanded } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = !!children;
  return (
    <li className="relative">
      <div
        onClick={() => {
          onClick && onClick();
          if (hasSubItems) setIsOpen((prev) => !prev);
        }}
        className={`group flex items-center py-5 px-2 my-1 font-medium rounded-md cursor-pointer transition-colors 
                    ${
                      active
                        ? "text-[#E0FFFF]"
                        : "hover:text-[#E0FFFF] text-neutral-400"
                    }
                `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all text-lg ${
            expanded ? "w-36 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {hasSubItems && (
          <RiArrowDropDownLine
            size={30}
            className={`ml-auto transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
        {!expanded && (
          <div
            className={`
                        absolute left-full rounded-md px-2 py-1 ml-4
                        bg-lime-500 text-[#E0FFFF] text-sm invisible 
                        opacity-20 -translate-x-3 transition-all group-hover:visible
                        group-hover:opacity-100 group-hover:translate-x-0
                        `}
          >
            {text}
          </div>
        )}
      </div>
      {isOpen && hasSubItems && (
        <ul className="pl-10 transition-all duration-300">{children}</ul>
      )}
    </li>
  );
};
export default {
  SidebarUser,
  SidebarItem,
};
