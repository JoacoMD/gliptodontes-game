import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export function App(): React.JSX.Element {
  const settings = useSettings();

  useEffect(() => {
    const root = document.documentElement;

    switch (settings.fontScale) {
      case 'small':
        root.style.setProperty('--font-scale', '0.9');
        break;

      case 'medium':
        root.style.setProperty('--font-scale', '1');
        break;

      case 'large':
        root.style.setProperty('--font-scale', '1.15');
        break;

      case 'xlarge':
        root.style.setProperty('--font-scale', '1.3');
        break;
    }
  }, [settings.fontScale]);

  return <RouterProvider router={router} />;
}
