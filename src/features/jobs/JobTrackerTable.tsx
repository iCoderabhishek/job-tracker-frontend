"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, JobMatch, CompanyStatusUpdate } from "../../api/jobs";
import { useState, useEffect, useMemo, Fragment } from "react";
import { Search01Icon, ArrowUpRight01Icon, DocumentCodeIcon, Cancel01Icon } from "hugeicons-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState
} from "@tanstack/react-table";
import { useCurrentUser } from "@/features/auth/hooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const statusColors: Record<string, string> = {
  notApplied: "bg-transparent text-foreground",
  alreadyApplied: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ignoreApplied: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  shortlisted: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  interviewed: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  ghosted: "bg-gray-500/10 text-gray-500 dark:text-gray-500",
};

const statusLabels: Record<string, string> = {
  notApplied: "To Apply",
  alreadyApplied: "Applied",
  ignoreApplied: "Ignored",
  shortlisted: "Shortlisted",
  interviewed: "Interviewing",
  rejected: "Rejected",
  ghosted: "Ghosted",
};

// --- Custom Editable Cell Component ---
const EditableCell = ({
  initialValue,
  onSave,
  placeholder,
}: {
  initialValue: string;
  onSave: (value: string) => void;
  placeholder: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      onSave(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full text-[12px] font-normal px-2 py-1 bg-blue-500/10 text-foreground border-none outline-none ring-1 ring-blue-500 inset-0 absolute"
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full h-full text-[12px] truncate cursor-text px-2 flex items-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
    >
      {value ? (
        <span className="font-normal text-foreground">{value}</span>
      ) : (
        <span className="text-muted-foreground/60 italic">{placeholder}</span>
      )}
    </div>
  );
};

// --- Drawer Component ---
const ResumeDrawer = ({ isOpen, onClose, match, currentUser }: { isOpen: boolean; onClose: () => void; match: JobMatch | null; currentUser: any }) => {
  if (!match) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 backdrop-blur-[1px]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background shadow-2xl z-50 border-l border-black/10 dark:border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 bg-muted/30">
              <div>
                <h2 className="text-lg font-bold text-foreground">Tailor Resume</h2>
                <p className="text-sm text-muted-foreground">{match.job.title} at {match.job.company}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <Cancel01Icon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
              <div className="space-y-6">
                {/* AI Suggestions Box */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">AI Optimization Strategy</h4>
                  <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
                    <p className="mb-2"><strong>Missing Keywords:</strong> {match.missing_skills || 'None detected'}</p>
                    <p><strong>Action:</strong> Inject these keywords naturally into your experience bullets.</p>
                  </div>
                </div>

                {/* Base Resume Side */}
                <div className="bg-card border border-black/10 dark:border-white/10 rounded-lg p-0 shadow-sm flex flex-col h-[500px]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 bg-muted/30 rounded-t-lg">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Master Resume</h4>
                    <span className="text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded text-muted-foreground">Editable</span>
                  </div>
                  <textarea 
                    className="flex-1 w-full p-4 text-[13px] text-foreground bg-transparent font-mono leading-relaxed resize-none outline-none custom-scrollbar"
                    defaultValue={currentUser?.resumes || "No master resume found. Please update your profile settings."}
                    placeholder="Paste your master resume here..."
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-black/10 dark:border-white/10 bg-background flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-black/10 dark:border-white/10 rounded-md hover:bg-muted">
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm">
                Save & Generate PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// --- Main Table Component ---
export function JobTrackerTable({ region }: { region?: string }) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true } // Default sort by date
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  
  const queryLimit = searchParams.get("limit");
  const defaultLimit = queryLimit === "all" ? "all" : (queryLimit ? Number(queryLimit) : 200);
  const [limit, setLimit] = useState<number | "all">(defaultLimit);

  useEffect(() => {
    const qLimit = searchParams.get("limit");
    if (qLimit) {
      setLimit(qLimit === "all" ? "all" : Number(qLimit));
    }
  }, [searchParams]);

  const handleLimitChange = (newLimit: number | "all") => {
    setLimit(newLimit);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newLimit));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["job-matches", limit, currentUser?.id, region],
    queryFn: () => {
      if (!currentUser?.id) throw new Error("No user");
      return jobsApi.getMatches(currentUser.id, limit, region);
    },
    enabled: !!currentUser?.id,
    staleTime: 0,
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: { match: JobMatch; update: Partial<CompanyStatusUpdate> }) => {
      if (!currentUser) throw new Error("Not authenticated");
      return jobsApi.updateCompanyStatus({
        comp_name: data.match.job.company,
        job_url: data.match.job.apply_url,
        status: data.match.status || 'notApplied',
        user_id: currentUser.id,
        ...data.update,
      });
    },
    onMutate: async ({ match, update }) => {
      await queryClient.cancelQueries({ queryKey: ["job-matches"] });
      const previousMatches = queryClient.getQueryData<JobMatch[]>(["job-matches"]);
      
      queryClient.setQueryData<JobMatch[]>(["job-matches"], (old) => {
        if (!old) return old;
        return old.map(m => {
          if (m.id === match.id) {
            if (update.status) m.status = update.status;
          }
          return m;
        });
      });
      return { previousMatches };
    },
    onError: (err, variables, context) => {
      if (context?.previousMatches) {
        queryClient.setQueryData(["job-matches"], context.previousMatches);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["job-matches"] });
      queryClient.invalidateQueries({ queryKey: ["job-metrics"] });
    },
  });

  const columnHelper = createColumnHelper<JobMatch>();

  const columns = useMemo(() => [
    columnHelper.accessor("created_at", {
      header: "Date",
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-muted-foreground/50">-</span>;
        const date = new Date(val);
        return <span className="text-[12px] font-medium text-foreground">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>;
      },
      size: 80,
    }),
    columnHelper.accessor((row) => row.job.company, {
      id: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="font-semibold text-[13px] text-foreground truncate px-2">
          {row.original.job.company}
        </div>
      ),
      size: 150,
    }),
    columnHelper.accessor((row) => row.job.title, {
      id: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="text-[13px] text-foreground/80 truncate px-2">
          {row.original.job.title}
        </div>
      ),
      size: 250,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <div className="w-full h-full relative" onClick={(e) => e.stopPropagation()}>
          <select 
            value={row.original.status || "notApplied"}
            onChange={(e) => updateCompanyMutation.mutate({ match: row.original, update: { status: e.target.value } })}
            className={`w-full h-full text-[12px] font-medium px-2 appearance-none cursor-pointer outline-none border-none bg-transparent ${statusColors[row.original.status || 'notApplied']}`}
          >
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val} className="text-foreground bg-background">{label}</option>
            ))}
          </select>
        </div>
      ),
      size: 130,
    }),
    columnHelper.accessor("match_score", {
      header: "Score",
      cell: (info) => {
        const score = info.getValue();
        return (
          <div className={`w-full h-full flex items-center justify-center font-bold text-[12px] ${
            score >= 80 ? 'text-green-600 bg-green-500/10' : 
            score >= 50 ? 'text-amber-600 bg-amber-500/10' : 'text-red-600 bg-red-500/10'
          }`}>
            {Math.round(score)}
          </div>
        );
      },
      size: 70,
    }),
    columnHelper.display({
      id: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="w-full h-full relative">
          <EditableCell 
            initialValue={row.original.job.location || ""} 
            placeholder="Add..."
            onSave={(val) => updateCompanyMutation.mutate({ match: row.original, update: { comp_site: val } })}
          />
        </div>
      ),
      size: 120,
    }),
    columnHelper.display({
      id: "ctc",
      header: "CTC",
      cell: ({ row }) => (
        <div className="w-full h-full relative">
          <EditableCell 
            initialValue={""} 
            placeholder="$"
            onSave={(val) => updateCompanyMutation.mutate({ match: row.original, update: { ctc: val } })}
          />
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor("missing_skills", {
      header: "Missing Keywords",
      cell: ({ row }) => {
        const skills = row.original.missing_skills ? row.original.missing_skills.split(',') : [];
        if (!skills.length) return <span className="text-[11px] text-muted-foreground/60 italic px-2">None</span>;
        return (
          <div className="flex items-center gap-1 px-2 h-full overflow-hidden whitespace-nowrap">
            <span className="text-[11px] font-medium text-red-500 truncate">{skills.join(", ")}</span>
          </div>
        );
      },
      size: 250,
    }),
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 h-full px-2">
          <button 
            onClick={() => {
              setSelectedMatch(row.original);
              setDrawerOpen(true);
            }}
            className="flex items-center justify-center w-6 h-6 hover:bg-blue-500/10 text-blue-500 rounded transition-colors"
            title="Tailor Resume"
          >
            <DocumentCodeIcon className="w-4 h-4" />
          </button>
          <a 
            href={row.original.job.apply_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-6 h-6 hover:bg-black/5 dark:hover:bg-white/10 text-foreground rounded transition-colors"
            title="Apply Now"
          >
            <ArrowUpRight01Icon className="w-4 h-4" />
          </a>
        </div>
      ),
      size: 80,
    }),
  ], [currentUser, updateCompanyMutation]);

  const table = useReactTable({
    data: matches || [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse h-full w-full bg-black/5 dark:bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-red-500 text-sm font-medium">
        Failed to load job matches. Backend might be unreachable.
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Search01Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Jobs Found</h3>
        <p className="text-muted-foreground text-sm">Waiting for the scraper to fetch new jobs.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end px-4 py-1.5 bg-muted/20 border-b border-black/5 dark:border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Show:</span>
          <select 
            value={limit} 
            onChange={(e) => handleLimitChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="text-xs bg-black/5 dark:bg-white/5 rounded px-2 py-1 outline-none text-foreground font-medium cursor-pointer border border-black/10 dark:border-white/10"
          >
            <option value={50} className="bg-background">50 Jobs</option>
            <option value={100} className="bg-background">100 Jobs</option>
            <option value={200} className="bg-background">200 Jobs</option>
            <option value="all" className="bg-background">All Jobs</option>
          </select>
        </div>
      </div>
      <div className="flex-1 w-full overflow-hidden flex flex-col bg-background">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table 
            className="w-full text-left border-collapse" 
            style={{ 
              width: table.getTotalSize(),
            }}
          >
            <thead className="bg-muted/50 sticky top-0 z-10 shadow-sm backdrop-blur-md">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={`relative px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border border-black/10 dark:border-white/10 ${header.column.getCanSort() ? 'hover:bg-muted/80' : ''}`}
                    >
                      <div 
                        className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      
                      {/* Resize Handle */}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-blue-500 ${header.column.getIsResizing() ? 'bg-blue-500' : 'bg-transparent'}`}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-background">
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group h-8"
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      style={{ width: cell.column.getSize() }}
                      className="p-0 border border-black/10 dark:border-white/10 align-middle relative overflow-hidden"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ResumeDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        match={selectedMatch} 
        currentUser={currentUser} 
      />
    </>
  );
}
