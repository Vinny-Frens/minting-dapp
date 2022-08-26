import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Mint } from "../components/Mint";
import Nav from "../components/Nav";
import Head from "next/head";

const Home: NextPage = () => {
	const [accountReady, setAccountReady] = React.useState(false);
	const { data: account } = useAccount();

	React.useEffect(() => {
		setAccountReady(Boolean(account));
	}, [account]);

	return (
		<>
			<Head>
				<title>Vinny & Frens</title>
				<link rel="icon" href="/logoMobile.png" />
			</Head>
			<Nav />
			<Mint />
			{/* {accountReady && <Mint />} */}
		</>
	);
};

export default Home;
