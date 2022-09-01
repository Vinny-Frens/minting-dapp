// import anime from 'animejs/lib/anime.es.js';
import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function Nav() {
	return (
		<nav className="fixed top-0 w-screen bg-orange-400 z-30 border-b-[6px] border-[#d73] pt-2 pb-1 px-4 lg:px-0">
			<div className="flex flex-wrap justify-between items-center max-w-6xl w-full mx-auto">
				<div className="flex justify-center items-center text-white font-black text-3xl">
					<a href="https://www.vinnyandfrens.xyz/">
						<img
							className="lg:hidden h-[40px]"
							src="/logoMobile.png"
							alt="logo"
						/>
						<img
							className="hidden lg:block h-[40px]"
							src="/logo.png"
							alt="logo"
						/>
					</a>
				</div>
				<div>
					<p className="text-white hidden sm:block">
						Get Your Vinny & Frens Now. Minting Live!
					</p>
				</div>
				<div className="h-full mt-[5px]">
					<ConnectButton />
				</div>
			</div>
		</nav>
	);
}
