import { useState } from 'react';
import { NFTCard } from '../components/nftCard';

const Home = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [fectchCollection, setFectchCollection] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [startPoint, setstartPoint] = useState();
  const [totalNfts, setTotalNfts] = useState(0);


  const getNfts = async () => {
    let nfts;

    let requestOptions = {
        method: 'GET'
      };
    const API_KEY = 'BomLASjQbV7pYRLxmX75-U2w2w_TOD7B';
    console.log('api key: ', API_KEY);
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTs/`;  
    
    if(!collectionAddress.length) {
      let fetchURL = `${baseURL}?owner=${walletAddress}`;

      if(startPoint) {
        fetchURL = `${fetchURL}&pageKey=${startPoint}`;
      }
      
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json()).catch(err => console.log('error: ', err));
    } else {
      const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
      
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json()).catch(err => console.log('error: ', err));
    }

    console.log(('NFT: ', nfts));
    if(nfts) {
      setNFTs(nfts.ownedNfts);
    }
    
    if(nfts.pageKey) {
      setstartPoint(nfts.pageKey);
    }

    console.log('startPoint - ', startPoint);

  }

  const getCollection = async () => {
    if(collectionAddress.length) {
      let requestOptions = {
        method: 'GET'
      };
      
      const API_KEY = 'BomLASjQbV7pYRLxmX75-U2w2w_TOD7B';
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTsForCollection`;
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${'true'}`;

      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json()).catch(err => console.log('error: ', err));
      if(nfts) {
        console.log('NFTs in the colleciton: ', nfts);
        setNFTs(nfts.nfts);
        let cant = await getFullCollection();
        console.log('cant: ', cant ); 
        setTotalNfts(cant);
      }
      console.log('totalNfts: ', totalNfts ); 
    }
    console.log('totalNfts: ', totalNfts ); 
  }

  const getCompleteCollection = async (startToken) => {
    let requestOptions = {
      method: 'GET'
    };
    
    const API_KEY = 'BomLASjQbV7pYRLxmX75-U2w2w_TOD7B';
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTsForCollection`;
    const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${'true'}&startToken=${startToken}`;

    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json()).catch(err => console.log('error: ', err));

    return nfts;
  }

  const getFullCollection = async () => {
    let start = '';
    let hasNextPage = true;
    let totalNftsFound = 0;
    while(hasNextPage) {  
      const { nfts, nextToken } = await getCompleteCollection(start);
      if (!nextToken) {
        hasNextPage = false;
      }
      start = nextToken;
      totalNftsFound += nfts.length;
    }
    return totalNftsFound;
  }

  const handleNextPage = () => {
    getNfts();
  }
  
  const handlePrevPage = () => {
    getNfts();
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className='flex flex-col w-full justify-center items-center gap-y-2'>
        <input disabled={fectchCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => {setWalletAddress(e.target.value)}} value={walletAddress} type="text" placeholder='Add your wallet address'/>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => {setCollectionAddress(e.target.value)}} value={collectionAddress} type="text" placeholder='Add the contract address of the collection'/>
        <label className="text-gray-600 "><input onChange={(e) => {setFectchCollection(e.target.checked)}} type="checkbox" />Check for collection visualization</label>
        
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={() => {
          fectchCollection ? getCollection() : getNfts()
        }}>Search the images..</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        { NFTs.length && NFTs.map((nft) => {
          return(
            <NFTCard key={nft.id.tokenId} nft={nft}/>
          )
        })
        }
      </div>
      <div>
          { startPoint ? 
                <>
                  <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={handlePrevPage}> --- View prev</button>
                  <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={handleNextPage}>View more +++</button> 
                </>     
                  :
                  <>
                  <p>No more</p>          
                  </>

          }
      </div>
      <div>
        {
          startPoint ? <p>More NFT</p> : <p>Finish</p> 
        }
      </div>
    </div>
  )
}

export default Home
