'use client';

import * as React from 'react';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseYoutubeId } from '@/lib/youtube';

interface YoutubeEmbedDialogProps {
  open: boolean;
  onClose: () => void;
  onEmbed: (url: string) => void;
}

export function YoutubeEmbedDialog({ open, onClose, onEmbed }: YoutubeEmbedDialogProps) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = () => {
    const id = parseYoutubeId(value.trim());
    if (!id) {
      setError('Please provide a valid YouTube URL.');
      return;
    }

    onEmbed(`https://www.youtube.com/watch?v=${id}`);
    setValue('');
    setError('');
    onClose();
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
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold">Embed a YouTube memory</Dialog.Title>
              <p className="mt-1 text-sm text-neutral-500">
                Paste any YouTube link. We will embed it seamlessly in your Gaia Archive entry.
              </p>
              <div className="mt-4 space-y-3">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Embed</Button>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
