import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className="bg-red-400 px-6 py-4 flex justify-between">
      <div className="">Hotelku</div>
      <div className="flex gap-4">
        <div>For Tenant</div>
        <div>Login</div>
        <div>Register</div>
      </div>
    </div>
  );
}
