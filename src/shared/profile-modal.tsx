import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Cancel01Icon, Loading02Icon, FloppyDiskIcon } from "hugeicons-react";
import { useCurrentUser } from "@/features/auth/hooks";
import { authApi } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [goal, setGoal] = useState("");
  const [resumes, setResumes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setGoal(currentUser.goal || "");
      setResumes(currentUser.resumes || "");
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const updatedUser = await authApi.loginOrSignup({
        email: currentUser.email,
        name: currentUser.name || currentUser.email.split('@')[0],
        goal,
        resumes
      });
      
      // Update cache instantly
      queryClient.setQueryData(["current-user"], updatedUser);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-background border border-black/5 dark:border-white/5 p-6 md:p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-xl font-serif font-semibold text-foreground">
                    Profile & Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Cancel01Icon className="w-5 h-5" />
                  </button>
                </div>

                {isUserLoading ? (
                  <div className="flex justify-center p-8">
                    <Loading02Icon className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2 block">
                        Career Goal
                      </label>
                      <p className="text-xs text-muted-foreground mb-3">
                        What kind of jobs are you looking for? The AI will use this to find the best matches.
                      </p>
                      <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. I am looking for a Senior Frontend Engineer role in a fast-paced startup..."
                        className="w-full px-4 py-3 bg-black/5 border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all resize-none min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2 block">
                        Master Resume
                      </label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Paste your entire base resume text here. We will tailor it for each specific job.
                      </p>
                      <textarea
                        value={resumes}
                        onChange={(e) => setResumes(e.target.value)}
                        placeholder="Paste your resume text here..."
                        className="w-full px-4 py-3 bg-black/5 border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all resize-none min-h-[200px]"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-foreground bg-black/5 hover:bg-black/10 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-70 active:scale-[0.98]"
                      >
                        {isSaving ? <Loading02Icon className="w-4 h-4 animate-spin" /> : <FloppyDiskIcon className="w-4 h-4" />}
                        Save Profile
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
