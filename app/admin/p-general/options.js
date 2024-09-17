import React from "react";
import style from "./options.module.css";
const Options = ({
  data,
  changeValue,
  name,
  selected,
  searchOption,
  optFiltered,
  categorySelect,
  text,
}) => {
  if (!data) {
    return null;
  }
  const { optName, optData } = optFiltered || {};
  return (
    <div className={style.mainDiv}>
      <p>{text}</p>
      {selected ? (
        <span>{selected}</span>
      ) : (
        <input
          onChange={searchOption}
          type="text"
          maxLength={30}
          name={name}
          placeholder={`Search ${text}...`}
        />
      )}
      {selected ? (
        <button
          className={style.cancelOpt}
          type="button"
          name={name}
          value=""
          onClick={changeValue}
        >
          Clear
        </button>
      ) : null}

      <input className={style.toggleInput} type="checkbox" id={name} />
      {selected ? null : (
        <div className={style.options}>
          {(optName === name ? optData : data).map((opt) => (
            <button
              type="button"
              key={opt}
              name={name}
              value={opt}
              onClick={
                name == "category"
                  ? (e) => {
                      categorySelect(e.target.value);
                    }
                  : changeValue
              }
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Options;
