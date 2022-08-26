import React from "react";

export const MintPage = () => {
	return (
		<>
			<div id="about" className="bg-[#124] pt-[0px] pb-[20px]">
				<div className="mx-auto w-full">
					<div className="max-w-4xl mx-auto">
						<img
							className="mx-auto w-full my-14 px-4"
							src="/static/media/about.2b0b97cdd6fbca1b3d9e.png"
							alt="title"
							style={{ maxHeight: "250px", maxWidth: "340px" }}
						/>
					</div>
				</div>
				<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2">
					<div className="my-auto mx-4 bg-white rounded-xl text-black border-[5px] border-[#fcc] p-7">
						<div className="text-3xl font-black text-orange-400 uppercase mb-6">
							GM FRENS
						</div>
						<div>
							Vinny &amp; Frens is a groundbreaking new NFT project brought to
							you by Degen Productions with artwork by Stacys. We are
							reimagining how creative works in the public domain can be adapted
							in new and novel ways. While we’re initially starting off with NFT
							collectibles, we have future plans that aim to redefine the
							contours of Web3.
						</div>
					</div>
					<div className="flex justify-end items-center">
						<div className="relative p-5 overflow-hidden flex justify-center mx-auto mt-9 md:mt-0 items-center">
							<img
								className="relative rounded-lg"
								src="/static/media/VR_Vinny.64924ae07231519b6e80.jpg"
								alt=""
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

// export default MintPage;
