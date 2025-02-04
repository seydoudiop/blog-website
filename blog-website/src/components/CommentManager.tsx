"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const CommentManager = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, []);

  const handleApprove = async (id: number) => {
    const { error } = await supabase
      .from('comments')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.error('Error approving comment:', error);
    } else {
      // Refresh the page to show the updated comment status
      setComments(
        comments.map((comment) =>
          comment.id === id ? { ...comment, status: 'approved' } : comment
        )
      );
    }
  };

  const handleReject = async (id: number) => {
    const { error } = await supabase
      .from('comments')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting comment:', error);
    } else {
      // Refresh the page to show the updated comment status
      setComments(
        comments.map((comment) =>
          comment.id === id ? { ...comment, status: 'rejected' } : comment
        )
      );
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
    } else {
      // Refresh the page to remove the deleted comment
      setComments(comments.filter((comment) => comment.id !== id));
    }
  };

  return (
    <div>
      <h2>Manage Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - Status: {comment.status}
            <button onClick={() => handleApprove(comment.id)}>Approve</button>
            <button onClick={() => handleReject(comment.id)}>Reject</button>
            <button onClick={() => handleDelete(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentManager;
