import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
};

function PostCard({
  post,
  currentUserId,
  onLike,
  onFollow,
  comments,
  isCommentsOpen,
  onToggleComments,
  commentText,
  onCommentTextChange,
  onCommentSubmit,
}) {
  const [imgBroken, setImgBroken] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 rounded-3xl mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sm font-bold text-rose-600">
              {post.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <Link to={`/profile/${post.user_id}`} className="text-sm font-semibold text-slate-900 hover:underline">
            {post.username}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {post.user_id !== currentUserId && (
            <button
              onClick={() => onFollow(post.user_id, post.followed_by_me)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                post.followed_by_me
                  ? 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                  : 'text-white bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
            >
              {post.followed_by_me ? 'Following' : 'Follow'}
            </button>
          )}
          <span className="text-xs text-slate-400">{formatTime(post.created_at)}</span>
        </div>
      </div>

      <div className="w-full aspect-square bg-slate-50">
        {imgBroken ? (
          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">📷</div>
        ) : (
          <img
            src={`http://localhost:5000${post.image_url}`}
            alt={post.caption}
            className="w-full h-full object-cover"
            onError={() => setImgBroken(true)}
          />
        )}
      </div>

      <div className="flex items-center gap-4 px-4 pt-3">
        <button onClick={() => onLike(post.id, post.liked_by_me)} className="active:scale-90 transition-transform">
          <Heart
            size={24}
            strokeWidth={2}
            fill={post.liked_by_me ? '#f43f5e' : 'none'}
            className={post.liked_by_me ? 'text-rose-500' : 'text-slate-700'}
          />
        </button>
        <button onClick={() => onToggleComments(post.id)} className="active:scale-90 transition-transform">
          <MessageCircle size={24} strokeWidth={2} className="text-slate-700" />
        </button>
      </div>

      {post.liked_by_me && (
        <p className="px-4 pt-2 text-sm font-semibold text-slate-900">Liked by you</p>
      )}

      {post.caption && (
        <p className="px-4 pt-1.5 text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900">{post.username}</span> {post.caption}
        </p>
      )}

      <button
        onClick={() => onToggleComments(post.id)}
        className="px-4 pt-1.5 pb-3 text-sm text-slate-400 hover:text-slate-600 text-left"
      >
        {comments ? (isCommentsOpen ? 'Hide comments' : 'View comments') : 'View comments'}
      </button>

      {isCommentsOpen && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          {comments &&
            comments.map((comment) => (
              <p key={comment.id} className="text-sm mb-1.5">
                <span className="font-semibold text-slate-900">{comment.username}</span>{' '}
                <span className="text-slate-600">{comment.text}</span>
              </p>
            ))}

          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText || ''}
              onChange={(e) => onCommentTextChange(post.id, e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <button
              disabled={!commentText}
              onClick={() => onCommentSubmit(post.id)}
              className="text-sm font-semibold text-rose-600 disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;