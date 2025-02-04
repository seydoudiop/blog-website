"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface EditPostFormProps {
  postId: number;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ postId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError) {
        console.error('Error fetching post:', postError);
        return;
      }

      setTitle(postData.title);
      setContent(postData.content);
      setImageUrl(postData.image_url || '');

      // Fetch selected categories
      const { data: postCategoriesData, error: postCategoriesError } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', postId);

      if (postCategoriesError) {
        console.error('Error fetching post categories:', postCategoriesError);
      } else {
        const selectedCategories = postCategoriesData.map((item) => item.category_id);
        setCategories(selectedCategories);
      }

      // Fetch selected tags
      const { data: postTagsData, error: postTagsError } = await supabase
        .from('post_tags')
        .select('tag_id')
        .eq('post_id', postId);

      if (postTagsError) {
        console.error('Error fetching post tags:', postTagsError);
      } else {
        const selectedTags = postTagsData.map((item) => item.tag_id);
        setTags(selectedTags);
      }
    };

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

    fetchPost();
    fetchAvailableCategories();
    fetchAvailableTags();
  }, [postId]);

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

    let newImageUrl = imageUrl;

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

      newImageUrl = storageData.path;
    }

    const { error: postError } = await supabase
      .from('posts')
      .update({ title, content, image_url: newImageUrl })
      .eq('id', postId);

    if (postError) {
      console.error('Error updating post:', postError);
      return;
    }

    // Delete existing categories
    const { error: deleteCategoriesError } = await supabase
      .from('post_categories')
      .delete()
      .eq('post_id', postId);

    if (deleteCategoriesError) {
      console.error('Error deleting post categories:', deleteCategoriesError);
    }

    // Delete existing tags
    const { error: deleteTagsError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', postId);

    if (deleteTagsError) {
      console.error('Error deleting post tags:', deleteTagsError);
    }

    // Insert categories
    for (const categoryId of categories) {
      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert([{ post_id: postId, category_id: categoryId }]);

      if (categoryError) {
        console.error('Error creating post_category:', categoryError);
      }
    }

    // Insert tags
    for (const tagId of tags) {
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert([{ post_id: postId, tag_id: tagId }]);

      if (tagError) {
        console.error('Error creating post_tag:', tagError);
      }
    }

    // Refresh the page to show the updated post
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Post</h2>
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
       {imageUrl && (
        <div>
          <img src={`https://YOUR_SUPABASE_URL/storage/v1/object/public/${imageUrl}`} alt="Post Image" style={{ maxWidth: '200px' }} />
        </div>
      )}
      <button type="submit">Update Post</button>
    </form>
  );
};

export default EditPostForm;
