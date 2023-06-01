import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Fab,
  Fade,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useScrollTrigger,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import lyrics from "./assets/lyrics.json";
import "./App.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "50ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function ScrollTop(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

function createData(id: number, title: string, lyric: string) {
  return { id, title, lyric };
}

const lyricsData = lyrics.map((lyric) =>
  createData(lyric.id, lyric.title, lyric.lyric)
);
console.log({ lyrics });

export default function SearchAppBar() {
  const lyricSelected = localStorage.getItem("currentLyric");
  const [rows, setRows] = React.useState(lyricsData);
  const [querySearch, setQuerySearch] = React.useState("");
  const [currentLyric, setCurrentLyric] = React.useState<any>(
    lyricSelected ? JSON.parse(lyricSelected) : null
  );

  React.useEffect(() => {
    setCurrentLyric(null);
    setRows(
      lyricsData.filter((o) => {
        let q = querySearch.toLowerCase().trimStart().trim();
        return (
          o.title.toLowerCase().includes(q) ||
          o.id + "" == q ||
          o.lyric.toLowerCase().includes(q)
        );
      })
    );
  }, [querySearch]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem("currentLyric", JSON.stringify(currentLyric));
  }, [currentLyric]);
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Letras Católicas
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar..."
              value={querySearch}
              onChange={(event) => {
                setQuerySearch(event.target.value);
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <Paper sx={{ width: "100%" }}>
          {!currentLyric && (
            <TableContainer sx={{ marginTop: "1rem" }}>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Titulo</TableCell>
                    <TableCell>Letra</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() => setCurrentLyric(row)}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell>{row.lyric.substring(0, 50)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {currentLyric && (
            <Card sx={{ minWidth: 275, marginTop: "1rem" }}>
              <CardHeader
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() => setCurrentLyric(null)}
                  >
                    <ArrowCircleLeftRoundedIcon fontSize="large" />
                  </IconButton>
                }
                sx={{
                  textAlign: "center",
                }}
                title={currentLyric.title}
              />
              <CardContent>
                <Typography component="pre" align="center" textAlign="center">
                  {currentLyric.lyric}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Container>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
