"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CreatePostForm from './CreatePostForm';
import EditPostForm from './EditPostForm';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      // Refresh the page to remove the deleted post
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div>
      <h2>Manage Posts</h2>
      <CreatePostForm />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            {editingPostId === post.id ? (
              <EditPostForm postId={post.id} />
            ) : (
              <button onClick={() => setEditingPostId(post.id)}>Edit</button>
            )}
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostManager;
