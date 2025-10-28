'use client';

import * as React from 'react';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface RefineSelectionSheetProps {
  open: boolean;
  selection: string;
  onClose: () => void;
  onSubmit: (options: { selection: string; stylePrompt?: string }) => void;
}

export function RefineSelectionSheet({ open, selection, onClose, onSubmit }: RefineSelectionSheetProps) {
  const [stylePrompt, setStylePrompt] = React.useState('');

  const handleSubmit = () => {
    onSubmit({ selection, stylePrompt });
    setStylePrompt('');
  };

  return (
    <Transition show={open} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-end justify-center p-6 md:items-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-6 md:scale-95 md:translate-y-0"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-6 md:scale-95 md:translate-y-0"
          >
            <DialogPanel className="w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-xl md:rounded-3xl">
              <Dialog.Title className="text-lg font-semibold">Refine with AI</Dialog.Title>
              <p className="mt-1 text-sm text-neutral-500">
                We&apos;ll polish your selection while honoring your voice. Add optional guidance if you have a tone in mind.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-400">Selection</p>
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-2xl border border-muted/60 bg-neutral-50 p-4 text-sm text-neutral-600">
                    {selection}
                  </div>
                </div>
                <Textarea
                  value={stylePrompt}
                  onChange={(event) => setStylePrompt(event.target.value)}
                  placeholder="Optional: add tone or structural guidance for the AI"
                  rows={4}
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Refine</Button>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
