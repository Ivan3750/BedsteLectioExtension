import { School } from 'lucide-react';
import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { cn } from 'utils/cn';
import { getNavbarPages, linkTo, shouldOverridePath } from 'utils/page';
import { ExtensionToggle } from './extension-toggle';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from './navigation-menu';

export const SiteHeader = () => (
    <header className="bg-background/60 dark:bg-dark/60 sticky top-0 z-40 w-full border-b dark:border-white/10 shadow-sm backdrop-blur">
        <div className="container flex h-14 items-center">
            <div className="h-14 mr-4 flex">
                <a className="mr-6 flex items-center space-x-2" href={linkTo(document.location, 'home')}>
                    <School />
                    <span className="hidden font-bold sm:inline-block">Lectio</span>
                </a>
                {shouldOverridePath(document.location.pathname) ? null : (
                    <NavigationMenu>
                        <NavigationMenuList>
                            {Object.entries(getNavbarPages(document.location)).map(([key, page]) => {
                                if (page.children.length) {
                                    return (
                                        <NavigationMenuItem key={key}>
                                            <NavigationMenuTrigger links={page.children.map((child) => child.link)}>
                                                {page.name}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    {page.children.map((child) => (
                                                        <ListItem key={child.link} href={child.link} title={child.name}>
                                                            {child.description ?? null}
                                                        </ListItem>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    );
                                } else {
                                    return (
                                        <NavigationMenuItem key={key}>
                                            <NavigationMenuLink
                                                className={cn(
                                                    'transition-colors hover:text-foreground/80',
                                                    decodeURI(document.location.pathname) === page.link
                                                        ? 'text-foreground'
                                                        : 'text-foreground/60',
                                                )}
                                                href={page.link}
                                            >
                                                {page.name}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                }
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                )}
            </div>
            <div className="flex flex-1 justify-end">
                <ExtensionToggle />
                <ThemeToggle />
            </div>
        </div>
    </header>
);

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild active={document.location.pathname === props.href}>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);
ListItem.displayName = 'ListItem';
