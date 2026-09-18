import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Modal({ isOpen, onClose, title, children, className, size = "md" }) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-4xl",
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "w-full transform rounded-2xl bg-white border border-slate-200 shadow-2xl transition-all text-left text-slate-900 max-h-[90vh] flex flex-col my-auto",
                  sizes[size],
                  className,
                )}
              >
                {title && (
                  <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0">
                    <Dialog.Title className="text-base sm:text-lg font-bold text-slate-900 truncate">
                      {title}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="p-1.5 -mr-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
