import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

class Land {
  tokenId: any
  image: any
  yield: any
  resource: any 
  cords: Map<string, number> = new Map()
  defence: any
  settlement: any 
  bonus: any 
  total: any
}

const opensea = 'https://opensea.io/assets/ethereum/0x17d084106c2f1c716ce39fa015ab022757d30c9a/'
const metadataIpfs = 'QmdDumXc55DAfMCfdhaghZQgb7cpCTTRyS5vmo3dbzUEnP'

const getData = async (tokenId:string) => {
  const data = await fetch('https://dweb.link/ipfs/' + metadataIpfs +'/' + tokenId + '.json' )
  .then((response) => response.json())
  .then((data) => {  return data });
  let someLand = new Land()
  someLand.tokenId = tokenId
  someLand.image = 'https://dweb.link/ipfs/' + data.image?.slice(7, data.image.length)
  const attributes = JSON.parse(JSON.stringify(data.attributes))
  attributes.forEach((a: any) => {
    const tt = a.trait_type
    if (tt === 'DEFENCE')  { someLand.defence = a.value }
    if (tt === 'RESOURCE') { someLand.resource = a.value }
    if (tt === 'Yield')    { someLand.yield = a.value }
    if (tt === 'COORDINATES') 
    { const cords = a.value.split(' ')
      someLand.cords.set('x', cords[0])
      someLand.cords.set('y', cords[1])
      someLand.cords.set('z', cords[2])
    }
    if (tt === 'Village'|| tt === 'Town' || tt === 'City' || tt === 'Capital') 
      { someLand.settlement = tt
        someLand.bonus = a.value 
      }
  })
  if(someLand.bonus !== undefined) {
    someLand.total = someLand.bonus/100 * someLand.yield + someLand.yield
  }
  return someLand
}

function App() {
  const [land, setLand] = useState<Land>()
  const Display = () => {
    if (!land) {return <></>}
    return (
      <div className='land'>
        <h6>
          Token ID : {land.tokenId} <br/>
          <div hidden={land.defence === 'None'}>
            Defence : {land.defence}
          </div>
          <div className='cords'>
            <div className='x'>X : {land.cords.get('x')} </div>
            <div className='y'>Y : {land.cords.get('y')} </div>
            <div className='z'>Z : {land.cords.get('z')} </div>
          </div> 
          <br/>
          Total {land.resource} Yield : 
          <span className='yield'>{land.bonus  ? land.total : land.yield}</span>
        </h6>
        <div hidden={!land.settlement}>
          {land.settlement} Bonus : {land.bonus}%
        </div>
        <picture>
          <a href={opensea + land.tokenId} title='Opensea.io'>
            <img src={land.image} alt={land.tokenId} width='50%' />
          </a>
        </picture> 
      </div>
      
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        <h4>Kryptoria Land Tokens</h4>
        <input id='idInput' className='id' placeholder='id #'  
          onChange={async (e: React.ChangeEvent<HTMLInputElement>)=> {
            e.preventDefault();
            const id = e.target.value
            if (parseInt(id) > 0 && parseInt(id) <= 10000) {
              setLand(await getData(id))
            } 
         }}
        ></input>
        <br/>
        <img src={logo} className="App-logo" alt="logo" />
        <Display /> 
        <p/>
      </header>
    </div>
  );
}

export default App;
