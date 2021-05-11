import React, { useState, useEffect } from 'react';
import axios from 'axios';

function api() {
  const [data, setData] = useState({ posts: [] });
  const [query, setQuery] = useState(1);
  const [search, setSearch] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `https://jsonplaceholder.typicode.com/posts?userId=${search}`,
      );
      
      setData({
        posts: result.data
      });
    };

    fetchData();
  }, [search]);


  return (
    <div>
      <input
        type="text"
        placeholder="User ID"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button type="button" onClick={() => setSearch(query)}>
        Search
      </button>
      <ul>
        {data.posts.map(post => (
          <li key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default api;