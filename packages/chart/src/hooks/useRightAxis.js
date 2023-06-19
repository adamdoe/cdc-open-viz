import { scaleLinear } from '@visx/scale'
import useReduceData from '../hooks/useReduceData'

export default function useRightAxis({ config, yMax = 0, data = [], updateConfig }) {
  const hasRightAxis = config.visualizationType === 'Combo' && config.orientation === 'vertical'
  const rightSeriesKeys = config.series && config.series.filter(series => series.axis === 'Right').map(key => key.dataKey)
  let { minValue } = useReduceData(config, data)

  const allRightAxisData = rightSeriesKeys => {
    if (!rightSeriesKeys) return [0]
    let rightAxisData = []
    rightSeriesKeys.map((key, index) => {
      return (rightAxisData = [...rightAxisData, ...data.map(item => Number(item[key]))])
    })
    return rightAxisData
  }

  const max = Math.max.apply(null, allRightAxisData(rightSeriesKeys))

  // if there is a bar series & the right axis doesn't include a negative number, default to zero
  const hasBarSeries = config.runtime?.barSeriesKeys?.length > 0

  if (hasBarSeries && minValue > 0) {
    minValue = 0
  }

  const yScaleRight = scaleLinear({
    domain: [minValue, max],
    range: [yMax, 0]
  })

  return { yScaleRight, hasRightAxis }
}
