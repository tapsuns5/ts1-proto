import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/Dialog/Dialog';
import { SimpleLabelButton } from '@/components/SimpleLabelButton';
import { SimpleIcon } from '@/components/SimpleIcon';

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export function PublishModal({ open, onClose, onPublish }: PublishModalProps) {
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [message, setMessage] = useState('');

  const handlePublish = () => {
    setMessage('');
    setNotifyMembers(true);
    onPublish();
  };

  const handleClose = () => {
    setMessage('');
    setNotifyMembers(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent size="lg" showCloseIconButton={false} className="sui-rounded-2xl">
        {/* Header */}
        <div className="sui-flex sui-items-center sui-gap-2 sui-pt-5 sui-px-4">
          <div className="sui-flex sui-items-center sui-justify-center sui-w-6 sui-h-6 sui-text-admin-action-text">
            <SimpleIcon name="mail" size="s" />
          </div>
          <DialogTitle className="sui-text-heading-md sui-text-neutral-text sui-flex-1">
            Notify team members
          </DialogTitle>
          <DialogClose asChild>
            <button className="sui-flex sui-items-center sui-justify-center sui-text-neutral-text hover:sui-text-neutral-text-medium">
              <SimpleIcon name="close" size="s" />
            </button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="sui-flex sui-flex-col sui-gap-2 sui-px-4 sui-py-4">
          <div className="sui-text-body sui-text-neutral-text">
            <p className="sui-mb-2">
              Publishing will make all draft games visible to team members. A notification will be sent to each team chat.
            </p>
            <p>
              Notifications include game details and will highlight schedule changes. You may also include an optional custom message.
            </p>
          </div>

          {/* Toggle */}
          <div className="sui-flex sui-items-center sui-gap-2">
            <input
              type="checkbox"
              name="notify-members"
              checked={notifyMembers}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifyMembers(e.target.checked)}
              className="sui-checkbox"
            />
            <span className="sui-text-body sui-text-neutral-text">
              {notifyMembers ? 'Yes, notify members' : "No, don't notify members"}
            </span>
          </div>

          {/* Optional message textarea — only when notify is on */}
          {notifyMembers && (
            <div className="sui-flex sui-flex-col sui-gap-1">
              <label className="sui-text-body sui-text-neutral-text sui-font-medium">
                Include a message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                className="sui-w-full sui-border sui-border-neutral-border sui-rounded-full sui-p-2 sui-min-h-[80px] sui-resize-vertical"
                placeholder="Add a custom message for team members..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sui-flex sui-items-center sui-justify-end sui-gap-1 sui-px-4 sui-pb-4 sui-pt-2">
          <SimpleLabelButton
            type="secondary"
            label="Cancel"
            onClick={handleClose}
          />
          <SimpleLabelButton
            type="primary"
            label={notifyMembers ? 'Publish & notify' : 'Publish without notification'}
            onClick={handlePublish}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
