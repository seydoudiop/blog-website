"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const SiteSettingsManager = () => {
  const [siteTitle, setSiteTitle] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [siteDescription, setSiteDescription] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
      } else {
        setSiteTitle(data.site_title || '');
        setSiteLogo(data.site_logo || '');
        setSiteDescription(data.site_description || '');
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('settings')
      .update({
        site_title: siteTitle,
        site_logo: siteLogo,
        site_description: siteDescription,
      })
      .eq('id', 1);

    if (error) {
      console.error('Error updating settings:', error);
    } else {
      alert('Settings updated successfully!');
    }
  };

  return (
    <div>
      <h2>Manage Site Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="siteTitle">Site Title:</label>
          <input
            type="text"
            id="siteTitle"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="siteLogo">Site Logo:</label>
          <input
            type="text"
            id="siteLogo"
            value={siteLogo}
            onChange={(e) => setSiteLogo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="siteDescription">Site Description:</label>
          <textarea
            id="siteDescription"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
          />
        </div>
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};

export default SiteSettingsManager;
