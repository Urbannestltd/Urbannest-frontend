import Image from 'next/image'
import Logo from '@/app/assets/urbannest-logo.png'

export const NavBar = () => {
    return (
        <nav className='mt-10 mx-4'>
            <Image className='w-[185px] h-10 mt-4' src={Logo} alt="logo" />
        </nav>
    )
}