import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp';
import ArticleSharpIcon from '@mui/icons-material/ArticleSharp';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Cadastro from '../components/Cadastro';
import Relatorio from '../components/Relatorio';
import Lancamento from '../components/Lancamento';
import { Chip, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';

// eslint-disable-next-line react-hooks/rules-of-hooks
const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);

const popoverId = isPopoverOpen ? 'simple-popover' : undefined;
const isPopoverOpen = Boolean(popoverAnchorEl);

const handlePopoverButtonClick = (event) => {
  event.stopPropagation();
  setPopoverAnchorEl(event.currentTarget);
};

const popoverMenuAction = (
  <React.Fragment>
      <IconButton aria-describedby={popoverId} onClick={handlePopoverButtonClick}>
        <MoreHorizIcon />
      </IconButton>
    </React.Fragment>
);

const CALLS_NAVIGATION = [
  {
    segment: 'made',
    title: 'Made',
    icon: <CallMadeIcon />,
    action: <Chip label={12} color="success" size="small" />,
  },
  {
    segment: 'received',
    title: 'Received',
    icon: <CallReceivedIcon />,
    action: <Chip label={4} color="error" size="small" />,
  },
];

const NAVIGATION = [
  {
    segment: 'cadastro',
    title: 'Cadastro',
    icon: <PersonAddAltSharpIcon />,
  },
  {
    segment: 'lancamento',
    title: 'Lançamento',
    icon: <ArticleSharpIcon />,
    action: popoverMenuAction,
    children: CALLS_NAVIGATION,
  },
  {
    segment: 'relatorio',
    title: 'Relatório',
    icon: <ArticleSharpIcon />,
    action: popoverMenuAction,
    children: CALLS_NAVIGATION,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
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

function Dashboard(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: false,
        title: 'Controle Morango',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Cadastro pathname={router.pathname} />
        <Relatorio pathname={router.pathname} />
        <Lancamento pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

export default Dashboard;