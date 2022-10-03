import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
//import './hexagons.css'
import { ThreeCircles, LineWave } from 'react-loader-spinner';

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
const someMap = new Map<number, Land>()
const opensea = 'https://opensea.io/assets/ethereum/0x17d084106c2f1c716ce39fa015ab022757d30c9a/'
const metadataIpfs = 'QmdDumXc55DAfMCfdhaghZQgb7cpCTTRyS5vmo3dbzUEnP'



function App() {
  const [landSaved, setLandSaved] = useState<Land>()
  const [hexTile, setHexTile] = useState<JSX.Element>()
  const [idSaved, setIdSaved] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>()
  

  return (
    <div className="App">
      <header className="App-header">
        <h4>Kryptoria Land Tokens</h4>
        <input placeholder='id #' onChange={  
          async (e: React.ChangeEvent<HTMLInputElement>)=> {
            e.preventDefault();
            const id = parseInt(e.target.value)
            if(id>0 && id<=10000){
              setIdSaved(id)

            }
          }
        }></input><br/>
        <button onClick={ async () => {
          if (idSaved) {
            setIsLoading(true)
            someMap.clear()
            setLandSaved(await getLand(idSaved, 7));
            let component = React.createElement( 'ul', {id:'hexGrid'}, makeHex(idSaved, 7) );
            setHexTile(component)
            setIsLoading(false)
          }
        }}>Load Lands</button>
        <br/>
        <img src={logo} className="App-logo" alt="logo" />
        { idSaved !== landSaved?.tokenId ? 
          <div className='spinner'>
            {isLoading ? 
            <ThreeCircles
              height="100"
              width="100"
              color="blue"
              ariaLabel="three-circles-rotating"
            /> :
            <LineWave
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="line-wave"
            />
            }
          </div> :         
          <>{hexTile}</>
        }
      </header>
    </div>
  );
}

const getData = async (tokenId:number) => {
  let someLand = new Land()
    const data = await fetch('https://dweb.link/ipfs/' + metadataIpfs +'/' + tokenId + '.json' )
    .then((response) => response.json())
    .then((data) => {  return data });
    
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

const getLand = async (id:number, number:number) => {
  for (let i=id; i<id+number; i++){
    const someLand = await getData(i)
    someMap.set(i, someLand)
  }
  return someMap.get(id)
}

const makeHex = (id:number, number:number) => {
    let html = []
    console.log(someMap)
    for(let i = id; i<id+number; i++){
      const land = someMap.get(i)
      
      if (!land) continue
      const hex = React.createElement('li', {key:'somekey'+i,className:'hex'},
      <div className="hexIn">
        <a className="hexLink" href={opensea + land.tokenId}>
          <img src={land.image} alt="" />
          <h1>
            Land#{land.tokenId}<br/>
            X:{land.cords.get('x')} Y:{land.cords.get('y')} Z:{land.cords.get('z')}
          </h1>
          <p>
            Total {land.resource} Yield : {land.bonus  ? land.total : land.yield}
            <br/>
            { !land.settlement ? <></> : land.settlement + ' Bonus : ' + land.bonus + '%' }
            <br/>
            { !land.defence || land.defence === 'None' ? <></> : 'Defence : ' + land.defence }
          </p>
        </a>
      </div>
      )
      html.push(hex)
    }
  return html
}
export default App;
