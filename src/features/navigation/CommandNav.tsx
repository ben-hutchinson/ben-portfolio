import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import styles from './CommandNav.module.css';

const links = [
  { href: '#work', label: 'Mission logs' },
  { href: '#systems', label: 'Systems' },
  { href: '#experience', label: 'Experience' },
  { href: '#crew', label: 'Crew' },
  { href: '#training', label: 'Training sim' },
] as const;

const NavigationLinks = ({ mobile = false }: { mobile?: boolean }) => (
  <ul className={mobile ? styles.mobileLinks : styles.links}>
    {links.map((link) => (
      <li key={link.href}>
        <a
          className={
            link.href === '#training'
              ? styles.trainingLink
              : styles.navigationLink
          }
          href={link.href}
        >
          {link.label}
        </a>
      </li>
    ))}
  </ul>
);

export const CommandNav = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <a className={styles.identity} href="#top" aria-label="Ben Hutchinson, back to top">
        <span className={styles.name}>Ben Hutchinson</span>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          Available for the right mission
        </span>
      </a>

      <nav aria-label="Primary" className={styles.desktopNavigation}>
        <NavigationLinks />
      </nav>

      <div className={styles.mobileNavigation}>
        <Sheet>
          <SheetTrigger
            render={
              <button
                aria-label="Open navigation"
                className={styles.menuButton}
                type="button"
              >
                <span className={styles.menuIcon} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
            }
          />
          <SheetContent className={styles.sheet}>
            <SheetHeader className={styles.sheetHeader}>
              <SheetTitle className={styles.sheetTitle}>Command index</SheetTitle>
              <SheetDescription className={styles.sheetDescription}>
                Jump to a section of Ben&apos;s portfolio.
              </SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile primary">
              <NavigationLinks mobile />
            </nav>
            <p className={styles.sheetStatus}>
              <span className={styles.statusDot} aria-hidden="true" />
              Manchester, UK
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
);
