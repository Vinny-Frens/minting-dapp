import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
	useContractWrite,
	useContractRead,
	useWaitForTransaction,
	useAccount,
	useDisconnect,
} from "wagmi";
import contractInterface from "../contract-abi.json";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import whiteListAddresses from "./Whitelist";
import Web3 from "web3";
import { hexZeroPad } from "ethers/lib/utils";

export function Mint() {
	const { address, isConnecting, isDisconnected, isConnected } = useAccount();
	const [accountReady, setAccountReady] = useState(false);
	const [merkel, setMerkel] = useState();
	const [Quantity, setQuantity] = useState(1);
	const [isdisconnected, setisdisconnected] = useState(false);
	const [errorMessage, seterrorMessage] = useState(" ");
	const [isErorr, setError] = useState(false);
	const [txstatus, settxstatus] = useState(false);
	const [userBalance, setUserbalance] = useState(0);
	const [success, setSuccess] = useState(false);
	const { data: account } = useAccount();

	const disconnect = useDisconnect({
		onSuccess(data) {
			setisdisconnected(true);
			console.log(isdisconnected);
		},
	});

	useEffect(() => {
		setAccountReady(Boolean(account));
		console.log(account);
		if (isdisconnected) {
			console.log("disconnected");
		}
	}, [account, accountReady]);

	const config = {
		addressOrName: "0x728124c5a816Cd26c20F38fC86202410e63f3b07",
		contractInterface: contractInterface,
	};

	console.log(address);
	const { data } = useContractRead(config, "cost");

	// presale mint method goes here. comment when enabling the public sale

	// const {
	// 	data: mintData,
	// 	write,
	// 	isSuccess,
	// 	isLoading,
	// 	isError,
	// } = useContractWrite(config, "whitelistMint", {
	// 	args: [Quantity, merkel],
	// 	overrides: {
	// 		value: (Quantity * data)?.toString(),
	// 	},
	// 	onSuccess: () => {
	// 		console.log("minting done");
	// 	},
	// 	onError: (error) => {
	// 		seterrorMessage(error.reason);

	// 		if (error.reason.includes("Address already claimed!")) {
	// 			seterrorMessage(
	// 				"Sorry, execution reverted: This address already claimed!"
	// 			);
	// 		} else if (error.reason.includes("Invalid proof!")) {
	// 			seterrorMessage(
	// 				"It appears the connected wallet is not part of the allow list."
	// 			);
	// 		} else if (error.reason.includes("insufficient funds")) {
	// 			seterrorMessage(
	// 				"It appears the connected wallet has insufficient funds for the requested transaction."
	// 			);
	// 		} else if (error.reason.includes("array")) {
	// 			seterrorMessage("");
	// 			setError(false);
	// 		}

	// 		setError(true);
	// 	},
	// });

	// public mint method commented out. uncomment to enable public mint.

	const {
		data: mintData,
		write,
		isSuccess,
		isLoading,
	} = useContractWrite(config, "mint", {
		args: [Quantity],
		overrides: {
			value: (Quantity * data)?.toString(),
		},
		onSuccess: () => {
			console.log("minting done");
		},
		onError: (error) => {
			seterrorMessage(error.reason);

			if (error.reason.includes("Address already claimed!")) {
				seterrorMessage(
					"Sorry, execution reverted: This address already claimed!"
				);
			} else if (error.reason.includes("Invalid proof!")) {
				seterrorMessage(
					"It appears the connected wallet is not part of the allow list."
				);
			} else if (error.reason.includes("insufficient funds")) {
				seterrorMessage(
					"It appears the connected wallet has insufficient funds for the requested transaction."
				);
			} else if (error.reason.includes("array")) {
				seterrorMessage("");
				setError(false);
			}

			setError(true);
		},
	});

	const { isLoading: txLoading, isSuccess: txSuccess } = useWaitForTransaction({
		hash: mintData?.hash,
	});

	async function checkWL() {
		if (accountReady) {
			console.log(account, "account");
			const sentAddress = keccak256(account.address);
			const leafNodes = whiteListAddresses.map((addr) => keccak256(addr));
			const merkleTree = new MerkleTree(leafNodes, keccak256, {
				sortPairs: true,
			});
			const rootHash = merkleTree.getHexRoot();
			const merkleProof = merkleTree.getHexProof(sentAddress);
			console.log(rootHash, merkleProof);
			setMerkel(merkleProof);
		}
	}

	useState(() => {
		if (txSuccess) {
			setSuccess(true);
			getBalance();
			setTimeout(() => {
				setSuccess(false);
			}, 10000);
		}
	}, [txSuccess]);

	useEffect(() => {
		write();
	}, [merkel]);

	async function mint() {
		await checkWL();
	}

	async function publicmint() {
		write();
	}

	async function getBalance() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			// await window.ethereum.enable();
			const web3 = window.web3;
			// creating contract instance
			const ct = new web3.eth.Contract(
				contractInterface,
				"0xbCF2Ad24E02357D0D3b160Fc524bceCe2CB120bf"
			);
			let tokensOf = await ct.methods.balanceOf(account.address).call();
			setUserbalance(tokensOf);
			console.log("tokkens", tokensOf);
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
		}
	}

	return (
		<>
			<div id="mint" className="bg-[#124] py-40">
				{isErorr && errorMessage ? (
					<>
						<div className="flex w-9/12  md:w-4/12 mx-auto p-4 mb-4 bg-blue-100 rounded-lg dark:bg-blue-200 cursor-pointer">
							<svg
								aria-hidden="true"
								className="flex-shrink-0 w-5 h-5 text-blue-700 dark:text-blue-800"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								></path>
							</svg>
							<span className="sr-only">Info</span>
							<div className="ml-3 text-sm font-medium ">{errorMessage}</div>
							<button
								type="button"
								className="ml-auto -mx-1.5 -my-1.5 bg-blue-100 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300"
								onClick={() => setError(false)}
							>
								<span className="sr-only">Close</span>
								<svg
									aria-hidden="true"
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									></path>
								</svg>
							</button>
						</div>
					</>
				) : null}

				<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2">
					<div className="my-auto mx-4 bg-white rounded-xl text-black border-[5px] border-[#fcc] p-7 ">
						<div className="text-3xl font-black text-orange-400 uppercase mb-6">
							MINT A FREN
						</div>
						<div>
							Glad to have you here fren. The entire process is optimized for
							your minting pleasure. We utilize the latest and greatest wallet
							interface to allow for a wide variety of wallet types. Once
							connected confirm your correct balance appears in the bar at the
							top and proceed to minting. Using an ERC721A that provides you
							with a super low cost minting experience, feel free to mint from 1
							to 42 NFTs with equal ease. 70 maximum per wallet. Welcome fren to
							Metaverse City.
						</div>
						<br />
						<div className="py-4">
							<div
								className="inline-flex rounded-md gap-2 shadow-sm"
								role="group"
							>
								<button
									type="button"
									className="bg-orange-400 text-white rounded-lg px-4 py-4 font-bold text-3xl shadow hover:bg-orange-500 transition-all"
									onClick={() => {
										if (Quantity > 1) {
											setQuantity(Quantity - 1);
										}
									}}
								>
									-
								</button>
								<button
									type="button"
									className="bg-orange-400 text-white rounded-lg px-4 py-4 font-bold text-3xl shadow hover:bg-orange-500 transition-all"
								>
									{Quantity}
								</button>
								<button
									type="button"
									className="bg-orange-400 text-white rounded-lg px-4 py-4 font-bold text-3xl shadow hover:bg-orange-500 transition-all"
									onClick={() => {
										if (Quantity < 42) {
											setQuantity(Quantity + 1);
										}
									}}
								>
									+
								</button>
							</div>
						</div>
						<div className="">
							{success ? (
								<>
									<button className="bg-orange-400 text-white rounded-lg px-8 py-4 font-bold text-3xl shadow hover:bg-orange-500 transition-all">
										Tx Successful
									</button>
								</>
							) : (
								<>
									{txLoading ? (
										<>
											<button className="bg-orange-400 text-white rounded-lg px-8 py-4 font-bold text-3xl shadow hover:bg-orange-500 transition-all">
												<a
													href={`https://etherscan.io/tx/${mintData?.hash}`}
													target="_blank"
													rel="noreferrer"
												>
													Tx Pending
												</a>
											</button>
										</>
									) : (
										<>
											<button
												className="bg-orange-400 text-white rounded-lg px-8 py-4 font-bold text-3xl shadow hover:bg-orange-500 transition-all"
												onClick={() => publicmint()}
												// onClick={() => mint()}
											>
												Mint Now
											</button>
										</>
									)}
								</>
							)}
						</div>
						<div className="mt-4">
							<h1>Costs {(0.022 * Quantity).toFixed(5)} ETH + gas</h1>
						</div>
					</div>
					<div className="">
						<div className="card">
							<div
								className={`${
									txSuccess ? "rotate-hide-front" : " "
								} card-side front`}
							>
								<img className="relative rounded-lg" src="/vaf.gif" alt="" />
							</div>
							<div className={`${txSuccess ? "rotate" : " "} + card-side back`}>
								<div className=" p-4 w-full max-w-sm bg-white rounded-lg border-[5px] shadow-md sm:p-6  dark:border-[#fcc] rotate-360 transition-all">
									<h5 className="text-3xl font-black text-orange-400 uppercase mb-6">
										MINT COMPLETED
									</h5>
									<p className="text-sm font-normal text-black">
										You have successfully purchased. Welcome to Vinny & Frens
									</p>
									<ul className="my-4 space-y-5">
										<li>
											<a
												href={`https://etherscan.io/tx/${mintData?.hash}`}
												target="_blank"
												rel="noreferrer"
												className="flex items-center p-3 text-base font-bold text-gray-900 bg-orange-400 rounded-lg hover:bg-orange-500  group  dark:bg-orange-400 shadow dark:hover:bg-orange-500 transition-all dark:text-white"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="293.775"
													height="293.671"
													viewBox="0 0 293.775 293.671"
													className="h-6 w-6"
												>
													<g
														id="etherscan-logo-circle"
														transform="translate(-219.378 -213.33)"
													>
														<path
															id="Path_1"
															data-name="Path 1"
															d="M280.433,353.152A12.45,12.45,0,0,1,292.941,340.7l20.737.068a12.467,12.467,0,0,1,12.467,12.467v78.414c2.336-.692,5.332-1.43,8.614-2.2a10.389,10.389,0,0,0,8.009-10.11V322.073a12.469,12.469,0,0,1,12.468-12.47h20.778a12.469,12.469,0,0,1,12.467,12.467v90.279s5.2-2.106,10.269-4.245a10.408,10.408,0,0,0,6.353-9.577V290.9a12.466,12.466,0,0,1,12.466-12.467h20.778A12.468,12.468,0,0,1,450.815,290.9v88.625c18.014-13.055,36.271-28.758,50.759-47.639a20.926,20.926,0,0,0,3.185-19.537,146.6,146.6,0,0,0-136.644-99.006c-81.439-1.094-148.744,65.385-148.736,146.834a146.371,146.371,0,0,0,19.5,73.45,18.56,18.56,0,0,0,17.707,9.173c3.931-.346,8.825-.835,14.643-1.518a10.383,10.383,0,0,0,9.209-10.306V353.152"
															fill="#21325b"
														/>
														<path
															id="Path_2"
															data-name="Path 2"
															d="M244.417,398.641A146.808,146.808,0,0,0,477.589,279.9c0-3.381-.157-6.724-.383-10.049-53.642,80-152.686,117.4-232.79,128.793"
															transform="translate(35.564 80.269)"
															fill="#979695"
														/>
													</g>
												</svg>

												<span className="flex-1 ml-3 whitespace-nowrap">
													EtherScan
												</span>
												<span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
													Popular
												</span>
											</a>
										</li>
										<li>
											<a
												// href={`https://testnets.opensea.io/collection/${config.addressOrName}`}
												href="https://opensea.io/collection/vinny-and-frens"
												target="_blank"
												rel="noreferrer"
												className="flex items-center p-3 text-base font-bold text-gray-900 bg-orange-400 rounded-lg hover:bg-orange-500  group  dark:bg-orange-400 shadow dark:hover:bg-orange-500 transition-all dark:text-white"
											>
												<svg
													width="90"
													height="90"
													className="h-6 w-6"
													viewBox="0 0 90 90"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
														fill="#2081E2"
													/>
													<path
														d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
														fill="white"
													/>
													<path
														d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
														fill="white"
													/>
												</svg>

												<span className="flex-1 ml-3 whitespace-nowrap">
													OpenSea
												</span>
												<span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
													Popular
												</span>
											</a>
										</li>
										<li>
											<a
												href="https://looksrare.org/collections/0x728124c5a816Cd26c20F38fC86202410e63f3b07"
												className="flex items-center p-3 text-base font-bold text-gray-900 bg-orange-400 rounded-lg hover:bg-orange-500  group  dark:bg-orange-400 shadow dark:hover:bg-orange-500 transition-all dark:text-white"
											>
												<svg
													version={1.0}
													id="katman_1"
													className="h-8 w-8"
													xmlns="http://www.w3.org/2000/svg"
													xmlnsXlink="http://www.w3.org/1999/xlink"
													x="0px"
													y="0px"
													viewBox="0 0 800 600"
													style={{ enableBackground: "new 0 0 800 600" }}
													xmlSpace="preserve"
												>
													<style
														type="text/css"
														dangerouslySetInnerHTML={{
															__html:
																"\n\t.st0{fill:#2DE370;}\n\t.st1{fill:#121619;}\n\t.st2{fillRule:evenodd;clipRule:evenodd;fill:#FFFFFF;}\n",
														}}
													/>
													<path
														className="st0"
														d="M298.3,98L146,249.5L399.7,502l253.7-252.4L501.1,98H298.3z"
													/>
													<path
														className="st1"
														d="M291.2,196.4c59.9-60,157.1-60,217,0l51.8,51.8l-51.8,51.8c-59.9,60-157.1,60-217,0l-51.8-51.8L291.2,196.4z"
													/>
													<path
														className="st2"
														d="M399.7,311.7c-35,0-63.4-27.7-63.4-61.8s28.4-61.8,63.4-61.8s63.4,27.7,63.4,61.8S434.8,311.7,399.7,311.7z"
													/>
													<path
														className="st1"
														d="M399.7,274.9c-14.7,0-26.7-12-26.7-26.7c0-14.8,12-26.7,26.7-26.7c14.7,0,26.7,12,26.7,26.7
	C426.4,263,414.5,274.9,399.7,274.9z"
													/>
												</svg>

												<span className="flex-1 ml-3 whitespace-nowrap">
													LooksRare
												</span>
											</a>
										</li>
										<li>
											<a
												href="https://rarible.com/collection/0x728124c5a816cd26c20f38fc86202410e63f3b07"
												className="flex items-center p-3 text-base font-bold text-gray-900 bg-orange-400 rounded-lg hover:bg-orange-500  group  dark:bg-orange-400 shadow dark:hover:bg-orange-500 transition-all dark:text-white"
											>
												<svg
													fill="none"
													height="48"
													className="h-8 w-8"
													viewBox="0 0 49 48"
													width="49"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="m.0966797 10.4931c0-5.79516 4.7127903-10.4931 10.5263203-10.4931h26.9474c5.8135 0 10.5263 4.69794 10.5263 10.4931v26.8625c0 5.7952-4.7128 10.4931-10.5263 10.4931h-26.9474c-5.81353 0-10.5263203-4.6979-10.5263203-10.4931z"
														fill="#feda03"
													/>
													<path
														clipRule="evenodd"
														d="m36.1418 20.0308c0 2.2953-1.341 3.437-2.8481 3.8336 1.8038.5407 3.1092 2.0189 3.1092 4.3622v4.3022h-6.883v-4.0859c0-1.2498-.7358-1.7545-1.9937-1.7545h-8.1647v5.8404h-6.883v-17.2087h16.3531c4.106 0 7.3102.8892 7.3102 4.7107zm-16.7772.0972h9.305v.0008c.0139-.0005.0279-.0008.0419-.0008.6398 0 1.1585.5252 1.1585 1.1732 0 .6479-.5187 1.1731-1.1585 1.1731-.014 0-.028-.0002-.0419-.0007v.0007h-9.305z"
														fill="#000"
														fillRule="evenodd"
													/>
												</svg>

												<span className="flex-1 ml-3 whitespace-nowrap">
													Rarible
												</span>
											</a>
										</li>
										<li>
											<a
												href="https://x2y2.io/collection/0x728124c5a816Cd26c20F38fC86202410e63f3b07/items"
												className="flex items-center p-3 text-base font-bold text-gray-900 bg-orange-400 rounded-lg hover:bg-orange-500  group  dark:bg-orange-400 shadow dark:hover:bg-orange-500 transition-all dark:text-white"
											>
												<svg
													width="512"
													height="512"
													className="h-8 w-8"
													viewBox="0 0 512 512"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M459.265 100.353C420.038 62.0229 366.378 38.4 307.2 38.4C187.023 38.4 89.6 135.823 89.6 256C89.6 376.177 187.023 473.6 307.2 473.6C366.377 473.6 420.038 449.977 459.265 411.647C412.474 472.661 338.831 512 256 512C114.615 512 0 397.385 0 256C0 114.615 114.615 0 256 0C338.831 0 412.474 39.339 459.265 100.353Z"
														fill="url(#paint0_linear_3_635)"
													/>
													<path
														d="M144.588 380.518C175.97 411.182 218.898 430.08 266.24 430.08C362.382 430.08 440.32 352.142 440.32 256C440.32 159.858 362.382 81.92 266.24 81.92C218.898 81.92 175.97 100.818 144.588 131.482C182.021 82.6712 240.935 51.2 307.2 51.2C420.308 51.2 512 142.892 512 256C512 369.108 420.308 460.8 307.2 460.8C240.935 460.8 182.021 429.329 144.588 380.518Z"
														fill="url(#paint1_linear_3_635)"
													/>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M409.6 256C409.6 340.831 340.831 409.6 256 409.6C171.169 409.6 102.4 340.831 102.4 256C102.4 171.169 171.169 102.4 256 102.4C340.831 102.4 409.6 171.169 409.6 256ZM358.4 256C358.4 312.554 312.554 358.4 256 358.4C199.446 358.4 153.6 312.554 153.6 256C153.6 199.446 199.446 153.6 256 153.6C312.554 153.6 358.4 199.446 358.4 256Z"
														fill="url(#paint2_linear_3_635)"
													/>
													<defs>
														<linearGradient
															id="paint0_linear_3_635"
															x1="0"
															y1="247.172"
															x2="512"
															y2="247.172"
															gradientUnits="userSpaceOnUse"
														>
															<stop stopColor="#00E0FF" />
															<stop offset="1" stopColor="#562EC8" />
														</linearGradient>
														<linearGradient
															id="paint1_linear_3_635"
															x1="0"
															y1="247.172"
															x2="512"
															y2="247.172"
															gradientUnits="userSpaceOnUse"
														>
															<stop stopColor="#00E0FF" />
															<stop offset="1" stopColor="#562EC8" />
														</linearGradient>
														<linearGradient
															id="paint2_linear_3_635"
															x1="0"
															y1="247.172"
															x2="512"
															y2="247.172"
															gradientUnits="userSpaceOnUse"
														>
															<stop stopColor="#00E0FF" />
															<stop offset="1" stopColor="#562EC8" />
														</linearGradient>
													</defs>
												</svg>

												<span className="flex-1 ml-3 whitespace-nowrap">
													X2y2
												</span>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
