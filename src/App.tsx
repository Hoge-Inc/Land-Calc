import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

class Land {
  tokenId: any
  image: any
  yield: any
  resource: any 
  cords: any
  x: any
  y: any
  z: any
  defence: any
  settlement: any 
  bonus: any 
}

const getData = async (tokenId:string) => {
  const data = await fetch('https://dweb.link/ipfs/QmdDumXc55DAfMCfdhaghZQgb7cpCTTRyS5vmo3dbzUEnP/' + tokenId + '.json')
  .then((response) => response.json())
  .then((data) => {  return data });
  let someLand = new Land()
  someLand.tokenId = tokenId
  someLand.image = data.image
  if (someLand.image?.substring(0,7) === 'ipfs://') { 
    someLand.image = 'https://dweb.link/ipfs/' + someLand.image?.slice(7, someLand.image.length)
  }
  const attributes = JSON.parse(JSON.stringify(data.attributes))
  attributes.forEach((a: any) => {
    if (a.trait_type === 'DEFENCE')      { someLand.defence = a.value }
    if (a.trait_type === 'RESOURCE')     { someLand.resource = a.value }
    if (a.trait_type === 'Yield')        { someLand.yield = a.value }
    if (a.trait_type === 'Village')      { someLand.settlement = a.trait_type; someLand.bonus = a.value }
    if (a.trait_type === 'Town')         { someLand.settlement = a.trait_type; someLand.bonus = a.value }
    if (a.trait_type === 'City')         { someLand.settlement = a.trait_type; someLand.bonus = a.value }
    if (a.trait_type === 'Capital')      { someLand.settlement = a.trait_type; someLand.bonus = a.value }
    if (a.trait_type === 'COORDINATES')  { someLand.cords = a.value 
        const cords = a.value.split(' ')
    someLand.x = cords[0]
    someLand.y = cords[1]
    someLand.z = cords[2]
    }
  })

  return someLand
}

function App() {
  const [land, setLand] = useState<Land>()
  const Display = () => {
    if (!land) {return <></>}
    return (
      <div className='land'>
        <img src={land.image} alt={land.tokenId} width='40%' />
        <br/>Token ID : {land.tokenId}<br/>
        <div hidden={land.defence === 'None'}>
          Defence : {land.defence}
        </div>
        <div hidden={!land.resource}>
          {land.resource} Yield : {land.yield}
        </div>
        <div hidden={!land.cords}>
          X : {land.x} <br/>
          Y : {land.y} <br/>
          Z : {land.z}<br/>
        </div>
        <div hidden={!land.settlement}>
          {land.settlement} Bonus : {land.bonus}%
        </div>
      </div>
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input id='idInput' className='id' placeholder='token id #' value={land?.tokenId} 
          onChange={async(e: React.ChangeEvent<HTMLInputElement>)=> {
            const id = e.target.value
            if (parseInt(id) > 0 && parseInt(id) <= 10000) {
              setLand(await getData(id))
            } 
         }}
        ></input>
        <h4>Kryptoria Land Tokens</h4>
        <Display />
      </header>
    </div>
  );
}

export default App;
