import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-16 items-center justify-between px-4'>
        <Link to={'/'} className='hidden items-center justify-between gap-2 md:flex'>
          <h1 className='text-lg font-semibold'>Haamil</h1>
        </Link>
      </nav>
    </div>
  );
}
