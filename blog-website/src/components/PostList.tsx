import React from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id} className="mb-4">
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <p className="text-gray-500 text-sm">{post.date}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
