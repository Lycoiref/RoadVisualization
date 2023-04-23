const roadColorMin = 'rgb(67, 255, 40)'
const roadColorMax = 'rgb(208, 2, 27)'


export class Series {
    public type: string
    public coordinateSystem: string
    public dimensions: string[]
    public data: any
    public polyline: boolean
    public large: boolean
    public lineStyle: any
    public effect: any
    constructor(roadLine: [], speed?: number, color?: string) {
        this.data = [{
            coords: roadLine,
            lineStyle: {
                color: color || roadColorMin
            }
        }]
        this.type = 'lines'
        this.coordinateSystem = 'geo'
        this.dimensions = ['value']
        this.polyline = true
        this.large = true
        this.lineStyle = {
            width: 5,
            opacity: 1
        }
        this.effect = {
            show: true,
            constantSpeed: speed || 50,
            symbolSize: [30, 50],
            trailLength: 0,
            color: '#66ccff',
            // symbol: 'path://M141,31c0.6,10,0.9,20.9,1.3,32.2c2.4,1.3,4.6,3.1,6.5,6.3v3.1l-6.3-1.9c0.7,34.6,0.4,73-1.5,103.1c-0.2,3.9-3.3,5.9-7,7c-20.4,5.7-41.1,6.1-62.2,0c-3.7-1.1-6.9-3.1-7-7c-1.9-30-2-68.3-1.3-103.1l-6.3,1.9v-3.1c1.9-3,4.1-5,6.5-6.3c0.4-11.5,0.7-22.4,1.1-32.4c0.2-3.7,8.5-15.4,19.6-16.7c11.7-1.3,26.5-1.3,38,0C133.1,15.7,140.9,27.5,141,31L141,31z M70.3,60.7c1.9,8.5,5.4,16.7,9.3,25c7.2-2,15-3,22.8-3.1v-1.7h-3.5c-0.7,0-1.3-0.6-1.3-1.3c0-0.7,0.6-1.3,1.3-1.3h9.4c0.7,0,1.3,0.6,1.3,1.3c0,0.7-0.6,1.3-1.3,1.3h-3.9v1.7c7.8,0.2,15.4,1.1,22.4,3.1c3.9-7.8,7-15.9,9.3-25C118.6,54,87.7,54,70.3,60.7z M138.3,31c-2.8-5.2-6.9-10.2-15.4-14.6l-1.7,2l5.6,12.2c3.9,0.7,7.8,1.7,11.7,2.4C138.3,32.5,138.3,31.8,138.3,31L138.3,31z M67.9,31v2.2c3.9-0.7,7.8-1.7,11.7-2.4l5.6-12.2l-1.7-2C74.6,20.7,70.5,25.9,67.9,31L67.9,31z M139,174.9c-5,1.5-10.2,3-15.2,4.4v2.4C131,179.9,138.4,178.4,139,174.9z M66.8,174.9c0.6,3.5,8,5.2,15.2,6.9v-2.4C77,177.7,72,176.2,66.8,174.9z M68.4,78.3c-0.4,13.5-0.2,24.6,0.2,36.3l9.4-0.2V95.1c-3.3-5.7-6.3-12-8.5-19.8C69.4,76.4,69,77.3,68.4,78.3z M78.3,117.3l-9.4,0.7c0.2,6.3,0.6,13,1.1,20.2c3.1-3.5,6.1-8,8.3-15.7V117.3z M137,79.4c-0.4-0.9-0.7-2-1.1-3c-2.6,8.1-5.7,13.9-8.5,19.8v18.1l9.6,0.2C137.2,103.4,137.2,92.9,137,79.4z M127.2,117.3v5.2c2.2,7.8,5.2,12.2,8.3,15.7c0.4-7.4,0.7-14.1,1.1-20.2L127.2,117.3L127.2,117.3zM82.5,146.8c-3.5,5-6.9,9.4-10.2,13.7c14.6,6.3,46.5,6.3,61.1,0c-3.1-4.3-6.5-8.7-10.2-13.7C112.3,148.8,93.4,148.8,82.5,146.8z'
            symbol: 'circle'
        }
    }
}

export function getMax(data: number[]) {
    let max = 0
    for (let item of data) {
        if (item > max) {
            max = item
        }
    }
    return max
}

export function getColor(value: number, max: number) {
    // 线性渐变
    let color = 'rgb(0, 0, 0)'
    if (value > 0) {
        color = `rgb(${Math.round(67 + ((208 - 67) / max) * value)}, ${255 - Math.round(((255 - 2) / max) * value)}, ${Math.round(40 - ((40 - 27) / max) * value)})`
    }
    // console.log(color);
    return color
}
