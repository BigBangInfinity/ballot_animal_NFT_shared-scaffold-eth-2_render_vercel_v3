import React, { useEffect, useState } from "react";
import Image from "next/image";
import BallotResults from "../components/BallotResults";
import MintNFT from "../components/MintNFT";
import SubmitProposal from "../components/SubmitProposal";
import banner2 from "../public/banner2.png";
import banner from "../public/banner.png";
import base64 from "base-64";
import type { NextPage } from "next";
import { useAccount, useBalance, useContractWrite, useNetwork, useSignMessage } from "wagmi";

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const BALLOT_ADDRESS = process.env.NEXT_PUBLIC_BALLOT_ADDRESS;

const Home: NextPage = () => {
  return (
    <>
      <section className="relative w-full min-h-screen md:h-screen flex md:block flex-col justify-center">
        <Image
          priority
          fill
          quality={100}
          className="pointer-events-none select-none"
          src={banner}
          alt="nft banner image"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="relative z-60 pt-32 md: pt-0 md: top-1/4 1g:top-1/3 ma mx-auto">
          <div className="max-w-2x1 px-4 flex flex-col gap-9 md: max-x1:bg-white/30 md: max-x1: rourded-2x1">
            <div className="flex gap-8 font-semibold mt-4">
              <button
                type="button"
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="bg-black/30 hover:bg-black/60 text-white/80 hover:text-white/90 px-6 py-4 rounded-md"
              >
                Rescue an Animal
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">ZOO DAO</span>

            <p className="text-centei r text-lg">
              {/* Team 12 final project{" "} */}
              <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
                Rescue Lost Animals by minting an NFT (no signature, no gas needed)
              </code>
            </p>
          </h1>
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Connect your wallet!</p>
      <WalletInfo></WalletInfo>
    </>
  );
}

function NFTCollection(params: { address: `0x${string}` }) {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await fetch(
          `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${params.address}/nfts?collection=mynft-7607`,
        );
        const data = await response.json();
        const decodedNfts = data.nfts.map((nft: { metadata_url: string }) => ({
          ...nft,
          metadata: JSON.parse(base64.decode(nft.metadata_url.split(",")[1])),
        }));
        setNfts(decodedNfts);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNfts();
  }, []);

  return (
    <div className="w-full flex justify-center ">
      <div className="grid grid-cols-1 gap-4 p-4 mx-auto">
        {loading ? (
          <p>Loading Animals...</p>
        ) : (
          nfts.map((nft, index) => (
            <div key={index} className="border p-2">
              <img src={nft.image_url} alt={nft.name} style={{ width: "100%", height: "auto" }} />
              {nft.metadata.attributes.map(
                (
                  attr: {
                    trait_type:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined;
                    value:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined;
                  },
                  attrIndex: React.Key | null | undefined,
                ) => (
                  <p key={attrIndex}>
                    {attr.trait_type}: {attr.value}
                  </p>
                ),
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <>
        <p>Your Animal Ledger is {address}</p>
        <p>Connected to the Zoo chain {chain?.name}</p>
        <div className="flex flex-row items-center justify-around w-full">
          <MintNFT></MintNFT>
          <SubmitProposal></SubmitProposal>
          <BallotResults></BallotResults>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-around w-full">
          <WalletAction></WalletAction>
          {/* <WalletAction2></WalletAction2> */}
          <WalletBalance address={address as `0x${string}`}></WalletBalance>
          <TokenInfo address={address as `0x${string}`}></TokenInfo>
          <ApiData address={address as `0x${string}`}></ApiData>
          <DelegateBox></DelegateBox>
          <BallotApiData address={address as `0x${string}`}></BallotApiData>

          <CastVotes2></CastVotes2>
        </div>

        <section className="relative w-full min-h-screen md:h-screen flex md:block flex-col justify-center">
          <Image
            priority
            fill
            quality={100}
            className="pointer-events-none select-none"
            src={banner2}
            alt="nft banner image"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </section>
        <div className="flex flex-col items-center justify-center my-8">
          <h2 className="text-2xl font-bold mb-4">Your Rescued Animals</h2>
          <NFTCollection address={address as `0x${string}`}></NFTCollection>
        </div>
      </>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">What&apos;s your favorite Animal?</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Just curious...</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}

// function WalletAction2() {
//   const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
//   return (
//     <div className="card w-96 bg-primary text-primary-content mt-4">
//       <div className="card-body">
//         <h2 className="card-title">Testing signatures</h2>
//         <button
//           className="btn btn-active btn-neutral"
//           disabled={isLoading}
//           onClick={() =>
//             signMessage({
//               message: "I want a token",
//             })
//           }
//         >
//           Sign message
//         </button>
//         {isSuccess && <div>Signature: {data}</div>}
//         {isError && <div>Error signing message</div>}
//       </div>
//     </div>
//   );
// }

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Available SEP to donate to the Zoo</h2>
        Available {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

function TokenBalanceFromApi(params: { address: `0x${string}` }) {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://ballot2-animal-nft.onrender.com/token-balance/${params.address}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading voting power from API...</p>;
  if (!data) return <p>No voting power information</p>;

  return <div>Animal captured: {data.result}</div>;
}

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Animal Rescued So Far:</h2>
        <TokenNameFromApi></TokenNameFromApi>
        <TokenBalanceFromApi address={params.address}></TokenBalanceFromApi>
      </div>
    </div>
  );
}

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Rescue Another Animal:</h2>
        <RequestNFT address={params.address}></RequestNFT>
        <TokenAddressFromApi></TokenAddressFromApi>
        {/* <TotalSupplyFromApi></TotalSupplyFromApi> */}
        <TokenNameFromApi></TokenNameFromApi>
      </div>
    </div>
  );
}

function DelegateBox() {
  return <DelegateVote2></DelegateVote2>;
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/contract-address")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Zoo Address : {data.result}</p>
    </div>
  );
}

function RequestNFT(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean; transactionHash: string; error?: string }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address, signature: "123" };

  if (isLoading) return <p>Locating a lost Animal...</p>;
  if (!data)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          setLoading(true);
          fetch("https://ballot2-animal-nft.onrender.com/mint-nfts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then(res => res.json())
            .then(data => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Mint NFT
      </button>
    );

  return (
    <div>
      {data && (
        <>
          <p>Result from API: {data.result ? "captured" : "escaped"}</p>
          {data.transactionHash && <p>Transaction Hash: {data.transactionHash}</p>}
          {data.error && <p>Error: {data.error}</p>}
        </>
      )}
    </div>
  );
}

// function TotalSupplyFromApi() {
//   const [data, setData] = useState<{ result: string }>();
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:3001/total-supply")
//       .then(res => res.json())
//       .then(data => {
//         setData(data);
//         setLoading(false);
//       });
//   }, []);

//   if (isLoading) return <p>Loading total supply from API...</p>;
//   if (!data) return <p>No total supply information</p>;

//   return <div>Total NFT supply from API: {data.result}</div>;
// }

function TokenNameFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/token-name")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token name from API...</p>;
  if (!data) return <p>No total token name information</p>;

  return <div>Zoo Name: {data.result}</div>;
}

function BallotApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">What should we do with the Rescued Animals?</h2>
        <VotingPowerFromApi address={params.address}></VotingPowerFromApi>
        <BallotAddressFromApi></BallotAddressFromApi>
        <Proposal0FromApi></Proposal0FromApi>
        <Proposal1FromApi></Proposal1FromApi>
        <Proposal2FromApi></Proposal2FromApi>
        <WinningProposalFromApi></WinningProposalFromApi>
      </div>
    </div>
  );
}

function BallotAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/ballot-address")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading Zoo Proposal...</p>;
  if (!data) return <p>No zoo proposal information</p>;

  return (
    <div>
      <p>Their destiny is in your hands: {data.result}</p>
    </div>
  );
}

function VotingPowerFromApi(params: { address: `0x${string}` }) {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://ballot2-animal-nft.onrender.com/voting-power/${params.address}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading your voting power...</p>;
  if (!data) return <p>No voting power</p>;

  return <div>Your voting power: {data.result}</div>;
}

interface Proposal0Data {
  name: string;
  votes: number;
}

interface ApiResponse {
  result: Proposal0Data;
}

function Proposal0FromApi() {
  const [data, setData] = useState<ApiResponse>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/proposal0")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading proposal0 info from API...</p>;
  if (!data) return <p>No proposal0 information</p>;

  return (
    <div>
      {data.result["name"] as string}: {data.result["votes"]} votes
    </div>
  );
}

interface Proposal1Data {
  name: string;
  votes: number;
}

interface ApiResponse {
  result: Proposal1Data;
}

function Proposal1FromApi() {
  const [data, setData] = useState<ApiResponse>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/proposal1")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading proposal1 info from API...</p>;
  if (!data) return <p>No proposal1 information</p>;

  return (
    <div>
      {data.result["name"]}: {data.result["votes"]} votes
    </div>
  );
}

interface Proposal2Data {
  name: string;
  votes: number;
}

interface ApiResponse {
  result: Proposal2Data;
}

function Proposal2FromApi() {
  const [data, setData] = useState<ApiResponse>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/proposal2")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading proposal2 info from API...</p>;
  if (!data) return <p>No proposal2 information</p>;

  return (
    <div>
      {data.result["name"]}: {data.result["votes"]} votes
    </div>
  );
}

function WinningProposalFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ballot2-animal-nft.onrender.com/winner-name")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading winner name from API...</p>;
  if (!data) return <p>No winner name information</p>;

  return <div>ZOO DAO DECISION: {data.result}</div>;
}

function DelegateVote2() {
  const [address, setAddress] = useState<string>("");
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKEN_ADDRESS,
    abi: [
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "delegatee",
            type: "address",
          },
        ],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "delegate",
  });
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Register To Vote</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label>
            Enter Your Wallet Address:
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </label>
        </div>
        <button className="btn btn-active btn-neutral" disabled={isLoading} onClick={() => write({ args: [address] })}>
          Enter Vote
        </button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </div>
    </div>
  );
}
function CastVotes2() {
  const [proposal, setProposal] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: BALLOT_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "proposal",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "vote",
  });

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Cast Vote</h2>
        <div className="form-control w-full max-w-xs my-4">
          {/* Radio buttons for proposals */}
          <div className="flex flex-col">
            <label className="flex items-center space-x-2">
              <input type="radio" name="proposal" checked={proposal === 0} onChange={() => setProposal(0)} />
              <span>Lock all rescued Animals back to the zoo?</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="proposal" checked={proposal === 1} onChange={() => setProposal(1)} />
              <span>Release them into the wild?</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="proposal" checked={proposal === 2} onChange={() => setProposal(2)} />
              <span>Let&apos;s start the barbecue...</span>
            </label>
          </div>

          {/* Input field for amount */}
          <label className="mt-4">
            How many Animals will you commit?
            <input
              type="number"
              placeholder="0"
              className="input input-bordered w-full max-w-xs"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Button to cast vote */}
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() => write({ args: [proposal, amount] })}
        >
          castVote
        </button>
        {isLoading && <div>Verification</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </div>
    </div>
  );
}

export default Home;
