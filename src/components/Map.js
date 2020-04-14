import React, { useState } from "react"
import { MapInteractionCSS } from "react-map-interaction"

import Karttakuva from "../images/kartta.svg"
import { ReactComponent as Tiet } from "../images/tiet.svg"
import { ReactComponent as Asemat } from "../images/asemat.svg"
import { ReactComponent as Etaisyydet } from "../images/etaisyydet.svg"

import stations from '../data/stations'
import lineColors from '../data/lineColors'

import './Map.css'

// Function to create SVG for route path with appropriate colors
const createRouteSVG = (routeDetails) => (
  <svg width="2880px" height="2048px" viewBox="0 0 1440 1024" className="linja">
    <g stroke="none" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {routeDetails.route.map((edge, index) => (
        <g key={index} stroke={lineColors[edge.line]} transform="translate(120.000000, 80.000000)" strokeWidth="10">
          <line x1={stations[edge.fromNode].x} y1={stations[edge.fromNode].y} x2={stations[edge.toNode].x} y2={stations[edge.toNode].y} />
        </g>
      ))}
    </g>
  </svg>
)

const Map = ({ routeDetails }) => {

  const [maxY, setMaxY] = useState()
  const [maxX, setMaxX] = useState()
  const [minimiScale, setMinimiScale] = useState(1)

  const positions = event => {
    let scale = Math.abs(event.scale)

    let vph = window.innerHeight
    let vpw = window.innerWidth
    let korkeus = document.querySelector(".mapImage").offsetHeight * scale
    let leveys = document.querySelector(".mapImage").offsetWidth * scale


    let my = vph - korkeus > 0 ? 0 : vph - korkeus // fail safe jos näyttö > kuva
    setMaxY(my)
    let mx = vpw - leveys > 0 ? 0 : vpw - leveys // fail safe jos näyttö > kuva
    setMaxX(mx)

    let wScale = vpw / leveys
    let hScale = vph / korkeus
    let suurin = Math.max(wScale, hScale)
    setMinimiScale(vph < 900 && vpw < 900 ? 0.5 : suurin) // jos mobiili, salli isompi zoomi
    if (vpw > 2900) setMinimiScale(1.5) // fail safe tosi iso näyttö
  }

  return (
    <div className="mapContainer">
      <MapInteractionCSS
        className="mapElement"
        minScale={minimiScale}
        maxScale={3}
        defaultScale={1} // 2
        translationBounds={{ xMin: maxX, yMin: maxY, xMax: 0, yMax: 0 }}
        onChange={positions}
      >
        <img
          className="mapImage"
          id="karttakuva"
          alt="mapImage"
          src={Karttakuva}
        />

        <Etaisyydet className="etaisyydet" />
        <Asemat className="asemat" />
        <Tiet className="tiet" />

        {routeDetails && createRouteSVG(routeDetails)}

      </MapInteractionCSS>
    </div>
  )
}

export default Map
