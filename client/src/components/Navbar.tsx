import React from "react";
import { Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IUserResponse } from "../types/userType";
import { themeToggle } from "../redux/slices/themeSlice";

interface PropsUserDropdown {
  currentUser: IUserResponse;
}

const LoginBtn: React.FC = () => {
  return (
    <Link to="/login">
      <Button gradientDuoTone="purpleToBlue" outline>
        Login
      </Button>
    </Link>
  );
};

const UserDropdown: React.FC<PropsUserDropdown> = ({
  currentUser,
}: PropsUserDropdown) => {
  return (
    <Dropdown
      label={
        <img
          src={currentUser.profilePicture}
          alt=""
          className="h-10 w-10 rounded-full"
        />
      }
      arrowIcon={false}
      inline
    >
      <Dropdown.Header>
        <span className="block text-sm">@{currentUser.username}</span>
        <span className="block truncate text-sm font-medium">
          {currentUser.email}
        </span>
      </Dropdown.Header>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item>Logout</Dropdown.Item>
    </Dropdown>
  );
};

const NavbarComponent: React.FC = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Thujuli's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="font-medium hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(themeToggle())}
        >
          {mode === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
          <UserDropdown currentUser={currentUser} />
        ) : (
          <LoginBtn />
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
