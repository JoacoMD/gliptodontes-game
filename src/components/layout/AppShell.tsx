import { Outlet } from 'react-router-dom';

/**
 * Portrait viewport container (720x1280 base ratio).
 * Fits any device by aspect-ratio while keeping content readable on tablets.
 */
export function AppShell(): React.JSX.Element {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <a
        href="#main"
        className="skip-link"
      >
        Saltar al contenido
      </a>
      <main
        id="main"
        className="relative h-full w-full max-h-[100dvh] max-w-[min(100vw,calc(100dvh*14/16))] overflow-hidden text-text-primary"
        style={{ aspectRatio: '9 / 16' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
