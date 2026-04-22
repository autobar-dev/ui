import Footer from '../Footer';
import Header from '../Header';
import { useStyles } from './styles';

export default function Layout({ children }: { children: any }) {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        { children }
      </div>
      <Footer />
    </div>
  );
}