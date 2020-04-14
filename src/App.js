import React, { useState, useEffect } from "react"

import Map from "./components/Map"
import Routes from "./components/Routes"

import data from './data/reittiopas.json'
import {
  createEdgeDistances,
  createRoutableNetwork,
  getRouteDetails,
} from './utils/helpingFunctions'

import './App.css'


// Get data
const { pysakit, tiet, linjastot } = data

// Create routable network
const edgeDistances = createEdgeDistances(tiet)
const routableNetwork = createRoutableNetwork(linjastot, edgeDistances)

const App = () => {

  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [routeDetails, setRouteDetails] = useState(null)

  // Calculate route when origin/destination changes (and both are defined),
  // else reset route
  useEffect(() => {
    if (origin && destination) setRouteDetails(getRouteDetails(origin, destination, routableNetwork))
    else setRouteDetails(null)
  }, [origin, destination])

  return (
    <div id='main'>
      <Map
        routeDetails={routeDetails}
        />
      <Routes
        setOrigin={setOrigin}
        setDestination={setDestination}
        options={pysakit}
        routeDetails={routeDetails}
      />
      <a
        id='main-title'
        href='https://koodihaaste.solidabis.com/'
        target='_blank'
        rel="noopener noreferrer"
      >
        Solidabis-koodihaaste
      </a>
    </div>
  )
}

export default App