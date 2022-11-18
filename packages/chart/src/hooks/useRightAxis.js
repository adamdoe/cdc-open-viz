import { scaleLinear } from '@visx/scale';

export default function useRightAxis({config, yMax = 0, data = []}, updateConfig) {
	const hasRightAxis = (config.visualizationType === 'Bar' || config.visualizationType === 'Combo' || config.visualizationType === 'Line') && config.orientation === 'vertical'
	const rightSeriesKeys = config.series.filter( series => series.axis === 'Right').map( key => key.dataKey )
	
	const allRightAxisData = (rightSeriesKeys) => {
		let rightAxisData = [];
		rightSeriesKeys.map( (key,index) => {
			return rightAxisData = [...rightAxisData, ...data.map( item => Number(item[key]) )]
		})
		return rightAxisData;
	}

	const min = Math.min.apply(null, allRightAxisData(rightSeriesKeys))
	const max = Math.max.apply(null, allRightAxisData(rightSeriesKeys))

	const yScaleRight = scaleLinear({
		domain: [min, max],
		range: [yMax, 0],
	});

	return {yScaleRight, hasRightAxis};
}
