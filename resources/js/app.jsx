import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import SiteLayout from '@/Layouts/SiteLayout';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider } from './Context/CartContext'

const appName = import.meta.env.VITE_APP_NAME || 'Micro & Mega';

gsap.registerPlugin(ScrollTrigger);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => {
            const Page = module.default;

            const isAuthPage = name.startsWith('Auth/');
            const isProfilePage = name.startsWith('Profile/');

            if (Page && Page.layout === undefined && !isAuthPage && !isProfilePage) {
                Page.layout = (page) => <SiteLayout>{page}</SiteLayout>;
            }

            return module;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

      const AppWithGsap = (appProps) => {
    useEffect(() => {
        const onStart = () => {
            if (ScrollTrigger && ScrollTrigger.getAll) {
                ScrollTrigger.getAll().forEach((t) => t.kill());
            }
        };
        const onFinish = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            requestAnimationFrame(() => {
                if (ScrollTrigger && ScrollTrigger.refresh) {
                    ScrollTrigger.refresh();
                }
            });
        };

        const offStart = router.on('start', onStart);
        const offFinish = router.on('finish', onFinish);

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    return (
        <CartProvider>
            <App {...appProps} />
        </CartProvider>
    );
};

        root.render(<AppWithGsap {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
