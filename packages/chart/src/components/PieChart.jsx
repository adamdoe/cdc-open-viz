import React, { useContext, useState, useEffect, useRef } from 'react'
import { animated, useTransition, interpolate } from 'react-spring'
import chroma from 'chroma-js'

// visx
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { Text } from '@visx/text'
import { useTooltip, TooltipWithBounds } from '@visx/tooltip'

// cove
import ConfigContext from '../ConfigContext'
import { useTooltip as useCoveTooltip } from '../hooks/useTooltip'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import ErrorBoundary from '@cdc/core/components/ErrorBoundary'

const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle
})

const PieChart = props => {
  const { transformedData: data, config, dimensions, seriesHighlight, colorScale, formatNumber, currentViewport, handleChartAriaLabels, isEditor } = useContext(ConfigContext)
  const { tooltipData, showTooltip, hideTooltip, tooltipOpen, tooltipLeft, tooltipTop } = useTooltip()
  const { handleTooltipMouseOver, handleTooltipMouseOff, TooltipListItem } = useCoveTooltip({
    xScale: false,
    yScale: false,
    showTooltip,
    hideTooltip
  })
  const [filteredData, setFilteredData] = useState(undefined)
  const [animatedPie, setAnimatePie] = useState(false)

  const triggerRef = useRef()
  const dataRef = useIntersectionObserver(triggerRef, {
    freezeOnceVisible: false
  })

  // Make sure the chart is visible if in the editor
  useEffect(() => {
    const element = document.querySelector('.isEditor')
    if (element) {
      // parent element is visible
      setAnimatePie(prevState => true)
    }
  })

  useEffect(() => {
    if (dataRef?.isIntersecting && config.animate && !animatedPie) {
      setTimeout(() => {
        setAnimatePie(true)
      }, 500)
    }
  }, [dataRef?.isIntersecting, config.animate]) // eslint-disable-line

  const AnimatedPie = ({ arcs, path, getKey }) => {
    const transitions = useTransition(arcs, getKey, {
      from: enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: enterUpdateTransition
    })

    // DEV-5053
    // onMouseLeave function doesn't work on animated.path for some reason.
    // As a workaround, we continue to fire the tooltipData while hovered,
    // and use this useEffect to hide the tooltip so it doesn't persist when users scroll.
    useEffect(() => {
      const timeout = setTimeout(() => {
        hideTooltip()
      }, 500)
      return () => {
        clearTimeout(timeout)
      }
    }, [tooltipData])

    return (
      <>
        {transitions.map(({ item: arc, props, key }, animatedPieIndex) => {
          return (
            <Group className={arc.data[config.xAxis.dataKey]} key={`${key}-${animatedPieIndex}`} style={{ opacity: config.legend.behavior === 'highlight' && seriesHighlight.length > 0 && seriesHighlight.indexOf(arc.data[config.runtime.xAxis.dataKey]) === -1 ? 0.5 : 1 }}>
              <animated.path
                d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
                  path({
                    ...arc,
                    startAngle,
                    endAngle
                  })
                )}
                fill={colorScale(arc.data[config.runtime.xAxis.dataKey])}
                onMouseEnter={e => handleTooltipMouseOver(e, { data: arc.data[config.runtime.xAxis.dataKey], arc })}
                onMouseLeave={e => handleTooltipMouseOff()}
              />
            </Group>
          )
        })}
        {transitions.map(({ item: arc, key }) => {
          const [centroidX, centroidY] = path.centroid(arc)
          const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

          let textColor = '#FFF'
          if (colorScale(arc.data[config.runtime.xAxis.dataKey]) && chroma.contrast(textColor, colorScale(arc.data[config.runtime.xAxis.dataKey])) < 3.5) {
            textColor = '000'
          }

          return (
            <animated.g key={key}>
              {hasSpaceForLabel && (
                <Text style={{ fill: textColor }} x={centroidX} y={centroidY} dy='.33em' textAnchor='middle' pointerEvents='none'>
                  {Math.round((((arc.endAngle - arc.startAngle) * 180) / Math.PI / 360) * 100) + '%'}
                </Text>
              )}
            </animated.g>
          )
        })}
      </>
    )
  }

  let [width] = dimensions

  if (config && config.legend && !config.legend.hide && currentViewport === 'lg') {
    width = width * 0.73
  }

  const height = config.heights.vertical

  const radius = Math.min(width, height) / 2
  const centerY = height / 2
  const centerX = width / 2
  const donutThickness = config.pieType === 'Donut' ? 75 : radius

  useEffect(() => {
    if (seriesHighlight.length > 0 && config.legend.behavior !== 'highlight') {
      let newFilteredData = []

      data.forEach(d => {
        if (seriesHighlight.indexOf(d[config.runtime.xAxis.dataKey]) !== -1) {
          newFilteredData.push(d)
        }
      })

      setFilteredData(newFilteredData)
    } else {
      setFilteredData(undefined)
    }
  }, [seriesHighlight]) // eslint-disable-line

  return (
    <ErrorBoundary component='PieChart'>
      <svg width={width} height={height} className={`animated-pie group ${config.animate === false || animatedPie ? 'animated' : ''}`} role='img' aria-label={handleChartAriaLabels(config)}>
        <Group top={centerY} left={centerX}>
          {/* prettier-ignore */}
          <Pie
            data={filteredData || data}
            pieValue={d => d[config.runtime.yAxis.dataKey]}
            pieSortValues={() => -1}
            innerRadius={radius - donutThickness}
            outerRadius={radius}
          >
            {pie => <AnimatedPie {...pie} getKey={d => d.data[config.runtime.xAxis.dataKey]}/>}
          </Pie>
        </Group>
      </svg>
      <div ref={triggerRef} />
      {tooltipData && Object.entries(tooltipData.data).length > 0 && tooltipOpen && showTooltip && tooltipData.dataYPosition && tooltipData.dataXPosition && (
        <>
          <style>{`.tooltip {background-color: rgba(255,255,255, ${config.tooltips.opacity / 100}) !important`}</style>
          <TooltipWithBounds key={Math.random()} className={'tooltip cdc-open-viz-module'} left={tooltipLeft} top={tooltipTop}>
            <ul>{typeof tooltipData === 'object' && Object.entries(tooltipData.data).map((item, index) => <TooltipListItem item={item} key={index} />)}</ul>
          </TooltipWithBounds>
        </>
      )}
      {/* <ReactTooltip id={`cdc-open-viz-tooltip-${config.runtime.uniqueId}`} variant='light' arrowColor='rgba(0,0,0,0)' className='tooltip' /> */}
    </ErrorBoundary>
  )
}

export default PieChart
