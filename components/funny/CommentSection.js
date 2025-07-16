'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ANIMATION_DURATIONS, FRIENDS_DATA } from '../../lib/constants';

const CommentSection = ({ comments, showComments, momentId }) => {
  const [newComment, setNewComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'easeInOut',
      }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'easeInOut',
        staggerChildren: 0.1,
      },
    },
  };

  const commentVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      x: 5,
      transition: {
        duration: 0.2,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        delay: 0.2,
      },
    },
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const getFriendData = (friendId) => {
    return FRIENDS_DATA.find(f => f.id === friendId) || { name: friendId, nickname: friendId };
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, this would add the comment to the database
      console.log('New comment:', newComment);
      setNewComment('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <AnimatePresence>
      {showComments && (
        <motion.div
          className="border-t border-gray-200 pt-4 mt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Comments Header */}
          <motion.div
            className="flex items-center gap-2 mb-4"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <span className="text-sm font-semibold text-gray-700">
              Comments ({comments.length})
            </span>
            <motion.div
              className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          {/* Comments List */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comments.map((comment, index) => {
              const friend = getFriendData(comment.author);
              return (
                <motion.div
                  key={comment.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  variants={commentVariants}
                  whileHover="hover"
                >
                  {/* Friend Avatar */}
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {friend.name.charAt(0).toUpperCase()}
                  </motion.div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <motion.span 
                        className="text-sm font-semibold text-gray-800"
                        whileHover={{ color: '#8b5cf6' }}
                      >
                        {friend.name}
                      </motion.span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                    </div>
                    
                    <motion.p
                      className="text-sm text-gray-700 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {comment.text}
                    </motion.p>

                    {/* Comment Reactions */}
                    <motion.div
                      className="flex items-center gap-2 mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      <motion.button
                        className="text-xs text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>👍</span>
                        <span>Like</span>
                      </motion.button>
                      <motion.button
                        className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reply
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Add Comment Form */}
          <motion.form
            className="relative"
            variants={inputVariants}
            onSubmit={handleCommentSubmit}
          >
            <motion.div
              className="relative"
              animate={{
                scale: isTyping ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.textarea
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                placeholder="Add a funny comment... 😄"
                rows={2}
                value={newComment}
                onChange={handleInputChange}
                whileFocus={{
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                }}
              />
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="absolute bottom-2 right-12 flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-purple-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="absolute bottom-2 right-2 p-2 text-purple-600 hover:text-purple-800 disabled:text-gray-400 transition-colors"
                disabled={!newComment.trim()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  rotate: newComment.trim() ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Character Counter */}
            <motion.div
              className="flex justify-between items-center mt-2 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: isTyping ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span>Share your thoughts on this hilarious moment!</span>
              <span className={newComment.length > 200 ? 'text-red-500' : ''}>
                {newComment.length}/250
              </span>
            </motion.div>
          </motion.form>

          {/* Fun Reactions */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <span className="text-xs text-gray-500">Quick reactions:</span>
            {['😂', '🤣', '😭', '💀', '🔥'].map((emoji, index) => (
              <motion.button
                key={emoji}
                className="text-lg hover:scale-125 transition-transform"
                whileHover={{ 
                  scale: 1.3,
                  rotate: [0, -10, 10, 0],
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => console.log(`Reacted with ${emoji}`)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;