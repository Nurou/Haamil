import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { generateNavItems } from './constants';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { BookOpen } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { buttonVariants } from '../ui/button';
import { cn } from '../../utils';
import { Chapter, Juz } from '@quranjs/api';

export const Menu = () => {
  const { parts, chapters } = useLoaderData() as { parts: Juz[]; chapters: Chapter[] };
  const { pathname } = useLocation();

  const navItems = generateNavItems({
    parts,
    chapters,
  });

  return (
    <div className='flex items-center justify-center h-[50px]'>
      <Sheet>
        <SheetTrigger>
          <div className=''>
            <BookOpen />
          </div>
        </SheetTrigger>
        {/* TODO: place this to the left on larger screens  */}
        <SheetContent side='bottom' className='overflow-auto grid place-content-center'>
          <SheetHeader>
            <VisuallyHidden.Root>
              <SheetTitle>Reader menu</SheetTitle>
              <SheetDescription>Navigate to anywhere in the Quran from here.</SheetDescription>
            </VisuallyHidden.Root>
          </SheetHeader>
          <Tabs defaultValue='chapter' className=''>
            <TabsList>
              {navItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {navItems.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <nav className='h-[200px] overflow-auto grid place-items-center'>
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.href}
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'group relative flex h-12 justify-start',
                        pathname === child.href && 'bg-muted font-bold hover:bg-muted'
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </nav>
              </TabsContent>
            ))}
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
