import React, { useContext, useEffect } from "react";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import { AppProvider } from "@toolpad/core/AppProvider";
import ArticleSharpIcon from "@mui/icons-material/ArticleSharp";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { createTheme, IconButton } from "@mui/material";
import { GlobalContext } from "../globalContext";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/Auth";

export default function Template(props) {
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "simple-popover" : undefined;
  const [global, setGlobal] = useContext(GlobalContext);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const auth = getAuth();
  const location = useLocation();
  const { hash, pathname, search } = location;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    console.log("current user", global.user);
  }, [global.user, setGlobal]);

  const [session, setSession] = React.useState({
    user: {
      name: "",
      email: global.user.email,
      image: "https://avatars.githubusercontent.com/u/19550456",
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: "",
            email: global.user.email,
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        });
      },
      signOut: () => {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            setGlobal({
              type: "reset",
            });
            navigate("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  }, []);

  const handlePopoverButtonClick = (event) => {
    event.stopPropagation();
    setPopoverAnchorEl(event.currentTarget);
  };

  const CALLS_NAVIGATION = [
    {
      segment: "produtor",
      title: "Produtor",
      icon: false,
    },
    {
      segment: "meeiro",
      title: "Meeiro",
      icon: false,
    },
    {
      segment: "qualidade",
      title: "Qualidade",
      icon: false,
    },
  ];

  const popoverMenuAction = (
    <React.Fragment>
      <IconButton
        aria-describedby={popoverId}
        onClick={handlePopoverButtonClick}
      ></IconButton>
    </React.Fragment>
  );

  const NAVIGATION = [
    {
      segment: "cadastro",
      title: "Cadastro",
      icon: <PersonAddAltSharpIcon />,
      action: popoverMenuAction,
      children: CALLS_NAVIGATION,
    },
    {
      segment: "lancamento",
      title: "Lançamento",
      icon: <PostAddIcon />,
    },
    {
      segment: "relatorio",
      title: "Relatório",
      icon: <ArticleSharpIcon />,
    },
  ];

  const demoTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  return (
    <React.Fragment>
      {pathname === "/login" ? (
        <main>{props.children}</main>
      ) : (
        <AppProvider
          navigation={NAVIGATION}
          branding={{
            logo: false,
            title: "Controle Morango",
          }}
          theme={demoTheme}
          authentication={authentication}
          session={session}
        >
          <DashboardLayout>{props.children}</DashboardLayout>
        </AppProvider>
      )}
    </React.Fragment>
  );
}
