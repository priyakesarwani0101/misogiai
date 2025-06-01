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
  const [feedback, setFeedback] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  const fetchFeedback = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${apiBaseUrl}/feedback/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setFeedback(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
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
      const response = await fetch(`${apiBaseUrl}/feedback/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          type: 'TEXT',
          content: newComment 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          fetchFeedback(); // Refresh all feedback
          setNewComment('');
          toast.success('Comment added successfully');
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleReaction = async (emoji) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to react');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/feedback/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          type: 'EMOJI',
          content: emoji 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          fetchFeedback(); // Refresh all feedback
          toast.success('Reaction added successfully');
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  // Calculate emoji counts
  const emojiCounts = feedback
    .filter(item => item.type === 'EMOJI')
    .reduce((acc, item) => {
      acc[item.content] = (acc[item.content] || 0) + 1;
      return acc;
    }, {});

  // Get only text comments
  const comments = feedback.filter(item => item.type === 'TEXT');

  if (loading) {
    return <div className="text-center py-4">Loading feedback...</div>;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Event Feedback</h3>
      
      {/* Emoji Reactions Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-medium mb-3">Quick Reactions</h4>
        <div className="flex gap-4">
          {EMOJI_OPTIONS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="px-4 py-2 rounded-full text-lg transition flex items-center gap-2 hover:bg-gray-100"
              title={label}
            >
              {emoji}
              <span className="text-sm font-medium">
                {emojiCounts[emoji] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-3">Comments</h4>
        
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
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
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
    </div>
  );
};

export default EventComments; 