"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [image, setImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setAvailableCategories(data);
      }
    };

    const fetchAvailableTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        setAvailableTags(data);
      }
    };

    fetchAvailableCategories();
    fetchAvailableTags();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setCategories(selectedCategories);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setTags(selectedTags);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = null;

    if (image) {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('posts')
        .upload(`${Date.now()}_${image.name}`, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (storageError) {
        console.error('Error uploading image:', storageError);
        return;
      }

      imageUrl = storageData.path;
    }

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ title, content, image_url: imageUrl }])
      .select('*')
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      return;
    }

    // Insert categories
    for (const categoryId of categories) {
      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert([{ post_id: postData.id, category_id: categoryId }]);

      if (categoryError) {
        console.error('Error creating post_category:', categoryError);
      }
    }

    // Insert tags
    for (const tagId of tags) {
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert([{ post_id: postData.id, tag_id: tagId }]);

      if (tagError) {
        console.error('Error creating post_tag:', tagError);
      }
    }

    // Refresh the page to show the new post
    router.refresh();
    setTitle('');
    setContent('');
    setCategories([]);
    setTags([]);
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="categories">Categories:</label>
        <select
          id="categories"
          multiple
          value={categories}
          onChange={handleCategoryChange}
        >
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tags">Tags:</label>
        <select id="tags" multiple value={tags} onChange={handleTagChange}>
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostForm;
