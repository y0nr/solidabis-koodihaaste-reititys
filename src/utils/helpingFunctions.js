// Create object with a format of { fromNode -> toNode -> distance }
export const createEdgeDistances = (edges) => edges.reduce((distances, item) => {
  return ({
    ...distances,
    [item.mista]: distances[item.mista]
      ? {
        ...distances[item.mista],
        [item.mihin]: item.kesto
      }
      : {
        [item.mihin]: item.kesto
      },
    [item.mihin]: distances[item.mihin]
      ? {
        ...distances[item.mihin],
        [item.mista]: item.kesto
      }
      : {
        [item.mista]: item.kesto
      },
  })
}, {})

// Create routable network based on lines (add edges to both directions as was instructed)
export const createRoutableNetwork = (lines, edgeDistances) => Object.keys(lines).reduce((network, lineName) => {
  // Get stops in order to both directions for current line
  const line = lines[lineName]
  const lineReversed = [...line].reverse()

  // Get line edges (all connected stop pairs) for both directions
  const lineEdges = line.map((node, index) => line[index + 1] ? [node, line[index + 1]] : null).filter(edge => edge !== null)
  const lineEdgesReversed = lineReversed.map((node, index) => lineReversed[index + 1] ? [node, lineReversed[index + 1]] : null).filter(edge => edge !== null)

  // Get union of stop pairs to both directions
  const lineEdgesAll = lineEdges.concat(lineEdgesReversed)

  // Create routable network by reducing stop information so that we get a
  // network in format of { fromNode -> { toNode: { distance, line }... } }
  return lineEdgesAll.reduce((network, edge) => ({
    ...network,
    [edge[0]]: network[edge[0]]
      ? {
        ...network[edge[0]],
        [edge[1]]: {
          distance: edgeDistances[edge[0]][edge[1]],
          line: lineName,
        }
      }
      : {
        [edge[1]]: {
          distance: edgeDistances[edge[0]][edge[1]],
          line: lineName,
        }
      }
  }), network)
}, {})

// Get route for defined origin and destination nodes using network structure created above by running Dijkstra's algorithm
export const getRouteDetails = (origin, destination, network) => {
  // Route details in format of { destination: { distance, route: [ { fromNode, toNode, edgeDistance, line }... ]}}
  let routeDetails = {
    [origin]: {
      distance: 0,
      route: [],
    }
  }

  // Create queue to be used in dijkstra algorithm
  let queue = [[routeDetails[origin].distance, routeDetails[origin].route, origin]]
  // Run until queue is empty
  while (queue.length > 0) {
    // Get last item from queue
    const [distance, route, fromNode] = queue.pop()

    // Reduce information from all toNodes for current fromNode to routeDetails,
    // by only setting information when calculated route is totally new or when the calculated path is shorter
    // than what was achieved with the previous calculations
    routeDetails = Object.keys(network[fromNode]).reduce((routeDetails, toNode) => {

      // Get line, edgeDistance, newDistance (total distance), and information if the destination has not been previously in the
      // results or the path to it is shorter
      const line = network[fromNode][toNode].line
      const edgeDistance = network[fromNode][toNode].distance
      const newDistance = distance + edgeDistance
      const inRouteDetails = routeDetails[toNode]
      const shorterDistance = inRouteDetails && routeDetails[toNode].distance > newDistance

      // If paths for toNodes are new or shorter, add the information to the routeDetails object and add them to the queue for next iteration
      if (!inRouteDetails || (inRouteDetails && shorterDistance)) {
        const newRoute = [...route, { fromNode, toNode, edgeDistance, line }]
        queue.push([newDistance, newRoute, toNode])
        return {
          ...routeDetails,
          [toNode]: {
            distance: newDistance,
            route: newRoute,
          }
        }
      }
      else {
        return routeDetails
      }

    }, routeDetails)
  }
  // Return the details of the route to the destination node
  return routeDetails[destination]
}