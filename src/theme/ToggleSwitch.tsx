import { FC, useEffect, useState } from 'react';
import { modify } from './modify';

export const ToggleSwitch: FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    modify(isChecked);
  }, [isChecked]);

  return (
    <label htmlFor="theme-switch">
      <input
        type="checkbox"
        checked={isChecked}
        onClick={() => {
          setIsChecked((prevState) => !prevState);
        }}
      />
    </label>
  );
};
