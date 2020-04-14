import React, { useState, useRef } from 'react'
import Autosuggest from 'react-autosuggest'

import './Routes.css'

const Routes = ({
  setOrigin,
  setDestination,
  options,
  routeDetails,
}) => {
  
  const [originAutosuggestValue, setOriginAutosuggestValue] = useState('')
  const [originAutosuggestOptions, setOriginAutosuggestOptions] = useState(options)
  const [destinationAutosuggestValue, setDestinationAutosuggestValue] = useState('')
  const [destinationAutosuggestOptions, setDestinationAutosuggestOptions] = useState(options)

  const destinationRef = useRef()

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => {
    const inputValue = value.trim().toUpperCase()
    return inputValue.length === 0 ? options : options.filter(option =>
      option === inputValue
    )
  }

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div>{suggestion}</div>
  )

  const onChange = setValue => (_event, { newValue }) => {
    newValue.length < 2 && setValue(newValue.trim().toUpperCase())
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = (setOptions, setValue, prevValue) => ({ value }) => {
    if (value !== prevValue) setOptions(getSuggestions(value))
    else {
      setValue('')
      setOptions(options)
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = setState => () => setState([])

  const onSuggestionSelected = type => (_event, { suggestion }) => {
    if (type === 'origin') {
      setOrigin(suggestion)
      setDestination('')
      destinationRef.current.input.focus()
    }
    if (type === 'destination') setDestination(suggestion)
  }

  const handleReset = () => {
    setOriginAutosuggestValue('')
    setOrigin('')
    setDestinationAutosuggestValue('')
    setDestination('')
  }


  // When showing route details, reduce path edges to line level to show the steps 
  // needed for getting from origin to destination and details for them.
  return (
    <div className='route-details'>
      <div className='route-options'>
        <div className='route-options-header'>
          <div className='route-options-title'>Hae reitti</div>
          <div className='route-options-reset' onClick={handleReset}>Nollaa</div>
        </div>
        <div className='route-options-origin'>
          <Autosuggest
            id='origin'
            suggestions={originAutosuggestOptions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested(setOriginAutosuggestOptions, setOriginAutosuggestValue, originAutosuggestValue)}
            onSuggestionsClearRequested={onSuggestionsClearRequested(setOriginAutosuggestOptions)}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelected('origin')}
            focusInputOnSuggestionClick={false}
            highlightFirstSuggestion
            shouldRenderSuggestions={() => true}
            inputProps={{
              placeholder: 'Mistä?',
              value: originAutosuggestValue,
              onChange: onChange(setOriginAutosuggestValue),
            }}
            />
        </div>
        <div className='route-options-arrow'>⇣</div>
        <div className='route-options-destination'>
          <Autosuggest
            id='destination'
            ref={destinationRef}
            suggestions={destinationAutosuggestOptions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested(setDestinationAutosuggestOptions, setDestinationAutosuggestValue, destinationAutosuggestValue)}
            onSuggestionsClearRequested={onSuggestionsClearRequested(setDestinationAutosuggestOptions)}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelected('destination')}
            focusInputOnSuggestionClick={false}
            highlightFirstSuggestion
            shouldRenderSuggestions={() => true}
            inputProps={{
              placeholder: 'Minne?',
              value: destinationAutosuggestValue,
              onChange: onChange(setDestinationAutosuggestValue),
            }}
          />
        </div>
      </div>
      {routeDetails && (
        <div className='route-directions'>
          <div className='route-directions-title'>Reittiohje</div>
          <div className='route-directions-details'>
            <div className='route-directions-distance'>Kokonaisetäisyys: {routeDetails.distance}</div>
            {routeDetails.route.reduce((routeForLine, edge) => {
              if (routeForLine.length === 0 || (routeForLine[routeForLine.length-1] && routeForLine[routeForLine.length-1].line !== edge.line)) {
                return [...routeForLine, edge]
              }
              else {
                routeForLine[routeForLine.length-1] = {...routeForLine[routeForLine.length-1], toNode: edge.toNode, with: edge.line, edgeDistance: routeForLine[routeForLine.length-1].edgeDistance + edge.edgeDistance}
                return routeForLine
              }
            }, []).map((lineInformation, index) => (
              <div key={index} className='route-directions-step'>
                <div><b>Etappi {index+1}</b></div>
                <div>Linja: {lineInformation.line}</div>
                <div>Pysäkit: {lineInformation.fromNode} ⇢ {lineInformation.toNode}</div>
                <div>Etäisyys: {lineInformation.edgeDistance}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>      
  )
}

export default Routes