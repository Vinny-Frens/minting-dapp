import "./global.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
	configureChains,
	apiProvider,
	wallet,
	darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiProvider } from "wagmi";

const { chains, provider, webSocketProvider } = configureChains(
	[
		chain.mainnet,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "false"
			? [chain.mainnet]
			: []),
	],
	[
		apiProvider.alchemy("_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC"),
		apiProvider.fallback(),
	]
);

const { wallets } = getDefaultWallets({
	appName: "Vinny & Frens",
	chains,
});

const demoAppInfo = {
	appName: "Vinny & Frens",
};

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: "Other",
		wallets: [wallet.argent({ chains }), wallet.trust({ chains })],
	},
]);

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<WagmiProvider client={wagmiClient}>
			<RainbowKitProvider
				appInfo={demoAppInfo}
				chains={chains}
				theme={darkTheme({
					accentColor: "#112244",
					accentColorForeground: "white",
					borderRadius: "medium",
				})}
			>
				<Component {...pageProps} />
			</RainbowKitProvider>
		</WagmiProvider>
	);
}

export default MyApp;
