import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { formatRelativeTime } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Send, MessageSquare, User } from 'lucide-react';

export function CommentSection({
  comments = [],
  onAddComment
}) {
  const { currentUser } = useUser();
  const toast = useToast();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser) {
      toast.error('Please select an active user to submit a note.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment({
        userId: currentUser.id,
        comment: commentText.trim()
      });
      setCommentText('');
    } catch (err) {
      toast.error(`Failed to post comment: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-900">
            Discussion & Activity Notes ({comments.length})
          </h4>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
            No activity notes recorded yet. Be the first to leave a comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 transition-colors"
            >
              {comment.user_avatar ? (
                <img
                  src={comment.user_avatar}
                  alt={comment.user_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 mt-0.5"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {comment.user_name ? comment.user_name.charAt(0) : <User className="w-4 h-4" />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{comment.user_name}</span>
                    {comment.user_role && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-medium">
                        {comment.user_role}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Posting as:</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            {currentUser?.avatar_url && (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.name}
                className="w-4 h-4 rounded-full object-cover"
              />
            )}
            {currentUser?.name || 'Anonymous User'}
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add an update, progress note, or mention a blocker..."
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 bg-white p-3 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={Send}
            isLoading={isSubmitting}
            disabled={!commentText.trim()}
          >
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
