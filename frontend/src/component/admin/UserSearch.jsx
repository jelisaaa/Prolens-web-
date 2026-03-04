import React from "react";

const UserSearch = ({ query, setQuery }) => {
  return (
    <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-2 border border-gray-400 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
      />
      <button
        type="submit"
        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default UserSearch;