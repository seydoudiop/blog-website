"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        setTags(data);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('tags')
      .insert([{ name }]);

    if (error) {
      console.error('Error creating tag:', error);
    } else {
      // Refresh the page to show the new tag
      setTags([...tags, data[0]]);
      setName('');
    }
  };

  return (
    <div>
      <h2>Manage Tags</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create Tag</button>
      </form>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TagManager;
