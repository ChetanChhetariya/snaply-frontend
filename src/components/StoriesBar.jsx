import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { getStories, createStory } from '../services/postService';
import { getCurrentUserId } from '../utils/Auth';

const STORY_DURATION = 15000;

function StoriesBar() {
  const [stories, setStories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [viewer, setViewer] = useState(null); // { userIndex, storyIndex }
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);
  const currentUserId = getCurrentUserId();

  const fetchStories = async () => {
    const token = localStorage.getItem('token');
    const data = await getStories(token);
    setStories(data.stories);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Group stories by user, most recent story first within each group
  const groupedByUser = useMemo(() => {
    const map = {};
    stories.forEach((story) => {
      if (!map[story.user_id]) {
        map[story.user_id] = { user_id: story.user_id, username: story.username, stories: [] };
      }
      map[story.user_id].stories.push(story);
    });
    return Object.values(map);
  }, [stories]);

  const myGroup = groupedByUser.find((g) => g.user_id === currentUserId);
  const otherGroups = groupedByUser.filter((g) => g.user_id !== currentUserId);
  const allGroups = myGroup ? [myGroup, ...otherGroups] : otherGroups;

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      await createStory(formData, token);
      await fetchStories();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAvatarClick = () => {
    if (myGroup) {
      setViewer({ userIndex: 0, storyIndex: 0 });
    } else {
      fileInputRef.current.click();
    }
  };

  const openOtherUserStory = (group) => {
    const userIndex = allGroups.findIndex((g) => g.user_id === group.user_id);
    setViewer({ userIndex, storyIndex: 0 });
  };

  const closeViewer = () => {
    setViewer(null);
    setProgress(0);
  };

  const goToNext = () => {
    if (!viewer) return;
    const currentGroup = allGroups[viewer.userIndex];

    if (viewer.storyIndex < currentGroup.stories.length - 1) {
      setViewer({ ...viewer, storyIndex: viewer.storyIndex + 1 });
    } else if (viewer.userIndex < allGroups.length - 1) {
      setViewer({ userIndex: viewer.userIndex + 1, storyIndex: 0 });
    } else {
      closeViewer();
    }
  };

  const goToPrev = () => {
    if (!viewer) return;
    if (viewer.storyIndex > 0) {
      setViewer({ ...viewer, storyIndex: viewer.storyIndex - 1 });
    } else if (viewer.userIndex > 0) {
      const prevGroup = allGroups[viewer.userIndex - 1];
      setViewer({ userIndex: viewer.userIndex - 1, storyIndex: prevGroup.stories.length - 1 });
    }
  };

  // Auto-advance timer with progress bar
  useEffect(() => {
    if (!viewer) return;

    setProgress(0);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(intervalRef.current);
        goToNext();
      }
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [viewer]);

  const activeGroup = viewer ? allGroups[viewer.userIndex] : null;
  const activeStory = activeGroup ? activeGroup.stories[viewer.storyIndex] : null;

  return (
    <div className="flex gap-4 overflow-x-auto px-1 py-4 [scrollbar-width:none]">
      {/* Your story */}
      <div className="relative flex flex-shrink-0 flex-col items-center gap-1">
        <button
          onClick={handleAvatarClick}
          disabled={uploading}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white disabled:opacity-50 ${
            myGroup
              ? 'bg-gradient-to-tr from-amber-400 via-brand-primary to-indigo-500 p-[2px]'
              : ''
          }`}
        >
          {myGroup ? (
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-primary to-brand-secondary">
              {myGroup.username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-border bg-surface-soft text-text-muted">
              +
            </div>
          )}
        </button>

        {/* Small add badge, always available */}
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="absolute bottom-5 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-primary text-white"
        >
          <Plus className="h-3 w-3" />
        </button>

        <span className="text-xs text-text-secondary">Your story</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Other users' stories */}
      {otherGroups.map((group) => (
        <button
          key={group.user_id}
          onClick={() => openOtherUserStory(group)}
          className="flex flex-shrink-0 flex-col items-center gap-1"
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-400 via-brand-primary to-indigo-500 p-[2px]">
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-white">
              <img
                src={`http://localhost:5000${group.stories[0].image_url}`}
                alt={group.username}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <span className="max-w-16 truncate text-xs text-text-secondary">{group.username}</span>
        </button>
      ))}

      {/* Full-screen viewer */}
      {viewer && activeStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
          <div className="relative w-full max-w-sm">
            {/* Progress bars */}
            <div className="absolute -top-6 left-0 right-0 flex gap-1 px-1">
              {activeGroup.stories.map((_, i) => (
                <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full bg-white"
                    style={{
                      width:
                        i < viewer.storyIndex ? '100%' : i === viewer.storyIndex ? `${progress}%` : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            <p className="absolute -top-12 left-0 text-sm font-semibold text-white">
              {activeGroup.user_id === currentUserId ? 'Your story' : activeGroup.username}
            </p>

            <button
              onClick={closeViewer}
              className="absolute -top-12 right-0 text-sm font-semibold text-white"
            >
              Close
            </button>

            <img
              src={`http://localhost:5000${activeStory.image_url}`}
              alt={activeGroup.username}
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />

            {/* Tap zones for prev/next */}
            <button
              onClick={goToPrev}
              className="absolute left-0 top-0 h-full w-1/3"
              aria-label="Previous story"
            />
            <button
              onClick={goToNext}
              className="absolute right-0 top-0 h-full w-1/3"
              aria-label="Next story"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StoriesBar;