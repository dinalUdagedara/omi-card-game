
import { NightModeToggle } from "./night-mode-selector";

const Header = () => {
  return (
    <div className="flex justify-end pr-4 pt-4">
      <NightModeToggle />
    </div>
  );
};

export default Header;
