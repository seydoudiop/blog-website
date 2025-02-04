"use client";

import Layout from '@/components/Layout';
import PostList from '@/components/PostList';
import { getPosts } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Blog</h1>
      <PostList posts={posts} />
    </Layout>
  );
}
