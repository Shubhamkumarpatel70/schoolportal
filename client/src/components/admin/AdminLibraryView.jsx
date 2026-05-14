import React, { useState } from "react";
import BookManagement from "../librarian/BookManagement";
import BookIssueManagement from "../librarian/BookIssueManagement";
import { FiBook, FiBookOpen } from "react-icons/fi";

const AdminLibraryView = () => {
  const [subTab, setSubTab] = useState("catalog");

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-neutral-1 pb-4">
        <button 
          onClick={() => setSubTab("catalog")} 
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition ${subTab === "catalog" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-neutral-3/50 hover:bg-neutral-1"}`}
        >
          <FiBook /> Book Catalog
        </button>
        <button 
          onClick={() => setSubTab("issues")} 
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition ${subTab === "issues" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-neutral-3/50 hover:bg-neutral-1"}`}
        >
          <FiBookOpen /> Issue History
        </button>
      </div>

      <div className="animate-fadeIn">
        {subTab === "catalog" ? <BookManagement /> : <BookIssueManagement />}
      </div>
    </div>
  );
};

export default AdminLibraryView;
