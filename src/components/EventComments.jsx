import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const EMOJI_OPTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '👎', label: 'Dislike' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😮', label: 'Wow' }
];

const EventComments = ({ isEventLive }) => {
  const { eventId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/events/${eventId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setComments(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to comment');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/events/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setComments([...comments, data.data]);
          setNewComment('');
          toast.success('Comment added successfully');
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleReaction = async (commentId, emoji) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to react');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/events/${eventId}/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emoji }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Update the comment's reactions in the local state
          setComments(comments.map(comment => 
            comment.id === commentId ? { ...comment, reactions: data.data.reactions } : comment
          ));
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Comments & Reactions</h3>
      
      {isEventLive && (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={200}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Comment
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{comment.user.name}</p>
                <p className="text-gray-600 mt-1">{comment.content}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            
            <div className="mt-2 flex gap-2">
              {EMOJI_OPTIONS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(comment.id, emoji)}
                  className={`px-2 py-1 rounded-full text-sm transition
                    ${comment.reactions?.includes(emoji) 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'hover:bg-gray-100'
                    }`}
                  title={label}
                >
                  {emoji} {comment.reactions?.filter(r => r === emoji).length || 0}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default EventComments; 