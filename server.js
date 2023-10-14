const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');
const lodash = require('lodash');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import Lodash and use memoize to cache the results
const memoizedGetBlogStats = lodash.memoize(getBlogStats, cacheKey, 60000); // Cache for 1 minute
const memoizedSearchBlogs = lodash.memoize(searchBlogs, cacheKey, 60000); // Cache for 1 minute

function cacheKey(...args) {
  return JSON.stringify(args);
}

app.get('/api/blog-stats', async (req, res) => {
  try {
    const data = await memoizedGetBlogStats();
    res.status(201).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/api/blog-search', async (req, res) => {
  try {
    const searchQuery = req.body.searchQuery;
    const data = await memoizedSearchBlogs(searchQuery);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function getBlogStats() {
  const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
  const headers = {
    'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
  };

  const response = await axios.get(url, { headers });
  const data = response.data.blogs;
  total_blogs = lodash.size(data);
  longest_title = lodash.maxBy(data, blog => blog.title.length);
  blogs_privacy = lodash.filter(data, blog => blog.title.toLowerCase().includes('privacy'));
  privacy_count = blogs_privacy.length;
  uniqueTitles = lodash.uniqBy(data, 'title').map(item => item.title);

  const lodash_data = {
    total_blogs: total_blogs,
    longest_title: longest_title,
    privacy_count: privacy_count,
    uniqueTitles: uniqueTitles,
  };

  const Combined_Data = response.data;
  Combined_Data.stats = JSON.parse(JSON.stringify(lodash_data));

  return Combined_Data;
}

async function searchBlogs(searchQuery) {
  const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
  const headers = {
    'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
  };

  const response = await axios.get(url, { headers });
  let data = response.data.blogs;
  data = JSON.parse(JSON.stringify(data));

  const filteredData = data.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return filteredData;
}


app.listen(5000, () => {
  console.log('Server running on port no. 5000');
});
