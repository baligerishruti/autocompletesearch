import { useState, useEffect } from "react";
export const App = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cacheData, setCacheData] = useState({});
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 1000);
    return () => clearTimeout(timer);
  }, [input]);

  const filterData = results.filter((item) => {
    return item.name.toLowerCase().includes(input.toLowerCase());
  });

  const fetchData = async () => {
    if (cacheData[input]) {
      setResults(cacheData[input]);
      return;
    }
    const data = await fetch(`https://dummyjson.com/users/search?q=${input}`);
    const json = await data.json();
    const results = json.users.map((user) => ({
      id: user.id,
      name: user.firstName + " " + user.lastName,
    }));
    setResults(results);
    setCacheData((prev) => ({ ...prev, [input]: results }));
  };

  const selectResult = (item) => {
    setInput(item.name);
    setShowResults(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (filterData.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowResults(true);
      setActiveIndex((current) =>
        current < 0 || current >= filterData.length - 1 ? 0 : current + 1
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowResults(true);
      setActiveIndex((current) =>
        current <= 0 || current >= filterData.length ? filterData.length - 1 : current - 1
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectResult(filterData[activeIndex]);
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setActiveIndex(-1);
  };

  return (
    <div>
      <h1>Auto Complete Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          onBlur={(e) => setShowResults(false)}
        />
        {showResults && (
          <div className="result-container">
            {filterData.length > 0 ? (
              filterData.map((item, index) => (
                <div
                  key={item.id}
                  className={`result-item ${index === activeIndex ? "active" : ""}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectResult(item);
                  }}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div>No Results Found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
