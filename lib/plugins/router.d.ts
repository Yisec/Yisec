/**
 * router.config({
 *  hash: true,
 *  root: document.body,
 *  cache: 4,
 *  onPageSwitch: (oldPage, newPage) => {
 *  },
 *  router: {
 *    '/xx/:id': component,
 *    '/xx/:bc': component,
 *  }
 * })
 *
 */
export interface RouterConfig {
    hash: boolean;
    root: HTMLElement;
    cache: number;
    onPageSwitch: () => void;
    routes: object;
}
export default function router(config: any): void;
