import { FC, useEffect, useState } from 'react';
import { modify } from './modify';

export const ToggleSwitch: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    modify(isDarkMode);
  }, [isDarkMode]);

  return (
    <button
      type="button"
      aria-label="toggle switch"
      onClick={() => {
        setIsDarkMode((prevState) => !prevState);
      }}
      style={{
        marginLeft: 4,
        cursor: 'pointer',
        border: 'none',
        borderColor: '#9ecf4c',
      }}
    >
      {isDarkMode ? (
        <span role="img" aria-label="emoji-moon">
          🌝
        </span>
      ) : (
        <span role="img" aria-label="emoji-sun">
          🌞
        </span>
      )}
    </button>
  );
};
