/**
 * 日期格式化
 */
export default () => {
    const dateFormat = (date: string | Date | number, format: string = 'YYYY-MM-DD hh:mm:ss'): string => {
        let dt = null
        if (typeof date === 'string' || typeof date === 'number') {
            dt = new Date(date)
        } else {
            dt = date
        }
    
        const y = dt.getFullYear().toString()
        const m = (dt.getMonth() + 1).toString().padStart(2, '0')
        const d = dt.getDate().toString().padStart(2, '0')
        const hh = dt.getHours().toString().padStart(2, '0')
        const mm = dt.getMinutes().toString().padStart(2, '0')
        const ss = dt.getSeconds().toString().padStart(2, '0')
    
        return format.replace('YYYY', y).replace('MM', m).replace('DD', d).replace('hh', hh).replace('mm', mm).replace('ss', ss)
    }

    return { dateFormat }
}