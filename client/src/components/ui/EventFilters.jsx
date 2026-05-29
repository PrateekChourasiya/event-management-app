import React from 'react';

const EventFilters = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, sortOrder, setSortOrder }) => {
  return (
    <div className="bg-white border-2 border-retro-light p-4 shadow-[4px_4px_0px_rgba(33,37,41,1)] mb-8 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label className="block font-bold text-retro-light text-xs mb-1">SEARCH</label>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search by title, description, venue..." 
          className="w-full border-2 border-retro-light px-3 py-2 text-sm focus:outline-none focus:border-retro-accent font-retro placeholder:font-sans"
        />
      </div>
      <div className="md:w-48">
        <label className="block font-bold text-retro-light text-xs mb-1">CATEGORY</label>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full border-2 border-retro-light px-3 py-2 text-sm focus:outline-none focus:border-retro-accent bg-white font-bold"
        >
          <option value="">ALL CATEGORIES</option>
          <option value="Music">MUSIC</option>
          <option value="Technology">TECHNOLOGY</option>
          <option value="Business">BUSINESS</option>
          <option value="Sports">SPORTS</option>
          <option value="Arts">ARTS</option>
          <option value="Education">EDUCATION</option>
          <option value="Food">FOOD & DRINK</option>
          <option value="Other">OTHER</option>
        </select>
      </div>
      <div className="md:w-48">
        <label className="block font-bold text-retro-light text-xs mb-1">SORT</label>
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full border-2 border-retro-light px-3 py-2 text-sm focus:outline-none focus:border-retro-accent bg-white font-bold"
        >
          <option value="newest">LATEST UPCOMING</option>
          <option value="oldest">EARLIEST FIRST</option>
        </select>
      </div>
    </div>
  );
};

export default EventFilters;
