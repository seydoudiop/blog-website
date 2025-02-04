import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const Admin = () => {
  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel.</p>
      <ul>
        <li>
          <Link href="/admin/posts">Manage Posts</Link>
        </li>
        <li>
          <Link href="/admin/categories">Manage Categories</Link>
        </li>
        <li>
          <Link href="/admin/tags">Manage Tags</Link>
        </li>
        <li>
          <Link href="/admin/settings">Manage Site Settings</Link>
        </li>
        <li>
          <Link href="/admin/comments">Manage Comments</Link>
        </li>
      </ul>
    </Layout>
  );
};

export default Admin;
