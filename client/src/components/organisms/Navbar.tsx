import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";

const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
];

const settings = [
  { name: "Profile", path: "/dashboard?tab=profile" },
  { name: "Dashboard", path: "/dashboard" },
];

const Search = styled("div")(({ theme }) => ({
  height: "40px",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  height: "100%",
  display: "flex",
  justifyItems: "center",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function Navbar() {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0, display: { xs: "block", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={false}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ name, path }) => (
                <MenuItem key={name}>
                  <Typography textAlign="center">{name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            sx={{ flexGrow: { xs: 1, md: 0 }, textAlign: "center" }}
          >
            BLOG
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            {pages.map(({ name, path }) => (
              <Button
                key={name}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {name}
                </Link>
              </Button>
            ))}
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexGrow: 0 }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase />
            </Search>
            <Box>
              <Tooltip title="Open settings">
                <IconButton>
                  <Avatar
                    alt="Jhon Doe"
                    src="https://source.unsplash.com/grayscale-photo-of-man-c_GmwfHBDzk"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={false}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {settings.map(({ name, path }) => (
                  <MenuItem key={name}>
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                ))}
                <MenuItem>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
