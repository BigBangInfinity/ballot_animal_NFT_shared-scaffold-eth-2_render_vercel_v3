import { useState } from "react";
import { FC } from "react";

interface RescueAnAnimalProps {
  text: string;
}
const RescueAnAnimal: FC<RescueAnAnimalProps> = ({ text }) => {
  return (
    <div>
      <h1>{text}</h1>
      <RequestNFT address="0x123" />
    </div>
  );
};

export default RescueAnAnimal;

function RequestNFT(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean; transactionHash: string; error?: string }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address, signature: "123" };

  if (isLoading) return <p>Locating a lost Animal...</p>;
  if (!data)
    return (
      <button
        type="button"
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="bg-black/30 hover:bg-black/60 text-white/80 hover:text-white/90 px-6 py-4 rounded-md"
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
        Rescue An Animal
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
