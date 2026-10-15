export const AutocompleteSearch = ({ input, setInput, filterData, showResults, setShowResults, activeIndex, setActiveIndex, searchError, isSearchLoading }) => {
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowResults(true);
    setActiveIndex(-1);
  };

  const selectResult = (item) => {
    setInput(item.title);
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

  return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)}
          />
        {showResults && (
          <div className="result-container">
            {isSearchLoading ? (
              <div className="loading" role="status">
                <span className="loading-spinner" aria-hidden="true" />
                Searching...
              </div>
            ) : searchError ? (
              <div role="alert">{searchError}</div>
            ) : filterData.length > 0 ? (
              filterData.map((item, index) => (
                <div
                  key={item.id}
                  className={`result-item ${index === activeIndex ? "active" : ""}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectResult(item);
                  }}
                >
                  {item.title}
                </div>
              ))
            ) : (
              <div>No Results Found</div>
            )}
          </div>
        )}
      </div>
  )
}
export default AutocompleteSearch;