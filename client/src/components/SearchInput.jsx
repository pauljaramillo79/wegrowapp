import React, { useEffect, useRef, useState } from "react";

const SearchInput = ({
  options,
  value,
  onChange,
  getOptionValue,
  getOptionLabel,
  getOptionDescription,
  placeholder,
  ariaLabel,
}) => {
  const wrapperRef = useRef(null);
  const optionRefs = useRef([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = options.filter((option) => {
    const label = getOptionLabel(option);
    const description = getOptionDescription(option);
    const searchableText = (label + " " + description).toLowerCase();
    return normalizedQuery === "" || searchableText.includes(normalizedQuery);
  });

  useEffect(() => {
    if (value === "" || value === null || value === undefined) {
      setQuery("");
      return;
    }

    const selectedOption = options.find((option) => {
      return String(getOptionValue(option)) === String(value);
    });

    if (selectedOption) {
      setQuery(getOptionLabel(selectedOption));
    }
  }, [value, options]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const activeOption = optionRefs.current[activeIndex];

    if (activeOption && activeOption.scrollIntoView) {
      activeOption.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const selectOption = (option) => {
    setQuery(getOptionLabel(option));
    onChange(getOptionValue(option));
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onChange("");
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === "Escape") {
      event.stopPropagation();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((currentIndex) => {
        if (filteredOptions.length === 0) return -1;
        return currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((currentIndex) => {
        if (filteredOptions.length === 0) return -1;
        return currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
      });
      return;
    }

    if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      selectOption(filteredOptions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className='search-input' ref={wrapperRef}>
      <input
        type='text'
        role='combobox'
        aria-label={ariaLabel}
        aria-autocomplete='list'
        aria-expanded={open}
        aria-controls='customer-search-options'
        aria-activedescendant={activeIndex >= 0 ? "customer-option-" + activeIndex : undefined}
        value={query}
        placeholder={placeholder}
        autoComplete='off'
        onChange={handleInputChange}
        onFocus={() => {
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
      />

      {open ? (
        <div className='search-input__options' id='customer-search-options' role='listbox'>
          {filteredOptions.length === 0 ? (
            <p className='search-input__empty'>No customers match “{query}”.</p>
          ) : (
            filteredOptions.map((option, index) => (
              <button
                type='button'
                id={"customer-option-" + index}
                role='option'
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex ? "search-input__option search-input__option--active" : "search-input__option"
                }
                key={getOptionValue(option)}
                ref={(element) => (optionRefs.current[index] = element)}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <strong>{getOptionLabel(option)}</strong>
                <span>{getOptionDescription(option)}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SearchInput;
