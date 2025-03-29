import Image from 'next/image';
import styles from './page.module.css';
import Button from '@/components/common/buttons/Button';

export default function Home() {
  return (
    <nav className="absolute w-full px-6 py-4 flex items-center justify-between bg-white shadow-lg">
      <div className="">Hotelku</div>
      <div className="flex items-center gap-4">
        <button>For Tenant</button>
        <Button color='white' name='Login' textColor='primary' border="primary"></Button>
        <Button color='primary' name='Register' textColor='white'></Button>
      </div>
    </nav>
  );
}
